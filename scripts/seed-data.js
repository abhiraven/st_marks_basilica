// Shared sample content used by both scripts/seed.js (fresh installs) and
// scripts/push-content-update.js (refreshing copy on an existing database).
// Keeping this in one place means both scripts always agree on what the
// "current" sample article content actually is.

const POSTS = [
  {
    title: "St Mark's Basilica Ticket Price 2026: What You'll Actually Pay",
    slug: "st-marks-basilica-ticket-price-2026",
    excerpt:
      "Walk-up entry, a St Mark's Basilica guided tour, or the Pala d'Oro and Treasury add-ons — here's what each one costs in 2026, and which one is actually worth your money.",
    cover_color: "copper",
    category: "Tickets & Prices",
    featured: 1,
    content: `Every way into St Mark's Basilica comes with a queue attached to it somewhere — the only question is whether you wait in it or skip it. What you pay depends mostly on what's included, not on how busy the day happens to be.

## Basilica Entry Ticket

Walk-up entry at the door runs **€10** per person through the individual line, or **€12** through a tour-operator line — both still mean queuing, sometimes for 45 minutes or more in peak season. Skip-the-line St Mark's Basilica tickets booked online, usually bundled with an audio guide, typically run **€19–€25** and get you straight past the wait.

## St Mark's Basilica Guided Tour Price

A St Mark's Basilica guided tour runs **€30 and up** per person, and for that you get skip-the-line entry plus 60 to 75 minutes with a certified guide. Worth it? If you want to know why the ceiling is covered in gold, or what the four bronze horses above the door are actually doing there — yes. Wander through without context and you'll walk away with nice photos and not much else.

## Pala d'Oro & Treasury — the Part People Forget

This trips up a lot of first-time visitors: the Pala d'Oro, the Basilica's jewel-encrusted gold altarpiece, and the Treasury behind it aren't covered by a standard entry ticket. Each is a separate add-on, roughly **€3–€5**. Skip them and you'll miss the single most valuable object inside the church.

## The Bronze Horses' Terrace

Climbing up to the Loggia dei Cavalli — the balcony where the original bronze horses stand — costs roughly **€5–€7** on top of entry. It's the only place in the square where you get eye-level with them and look straight down over Piazza San Marco.

## So Which One Should You Book?

First visit, and you want to actually understand what you're looking at? Book a St Mark's Basilica guided tour. Tight on time or budget? A skip-the-line entry ticket gets you in the door at the lowest price, full stop. Either way — book a few days out, especially if you're traveling between April and October, when slots disappear fast.`,
  },
  {
    title: "The Best Time to Visit St Mark's Basilica (So You're Not Fighting Crowds)",
    slug: "best-time-to-visit-st-marks-basilica",
    excerpt:
      "Because entry is timed and Sunday hours are different, timing matters more than the season does. Here's when to book if you want fewer people in your photos.",
    cover_color: "bronze",
    category: "Planning Tips",
    featured: 0,
    content: `Forget the "best season" advice you'll find elsewhere — St Mark's Basilica sits on Venice's single busiest square, every day, all year. The real question isn't when to visit. It's which hour, and which day of the week.

## Book the First Slot You Can

Nothing beats the earliest entry time of the day, right at 9:30am Monday through Saturday. The mosaic ceiling is nearly empty of crowds, the light through the west windows is softer, and you're not shuffling past a tour group of forty to see the Pala d'Oro. It's the single easiest way to have a noticeably better visit.

## Skip 11am to 3pm, April Through October

That window is when the Basilica is at its most crowded, timed to when cruise-ship excursions and day-trip tour buses land on the square. Booked a St Mark's Basilica guided tour? Ask your provider whether an early-morning slot is available — most offer one.

## Sundays Are a Different Schedule Entirely

Here's the detail that catches people out: on Sundays and religious holidays, the Basilica is only open to sightseers in the afternoon, roughly 2:00pm–5:15pm, since mornings are reserved for Mass. If your trip lands on a Sunday, plan your visit for the afternoon window rather than assuming standard weekday hours.

## Does the Season Even Matter?

A little. November through March is calmer overall, and even popular slots move faster. June through August is Venice's busiest stretch by a wide margin — if that's your trip, book your entry time as far ahead as you can.

## One More Thing: Book the Slot, Not Just the Day

Because the Basilica caps entries during busy periods with timed reservations, showing up in Venice and hoping to walk in is a real gamble in high season. Reserve online before you fly, especially if the Doge's Palace combo is on your list too — its capacity is tighter than the Basilica's alone.`,
  },
  {
    title: "Inside the Pala d'Oro: What to Expect Before You Go",
    slug: "pala-doro-guide",
    excerpt:
      "The Basilica's gold altarpiece has been rebuilt and re-jeweled for nearly 700 years. Here's what's actually behind the high altar, how the tickets work, and a few things worth knowing before you show up.",
    cover_color: "marble",
    category: "Attractions & Museums",
    featured: 0,
    content: `Most first-time visitors walk right past the Pala d'Oro without realizing what it is: not a decorative backdrop, but one of the most valuable surviving works of Byzantine and medieval goldsmithing anywhere in the world.

## What You'll Actually See

The Pala d'Oro is a gold altarpiece set with more than 1,900 gemstones, pearls, and enamel plaques, assembled starting in the 10th century and reworked repeatedly over nearly 700 years by Byzantine and Venetian craftsmen. It sits behind the high altar, directly over the crypt that holds the relics of St Mark — the reason this building exists in the first place.

## It's Not Included in Your Basilica Ticket

This is the detail that catches people out: Pala d'Oro access is a separate ticket from general Basilica admission, usually an extra **€3–€5**. It doesn't come bundled automatically. If you want to guarantee a close look, add it when you book, or look for a combo ticket that already includes it alongside the Treasury.

## Pair It With the Treasury

The Treasury, just off the same route, holds Byzantine relics and objects looted from Constantinople in 1204 — chalices, reliquaries, icons — some of the oldest objects on display anywhere in Venice. It's a small, quiet stop that most people rush past, and it's worth the extra few minutes.

## How Long You'll Actually Need

Most people spend 10 to 15 minutes at the Pala d'Oro and a similar amount in the Treasury. If you can, pair both with a St Mark's Basilica guided tour — understanding the history of the relics first makes the gold itself land differently.

## A Couple of Practical Notes

Photography without flash is generally permitted in the main Basilica but restricted around the Pala d'Oro — check current signage at the entrance. Remember the dress code applies throughout: shoulders and knees covered, hats off, and keep your voice down — this is still an active church.`,
  },
];

module.exports = { POSTS };
