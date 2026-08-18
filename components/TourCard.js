import { img } from "@/lib/images";
import { normalizeExternalUrl } from "@/lib/url";

function Stars({ rating }) {
  const numRating = Number(rating) || 0;
  const full = Math.min(5, Math.max(0, Math.round(numRating)));
  return (
    <span className="text-basilica-copper text-sm" aria-label={`Rated ${numRating} out of 5`}>
      {"★".repeat(full)}
      <span className="text-basilica-marbleDark/20">{"★".repeat(5 - full)}</span>
    </span>
  );
}

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
      <div className="relative h-40 w-full">
        <img
          src={tour.image || img("gatehouses", 800)}
          alt={tour.imageAlt || tour.title}
          className="h-full w-full object-cover"
        />
        {tour.badge && (
          <span className="absolute left-3 top-3 inline-flex items-center rounded-full bg-basilica-marbleBlack/90 px-3 py-1 text-xs font-bold text-white shadow">
            {tour.badge}
          </span>
        )}
        {highlighted && (
          <span className="absolute right-3 top-3 inline-flex items-center rounded-full bg-basilica-bronze px-3 py-1 text-xs font-bold text-white shadow">
            ⭐ Most Popular
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-lg font-bold text-basilica-marbleBlack leading-snug">
          {tour.title}
        </h3>

        <ul className="mt-3 space-y-1.5 text-sm text-basilica-marbleBlack/80">
          {features.filter(Boolean).map((f, i) => (
            <li key={i} className="flex gap-2">
              <span className="text-basilica-marbleDark">✓</span>
              <span>{f}</span>
            </li>
          ))}
        </ul>

        <div className="mt-4 flex items-center gap-2 text-sm text-basilica-marbleBlack/70">
          <Stars rating={tour.rating} />
          <span>
            Rated {tour.rating} out of 5 | Reviews: {Number(tour.reviews || 0).toLocaleString()}
          </span>
        </div>

        <div className="mt-auto pt-5 flex items-center justify-between">
          <div>
            <div className="text-xs text-basilica-marbleBlack/60">from</div>
            <div className="text-2xl font-bold text-basilica-marbleBlack">{tour.price}</div>
          </div>
          <a
            href={normalizeExternalUrl(tour.url)}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="inline-flex items-center rounded-full bg-basilica-bronze px-5 py-2.5 text-sm font-bold text-white shadow hover:bg-basilica-bronzeDark transition"
          >
            BOOK NOW
          </a>
        </div>
      </div>
    </div>
  );
}
