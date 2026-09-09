(() => {
  const API_URL = "/api/availability";
  const REFRESH_MS = 5 * 60 * 1000;
  let status = { checked: false, reliable: false, partial: false };

  function getWrap() {
    return document.querySelector(".availability-wrap");
  }

  function getLocale() {
    const text = getWrap()?.innerText || "";
    return /Live-Kalender|Verfügbarkeit|frühere Monate/i.test(text) ? "de-AT" : "en-US";
  }

  function monthFromTitle(title) {
    const normalized = title.trim().toLowerCase();
    const now = new Date();
    for (let offset = -24; offset <= 120; offset += 1) {
      const d = new Date(now.getFullYear(), now.getMonth() + offset, 1);
      for (const locale of ["de-AT", "en-US"]) {
        const label = new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" })
          .format(d)
          .trim()
          .toLowerCase();
        if (label === normalized) return { year: d.getFullYear(), month: d.getMonth() };
      }
    }
    return null;
  }

  function ensureStatusMessage(wrap) {
    let el = wrap.querySelector(".availability-status-message");
    if (!el) {
      el = document.createElement("div");
      el.className = "availability-status-message";
      const head = wrap.querySelector(".availability-head");
      if (head) head.insertAdjacentElement("afterend", el);
      else wrap.prepend(el);
    }
    return el;
  }

  function applyReliabilityState() {
    const wrap = getWrap();
    if (!wrap) return;

    const message = ensureStatusMessage(wrap);
    wrap.classList.toggle("availability-unreliable", status.checked && !status.reliable);

    if (!status.checked) {
      message.hidden = true;
      return;
    }

    if (!status.reliable) {
      const isGerman = getLocale() === "de-AT";
      message.hidden = false;
      message.className = "availability-status-message availability-status-error";
      message.textContent = status.partial
        ? (isGerman
            ? "Die Verfügbarkeit kann gerade nicht zuverlässig angezeigt werden, weil nicht alle Kalenderquellen erreichbar sind. Bitte den gewünschten Zeitraum direkt per E-Mail, Telefon oder WhatsApp anfragen."
            : "Availability cannot currently be shown reliably because not all calendar sources are reachable. Please ask about your preferred dates directly by email, phone or WhatsApp.")
        : (isGerman
            ? "Die Verfügbarkeit kann gerade nicht geladen werden. Bitte den gewünschten Zeitraum direkt per E-Mail, Telefon oder WhatsApp anfragen."
            : "Availability cannot be loaded right now. Please ask about your preferred dates directly by email, phone or WhatsApp.");
    } else {
      message.hidden = true;
    }
  }

  async function checkAvailabilityStatus() {
    try {
      const response = await fetch(`${API_URL}?status=${Date.now()}`, { cache: "no-store" });
      const json = await response.json();
      const partial = Boolean(json.partial);
      status = {
        checked: true,
        reliable: response.ok && json.available !== false && !partial,
        partial,
      };
    } catch (error) {
      status = { checked: true, reliable: false, partial: false };
    }
    enhanceCalendar();
  }

  function enhanceCalendar() {
    const wrap = getWrap();
    if (!wrap) return;

    applyReliabilityState();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const cards = [...wrap.querySelectorAll(".calendar-card")];
    cards.forEach((card) => {
      const title = card.querySelector(".calendar-title")?.textContent || "";
      const monthInfo = monthFromTitle(title);
      if (!monthInfo) return;

      card.querySelectorAll(".calendar-day").forEach((dayEl) => {
        dayEl.classList.remove("past", "today");
        if (dayEl.classList.contains("outside")) return;

        const dayNumber = Number.parseInt(dayEl.textContent.trim(), 10);
        if (!Number.isFinite(dayNumber)) return;
        const date = new Date(monthInfo.year, monthInfo.month, dayNumber);
        date.setHours(0, 0, 0, 0);

        if (date < today) dayEl.classList.add("past");
        if (date.getTime() === today.getTime()) dayEl.classList.add("today");
      });
    });

    const earlierButton = wrap.querySelector(".calendar-nav-btn:first-child");
    const firstTitle = wrap.querySelector(".calendar-card .calendar-title")?.textContent || "";
    const firstMonth = monthFromTitle(firstTitle);
    if (earlierButton && firstMonth) {
      const isCurrentMonth = firstMonth.year === today.getFullYear() && firstMonth.month === today.getMonth();
      earlierButton.disabled = isCurrentMonth;
      earlierButton.setAttribute("aria-disabled", String(isCurrentMonth));
      earlierButton.title = isCurrentMonth
        ? (getLocale() === "de-AT" ? "Frühere Monate sind nicht relevant." : "Earlier months are not relevant.")
        : "";
    }
  }

  const observer = new MutationObserver(() => enhanceCalendar());
  observer.observe(document.documentElement, { childList: true, subtree: true });

  document.addEventListener("DOMContentLoaded", () => {
    enhanceCalendar();
    checkAvailabilityStatus();
    window.setInterval(checkAvailabilityStatus, REFRESH_MS);
  });
})();
