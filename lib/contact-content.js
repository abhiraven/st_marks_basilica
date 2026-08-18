import { img } from "@/lib/images";
import { getPageContent, savePageContent } from "@/lib/content-store";

export const DEFAULT_CONTACT_CONTENT = {
  seo: {
    title: "Contact Us | St Mark's Basilica Entry",
    description:
      "Questions about a St Mark's Basilica guided tour, ticket prices, or the Doge's Palace combo? Get in touch and we'll help you sort it out.",
    noIndex: false,
  },
  hero: {
    eyebrow: "CONTACT US",
    title: "Get in Touch",
    subtitle:
      "Not sure whether to book St Mark's Basilica entry tickets or a guided tour, or something went sideways with an existing reservation? Send us the details and we'll help you sort it out.",
  },
  image: {
    src: img("piazza", 1000),
    alt: "Piazza San Marco visitor information",
  },
  email: "hello@stmarksbasilicaentry.com",
  supportHours: "Every day, 9:00 am – 8:00 pm CET",
};

export async function getContactContent() {
  return getPageContent("contact", DEFAULT_CONTACT_CONTENT);
}

export async function saveContactContent(content) {
  return savePageContent("contact", content);
}
