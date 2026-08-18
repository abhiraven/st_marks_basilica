"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { DEFAULT_SITE_CHROME_CONTENT } from "@/lib/site-chrome-defaults";

export default function Header({ content }) {
  const [open, setOpen] = useState(false);

  const chrome = content || DEFAULT_SITE_CHROME_CONTENT;
  const logo = chrome.logo || DEFAULT_SITE_CHROME_CONTENT.logo;
  const navbar = chrome.navbar || DEFAULT_SITE_CHROME_CONTENT.navbar;
  const navItems = navbar.items?.length ? navbar.items : DEFAULT_SITE_CHROME_CONTENT.navbar.items;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-basilica-marbleDark/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-20 gap-6">
          <Link href="/" className="flex items-center shrink-0" onClick={() => setOpen(false)}>
            <Image
              src={logo.src || DEFAULT_SITE_CHROME_CONTENT.logo.src}
              alt={logo.alt || DEFAULT_SITE_CHROME_CONTENT.logo.alt}
              width={1814}
              height={408}
              priority
              className="h-14 sm:h-16 w-auto"
              unoptimized={logo.src?.startsWith("http")}
            />
          </Link>

          <nav className="hidden lg:flex items-center gap-7 text-xs font-bold tracking-wider text-basilica-marbleBlack/80">
            {navItems.map((item) => (
              <Link key={item.label} href={item.href} className="hover:text-basilica-bronze transition">
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3 lg:hidden">
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-basilica-marbleDark/20 text-basilica-marbleBlack"
            >
              {open ? (
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M3 6h18M3 12h18M3 18h18" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {open && (
          <nav className="lg:hidden flex flex-col gap-1 border-t border-basilica-marbleDark/10 py-3">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-2 py-2.5 text-sm font-bold tracking-wide text-basilica-marbleBlack/80 hover:bg-basilica-marbleDark/5 hover:text-basilica-bronze transition"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
