// Centralized set of minimal outline-style icons used across the site,
// replacing emoji so every icon shares the same stroke weight, sizing, and
// color (set via currentColor / className) instead of relying on whatever
// emoji font the visitor's OS happens to render. Admin content stores an
// icon *key* (e.g. "price", "anchor") rather than raw emoji text; unknown
// or blank keys fall through to a generic dot so old/custom values never
// render nothing at all.
const PATHS = {
  price: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9.25a2.25 2.25 0 0 1 2.25-1.75h.5a2.25 2.25 0 0 1 0 4.5h-.5a2.25 2.25 0 0 0 0 4.5h.5a2.25 2.25 0 0 0 2.25-1.75" />
      <path d="M12 6.5v11" />
    </>
  ),
  instant: <path d="M13 2 4.5 13.5H11L10 22l8.5-11.5H12l1-8.5Z" strokeLinejoin="round" />,
  support: (
    <>
      <path d="M4 14v-2a8 8 0 0 1 16 0v2" />
      <rect x="2.5" y="13" width="4" height="6.5" rx="1.5" />
      <rect x="17.5" y="13" width="4" height="6.5" rx="1.5" />
    </>
  ),
  booking: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18" />
      <path d="M8 3v4M16 3v4" />
      <path d="m9 15 2 2 4-4" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3 4.5 6v6c0 4.5 3.2 7.5 7.5 9 4.3-1.5 7.5-4.5 7.5-9V6L12 3Z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </>
  ),
  anchor: (
    <>
      <circle cx="12" cy="5" r="2" />
      <path d="M12 7v14" />
      <path d="M6 12H3a9 9 0 0 0 9 9 9 9 0 0 0 9-9h-3" />
      <path d="M7.5 9.5 12 12l4.5-2.5" />
    </>
  ),
  ticket: (
    <>
      <path d="M3 8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4V8Z" />
      <path d="M14 6v12" strokeDasharray="2 2" />
    </>
  ),
  dining: (
    <>
      <path d="M7 3v7a2 2 0 0 0 2 2v9" />
      <path d="M7 3v5M10 3v5" />
      <path d="M17 3c-1.4 0-2.5 1.6-2.5 5s1.1 5 2.5 5v8" />
    </>
  ),
  sunset: (
    <>
      <path d="M12 3v5" />
      <path d="m5.6 8.6 1.8 1.8M18.4 8.6l-1.8 1.8" />
      <path d="M3 14h18" />
      <path d="M5 18a7 7 0 0 1 14 0" />
      <path d="M2 21h20" />
    </>
  ),
  skipLine: (
    <>
      <path d="M4 6v12l7-6-7-6Z" strokeLinejoin="round" />
      <path d="M12 6v12l7-6-7-6Z" strokeLinejoin="round" />
      <path d="M20 6v12" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m4 7 8 6 8-6" />
    </>
  ),
  refund: (
    <>
      <path d="M4 10a8 8 0 1 1 2.2 5.6" />
      <path d="M4 4v6h6" />
    </>
  ),
  landmark: (
    <>
      <path d="M4 21h16" />
      <path d="M5 21V10M9 21V10M15 21V10M19 21V10" />
      <path d="M3 10 12 4l9 6" />
    </>
  ),
  compare: (
    <>
      <path d="M4 20V10" />
      <path d="M12 20V4" />
      <path d="M20 20v-7" />
      <path d="M2 20h20" />
    </>
  ),
  star: <path d="m12 3 2.6 5.9 6.4.6-4.8 4.3 1.4 6.3L12 17l-5.6 3.1 1.4-6.3-4.8-4.3 6.4-.6L12 3Z" strokeLinejoin="round" />,
  flame: (
    <path
      d="M12 2c2.5 3 1 5-.5 7-1.2 1.6-2 2.9-2 4.5a2.5 2.5 0 0 0 5 0c0-.6-.1-1-.3-1.5 1.4 1 2.3 2.7 2.3 4.5A5.5 5.5 0 0 1 5 16c0-4.5 3-6 4.5-9 .8-1.6.8-3.3-.5-5 1.4.6 2.3 1.3 3 3Z"
      strokeLinejoin="round"
    />
  ),
  check: <path d="m5 12 5 5 9-10" strokeLinejoin="round" />,
  phone: (
    <path d="M6.6 10.8a15.9 15.9 0 0 0 6.6 6.6l2.2-2.2a1.5 1.5 0 0 1 1.5-.4c1 .3 2 .5 3.1.5a1.5 1.5 0 0 1 1.5 1.5V20a1.5 1.5 0 0 1-1.5 1.5C10.6 21.5 2.5 13.4 2.5 3.5A1.5 1.5 0 0 1 4 2h3.2a1.5 1.5 0 0 1 1.5 1.5c0 1.1.2 2.1.5 3.1.1.5 0 1.1-.4 1.5L6.6 10.8Z" />
  ),
};

export default function Icon({ name, className = "h-5 w-5", filled = false }) {
  const content = PATHS[name];
  const size = { width: 20, height: 20 };
  if (!content) {
    return (
      <svg viewBox="0 0 24 24" {...size} className={className} fill="currentColor" aria-hidden="true">
        <circle cx="12" cy="12" r="4" />
      </svg>
    );
  }
  if (filled) {
    return (
      <svg viewBox="0 0 24 24" {...size} className={className} fill="currentColor" stroke="none" aria-hidden="true">
        {content}
      </svg>
    );
  }
  return (
    <svg
      viewBox="0 0 24 24"
      {...size}
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {content}
    </svg>
  );
}
