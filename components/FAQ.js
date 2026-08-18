"use client";

import { useState } from "react";
import { contentToHtml } from "@/lib/post-content";

const FAQS = [
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
];

export default function FAQ({ items }) {
  const [openIndex, setOpenIndex] = useState(0);
  const faqs = Array.isArray(items) && items.length > 0 ? items : FAQS;

  return (
    <div className="divide-y divide-basilica-marbleDark/15 rounded-2xl border border-basilica-marbleDark/15 bg-white">
      {faqs.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={`${item.q}-${i}`}>
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? -1 : i)}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              aria-expanded={isOpen}
            >
              <span className="font-semibold text-basilica-marbleBlack">{item.q}</span>
              <span className="shrink-0 text-basilica-bronze text-xl leading-none">
                {isOpen ? "−" : "+"}
              </span>
            </button>
            {isOpen && (
              <div
                className="prose-content px-5 pb-4 text-sm leading-relaxed text-basilica-marbleBlack/80"
                dangerouslySetInnerHTML={{ __html: contentToHtml(item.a) }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
