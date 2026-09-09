(() => {
  function isGerman() {
    const text = document.body?.innerText || "";
    return /Verfügbarkeit|Jetzt anfragen|Kontakt|Gmünd in Kärnten/i.test(text);
  }

  function enhanceCalendarCta() {
    const wrap = document.querySelector(".availability-wrap");
    if (!wrap || wrap.querySelector(".direct-inquiry-card")) return;

    const de = isGerman();
    const card = document.createElement("div");
    card.className = "direct-inquiry-card";

    const heading = document.createElement("div");
    heading.className = "direct-inquiry-title";
    heading.textContent = de ? "Freien Zeitraum gefunden?" : "Found dates that work for you?";

    const copy = document.createElement("p");
    copy.className = "direct-inquiry-copy";
    copy.textContent = de
      ? "Dann schreib mir einfach direkt. Persönlicher Kontakt, flexible Absprache und unkomplizierter Self Check-in – auch mit Haustier."
      : "Just message me directly. Personal contact, flexible arrangements and easy self check-in – pets are welcome too.";

    const actions = document.createElement("div");
    actions.className = "direct-inquiry-actions";

    const whatsapp = document.createElement("a");
    whatsapp.className = "direct-inquiry-btn direct-inquiry-primary";
    whatsapp.href = de
      ? "https://wa.me/436707019210?text=Hallo%20Paul%2C%20ich%20interessiere%20mich%20f%C3%BCr%20das%20Modern%20Studio%20Perauer.%20Ich%20w%C3%BCrde%20gern%20einen%20Zeitraum%20anfragen."
      : "https://wa.me/436707019210?text=Hi%20Paul%2C%20I%27m%20interested%20in%20Modern%20Studio%20Perauer%20and%20would%20like%20to%20ask%20about%20some%20dates.";
    whatsapp.target = "_blank";
    whatsapp.rel = "noopener noreferrer";
    whatsapp.textContent = de ? "Direkt per WhatsApp anfragen" : "Ask directly on WhatsApp";

    const phone = document.createElement("a");
    phone.className = "direct-inquiry-btn direct-inquiry-secondary";
    phone.href = "tel:+436707019210";
    phone.textContent = de ? "Anrufen" : "Call";

    actions.append(whatsapp, phone);
    card.append(heading, copy, actions);

    const note = wrap.querySelector(".calendar-note");
    if (note) note.insertAdjacentElement("afterend", card);
    else wrap.append(card);
  }

  function polishFooter() {
    const nodes = [...document.querySelectorAll(".footer-copy")];
    for (const node of nodes) {
      const text = node.textContent.trim();
      if (text.includes("Ein richtig guter Deal")) {
        node.textContent = "Persönlich. Flexibel. Unkompliziert.";
      } else if (/Modern\. Cozy\. Central\. A really good deal\./i.test(text)) {
        node.textContent = "Personal. Flexible. Easy.";
      }
    }
  }

  function run() {
    enhanceCalendarCta();
    polishFooter();
  }

  const observer = new MutationObserver(run);
  observer.observe(document.documentElement, { childList: true, subtree: true });
  document.addEventListener("DOMContentLoaded", run);
})();
