
import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Mail,
  Phone,
  Mountain,
  Trees,
  Snowflake,
  Check,
  ChevronRight,
  Globe,
  PawPrint,
  CreditCard,
  Home,
  Euro,
  Sparkles,
  ExternalLink,
  Wifi,
  UtensilsCrossed,
  BedDouble,
  ShowerHead,
  Star,
  WashingMachine,
  Monitor,
  KeyRound,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  FileText,
  Bike,
  Waves,
  MountainSnow,
  MessageCircle,
} from "lucide-react";

function Button({ children, href, outline = false, target, rel }) {
  const className = `btn ${outline ? "btn-outline" : "btn-solid"}`;
  if (href) return <a className={className} href={href} target={target} rel={rel}>{children}</a>;
  return <button className={className}>{children}</button>;
}

function Card({ children, className = "" }) {
  return <div className={`card ${className}`.trim()}>{children}</div>;
}

function SectionTitle({ eyebrow, title, text }) {
  return (
    <div className="section-title">
      {eyebrow ? <div className="eyebrow">{eyebrow}</div> : null}
      <h2>{title}</h2>
      {text ? <p>{text}</p> : null}
    </div>
  );
}

function formatMonth(date, lang) {
  return new Intl.DateTimeFormat(lang === "de" ? "de-AT" : "en-US", {
    month: "long",
    year: "numeric",
  }).format(date);
}

function weekdayLabels(lang) {
  return lang === "de"
    ? ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"]
    : ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
}

function getMonthGrid(monthDate) {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const first = new Date(year, month, 1);
  const firstDay = (first.getDay() + 6) % 7;
  const start = new Date(year, month, 1 - firstDay);
  const days = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    days.push(d);
  }
  return days;
}

function dateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function AvailabilityCalendar({ lang }) {
  const [data, setData] = useState({ unavailableDates: [] });
  const [loading, setLoading] = useState(true);
  const [monthOffset, setMonthOffset] = useState(0);

  useEffect(() => {
    fetch("/api/availability")
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const unavailable = useMemo(() => new Set(data.unavailableDates || []), [data.unavailableDates]);
  const months = useMemo(() => {
    const base = new Date();
    return [0, 1].map((offset) => new Date(base.getFullYear(), base.getMonth() + monthOffset + offset, 1));
  }, [monthOffset]);

  return (
    <div className="availability-wrap">
      <div className="availability-head">
        <div>
          <div className="small-kicker">{lang === "de" ? "Live-Kalender" : "Live calendar"}</div>
          <h3>{lang === "de" ? "Verfügbarkeit auf einen Blick" : "Availability at a glance"}</h3>
        </div>
        <div className="legend">
          <span><i className="legend-box available"></i>{lang === "de" ? "frei" : "available"}</span>
          <span><i className="legend-box unavailable"></i>{lang === "de" ? "belegt" : "booked"}</span>
        </div>
      </div>

      <div className="calendar-nav">
        <button className="calendar-nav-btn" onClick={() => setMonthOffset((v) => v - 1)}>
          <ChevronLeft size={16} />
          {lang === "de" ? "frühere Monate" : "earlier months"}
        </button>
        <button className="calendar-nav-btn" onClick={() => setMonthOffset((v) => v + 1)}>
          {lang === "de" ? "spätere Monate" : "later months"}
          <ChevronRightIcon size={16} />
        </button>
      </div>

      {loading ? (
        <div className="availability-loading">
          {lang === "de" ? "Kalender wird geladen ..." : "Loading calendar ..."}
        </div>
      ) : (
        <div className="calendar-grid-two">
          {months.map((monthDate) => {
            const days = getMonthGrid(monthDate);
            return (
              <div className="calendar-card" key={monthDate.toISOString()}>
                <div className="calendar-title">{formatMonth(monthDate, lang)}</div>
                <div className="calendar-weekdays">
                  {weekdayLabels(lang).map((day) => <div key={day}>{day}</div>)}
                </div>
                <div className="calendar-days">
                  {days.map((day) => {
                    const inMonth = day.getMonth() === monthDate.getMonth();
                    const isUnavailable = unavailable.has(dateKey(day));
                    return (
                      <div
                        key={dateKey(day)}
                        className={[
                          "calendar-day",
                          inMonth ? "" : "outside",
                          isUnavailable ? "booked" : "free",
                        ].join(" ").trim()}
                      >
                        {day.getDate()}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <p className="calendar-note">
        {lang === "de"
          ? "Die Verfügbarkeit wird automatisch synchronisiert und dient als Orientierung. Bitte deinen Wunschzeitraum dennoch direkt per E-Mail, Telefon oder WhatsApp bestätigen lassen."
          : "Availability syncs automatically and is shown for guidance. Please still confirm your preferred dates directly by email, phone or WhatsApp."}
      </p>
    </div>
  );
}

function Gallery({ lang }) {
  const groups = [
    {
      title: lang === "de" ? "Schlafen & Entspannen" : "Sleep & unwind",
      images: [
        { src: "/images/hero-bed.jpg", alt: "Bed" },
        { src: "/images/table-wardrobe.jpg", alt: "Table and wardrobe" },
      ],
    },
    {
      title: lang === "de" ? "Küche & Wohnen" : "Kitchen & living",
      images: [
        { src: "/images/entry-kitchen.jpg", alt: "Entry and kitchen" },
        { src: "/images/kitchen-line.jpg", alt: "Kitchen line" },
        { src: "/images/fridge-dishwasher.jpg", alt: "Fridge and dishwasher" },
      ],
    },
    {
      title: lang === "de" ? "Bad & Komfort" : "Bathroom & comfort",
      images: [
        { src: "/images/bathroom-shower.jpg", alt: "Bathroom shower" },
        { src: "/images/sink-toilet.jpg", alt: "Sink and toilet" },
        { src: "/images/sink-towelwarmer.jpg", alt: "Sink and towel warmer" },
      ],
    },
  ];

  return (
    <div className="gallery-groups">
      {groups.map((group) => (
        <div className="gallery-group" key={group.title}>
          <div className="gallery-group-title">{group.title}</div>
          <div className={`gallery-grid gallery-count-${group.images.length}`}>
            {group.images.map((img) => (
              <div className="gallery-item" key={img.src}>
                <img src={img.src} alt={img.alt} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function App() {
  const [lang, setLang] = useState("de");

  const t = useMemo(() => {
    const content = {
      de: {
        nav: { stay: "Studio", gallery: "Fotos", features: "Ausstattung", location: "Lage", pricing: "Preise", availability: "Verfügbarkeit", contact: "Kontakt", legal: "Hausregeln" },
        hero: {
          badge: "Ferienwohnung in Gmünd in Kärnten",
          title: "Modern Studio Perauer",
          subtitle: "Frisch renoviertes Studio für 2 Personen – modern, gemütlich und hochwertig ausgestattet. Ideal für Paare, Kletterer, Wanderer, Skifahrer und aktive Gäste, die eine stilvolle und unkomplizierte Unterkunft suchen.",
          primaryCta: "Jetzt anfragen",
          secondaryCta: "Fotos ansehen",
          highlights: ["ab 65 € / Nacht", "22 m² hochwertig genutzt", "5 Gehminuten ins Zentrum", "starke Lage für Aktivurlaub"],
          overlayTitle: "Modern wohnen, entspannt ankommen",
          overlayCopy: "Frisch renoviertes Studio mit Einbauküche, Rain Shower und Stadtzentrum in wenigen Minuten.",
        },
        value: {
          eyebrow: "Für 2 Personen",
          title: "Warum dieses Studio?",
          intro: "Das Studio verbindet moderne Ausstattung, klare Gestaltung und eine sehr praktische Lage. Es ist frisch renoviert, hochwertig eingerichtet und so geplant, dass man sich sofort wohlfühlt – ideal für zwei Personen, die entspannt wohnen und die Region aktiv erleben möchten.",
          cards: [
            { title: "Modern und stimmig ausgestattet", text: "Frisch renoviert, stilvoll eingerichtet und mit genau den Dingen ausgestattet, die einen Aufenthalt angenehm machen – von der Einbauküche bis zur Regendusche." },
            { title: "Top-Ausgangspunkt für aktive Tage", text: "Klettern, Wandern, Winterausflüge, Kultur in Gmünd und vieles mehr sind schnell erreichbar. Das Zentrum ist nur wenige Gehminuten entfernt." },
            { title: "Flexibel und unkompliziert", text: "Auf Wunsch persönlicher Check-in oder eigenständiger Check-in per Schlüsselbox – dazu direkter Kontakt per Mail, Telefon oder WhatsApp." },
          ],
        },
        facts: {
          title: "Auf einen Blick",
          items: ["Studio für 1–2 Personen", "1 Schlafzimmer · 1 Bett · 1 Bad", "22 m² frisch renoviert", "Einbauküche mit Geschirrspüler", "Regendusche im modernen Bad", "WLAN & Arbeitsplatz", "Haustiere erlaubt: 30 € pro Aufenthalt", "Check-in ab 15:00 · Check-out bis 10:00"],
        },
        features: {
          title: "Alles, was man braucht",
          groups: [
            { title: "Studio & Komfort", items: ["Großzügiges Doppelbett", "Tisch und offener Kleiderschrank", "Ruhiger, durchdachter Grundriss", "Ideal für Paare und aktive Reisende"] },
            { title: "Küche & Alltag", items: ["Einbauküche", "Kühlschrank", "Geschirrspüler", "Waschmaschine im anderen Teil des Hauses"] },
            { title: "Gut zu wissen", items: ["Persönlicher Check-in oder Self Check-in per Schlüsselbox", "Zugang über eine Steintreppe", "Direkte Anfrage per Mail, Telefon oder WhatsApp", "Bezahlung vor Ort in bar"] },
          ],
        },
        icons: { kitchen: "Küche", wifi: "WLAN", bed: "Doppelbett", shower: "Rain Shower", work: "Arbeitsplatz", wash: "Waschmaschine" },
        reviews: {
          title: "Bewertungen & Inserate",
          text: "Die Unterkunft wird auf beiden Plattformen sehr gut bewertet. Airbnb zeigt 4,97 von 5 Sternen aus 30 Bewertungen; Booking.com führt 9,4 von 10 aus 41 Bewertungen. Besonders häufig genannt werden Sauberkeit, Ausstattung, Lage und unkomplizierter Check-in.",
          stats: ["Airbnb: 4,97 / 5", "30 Airbnb-Bewertungen", "Booking.com: 9,4 / 10", "41 Booking-Bewertungen"],
          airbnb: "Airbnb ansehen",
          booking: "Booking.com ansehen",
        },
        location: {
          title: "Top-Lage für Sommer und Winter",
          text: "Die Unterkunft liegt in Waschanger 33 in 9853 Gmünd in Kärnten. Das Zentrum der Künstlerstadt ist in rund fünf Gehminuten erreichbar. Nicht weit entfernt liegen der Millstätter See, das Maltatal mit Hochalmstraße und Kölnbreinsperre. Im Winter ist die Lage ideal als Ausgangspunkt zum Skifahren und für Touren, im Sommer für Wandern, Radfahren und Ausflüge ans Wasser.",
          points: ["Gmünd mit Kunst, Altstadt und Kultur in kurzer Distanz", "Nicht weit zum Millstätter See und ins Maltatal", "Starker Ausgangspunkt für Skifahren, Touren und Sommeraktivitäten"],
          mapTitle: "Lage direkt ansehen",
        },
        nearby: {
          title: "Aktiv rund ums Studio",
          items: [
            { label: "Millstätter See", icon: Waves },
            { label: "Maltatal & Hochalmstraße", icon: Mountain },
            { label: "Kölnbreinsperre", icon: MountainSnow },
            { label: "Radfahren im Sommer", icon: Bike },
          ],
        },
        audience: { title: "Ideal für", items: ["Paare", "Junge Reisende", "Kletterer", "Wanderer", "Skifahrer", "Alle, die Qualität ohne Schnickschnack wollen"] },
        pricing: { title: "Preise & Buchung", price: "ab 65 € / Nacht", note: "Der genaue Preis richtet sich nach Personenzahl und Aufenthaltsdauer. Wochen- und Monatsrabatte sind möglich.", payment: "Bezahlung vor Ort in bar." },
        availability: { title: "Verfügbarkeit", text: "Hier siehst du die nächsten freien und belegten Tage. Du kannst auch zu späteren Monaten weiterblättern." },
        contact: { title: "Direkt anfragen", text: "Am besten direkt per E-Mail, Telefon oder WhatsApp anfragen. So bleibt es persönlich, einfach und ohne unnötige Plattformgebühren.", phoneLabel: "Telefon", mailLabel: "E-Mail", addressLabel: "Adresse", phone: "+43 670 7019210", mail: "perauerappartments@gmail.com", address: "Waschanger 33, 9853 Gmünd in Kärnten, Österreich", ctaMail: "E-Mail schreiben", ctaCall: "Anrufen", ctaWhatsApp: "WhatsApp" },
        legal: {
          title: "Hausregeln",
          intro: "Damit sich alle Gäste wohlfühlen, gelten folgende einfachen Regeln für den Aufenthalt.",
          checkoutTitle: "Check-out",
          checkoutText: "Soweit nicht anders vereinbart, ist der Check-out um 10:00 Uhr.",
          rules: [
            "Keine Partys",
            "Kein Rauchen (bei Verstoß fällt eine Gebühr von €200 an)",
            "Kein Diebstahl",
            "Kein offenes Feuer",
            "Keine vorsätzlichen Verschmutzungen oder Beschädigungen",
          ],
        },
        footer: { line1: "Modern Studio Perauer", line2: "Modern. Gemütlich. Zentral. Ein richtig guter Deal." },
      },
      en: {
        nav: { stay: "Studio", gallery: "Gallery", features: "Features", location: "Location", pricing: "Pricing", availability: "Availability", contact: "Contact", legal: "House rules" },
        hero: {
          badge: "Holiday apartment in Gmünd in Carinthia",
          title: "Modern Studio Perauer",
          subtitle: "Freshly renovated studio for 2 guests – modern, cosy and thoughtfully equipped. Perfect for couples, climbers, hikers, skiers and active travellers looking for a stylish and uncomplicated stay.",
          primaryCta: "Send inquiry",
          secondaryCta: "View gallery",
          highlights: ["from €65 / night", "22 m² thoughtfully designed", "5 minutes to town centre", "great base for active stays"],
          overlayTitle: "Stay modern, arrive with ease",
          overlayCopy: "Freshly renovated studio with built-in kitchen, rain shower and the town centre just minutes away.",
        },
        value: {
          eyebrow: "For 2 guests",
          title: "Why this studio?",
          intro: "The studio combines modern comfort, clean design and a very practical location. It has been freshly renovated, carefully furnished and planned so that two guests can settle in easily and enjoy both the apartment and the region.",
          cards: [
            { title: "Modern and well equipped", text: "Freshly renovated, tastefully furnished and equipped with the features that make a stay feel easy – from the built-in kitchen to the rain shower." },
            { title: "Excellent base for active days", text: "Climbing, hiking, winter trips, culture in Gmünd and much more are all within easy reach. The town centre is only a short walk away." },
            { title: "Flexible and uncomplicated", text: "Personal check-in or self check-in via lockbox, plus direct contact by email, phone or WhatsApp." },
          ],
        },
        facts: {
          title: "At a glance",
          items: ["Studio for 1–2 guests", "1 bedroom · 1 bed · 1 bath", "22 m² freshly renovated", "Built-in kitchen with dishwasher", "Rain shower in a stylish bathroom", "Wi‑Fi & workspace", "Pets welcome: €30 per stay", "Check-in from 15:00 · Check-out until 10:00"],
        },
        features: {
          title: "Everything you need",
          groups: [
            { title: "Studio & comfort", items: ["Large double bed", "Table and open wardrobe", "Quiet and well-planned layout", "Ideal for couples and active travellers"] },
            { title: "Kitchen & daily stay", items: ["Built-in kitchen", "Fridge", "Dishwasher", "Washing machine in another part of the house"] },
            { title: "Good to know", items: ["Personal check-in or self check-in via lockbox", "Access via stone staircase", "Direct inquiries by email, phone or WhatsApp", "Payment on site in cash"] },
          ],
        },
        icons: { kitchen: "Kitchen", wifi: "Wi‑Fi", bed: "Double bed", shower: "Rain shower", work: "Workspace", wash: "Washing machine" },
        reviews: {
          title: "Reviews & listings",
          text: "The property is rated very well on both platforms. Airbnb shows 4.97 out of 5 from 30 reviews; Booking.com lists 9.4 out of 10 from 41 reviews. Guests especially mention cleanliness, equipment, location and easy check-in.",
          stats: ["Airbnb: 4.97 / 5", "30 Airbnb reviews", "Booking.com: 9.4 / 10", "41 Booking reviews"],
          airbnb: "View on Airbnb",
          booking: "View on Booking.com",
        },
        location: {
          title: "Top location for summer and winter",
          text: "The studio is located at Waschanger 33, 9853 Gmünd in Carinthia, Austria. The centre of the artists' town is around five minutes away on foot. The Millstätter See, the Maltatal with the Hochalmstraße and the Kölnbrein dam are all within easy reach. In winter, the location works very well as a base for skiing and touring; in summer for hiking, cycling and trips to the water.",
          points: ["Gmünd with art, old town charm and culture nearby", "Not far from Millstätter See and Maltatal", "Excellent base for skiing, touring and summer activities"],
          mapTitle: "See the location directly",
        },
        nearby: {
          title: "Active around the studio",
          items: [
            { label: "Millstätter See", icon: Waves },
            { label: "Maltatal & Hochalmstraße", icon: Mountain },
            { label: "Kölnbrein dam", icon: MountainSnow },
            { label: "Cycling in summer", icon: Bike },
          ],
        },
        audience: { title: "Perfect for", items: ["Couples", "Young travellers", "Climbers", "Hikers", "Skiers", "Anyone who wants quality without fuss"] },
        pricing: { title: "Pricing & booking", price: "from €65 / night", note: "The exact rate depends on the number of guests and length of stay. Weekly and monthly discounts are available.", payment: "Payment on site in cash." },
        availability: { title: "Availability", text: "Here you can see upcoming free and booked dates. You can also browse forward to later months." },
        contact: { title: "Send a direct inquiry", text: "The easiest way is to contact us directly by email, phone or WhatsApp. Personal, simple and without unnecessary platform fees.", phoneLabel: "Phone", mailLabel: "Email", addressLabel: "Address", phone: "+43 670 7019210", mail: "perauerappartments@gmail.com", address: "Waschanger 33, 9853 Gmünd in Carinthia, Austria", ctaMail: "Send email", ctaCall: "Call now", ctaWhatsApp: "WhatsApp" },
        legal: {
          title: "House rules",
          intro: "To keep the stay comfortable for everyone, the following simple rules apply.",
          checkoutTitle: "Check-out",
          checkoutText: "Unless otherwise agreed, check-out time is 10:00 a.m.",
          rules: [
            "No parties",
            "No smoking (€200 violation fee)",
            "No theft",
            "No open fire",
            "No intentional littering or damage",
          ],
        },
        footer: { line1: "Modern Studio Perauer", line2: "Modern. Cosy. Central. A really good deal." },
      },
    };
    return content[lang];
  }, [lang]);

  const whatsappLink = "https://wa.me/436707019210";

  return (
    <div className="site-shell">
      <header className="topbar">
        <div className="container topbar-inner">
          <div className="brand">Modern Studio Perauer</div>
          <nav className="nav">
            <a href="#studio">{t.nav.stay}</a>
            <a href="#gallery">{t.nav.gallery}</a>
            <a href="#features">{t.nav.features}</a>
            <a href="#location">{t.nav.location}</a>
            <a href="#pricing">{t.nav.pricing}</a>
            <a href="#availability">{t.nav.availability}</a>
            <a href="#contact">{t.nav.contact}</a>
            <a href="#legal">{t.nav.legal}</a>
          </nav>
          <button className="lang-toggle" onClick={() => setLang(lang === "de" ? "en" : "de")}>
            <Globe size={16} />
            <span>{lang === "de" ? "EN" : "DE"}</span>
          </button>
        </div>
      </header>

      <main>
        <section className="hero container">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="badge"><Sparkles size={16} /> {t.hero.badge}</div>
            <h1>{t.hero.title}</h1>
            <p className="hero-copy">{t.hero.subtitle}</p>
            <div className="cta-row">
              <Button href="#contact">{t.hero.primaryCta} <ChevronRight size={16} /></Button>
              <Button href="#gallery" outline>{t.hero.secondaryCta}</Button>
            </div>
            <div className="highlight-grid">
              {t.hero.highlights.map((item) => <div className="highlight" key={item}>{item}</div>)}
            </div>
          </motion.div>

          <motion.div className="hero-image-wrap" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }}>
            <img
              className="hero-image"
              src="/images/hero-bed.jpg"
              alt="Modern Studio Perauer"
            />
            <div className="hero-overlay-card">
              <div className="overlay-kicker">Modern Studio Perauer</div>
              <div className="overlay-title">{t.hero.overlayTitle}</div>
              <div className="overlay-copy">{t.hero.overlayCopy}</div>
            </div>
          </motion.div>
        </section>

        <section id="studio" className="container section">
          <SectionTitle eyebrow={t.value.eyebrow} title={t.value.title} text={t.value.intro} />
          <div className="grid-3">
            {t.value.cards.map((card) => (
              <Card key={card.title}>
                <h3>{card.title}</h3>
                <p>{card.text}</p>
              </Card>
            ))}
          </div>
        </section>

        <section className="container section section-tight">
          <div className="icon-grid">
            <Card className="icon-card"><UtensilsCrossed size={22} /><strong>{t.icons.kitchen}</strong></Card>
            <Card className="icon-card"><Wifi size={22} /><strong>{t.icons.wifi}</strong></Card>
            <Card className="icon-card"><BedDouble size={22} /><strong>{t.icons.bed}</strong></Card>
            <Card className="icon-card"><ShowerHead size={22} /><strong>{t.icons.shower}</strong></Card>
            <Card className="icon-card"><Monitor size={22} /><strong>{t.icons.work}</strong></Card>
            <Card className="icon-card"><WashingMachine size={22} /><strong>{t.icons.wash}</strong></Card>
          </div>
        </section>

        <section className="container section">
          <div className="grid-2-wide">
            <Card>
              <div className="inline-head"><Home size={18} /><h3>{t.facts.title}</h3></div>
              <div className="facts-grid">
                {t.facts.items.map((item) => (
                  <div className="fact-item" key={item}><Check size={16} /> <span>{item}</span></div>
                ))}
              </div>
            </Card>
            <Card className="soft-card">
              <div className="small-kicker">{t.audience.title}</div>
              <div className="chip-wrap">
                {t.audience.items.map((item) => <span className="chip" key={item}>{item}</span>)}
              </div>
            </Card>
          </div>
        </section>

        <section id="gallery" className="container section">
          <SectionTitle eyebrow={lang === "de" ? "Echte Fotos" : "Real photos"} title={lang === "de" ? "Einblicke ins Studio" : "Inside the studio"} text={lang === "de" ? "Die Bilder sind nach Bereichen gruppiert, damit man das Studio schnell erfassen kann – Schlafen, Küche/Wohnen und Bad." : "The photos are grouped by area so guests can understand the studio quickly – sleeping, kitchen/living and bathroom."} />
          <Gallery lang={lang} />
        </section>

        <section className="container section section-tight">
          <Card className="review-section-card">
            <div className="review-section-head">
              <SectionTitle eyebrow={lang === "de" ? "Vertrauen" : "Trust"} title={t.reviews.title} text={t.reviews.text} />
            </div>
            <div className="review-stats-row">
              {t.reviews.stats.map((item) => <span className="chip review-chip" key={item}>{item}</span>)}
            </div>
            <div className="cta-row">
              <Button href="https://www.airbnb.at/rooms/715928217720024482" outline target="_blank" rel="noreferrer">{t.reviews.airbnb} <ExternalLink size={16} /></Button>
              <Button href="https://www.booking.com/hotel/at/modern-studio-rental-in-gmund-in-karnten.de.html" outline target="_blank" rel="noreferrer">{t.reviews.booking} <ExternalLink size={16} /></Button>
            </div>
          </Card>
        </section>

        <section id="features" className="container section">
          <SectionTitle eyebrow={lang === "de" ? "Ausstattung" : "Features"} title={t.features.title} />
          <div className="grid-3">
            {t.features.groups.map((group) => (
              <Card key={group.title}>
                <h3>{group.title}</h3>
                <div className="list">
                  {group.items.map((item) => (
                    <div className="list-item" key={item}><Check size={16} /><span>{item}</span></div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </section>

        <section id="location" className="container section">
          <div className="grid-2">
            <div>
              <SectionTitle eyebrow={lang === "de" ? "Umgebung" : "Around you"} title={t.location.title} text={t.location.text} />
              <div className="list">
                {t.location.points.map((point) => (
                  <div className="location-item" key={point}><MapPin size={16} /><span>{point}</span></div>
                ))}
              </div>
              <div className="nearby-grid">
                {t.nearby.items.map((item) => {
                  const Icon = item.icon;
                  return <div className="nearby-item" key={item.label}><Icon size={18} /><span>{item.label}</span></div>;
                })}
              </div>
              <div className="cta-row">
                <Button href="https://maps.app.goo.gl/J5fKVc2VU9DzRR4v5" outline target="_blank" rel="noreferrer">{t.location.mapTitle} <ExternalLink size={16} /></Button>
              </div>
            </div>
            <Card className="location-card map-card">
              <div className="map-frame-wrap">
                <iframe
                  title="Modern Studio Perauer map"
                  src="https://www.google.com/maps?q=Waschanger%2033,%209853%20Gm%C3%BCnd%20in%20K%C3%A4rnten,%20Austria&output=embed"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
              <div className="location-body">
                <div className="activity-grid">
                  <div className="activity"><Mountain size={18} /><span>{lang === "de" ? "Klettern" : "Climbing"}</span></div>
                  <div className="activity"><Trees size={18} /><span>{lang === "de" ? "Wandern" : "Hiking"}</span></div>
                  <div className="activity"><Snowflake size={18} /><span>{lang === "de" ? "Skifahren" : "Skiing"}</span></div>
                </div>
                <div className="address-box">
                  <strong>{lang === "de" ? "Adresse:" : "Address:"}</strong><br />
                  Waschanger 33, 9853 Gmünd in Kärnten, Österreich
                </div>
              </div>
            </Card>
          </div>
        </section>

        <section id="pricing" className="container section">
          <div className="grid-2-wide">
            <Card className="dark-card">
              <div className="inline-head"><Euro size={18} /><div className="small-kicker invert">{t.pricing.title}</div></div>
              <div className="price">{t.pricing.price}</div>
              <p className="invert-text">{t.pricing.note}</p>
            </Card>
            <div className="grid-2">
              <Card>
                <div className="inline-head"><CreditCard size={18} /><h3>{lang === "de" ? "Zahlung" : "Payment"}</h3></div>
                <p>{t.pricing.payment}</p>
              </Card>
              <Card>
                <div className="inline-head"><KeyRound size={18} /><h3>Check-in</h3></div>
                <p>{lang === "de" ? "Persönlicher Check-in oder eigenständiger Check-in per Schlüsselbox ab 15:00 Uhr." : "Personal check-in or self check-in via lockbox from 15:00."}</p>
              </Card>
              <Card className="span-2">
                <div className="inline-head"><PawPrint size={18} /><h3>{lang === "de" ? "Haustiere" : "Pets"}</h3></div>
                <p>{lang === "de" ? "Haustiere sind willkommen. Gebühr: 30 € pro Aufenthalt." : "Pets are welcome. Fee: €30 per stay."}</p>
              </Card>
            </div>
          </div>
        </section>

        <section id="availability" className="container section">
          <SectionTitle eyebrow={lang === "de" ? "Planung" : "Planning"} title={t.availability.title} text={t.availability.text} />
          <AvailabilityCalendar lang={lang} />
        </section>

        <section id="contact" className="container section">
          <div className="grid-2">
            <div>
              <SectionTitle eyebrow={lang === "de" ? "Direkt buchen" : "Direct booking"} title={t.contact.title} text={t.contact.text} />
              <div className="contact-list">
                <div className="contact-item"><Phone size={18} /><div><div className="contact-label">{t.contact.phoneLabel}</div><a href="tel:+436707019210">{t.contact.phone}</a></div></div>
                <div className="contact-item"><Mail size={18} /><div><div className="contact-label">{t.contact.mailLabel}</div><a href="mailto:perauerappartments@gmail.com">{t.contact.mail}</a></div></div>
                <div className="contact-item"><MapPin size={18} /><div><div className="contact-label">{t.contact.addressLabel}</div><div>{t.contact.address}</div></div></div>
              </div>
            </div>
            <Card className="soft-card">
              <div className="small-kicker">{lang === "de" ? "Direkte Anfrage" : "Direct inquiry"}</div>
              <h3>{lang === "de" ? "Persönlich statt Plattform" : "Personal instead of platform"}</h3>
              <p>
                {lang === "de"
                  ? "Direkte Anfragen sind unkompliziert, persönlich und ohne unnötige Gebühren. Schreib einfach eine kurze Nachricht, ruf an oder schick eine WhatsApp."
                  : "Direct inquiries are simple, personal and avoid unnecessary platform fees. Just send a short message, call or write on WhatsApp."}
              </p>
              <div className="cta-row">
                <Button href="mailto:perauerappartments@gmail.com">{t.contact.ctaMail}</Button>
                <Button href="tel:+436707019210" outline>{t.contact.ctaCall}</Button>
                <Button href={whatsappLink} outline target="_blank" rel="noreferrer"><MessageCircle size={16} /> {t.contact.ctaWhatsApp}</Button>
              </div>
            </Card>
          </div>
        </section>

        <section id="legal" className="container section">
          <SectionTitle eyebrow={lang === "de" ? "Wichtig" : "Important"} title={t.legal.title} text={t.legal.intro} />
          <div className="rules-grid">
            <Card>
              <div className="inline-head"><FileText size={18} /><h3>{t.legal.checkoutTitle}</h3></div>
              <p>{t.legal.checkoutText}</p>
            </Card>
            <Card className="rules-card">
              <div className="inline-head"><FileText size={18} /><h3>{lang === "de" ? "5 einfache Regeln" : "5 simple rules"}</h3></div>
              <div className="list">
                {t.legal.rules.map((rule) => (
                  <div className="list-item" key={rule}><Check size={16} /><span>{rule}</span></div>
                ))}
              </div>
            </Card>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container">
          <div className="footer-title">{t.footer.line1}</div>
          <div className="footer-copy">{t.footer.line2}</div>
        </div>
      </footer>
    </div>
  );
}
