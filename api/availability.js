
export default async function handler(req, res) {
  const icsUrl = "https://www.airbnb.at/calendar/ical/715928217720024482.ics?t=14c797c229c4495db948d6aab4a9ecb8";

  try {
    const response = await fetch(icsUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Accept": "text/calendar,text/plain,*/*",
      },
    });

    if (!response.ok) {
      return res.status(200).json({ unavailableDates: [], source: "airbnb" });
    }

    const icsText = await response.text();
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

    res.setHeader("Cache-Control", "s-maxage=86400, stale-while-revalidate=86400");
    return res.status(200).json({
      unavailableDates: Array.from(unavailable).sort(),
      source: "airbnb",
    });
  } catch (error) {
    return res.status(200).json({ unavailableDates: [], source: "airbnb" });
  }
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
