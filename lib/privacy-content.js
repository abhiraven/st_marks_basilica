import { getPageContent, savePageContent } from "@/lib/content-store";

export const DEFAULT_PRIVACY_CONTENT = {
  seo: {
    title: "Privacy Policy | St Mark's Basilica Entry",
    description:
      "How St Mark's Basilica Entry collects, uses, and protects your information, including our use of cookies and affiliate booking partners.",
    noIndex: false,
  },
  hero: {
    eyebrow: "LEGAL",
    title: "Privacy Policy",
    subtitle:
      "This page explains what information we collect when you visit this site, how we use it, and the choices you have.",
  },
  effectiveDate: "August 18, 2026",
  intro:
    "St Mark's Basilica Entry (\"we,\" \"our,\" or \"us\") respects your privacy. This Privacy Policy explains what information we collect, how we use it, and the choices you have when you visit this website. By using this site, you agree to the practices described below.",
  sections: [
    {
      title: "Who We Are",
      body: "St Mark's Basilica Entry is an independent travel guide covering St Mark's Basilica ticket prices, guided tours, and visitor planning. We are not affiliated with the Procuratoria di San Marco, the Patriarchate of Venice, or any official ticketing authority for the Basilica.\n\nWe don't sell tickets ourselves. When you book through a link on this site, you're completing that purchase with one of our booking partners, and we may earn a commission at no extra cost to you.",
    },
    {
      title: "Information We Collect",
      body: "When you reach out to us directly, you may share:\n\n- Your name and email address\n- Anything else you choose to include in your message\n\nWe may also automatically collect some technical information whenever you visit this site, such as:\n\n- Your IP address and approximate location\n- Browser type and device information\n- Which pages you visit and how long you spend on them\n- The site that referred you here\n- The date and time of your visit",
    },
    {
      title: "Cookies & Similar Technologies",
      body: "This site may use cookies and similar technologies to remember your preferences, keep the site running smoothly, and, where relevant, support affiliate link tracking so our booking partners can credit purchases back to us. You can control or disable cookies through your browser settings, though some parts of the site may not work as intended if you do.",
    },
    {
      title: "Affiliate Links & Booking Partners",
      body: "Many of the ticket and tour links on this site are affiliate links, most commonly through GetYourGuide, and potentially other reputable booking platforms over time. If you click one of these links and make a purchase, we may earn a commission. This never changes the price you pay.\n\nOnce you leave our site to complete a booking, your information is handled by that booking partner under their own privacy policy, which we'd encourage you to review.",
    },
    {
      title: "How We Use Your Information",
      body: "We use the information we have to:\n\n- Respond to questions you send us\n- Keep this website running and secure\n- Understand which pages and content are useful to visitors\n- Track affiliate referrals and commissions with our booking partners\n- Meet our legal obligations",
    },
    {
      title: "Sharing Your Information",
      body: "We don't sell your personal information. We may share it with the service providers who help us run this site — for example, our hosting and booking partners — or when required to do so by law. Any affiliate partner you book through receives only what's needed to process and credit that booking.",
    },
    {
      title: "Data Security",
      body: "We take reasonable steps to protect the information we collect, but no method of storing or transmitting data over the internet is completely secure. We can't guarantee absolute security, so we'd encourage you to avoid sending sensitive personal details through the contact email on this site.",
    },
    {
      title: "Data Retention",
      body: "We keep information only for as long as it's genuinely useful — to respond to your inquiry, meet legal requirements, or maintain accurate records — and remove it once it's no longer needed for those purposes.",
    },
    {
      title: "Your Rights",
      body: "Depending on where you're located, you may have the right to access, correct, or delete the personal information we hold about you, object to or restrict how it's used, request a copy of it, or withdraw any consent you've given. To exercise any of these rights, contact us using the details below.",
    },
    {
      title: "Children's Privacy",
      body: "This website is intended for general travel planning and is not directed at children under 13. We don't knowingly collect personal information from children.",
    },
    {
      title: "International Visitors",
      body: "If you're visiting this site from outside Italy or the European Union, be aware that any information you share with us may be processed in a different country, which may have different data protection laws than where you live.",
    },
    {
      title: "Changes to This Policy",
      body: "We may update this Privacy Policy from time to time to reflect changes to the site or our practices. Any updates will be posted on this page along with a new effective date.",
    },
    {
      title: "Contact Us",
      body: "Questions about this Privacy Policy or how your information is handled? Reach us at hello@stmarksbasilicaentry.com.\n\nSt Mark's Basilica Entry is an independent guide and is not affiliated with, endorsed by, or operated by the Procuratoria di San Marco, the Patriarchate of Venice, or any official St Mark's Basilica ticketing authority. Some links on this site are affiliate links, and we may earn a commission from qualifying purchases at no extra cost to you.",
    },
  ],
};

export async function getPrivacyContent() {
  return getPageContent("privacy", DEFAULT_PRIVACY_CONTENT);
}

export async function savePrivacyContent(content) {
  return savePageContent("privacy", content);
}
