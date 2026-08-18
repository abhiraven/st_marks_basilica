import Eyebrow from "@/components/Eyebrow";
import { getContactContent } from "@/lib/contact-content";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const { seo } = await getContactContent();
  return {
    title: seo.title,
    description: seo.description,
    alternates: { canonical: "/contact" },
    robots: seo.noIndex ? { index: false, follow: false } : { index: true, follow: true },
  };
}

export default async function ContactPage() {
  const { hero, image, email, supportHours } = await getContactContent();

  return (
    <div className="bg-white">
    <section className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
      <Eyebrow>{hero.eyebrow}</Eyebrow>
      <h1 className="mt-4 font-display text-4xl font-bold text-basilica-marbleBlack">{hero.title}</h1>
      <p className="mt-2 text-basilica-marbleBlack/70 max-w-2xl">{hero.subtitle}</p>

      <div className="mt-10 overflow-hidden rounded-2xl border border-basilica-marbleDark/15 bg-white">
        <img
          src={image.src}
          alt={image.alt}
          className="h-56 w-full object-cover"
        />

        <div className="p-6 sm:p-8 grid gap-6 sm:grid-cols-2">
          <div className="flex items-start gap-4">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-basilica-marbleDark/10 text-2xl">
              ✉️
            </span>
            <div>
              <div className="text-lg font-semibold text-basilica-marbleBlack">Email</div>
              <a
                href={`mailto:${email}`}
                className="text-lg text-basilica-bronze hover:text-basilica-bronzeDark break-all"
              >
                {email}
              </a>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-basilica-marbleDark/10 text-2xl">
              🕐
            </span>
            <div>
              <div className="text-lg font-semibold text-basilica-marbleBlack">Support Hours</div>
              <div className="text-lg text-basilica-marbleBlack/70">{supportHours}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
    </div>
  );
}
