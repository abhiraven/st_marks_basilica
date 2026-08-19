import { sql, ensureSchema } from "@/lib/db";
import { img } from "@/lib/images";
import { withPartnerId } from "@/lib/tours-data";

// Full editable copy for every section of the homepage. This is the
// fallback used whenever the database has no saved edits yet (fresh
// install) or is missing a field that was added after someone already
// saved custom content once.
export const DEFAULT_HOME_CONTENT = {
  seo: {
    title: "St Mark's Basilica Tickets Venice 2026 | Skip the Line & Guided Tours",
    description:
      "Book St Mark's Basilica tickets online — skip-the-line entry, guided tours, and Doge's Palace combo passes for St Mark's Basilica in Venice. Compare prices, check opening hours, and reserve your timed entry in minutes.",
    noIndex: false,
  },
  tours: [
    {
      id: "general-admission",
      title: "St Mark's Basilica Tickets — Skip the Line Entry",
      image: img("facade", 800),
      features: [
        "Timed entry straight past the ticket-line at the Basilica door",
        "No queue at Porta dei Fiori — walk right past it",
        "Main nave, gold mosaics & high altar included",
        "Self-guided, so you can go at your own pace",
      ],
      rating: "4.4",
      reviews: "7540",
      price: "€19",
      badge: "",
      url: withPartnerId("https://www.getyourguide.com/venice-l35/venice-st-mark-s-basilica-skip-the-line-tickets-t645294/"),
    },
    {
      id: "guided-tour",
      title: "St Mark's Basilica Guided Tour — Skip the Line Plus a Local Guide",
      image: img("mosaicCeiling", 800),
      features: [
        "Skip-the-line entry built into the price",
        "60–75 minutes with a certified local guide",
        "Small groups, not a 40-person crowd",
        "Learn the story behind the gold mosaics, not just the photo spot",
      ],
      rating: "4.7",
      reviews: "15230",
      price: "€34",
      badge: "🏆 Award-Winning Tour - 2026",
      url: withPartnerId("https://www.getyourguide.com/venice-l35/skip-the-line-the-golden-basilica-t6515/"),
    },
    {
      id: "basilica-doges-palace-combo",
      title: "St Mark's Basilica + Doge's Palace Combo Ticket",
      image: img("dogesPalace", 800),
      features: [
        "Covers Basilica skip-the-line entry and Doge's Palace",
        "Walk across the Bridge of Sighs into the Doge's private chambers",
        "One booking, two timed slots — no double queuing",
        "The simplest way to see Venice's two biggest landmarks in a day",
      ],
      rating: "4.6",
      reviews: "9180",
      price: "€55",
      badge: "",
      url: withPartnerId("https://www.getyourguide.com/venice-l35/venice-st-mark-s-square-tour-skip-the-line-entrance-t6503/"),
    },
  ],

  hero: {
    badgeText: "SKIP-THE-LINE TICKETS",
    subBadgeTitle: "VENICE",
    subBadgeSubtitle: "UNESCO World Heritage City",
    title: "St Mark's Basilica Tickets\n& Guided Tour, 2026",
    subtitle:
      "Step inside the gold Byzantine mosaics of St Mark's Basilica on Venice's most famous square. Skip the line, lock in a timed entry, or add a guided tour — book your St Mark's Basilica tickets online before you land in Venice.",
    features: [
      { icon: "🎧", title: "Guides Who Know Their Byzantine History", body: "Licensed local guides, in multiple languages" },
      { icon: "⚡", title: "Walk Straight In", body: "Timed entry — no standing in the Basilica queue" },
      { icon: "📱", title: "Ticket on Your Phone", body: "Mobile voucher works at the door, nothing to print" },
      { icon: "🧥", title: "Dress Code, Sorted", body: "We tell you exactly what to wear before you go" },
    ],
    primaryCtaText: "Book St Mark's Basilica Tour →",
    secondaryCtaText: "Check Ticket Prices",
    ratingValue: "4.8/5",
    ratingText: "Rated by over 6,500 travelers",
    priceBadgeLabel: "FROM",
    priceBadgeValue: "€19",
    priceBadgeUnit: "PER PERSON",
    backgroundImage: img("domesAerial", 1600, 70),
    collageMainImage: img("mosaicCeiling", 1200, 75),
    collageMainImageAlt: "Gold Byzantine mosaic ceiling inside St Mark's Basilica",
    collageImages: [img("piazza", 700, 75), img("goldMosaic", 700, 75), img("dogesPalace", 700, 75), img("campanile", 700, 75)],
    collageImagesAlt: [
      "Crowds and pigeons in Piazza San Marco, Venice",
      "Gold mosaic facade detail of St Mark's Basilica",
      "Piazza San Marco with the Doge's Palace",
      "St Mark's Campanile bell tower above the square",
    ],
  },

  trustBar: {
    items: [
      { icon: "✅", title: "Encrypted Checkout", body: "Your payment details stay protected" },
      { icon: "🕐", title: "Cancel Free, Up to 24h", body: "Plans change — get a full refund with notice" },
      { icon: "🎧", title: "Real Support, Real Fast", body: "Questions answered by an actual human" },
      { icon: "🙂", title: "Guides Who Live Here", body: "Local Venetian storytellers, not a scripted tour rep" },
    ],
  },

  toursSection: {
    eyebrow: "TICKET OPTIONS",
    title: "Pick the St Mark's Basilica Ticket That Fits Your Trip",
    subtitle:
      "A skip-the-line entry ticket if you just want to see it. A St Mark's Basilica guided tour if you want to understand what you're looking at. A combo ticket if the Doge's Palace is on your list too.",
  },

  combosSection: {
    eyebrow: "SAVE MORE",
    title: "Bundle St Mark's Basilica With Venice's Other Icons",
    items: [
      {
        title: "St Mark's Basilica & Doge's Palace",
        image: img("dogesPalace", 500),
        description:
          "One reservation, both sights — Basilica entry and the Doge's Palace across the Bridge of Sighs, without juggling two separate bookings and two separate time slots.",
        url: withPartnerId("https://www.getyourguide.com/venice-l35/venice-st-mark-s-square-tour-skip-the-line-entrance-t6503/"),
      },
      {
        title: "St Mark's Basilica Skip-the-Line Ticket & Audio App",
        image: img("byzantineDetail", 500),
        description:
          "A self-paced audio-guided walk through the mosaics, the Pala d'Oro, and the Treasury — skip-the-line entry included, narrated in your language on your own phone.",
        url: withPartnerId("https://www.getyourguide.com/venice-l35/venice-st-mark-s-basilica-skip-the-line-ticket-audio-app-t395051/"),
      },
      {
        title: "St Mark's Basilica Guided Tours & Tickets",
        image: img("rialto", 500),
        description:
          "Compare every current St Mark's Basilica guided tour and skip-the-line ticket option side by side, from quick entry passes to full Venice walking tours.",
        url: withPartnerId("https://www.getyourguide.com/saint-mark-s-basilica-l3934/"),
      },
    ],
  },

  ticketPrices: {
    eyebrow: "TICKET PRICES",
    title: "St Mark's Basilica Ticket Price 2026: What You'll Actually Pay",
    items: [
      {
        icon: "🎟️",
        title: "Basilica Entry Ticket",
        body: "Walk-up entry at the ticket office runs **€10** per person through the individual line, or **€12** through a tour-guide line — but both still mean waiting in a queue. Skip-the-line St Mark's Basilica tickets booked online, usually with an audio guide included, typically run **€19–€25** and get you straight past the wait.",
        anchorId: "",
      },
      {
        icon: "🎧",
        title: "St Mark's Basilica Guided Tour Price",
        body: "Expect to pay **€30–€40** per person for a St Mark's Basilica guided tour. That covers skip-the-line entry and roughly 60–75 minutes with a certified guide explaining the Byzantine mosaics, the four bronze horses, and the story behind the Pala d'Oro — not just where to take photos.",
        anchorId: "",
      },
      {
        icon: "✨",
        title: "Pala d'Oro & Treasury Access",
        body: "Here's what trips people up: the Basilica's jewel-encrusted gold altarpiece (the Pala d'Oro) and the Treasury are **not** included in a standard entry ticket — they're separate add-ons, each roughly **€3–€5**. Skip them and you'll miss the single most valuable object inside the church.",
        anchorId: "pala-doro-treasury",
      },
      {
        icon: "🐎",
        title: "Museum & Loggia dei Cavalli (Bronze Horses Terrace)",
        body: "Climbing up to the horses' balcony for the best view over Piazza San Marco costs roughly **€5–€7** on top of Basilica entry. It's the only spot where you get eye-level with the original bronze horses and look straight down the square.",
        anchorId: "",
      },
    ],
  },

  benefits: {
    eyebrow: "WHY BOOK ONLINE",
    title: "Why Not Just Queue at the Door?",
    backgroundImage: img("piazza", 1400),
    items: [
      {
        icon: "⏭️",
        title: "Skip the Line, for Real",
        body: "The walk-up queue for St Mark's Basilica regularly runs 45 minutes or more in peak season. Book ahead and you walk straight to the door instead.",
      },
      {
        icon: "🎟️",
        title: "You Won't Get Turned Away",
        body: "During busy periods, the Basilica requires a timed online reservation just to enter — turning up without one is a real risk. Booking ahead locks your slot in before you arrive.",
      },
      {
        icon: "💶",
        title: "Compare Before You Pay",
        body: "Compare St Mark's Basilica guided tours and combo tickets side by side, so you know exactly what the extra euros get you before you commit.",
      },
    ],
  },

  highlights: {
    eyebrow: "2026 UPDATE",
    title: "What's New for St Mark's Basilica Tickets in 2026",
    items: [
      {
        icon: "📩",
        title: "Confirmation Lands Instantly",
        body: "Your voucher and QR code hit your inbox the moment you book — no waiting around.",
      },
      {
        icon: "⚡",
        title: "Timed Entry Reservations",
        body: "During peak season, the Basilica requires a reserved entry window — booking ahead means you already have one.",
      },
      {
        icon: "🕐",
        title: "Last-Minute Slots Do Open Up",
        body: "Sold out for your date? It's worth checking again closer to your visit — cancellations free up spots.",
      },
      {
        icon: "↩️",
        title: "Free Cancellation on Most Tours",
        body: "Plans change. Most guided tours can be cancelled up to 24 hours out for a full refund.",
      },
    ],
    footnote: "*Cancellation terms vary slightly by booking partner — checkout will show the exact policy before you pay.",
  },

  bestTime: {
    eyebrow: "PLAN YOUR VISIT",
    title: "When's the Best Time to Visit St Mark's Basilica?",
    body: "St Mark's Basilica opens at 9:30am Monday through Saturday, and the first hour is dramatically quieter than midday, when Piazza San Marco fills with cruise-ship groups and tour buses. Avoid 11am–3pm any day between April and October — that's peak cruise-excursion time. Sundays and religious holidays are different: the Basilica is only open to sightseers in the afternoon (roughly 2:00pm–5:15pm), since mornings are reserved for Mass, so plan around that if your trip lands on a Sunday.",
  },

  hours: {
    title: "St Mark's Basilica Opening Hours 2026",
    summerLabel: "Monday – Saturday",
    summerHours: "9:30 am – 5:15 pm (last entry 4:45 pm)",
    winterLabel: "Sundays & Holy Days",
    winterHours: "2:00 pm – 5:15 pm (last entry 4:45 pm)",
    note: "Hours can shift for religious holidays and special services, so treat your ticket's confirmed entry time as the final word.",
  },

  location: {
    eyebrow: "VISITOR INFO",
    title: "Where Is St Mark's Basilica?",
    address: "Piazza San Marco, 328, 30124 Venezia VE, Italy",
    gps: "45.4345° N, 12.3397° E",
    metro: "San Zaccaria or Vallaresso–San Marco vaporetto stops (lines 1, 2, 5.1), on the edge of the square",
    image: img("piazza", 800),
    imageAlt: "Piazza San Marco in front of St Mark's Basilica",
  },

  nearby: {
    eyebrow: "NEARBY",
    title: "Worth Seeing While You're in the Square",
    items: [
      {
        title: "Doge's Palace",
        body: "Steps from the Basilica and connected by history if not by door — walk the Doge's private chambers, cross the Bridge of Sighs, and see where Venice's rulers actually governed.",
        image: img("dogesPalace", 500),
      },
      {
        title: "St Mark's Campanile",
        body: "The bell tower on the same square has an elevator straight to the top — the widest, most photographed view over Venice's rooftops and lagoon anywhere in the city.",
        image: img("campanile", 500),
      },
    ],
  },

  faq: {
    eyebrow: "FAQ",
    title: "St Mark's Basilica Tickets & Tour FAQs",
    items: [
      {
        q: "How do I book St Mark's Basilica tickets?",
        a: "Right here on this page — pick a ticket or tour, hit BOOK NOW, and finish checkout with our booking partner. It only takes a couple of minutes, and you'll get an email confirmation with a QR code or voucher within minutes; that's what you show at the entrance.",
      },
      {
        q: "What is the St Mark's Basilica ticket price?",
        a: "Walk-up entry at the door is €10–€12, but that still means queuing. Skip-the-line St Mark's Basilica tickets booked online typically run €19–€25, and guided tours start around €30–€40 including a certified guide.",
      },
      {
        q: "Is a St Mark's Basilica guided tour worth it?",
        a: "If you want to actually understand what you're looking at — why the mosaics are gold, what the four bronze horses are doing above the entrance, what the Pala d'Oro is — yes. Walk through without context and you'll get nice photos and not much else.",
      },
      {
        q: "What is the dress code for St Mark's Basilica?",
        a: "St Mark's Basilica is an active church, and the dress code is enforced at the door: shoulders and knees must be covered for everyone, and hats should come off. Bring a scarf or light layer if you're wearing something sleeveless — staff will turn away visitors who aren't covered up.",
      },
      {
        q: "What are St Mark's Basilica opening hours?",
        a: "Monday through Saturday it's open 9:30am–5:15pm (last entry 4:45pm). On Sundays and religious holidays it only opens to sightseers in the afternoon, from about 2:00pm–5:15pm, since mornings are reserved for Mass.",
      },
      {
        q: "How long do I need to visit St Mark's Basilica?",
        a: "Budget 30–45 minutes for the main nave and mosaics. Adding the Pala d'Oro, the Treasury, or the Loggia dei Cavalli (bronze horses terrace)? Tack on another 30–45 minutes for those combined.",
      },
      {
        q: "Is St Mark's Basilica worth visiting?",
        a: "Yes — it's one of the few places where you can stand under nearly 8,000 square feet of 12th-to-13th-century gold mosaic ceiling, still largely intact. Even a quick 30-minute visit to the main nave is worth working into a Venice trip.",
      },
      {
        q: "Is there a free way to see St Mark's Basilica?",
        a: "Yes — entering to pray or attend Mass, through the north-side Porta dei Fiori entrance, doesn't require a ticket. Sightseeing visits during regular hours require a ticket, and the Pala d'Oro, Treasury, and bronze horses terrace are always separate, ticketed add-ons.",
      },
      {
        q: "What is the cancellation policy?",
        a: "Most guided tours allow free cancellation up to 24 hours before your scheduled time. Timed skip-the-line entry tickets are usually non-refundable but sometimes changeable — the exact terms show up at checkout before you pay.",
      },
      {
        q: "How do I get to St Mark's Basilica?",
        a: "Take the vaporetto (water bus) to San Zaccaria or Vallaresso–San Marco — both stops sit right at the edge of Piazza San Marco, a short walk from the Basilica entrance. It's also fully walkable from the Rialto Bridge area in about 15–20 minutes.",
      },
    ],
  },

  finalCta: {
    title: "Ready to Step Inside St Mark's Basilica?",
    subtitle: "Lock in your timed entry now — slots tighten fast in peak season, and Doge's Palace combo tickets sell out even quicker.",
    ctaText: "Book St Mark's Basilica Tour Now →",
    backgroundImage: img("facade", 1400),
  },
};

