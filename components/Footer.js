import Link from "next/link";
import { DEFAULT_SITE_CHROME_CONTENT } from "@/lib/site-chrome-defaults";

export default function Footer({ content }) {
  const chrome = content || DEFAULT_SITE_CHROME_CONTENT;
  const footer = chrome.footer || DEFAULT_SITE_CHROME_CONTENT.footer;
  const about = footer.about || DEFAULT_SITE_CHROME_CONTENT.footer.about;
  const columns = footer.columns?.length ? footer.columns : DEFAULT_SITE_CHROME_CONTENT.footer.columns;
  const copyright = footer.copyright || DEFAULT_SITE_CHROME_CONTENT.footer.copyright;

  return (
    <footer className="bg-basilica-marbleBlack text-white/80 mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 grid gap-8 sm:grid-cols-2 md:grid-cols-3 text-sm">
        <div>
          <div className="font-display text-lg text-white font-bold mb-3">{about.heading}</div>
          <p className="text-white/60">{about.text}</p>
        </div>
        {columns.map((column, idx) => (
          <div key={idx}>
            <div className="font-semibold text-white mb-3">{column.heading}</div>
            <ul className="space-y-2">
              {(column.links || []).map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="hover:text-basilica-copper">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10 py-4 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-center text-xs text-white/50">
        <span>© {new Date().getFullYear()} {copyright}</span>
        <Link href="/privacy-policy" className="hover:text-basilica-copper underline underline-offset-2">
          Privacy Policy
        </Link>
      </div>
    </footer>
  );
}
