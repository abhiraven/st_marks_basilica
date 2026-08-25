import Image from "next/image";
import Eyebrow from "@/components/Eyebrow";
import { getAboutContent } from "@/lib/about-content";
import { img } from "@/lib/images";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const { seo } = await getAboutContent();
  return {
    title: seo.title,
    description: seo.description,
    alternates: { canonical: "/about" },
    robots: seo.noIndex ? { index: false, follow: false } : { index: true, follow: true },
  };
}

export default async function AboutPage() {
  const { hero, images, sections } = await getAboutContent();

  return (
    <div className="bg-white">
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
      <Eyebrow>{hero.eyebrow}</Eyebrow>
      <h1 className="mt-4 font-display text-4xl font-bold text-basilica-marbleBlack">{hero.title}</h1>
      <p className="mt-2 text-basilica-marbleBlack/70 max-w-2xl">{hero.subtitle}</p>

      <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {images.map((image, i) => (
          <div key={i} className="relative h-56 w-full overflow-hidden rounded-2xl">
            <Image
              src={image.src || img("gatehouses", 800)}
              alt={image.alt}
              fill
              sizes="(min-width: 640px) 33vw, 100vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>

      <div className="mt-10 max-w-4xl flex flex-col gap-8">
        {sections.map((section, i) => (
          <div key={i}>
            <h3 className="font-display text-xl font-bold text-basilica-marbleBlack">{section.title}</h3>
            <p className="mt-2 text-basilica-marbleBlack/70 leading-relaxed">{section.body}</p>
          </div>
        ))}
      </div>
    </section>
    </div>
  );
}
