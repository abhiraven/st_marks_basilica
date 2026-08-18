// Pure data, no imports — this is deliberately its own file, separate from
// lib/site-chrome-content.js, so client components (Header.js, Footer.js)
// can import DEFAULT_SITE_CHROME_CONTENT for their fallback rendering
// without also pulling in lib/db.js (which opens a real Postgres connection
// and throws if DATABASE_URL isn't set — fine on the server, but that check
// ran in the browser too when Header/Footer imported it from the same file
// as the DB-backed get/save functions, since webpack bundles a client
// component's entire import graph into the client bundle).
export const DEFAULT_SITE_CHROME_CONTENT = {
  logo: {
    src: "/logo.png",
    alt: "St Mark's Basilica Entry",
  },
  navbar: {
    items: [
      { label: "ST MARK'S BASILICA TICKETS", href: "/" },
      { label: "TICKET OPTIONS", href: "/#tours" },
      { label: "ABOUT US", href: "/about" },
      { label: "BLOG", href: "/blog" },
      { label: "CONTACT US", href: "/contact" },
    ],
    bookNowLabel: "Book Now",
    bookNowHref: "/#tours",
  },
  footer: {
    about: {
      heading: "St Mark's Basilica Entry",
      text: "An independent guide to St Mark's Basilica tickets, guided tours and visitor information. We're not affiliated with the Procuratoria di San Marco or the Patriarchate of Venice. Our goal is to help visitors plan their visit and choose the right ticket.",
    },
    columns: [
      {
        heading: "Explore",
        links: [
          { label: "Guided Tours", href: "/#tours" },
          { label: "Ticket Prices", href: "/#tickets" },
          { label: "Pala d'Oro & Treasury", href: "/#pala-doro-treasury" },
          { label: "Blog", href: "/blog" },
          { label: "About Us", href: "/about" },
        ],
      },
      {
        heading: "Visitor Info",
        links: [
          { label: "Opening Hours", href: "/#hours" },
          { label: "Address & Map", href: "/#location" },
          { label: "FAQs", href: "/#faq" },
          { label: "Contact Us", href: "/contact" },
        ],
      },
    ],
    copyright: "St Mark's Basilica Entry. All prices shown are indicative and set by third-party booking partners.",
  },
};
