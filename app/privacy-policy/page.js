import Eyebrow from "@/components/Eyebrow";
import RichText from "@/components/RichText";
import { getPrivacyContent } from "@/lib/privacy-content";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const { seo } = await getPrivacyContent();
  return {
    title: seo.title,
    description: seo.description,
    alternates: { canonical: "/privacy-policy" },
    robots: seo.noIndex ? { index: false, follow: false } : { index: true, follow: true },
  };
}

export default async function PrivacyPolicyPage() {
  const { hero, effectiveDate, intro, sections } = await getPrivacyContent();

  return (
    <div className="bg-white">
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <Eyebrow>{hero.eyebrow}</Eyebrow>
        <h1 className="mt-4 font-display text-4xl font-bold text-basilica-marbleBlack">{hero.title}</h1>
        <p className="mt-2 text-basilica-marbleBlack/70">{hero.subtitle}</p>
        {effectiveDate && (
          <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-basilica-marbleBlack/40">
            Effective Date: {effectiveDate}
          </p>
        )}

        {intro && (
          <p className="mt-8 text-basilica-marbleBlack/80 leading-relaxed">{intro}</p>
        )}

        <div className="mt-8 flex flex-col gap-8">
          {sections.map((section, i) => (
            <div key={i}>
              <h2 className="font-display text-lg font-bold text-basilica-marbleBlack">
                {i + 1}. {section.title}
              </h2>
              <RichText
                text={section.body}
                className="mt-2 text-sm text-basilica-marbleBlack/70 leading-relaxed flex flex-col gap-3"
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
