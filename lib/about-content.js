import { img } from "@/lib/images";
import { getPageContent, savePageContent } from "@/lib/content-store";

export const DEFAULT_ABOUT_CONTENT = {
  seo: {
    title: "About St Mark's Basilica | St Mark's Basilica Entry",
    description:
      "The real story behind St Mark's Basilica — how the relics of St Mark ended up in Venice, what a St Mark's Basilica guided tour covers inside, what the Pala d'Oro and bronze horses add, and what you can see for free.",
    noIndex: false,
  },
  hero: {
    eyebrow: "ABOUT US",
    title: "About St Mark's Basilica",
    subtitle: "What St Mark's Basilica actually is, why it's covered in gold, and what's worth knowing before you go.",
  },
  images: [
    { src: img("domesAerial", 700), alt: "Aerial view of St Mark's Basilica domes over Venice" },
    { src: img("mosaicCeiling", 700), alt: "Gold Byzantine mosaic ceiling inside St Mark's Basilica" },
    { src: img("byzantineDetail", 700), alt: "Ornate Byzantine facade detail of St Mark's Basilica" },
  ],
  sections: [
    {
      title: "A Church Built to Outshine an Empire",
      body: "St Mark's Basilica wasn't built as an ordinary parish church. In 828 AD, two Venetian merchants smuggled the relics of St Mark the Evangelist out of Alexandria, and Venice built a shrine worthy of them — modeled deliberately on the great churches of Constantinople. The current building was consecrated in 1094, and for centuries afterward it served as the private chapel of the Doge, not the city's cathedral (that role only passed to it in 1807). Every Doge, every state ceremony, every declaration of war or peace ran through this building.",
    },
    {
      title: "Inside: Nearly 8,000 Square Feet of Gold Mosaic",
      body: "This is why locals call it the Chiesa d'Oro — the Church of Gold. Nearly every surface of the domed ceiling is covered in gold-ground mosaic, built up over four centuries starting in the 1100s, depicting everything from the Old Testament to the life of Christ. A St Mark's Basilica guided tour is worth it here if you want the biblical scenes and the engineering explained rather than just craning your neck at the shine.",
    },
    {
      title: "The Bronze Horses & the Pala d'Oro",
      body: "The four bronze horses above the main entrance are Byzantine, looted from Constantinople during the Fourth Crusade in 1204 — the originals now stand inside the Basilica's museum, with replicas outdoors. Behind the high altar sits the Pala d'Oro, a gold altarpiece embedded with over 1,900 gemstones and pearls, assembled and re-assembled across nearly 700 years. Both the museum and the Pala d'Oro are sold as separate tickets from general Basilica admission, so plan for them if they're on your list.",
    },
    {
      title: "What's Actually Free",
      body: "Entering St Mark's Basilica to pray or attend Mass, through the north-side Porta dei Fiori, costs nothing. The catch is that sightseeing visits during regular hours require a timed ticket, and the two things most people specifically come to see — the Pala d'Oro and the bronze horses' terrace — are separate, ticketed add-ons on top of that.",
    },
  ],
};

export async function getAboutContent() {
  return getPageContent("about", DEFAULT_ABOUT_CONTENT);
}

export async function saveAboutContent(content) {
  return savePageContent("about", content);
}