function deepMerge(defaults, overrides) {
  if (Array.isArray(defaults)) {
    return Array.isArray(overrides) ? overrides : defaults;
  }
  if (defaults && typeof defaults === "object") {
    if (!overrides || typeof overrides !== "object") return defaults;
    const result = { ...defaults };
    for (const key of Object.keys(defaults)) {
      result[key] = deepMerge(defaults[key], overrides[key]);
    }
    return result;
  }
  return overrides === undefined || overrides === null ? defaults : overrides;
}

export async function getHomeContent() {
  try {
    await ensureSchema();
    const rows = await sql`SELECT value FROM site_content WHERE key = 'home'`;
    if (!rows[0]) return DEFAULT_HOME_CONTENT;
    const parsed = JSON.parse(rows[0].value);
    return deepMerge(DEFAULT_HOME_CONTENT, parsed);
  } catch (err) {
    // Previously silent — a failed read (bad JSON, connection error, etc.)
    // would fall back to defaults with zero trace anywhere, which looks
    // identical to "my save didn't take effect." Log it so it's visible.
    console.error("[getHomeContent] falling back to defaults due to:", err);
    return DEFAULT_HOME_CONTENT;
  }
}

export async function saveHomeContent(content) {
  await ensureSchema();
  const value = JSON.stringify(content);
  await sql`
    INSERT INTO site_content (key, value, updated_at) VALUES ('home', ${value}, NOW())
    ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()
  `;
}
