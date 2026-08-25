import Image from "next/image";
import { img } from "@/lib/images";
import { normalizeExternalUrl } from "@/lib/url";
import Icon from "@/components/Icon";

export default function TourCard({ tour, highlighted = false }) {
  const features = Array.isArray(tour.features) ? tour.features : [];
  return (
    <div
      className={`flex flex-col rounded-2xl border bg-white shadow-sm overflow-hidden transition-shadow ${
        highlighted
          ? "border-basilica-bronze ring-2 ring-basilica-bronze/50 shadow-lg sm:-translate-y-1"
          : "border-basilica-marbleDark/15 hover:shadow-lg"
      }`}
    >
      <div className="relative h-48 w-full">
        <Image
          src={tour.image || img("gatehouses", 800)}
          alt={tour.imageAlt || tour.title}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover"
        />
        {tour.badge && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-basilica-marbleBlack/90 px-3 py-1 text-xs font-bold text-white shadow">
            <Icon name="star" filled className="h-3 w-3" /> {tour.badge}
          </span>
        )}
        {highlighted && (
          <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-basilica-bronze px-3 py-1 text-xs font-bold text-white shadow">
            <Icon name="star" filled className="h-3 w-3" /> Most Popular
          </span>
        )}
        {tour.rating && (
          <span className="absolute left-3 bottom-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-basilica-marbleBlack shadow">
            <Icon name="star" filled className="h-3.5 w-3.5 text-basilica-copper" />
            {tour.rating}
            {tour.reviews ? (
              <span className="font-medium text-basilica-marbleBlack/50">
                ({Number(tour.reviews).toLocaleString()})
              </span>
            ) : null}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-lg font-bold text-basilica-marbleBlack leading-snug">
          {tour.title}
        </h3>

        {tour.description && (
          <p className="mt-2 text-sm text-basilica-marbleBlack/60 line-clamp-2">{tour.description}</p>
        )}

        <ul className="mt-3 space-y-1.5 text-sm text-basilica-marbleBlack/80">
          {features.filter(Boolean).map((f, i) => (
            <li key={i} className="flex gap-2">
              <Icon name="check" className="h-4 w-4 shrink-0 text-basilica-marbleDark mt-0.5" />
              <span>{f}</span>
            </li>
          ))}
        </ul>

        {tour.duration && (
          <div className="mt-4 flex items-center gap-1.5 text-sm text-basilica-marbleBlack/60">
            <Icon name="clock" className="h-4 w-4 shrink-0" />
            <span>Duration: {tour.duration}</span>
          </div>
        )}

        <div className="mt-auto border-t border-basilica-marbleDark/15 pt-4 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-basilica-marbleBlack/50">From</div>
            <div className="flex items-baseline gap-1">
              <span className="font-display text-2xl font-bold text-basilica-marbleBlack">{tour.price}</span>
              <span className="text-xs text-basilica-marbleBlack/50">/person</span>
            </div>
          </div>
          <a
            href={normalizeExternalUrl(tour.url)}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="inline-flex items-center rounded-lg bg-basilica-bronze px-5 py-2.5 text-sm font-bold text-white shadow hover:bg-basilica-bronzeDark transition"
          >
            BOOK NOW
          </a>
        </div>
      </div>
    </div>
  );
}
