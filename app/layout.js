import "./globals.css";
import Script from "next/script";
import { Playfair_Display } from "next/font/google";
import SiteChrome from "@/components/SiteChrome";
import { getSiteChromeContent } from "@/lib/site-chrome-content";

// An elegant, high-contrast serif for headings — evokes Venetian signage and
// illuminated manuscripts, distinct from the generic Georgia fallback most
// travel-affiliate sites use. Loaded via next/font so it's self-hosted and
// zero-layout-shift; exposed as a CSS variable and wired into
// tailwind.config.js under `fontFamily.display`.
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

export const metadata = {
  metadataBase: new URL("https://www.stmarksbasilicaentry.com"),
  title: "St Mark's Basilica Tickets Venice 2026 | Skip the Line & Guided Tours",
  description:
    "Book St Mark's Basilica tickets online — skip-the-line entry, guided tours, and Doge's Palace combo passes for St Mark's Basilica in Venice. Compare prices, check opening hours, and reserve your timed entry in minutes.",
  openGraph: {
    title: "St Mark's Basilica Tickets Venice 2026 | Skip the Line & Guided Tours",
    description:
      "Book St Mark's Basilica tickets online — skip-the-line entry, guided tours, and Doge's Palace combo passes for St Mark's Basilica in Venice. Compare prices, check opening hours, and reserve your timed entry in minutes.",
    type: "website",
  },
};

// Root layout is a server component, so the navbar/footer content saved in
// the admin panel (logo, nav links, footer columns) can be fetched here on
// every request and threaded down through SiteChrome into Header/Footer —
// both of which stay client components (Header needs useState for the
// mobile menu) but now render from this data instead of hardcoded JSX.
//
// That DB fetch runs for every route in the app (it's in the root layout,
// above every page), so every route needs to render dynamically instead of
// being statically generated at build time — same reasoning every other
// DB-backed page here already has its own "force-dynamic" export for.
// Setting it once here at the root covers every current and future page,
// instead of relying on each one to remember to add it individually.
export const dynamic = "force-dynamic";

export default async function RootLayout({ children }) {
  const siteChrome = await getSiteChromeContent();

  return (
    <html lang="en" className={playfair.variable}>
      <body className="bg-basilica-marble text-basilica-marbleBlack antialiased">
        {/* Google tag (gtag.js) — loaded in the root layout (not just the
            homepage) so Analytics tracks navigation across the whole site.
            next/script with "afterInteractive" is the Next.js-recommended
            way to load a tag like this: functionally the same as putting
            the snippet directly in <head>, but it loads after the page is
            interactive instead of blocking the initial render. */}
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-VRV0JVJK1B" strategy="afterInteractive" />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-VRV0JVJK1B');
          `}
        </Script>
        <SiteChrome siteChrome={siteChrome}>{children}</SiteChrome>
      </body>
    </html>
  );
}
