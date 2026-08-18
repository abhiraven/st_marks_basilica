"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { img } from "@/lib/images";
import { normalizeExternalUrl } from "@/lib/url";

export default function MobileBookBar({ tour }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 420);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!tour) return null;

  return (
    <div
      className={`sm:hidden fixed inset-x-0 bottom-0 z-40 transition-transform duration-300 ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div
        className="flex items-center gap-3 border-t border-basilica-marbleDark/10 bg-white px-4 py-3 shadow-[0_-6px_24px_rgba(0,0,0,0.1)]"
        style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}
      >
        <img
          src={tour.image || img("gatehouses", 800)}
          alt={tour.imageAlt || tour.title}
          className="h-14 w-14 shrink-0 rounded-xl object-cover"
        />

        <div className="min-w-0 flex-1">
          <div className="text-sm font-bold text-basilica-marbleBlack leading-snug truncate">
            {tour.title}
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-basilica-marbleBlack/70">
            <span className="font-semibold text-basilica-marbleBlack">From {tour.price}</span>
            <span>·</span>
            <span>★ {tour.rating} ({Number(tour.reviews || 0).toLocaleString()})</span>
          </div>
          <Link
            href="/#tours"
            className="mt-0.5 inline-block text-[11px] font-semibold text-basilica-marbleBlack/50 underline underline-offset-2"
          >
            More options
          </Link>
        </div>

        <a
          href={normalizeExternalUrl(tour.url)}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="shrink-0 rounded-full bg-basilica-bronzeDark px-5 py-3 text-sm font-bold text-white shadow-lg hover:bg-basilica-bronzeDark/90 transition"
        >
          Book Now
        </a>
      </div>
    </div>
  );
}
