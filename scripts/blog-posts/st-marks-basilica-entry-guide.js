// Blog post definition: "St. Mark's Basilica Entry: Rules, Access and Visitor Tips".
// Seeded by scripts/seed-post.js (idempotent upsert by slug).
//
// Images follow this site's existing convention (lib/images.js): free-licence
// Unsplash photos (https://unsplash.com/license) hotlinked from the
// images.unsplash.com CDN — nothing is uploaded to storage. The IDs come from
// the curated St Mark's photo set in lib/images.js. Inline images are written as
// {{image:<key>}} placeholders and rendered as the same
// <figure class="editor-image-figure"> markup the admin rich-text editor saves,
// so the post stays fully editable in the CMS.

const SITE = "https://www.stmarksbasilicaentry.com";
const SKIP_LINE_TICKET_URL =
  "https://www.getyourguide.com/venice-l35/venice-st-mark-s-basilica-skip-the-line-ticket-audio-app-t395051/?partner_id=6WVF80I&utm_medium=online_publisher&cmp=vacayin-stmarksbasilica";
const TERRACE_TOUR_URL =
  "https://www.getyourguide.com/venice-l35/priority-access-st-mark-s-basilica-tour-with-terrace-access-t617827/?partner_id=6WVF80I&utm_medium=online_publisher&cmp=vacayin-stmarksbasilica";

const ext = (href, text) => `<a target="_blank" rel="noopener noreferrer nofollow" href="${href}">${text}</a>`;
const unsplash = (id, w, h) => `https://images.unsplash.com/photo-${id}?w=${w}${h ? `&h=${h}` : ""}&q=80&auto=format&fit=crop`;

module.exports = {
  title: "St. Mark’s Basilica Entry: Rules, Access and Visitor Tips",
  slug: "st-marks-basilica-entry-guide",
  focusKeyword: "St. Mark’s Basilica entry", // no focus-keyword column in this schema; kept for reference
  secondaryKeywords: ["St. Mark’s Basilica tickets", "St. Mark’s Basilica visiting tips", "how to visit St. Mark’s Basilica"],
  seo_title: "St. Mark’s Basilica Entry: Rules, Access & Visitor Tips",
  meta_description:
    "Planning your St. Mark’s Basilica entry? Learn how timed tickets work, the dress code and bag rules, what to expect inside and tips for a smooth visit.",
  excerpt: "Timed slots, dress code, bag limits and Sunday hours: everything to know before you walk through the Basilica’s doors.",
  category: "Travel Tips",
  cover_color: "bronze",
  featured: 0,
  images: {
    cover: {
      url: unsplash("1628106881749-88bf2fb79103", 1200),
      alt: "The façade of St. Mark’s Basilica in Venice at sunrise, seen across an almost empty St. Mark’s Square",
    },
    facade: {
      url: unsplash("1783261088818-bb5efa83dd5c", 1200, 800),
      alt: "Ornate upper façade of St. Mark’s Basilica with gilded arches, statues and the bronze horses on the Loggia dei Cavalli",
      caption: "The Loggia dei Cavalli above the main entrance is reached with a Museum ticket.",
    },
    interior: {
      url: unsplash("1784121188112-fd475e40b74f", 1200, 800),
      alt: "Gold mosaic vaults and painted ceiling inside St. Mark’s Basilica in Venice",
      caption: "The gold mosaics are the highlight of the main visitor route.",
    },
  },
  content: `<p>Few church doors in Europe draw a queue like the one at St. Mark’s. Planning your <strong>St. Mark’s Basilica entry</strong> in advance makes the difference between a calm visit under the golden domes and a frustrating wait in the square. Here’s how entry works, what the rules are and how to make the most of your time inside.</p>
<h2>How St. Mark’s Basilica Entry Works</h2>
<p>Visits run on timed slots. When you book, you choose a date and an entry window, and your ticket carries a QR or bar code that is scanned at the turnstiles. You can show it on your phone.</p>
<p>The official ticket office asks visitors to arrive at their booked time, with only a short tolerance of a few minutes. Entry can be refused if your date and time don’t match your booking, so build in a buffer for Venice’s crowded lanes.</p>
<h2>Your Entry Options</h2>
<h3>Basic Basilica entry</h3>
<p>The standard ticket covers the main interior route. It does not include the Pala d’Oro, the Museum or the Loggia dei Cavalli, and the Bell Tower always needs a separate ticket.</p>
<h3>Add-ons and tours</h3>
<p>You can add the Pala d’Oro altarpiece or the Museum and terrace, or book a guided visit. A ${ext(SKIP_LINE_TICKET_URL, "skip-the-line ticket with audio guide")} suits independent travellers, while a ${ext(TERRACE_TOUR_URL, "guided tour with terrace access")} adds context and views. Our guide to <a href="${SITE}/blog/st-marks-basilica-ticket-options">St. Mark’s Basilica tickets</a> compares every option in detail.</p>
{{image:facade}}
<h2>What to Expect Inside</h2>
<p>Inside, visitors follow a set one-way route designed to keep people moving, and the main visit is short. Look up: the domes and vaults are covered in shimmering gold mosaics, and the marble floors are just as intricate. To plan your timing, see <a href="${SITE}/blog/how-long-st-marks-basilica">how long you need at St. Mark’s Basilica</a>.</p>
{{image:interior}}
<h2>Entry Requirements</h2>
<p>St. Mark’s is an active cathedral, and the rules reflect that:</p>
<ul><li><p><strong>Dress code:</strong> shoulders and knees should be covered.</p></li><li><p><strong>Bags:</strong> backpacks and luggage larger than 40 × 30 × 20 cm aren’t allowed, and neither are trolley bags.</p></li><li><p><strong>Behaviour:</strong> keep your voice low, stay on the route and respect anyone at prayer.</p></li></ul>
<p>Rules can change, so check the official visitor information shortly before your visit.</p>
<h2>St. Mark’s Basilica Visiting Tips</h2>
<ul><li><p><strong>Book ahead in busy months.</strong> Popular time slots can sell out.</p></li><li><p><strong>Mind Sunday mornings.</strong> Mass is celebrated, so the Basilica opens to visitors later on Sundays and religious holidays.</p></li><li><p><strong>Go early.</strong> The first slots of the day are usually calmer in the square.</p></li><li><p><strong>Pack light.</strong> A small bag saves time and avoids problems at the door.</p></li></ul>
<h2>Frequently Asked Questions</h2>
<h3>Do I need to book St. Mark’s Basilica in advance?</h3>
<p>Booking is strongly recommended, because entry runs on timed slots that can fill up, especially in peak season.</p>
<h3>Is the Bell Tower included with Basilica entry?</h3>
<p>No. The Bell Tower is a separate attraction with its own ticket.</p>
<h3>Can I bring a backpack?</h3>
<p>Only a small one. Bags must stay within the size limit, so leave larger luggage at your hotel.</p>
<h2>Plan Your Visit</h2>
<p>Knowing how to visit St. Mark’s Basilica before you arrive means less waiting and more time looking up at the mosaics. Choose your time slot, dress appropriately, travel light and arrive on time. When you’re ready, <a href="${SITE}/#tours">compare St. Mark’s Basilica tickets and tours</a> and book the entry that suits your trip.</p>`,
};
