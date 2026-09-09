
export default async function handler(req, res) {
  const calendars = [
    {
      name: "airbnb",
      url: "https://www.airbnb.at/calendar/ical/715928217720024482.ics?t=14c797c229c4495db948d6aab4a9ecb8",
    },
    {
      name: "booking",
      url: "https://ical.booking.com/v1/export?t=0af3f3d2-1a58-462a-8e7a-a08dc827c412",
    },
  ];

  try {
    const results = await Promise.all(
      calendars.map(async (calendar) => {
        try {
          const response = await fetch(calendar.url, {
            cache: "no-store",
            headers: {
              "User-Agent": "Mozilla/5.0",
              "Accept": "text/calendar,text/plain,*/*",
              "Cache-Control": "no-cache",
            },
          });

          if (!response.ok) {
            return { name: calendar.name, ok: false, dates: [] };
          }

          const icsText = await response.text();
          return {
            name: calendar.name,
            ok: true,
            dates: extractUnavailableDates(icsText),
          };
        } catch (error) {
          return { name: calendar.name, ok: false, dates: [] };
        }
      })
    );

    const successful = results.filter((result) => result.ok);
    const failedSources = results.filter((result) => !result.ok).map((result) => result.name);

    if (successful.length === 0) {
      res.setHeader("Cache-Control", "no-store, max-age=0");
      return res.status(503).json({
        unavailableDates: [],
        source: "airbnb+booking",
        available: false,
        error: "availability_unavailable",
        failedSources,
      });
    }

    const unavailable = new Set();
    successful.forEach((result) => {
      result.dates.forEach((date) => unavailable.add(date));
    });

    res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=60");
    return res.status(200).json({
      unavailableDates: Array.from(unavailable).sort(),
      source: "airbnb+booking",
      available: true,
      partial: failedSources.length > 0,
      failedSources,
    });
  } catch (error) {
    res.setHeader("Cache-Control", "no-store, max-age=0");
    return res.status(503).json({
      unavailableDates: [],
      source: "airbnb+booking",
      available: false,
      error: "availability_unavailable",
    });
  }
}

function extractUnavailableDates(icsText) {
  const blocks = icsText.split("BEGIN:VEVENT").slice(1);
  const unavailable = new Set();

  for (const block of blocks) {
    const startMatch = block.match(/DTSTART(?::|;VALUE=DATE:)(\d{8})/);
    const endMatch = block.match(/DTEND(?::|;VALUE=DATE:)(\d{8})/);
    if (!startMatch || !endMatch) continue;

    const start = parseDate(startMatch[1]);
    const end = parseDate(endMatch[1]);
    if (!start || !end) continue;

    const cursor = new Date(start);
    while (cursor < end) {
      unavailable.add(toKey(cursor));
      cursor.setDate(cursor.getDate() + 1);
    }
  }

  return Array.from(unavailable);
}

function parseDate(value) {
  const m = value.match(/^(\d{4})(\d{2})(\d{2})$/);
  if (!m) return null;
  return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
}

function toKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
