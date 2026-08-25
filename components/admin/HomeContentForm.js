"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Checkbox, Field, ImageUploadField, Repeater, Section, setPath } from "./FormFields";
import { normalizeExternalUrl } from "@/lib/url";

function slugify(text) {
  return String(text || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function HomeContentForm({ initialContent }) {
  const router = useRouter();
  const [content, setContent] = useState(initialContent);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  function update(path, value) {
    setContent((prev) => setPath(prev, path, value));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    // Make sure every tour card has a stable id (new cards added via the
    // repeater start out without one) before saving.
    const normalized = {
      ...content,
      tours: (content.tours || []).map((t, i) => ({
        ...t,
        // Always fold in the index so two cards with the same (or blank)
        // title can never collide on the same id — that would produce
        // duplicate React keys and unstable ordering on the live page.
        id: t.id || (slugify(t.title) ? `${slugify(t.title)}-${i}` : `tour-${i}`),
        // Guarantee the booking link always has a scheme — a bare link like
        // "getyourguide.com/..." would otherwise render as a path relative
        // to this site instead of taking visitors to the actual URL.
        url: normalizeExternalUrl(t.url),
      })),
      combosSection: {
        ...content.combosSection,
        items: (content.combosSection?.items || []).map((c) => ({
          ...c,
          url: normalizeExternalUrl(c.url),
        })),
      },
    };
    setContent(normalized);

    try {
      const res = await fetch("/api/admin/home", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(normalized),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setMessage(data.error || "Failed to save changes.");
        return;
      }
      setMessage("Saved! Your homepage is now updated.");
      router.refresh();
    } catch {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="sticky top-0 z-10 -mx-4 sm:-mx-6 px-4 sm:px-6 py-3 bg-basilica-marble/95 backdrop-blur border-b border-basilica-marbleDark/10 flex items-center justify-between">
        <span className="text-xs text-basilica-marbleBlack/50">
          {message || "Edit any section below, then save."}
        </span>
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center rounded-full bg-basilica-bronze px-6 py-2.5 text-sm font-bold text-white hover:bg-basilica-bronzeDark transition disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save Changes"}
        </button>
      </div>

      <Section title="SEO" description="Page title, search-result description, and search engine visibility for the homepage" defaultOpen>
        <Field
          label="Page Title"
          value={content.seo?.title}
          onChange={(v) => update(["seo", "title"], v)}
          hint="Shown as the browser tab title and the blue link in Google search results. Keep it under ~60 characters."
        />
        <Field
          label="Meta Description"
          value={content.seo?.description}
          onChange={(v) => update(["seo", "description"], v)}
          textarea
          hint="The gray summary line under the title in Google search results. Keep it under ~160 characters."
        />
        <Checkbox
          label="Hide this page from search engines (noindex, nofollow)"
          checked={content.seo?.noIndex}
          onChange={(v) => update(["seo", "noIndex"], v)}
          hint="Leave unchecked so Google can index and follow links on this page. Check it to keep it out of search results."
          confirmOnCheck="Hide this page from search engines? It will be set to noindex, nofollow."
          confirmOnUncheck="Make this page visible to search engines again? It will be set to index, follow."
        />
      </Section>

      <Section title="Tour & Ticket Cards" description="The 3 bookable cards shown in the Tours section — photo, price, features, and booking link" defaultOpen>
        <Repeater
          items={content.tours}
          onChange={(v) => update(["tours"], v)}
          fields={[
            { key: "title", label: "Title" },
            { key: "image", label: "Photo", type: "image", uploadType: "tours" },
            { key: "imageAlt", label: "Photo Alt Text (for accessibility & SEO)" },
            { key: "features", label: "Features (one per line)", type: "lines" },
            { key: "rating", label: "Rating (e.g. 4.5)" },
            { key: "reviews", label: "Review Count" },
            { key: "price", label: "Price (e.g. €18)" },
            { key: "badge", label: "Badge Text (optional, e.g. Award-Winning Tour — shown with a star icon)" },
            { key: "url", label: "Booking URL (affiliate link)" },
          ]}
          addLabel="+ Add Tour Card"
        />
      </Section>

      <Section title="Hero Section" description="Top banner with headline, badges, and CTAs" defaultOpen>
        <Field label="Badge Text" value={content.hero.badgeText} onChange={(v) => update(["hero", "badgeText"], v)} />
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Sub-badge Title" value={content.hero.subBadgeTitle} onChange={(v) => update(["hero", "subBadgeTitle"], v)} />
          <Field label="Sub-badge Subtitle" value={content.hero.subBadgeSubtitle} onChange={(v) => update(["hero", "subBadgeSubtitle"], v)} />
        </div>
        <Field
          label="Headline"
          value={content.hero.title}
          onChange={(v) => update(["hero", "title"], v)}
          textarea
          hint="Press Enter for a line break, same as it appears on the page."
        />
        <Field label="Subtitle" value={content.hero.subtitle} onChange={(v) => update(["hero", "subtitle"], v)} textarea />
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Primary Button Text" value={content.hero.primaryCtaText} onChange={(v) => update(["hero", "primaryCtaText"], v)} />
          <Field label="Secondary Button Text" value={content.hero.secondaryCtaText} onChange={(v) => update(["hero", "secondaryCtaText"], v)} />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Rating Value" value={content.hero.ratingValue} onChange={(v) => update(["hero", "ratingValue"], v)} />
          <Field label="Rating Text" value={content.hero.ratingText} onChange={(v) => update(["hero", "ratingText"], v)} />
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <Field label="Price Badge Label" value={content.hero.priceBadgeLabel} onChange={(v) => update(["hero", "priceBadgeLabel"], v)} />
          <Field label="Price Badge Value" value={content.hero.priceBadgeValue} onChange={(v) => update(["hero", "priceBadgeValue"], v)} />
          <Field label="Price Badge Unit" value={content.hero.priceBadgeUnit} onChange={(v) => update(["hero", "priceBadgeUnit"], v)} />
        </div>
        <div>
          <div className="text-xs font-semibold text-basilica-marbleBlack/70 mb-2">Feature Grid (4 items)</div>
          <Repeater
            items={content.hero.features}
            onChange={(v) => update(["hero", "features"], v)}
            fields={[
              { key: "icon", label: "Icon (emoji)" },
              { key: "title", label: "Title" },
              { key: "body", label: "Body" },
            ]}
          />
        </div>

        <div>
          <div className="text-xs font-semibold text-basilica-marbleBlack/70 mb-2">Photos</div>
          <div className="grid gap-3 sm:grid-cols-2">
            <ImageUploadField
              label="Background Photo (faint image behind the headline)"
              value={content.hero.backgroundImage}
              onChange={(v) => update(["hero", "backgroundImage"], v)}
              uploadType="site"
            />
            <ImageUploadField
              label="Main Collage Photo (large photo top-right)"
              value={content.hero.collageMainImage}
              onChange={(v) => update(["hero", "collageMainImage"], v)}
              uploadType="site"
              altValue={content.hero.collageMainImageAlt}
              onAltChange={(v) => update(["hero", "collageMainImageAlt"], v)}
            />
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {[0, 1, 2, 3].map((i) => (
              <ImageUploadField
                key={i}
                label={`Collage Grid Photo ${i + 1} of 4`}
                value={content.hero.collageImages?.[i]}
                onChange={(v) => {
                  const next = [...(content.hero.collageImages || [])];
                  next[i] = v;
                  update(["hero", "collageImages"], next);
                }}
                uploadType="site"
                altValue={content.hero.collageImagesAlt?.[i]}
                onAltChange={(v) => {
                  const next = [...(content.hero.collageImagesAlt || [])];
                  next[i] = v;
                  update(["hero", "collageImagesAlt"], next);
                }}
              />
            ))}
          </div>
        </div>
      </Section>

      <Section title="Trust Bar" description="Small strip of trust icons below the hero">
        <Repeater
          items={content.trustBar.items}
          onChange={(v) => update(["trustBar", "items"], v)}
          fields={[
            { key: "icon", label: "Icon (emoji)" },
            { key: "title", label: "Title" },
            { key: "body", label: "Body" },
          ]}
        />
      </Section>

      <Section title="Tours Section Intro" description="Heading above the tour/ticket cards">
        <Field label="Eyebrow" value={content.toursSection.eyebrow} onChange={(v) => update(["toursSection", "eyebrow"], v)} />
        <Field label="Title" value={content.toursSection.title} onChange={(v) => update(["toursSection", "title"], v)} />
        <Field label="Subtitle" value={content.toursSection.subtitle} onChange={(v) => update(["toursSection", "subtitle"], v)} textarea />
      </Section>

      <Section title="Combo Offer Cards" description="Heading and the 3 bundled-ticket cards below the Tours section" defaultOpen>
        <Field label="Eyebrow" value={content.combosSection.eyebrow} onChange={(v) => update(["combosSection", "eyebrow"], v)} />
        <Field label="Title" value={content.combosSection.title} onChange={(v) => update(["combosSection", "title"], v)} />
        <Repeater
          items={content.combosSection.items}
          onChange={(v) => update(["combosSection", "items"], v)}
          fields={[
            { key: "title", label: "Title" },
            { key: "image", label: "Photo", type: "image", uploadType: "tours" },
            { key: "imageAlt", label: "Photo Alt Text (for accessibility & SEO)" },
            { key: "description", label: "Description", textarea: true },
            { key: "url", label: "Booking URL (affiliate link)" },
          ]}
          addLabel="+ Add Combo Card"
        />
      </Section>

      <Section title="Ticket Price Breakdown" description="The 4 pricing explainer cards">
        <Field label="Eyebrow" value={content.ticketPrices.eyebrow} onChange={(v) => update(["ticketPrices", "eyebrow"], v)} />
        <Field label="Title" value={content.ticketPrices.title} onChange={(v) => update(["ticketPrices", "title"], v)} />
        <Repeater
          items={content.ticketPrices.items}
          onChange={(v) => update(["ticketPrices", "items"], v)}
          fields={[
            { key: "icon", label: "Icon (emoji)" },
            { key: "title", label: "Title" },
            { key: "body", label: "Body (use **text** for bold)", textarea: true },
            { key: "anchorId", label: "Anchor ID (advanced — leave blank)" },
          ]}
        />
      </Section>

      <Section title="Benefits Section" description="Dark teal 'Why Book Online' block">
        <Field label="Eyebrow" value={content.benefits.eyebrow} onChange={(v) => update(["benefits", "eyebrow"], v)} />
        <Field label="Title" value={content.benefits.title} onChange={(v) => update(["benefits", "title"], v)} />
        <ImageUploadField
          label="Background Photo"
          value={content.benefits.backgroundImage}
          onChange={(v) => update(["benefits", "backgroundImage"], v)}
          uploadType="site"
        />
        <Repeater
          items={content.benefits.items}
          onChange={(v) => update(["benefits", "items"], v)}
          fields={[
            { key: "icon", label: "Icon (emoji)" },
            { key: "title", label: "Title" },
            { key: "body", label: "Body", textarea: true },
          ]}
        />
      </Section>

      <Section title="Highlights Section" description="2026 ticket highlights cards">
        <Field label="Eyebrow" value={content.highlights.eyebrow} onChange={(v) => update(["highlights", "eyebrow"], v)} />
        <Field label="Title" value={content.highlights.title} onChange={(v) => update(["highlights", "title"], v)} />
        <Repeater
          items={content.highlights.items}
          onChange={(v) => update(["highlights", "items"], v)}
          fields={[
            { key: "icon", label: "Icon (emoji)" },
            { key: "title", label: "Title" },
            { key: "body", label: "Body", textarea: true },
          ]}
        />
        <Field label="Footnote" value={content.highlights.footnote} onChange={(v) => update(["highlights", "footnote"], v)} />
      </Section>

      <Section title="Best Time to Visit" description="Timing advice text">
        <Field label="Eyebrow" value={content.bestTime.eyebrow} onChange={(v) => update(["bestTime", "eyebrow"], v)} />
        <Field label="Title" value={content.bestTime.title} onChange={(v) => update(["bestTime", "title"], v)} />
        <Field label="Body" value={content.bestTime.body} onChange={(v) => update(["bestTime", "body"], v)} textarea />
      </Section>

      <Section title="Opening Hours" description="Hours table next to Best Time to Visit">
        <Field label="Title" value={content.hours.title} onChange={(v) => update(["hours", "title"], v)} />
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Summer Label" value={content.hours.summerLabel} onChange={(v) => update(["hours", "summerLabel"], v)} />
          <Field label="Summer Hours" value={content.hours.summerHours} onChange={(v) => update(["hours", "summerHours"], v)} />
          <Field label="Winter Label" value={content.hours.winterLabel} onChange={(v) => update(["hours", "winterLabel"], v)} />
          <Field label="Winter Hours" value={content.hours.winterHours} onChange={(v) => update(["hours", "winterHours"], v)} />
        </div>
        <Field label="Note" value={content.hours.note} onChange={(v) => update(["hours", "note"], v)} textarea />
      </Section>

      <Section title="Location" description="Address block next to the map image">
        <Field label="Eyebrow" value={content.location.eyebrow} onChange={(v) => update(["location", "eyebrow"], v)} />
        <Field label="Title" value={content.location.title} onChange={(v) => update(["location", "title"], v)} />
        <Field label="Address" value={content.location.address} onChange={(v) => update(["location", "address"], v)} />
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="GPS Coordinates" value={content.location.gps} onChange={(v) => update(["location", "gps"], v)} />
          <Field label="Nearest Metro" value={content.location.metro} onChange={(v) => update(["location", "metro"], v)} />
        </div>
        <ImageUploadField
          label="Photo"
          value={content.location.image}
          onChange={(v) => update(["location", "image"], v)}
          uploadType="site"
          altValue={content.location.imageAlt}
          onAltChange={(v) => update(["location", "imageAlt"], v)}
        />
      </Section>

      <Section title="Nearby Attractions" description="Cards for things to visit near St Mark's Basilica">
        <Field label="Eyebrow" value={content.nearby.eyebrow} onChange={(v) => update(["nearby", "eyebrow"], v)} />
        <Field label="Title" value={content.nearby.title} onChange={(v) => update(["nearby", "title"], v)} />
        <Repeater
          items={content.nearby.items}
          onChange={(v) => update(["nearby", "items"], v)}
          fields={[
            { key: "title", label: "Title" },
            { key: "body", label: "Body", textarea: true },
            { key: "image", label: "Photo", type: "image", uploadType: "site" },
            { key: "imageAlt", label: "Photo Alt Text (for accessibility & SEO)" },
          ]}
        />
      </Section>

      <Section title="FAQ" description="Frequently asked questions accordion">
        <Field label="Eyebrow" value={content.faq.eyebrow} onChange={(v) => update(["faq", "eyebrow"], v)} />
        <Field label="Title" value={content.faq.title} onChange={(v) => update(["faq", "title"], v)} />
        <Repeater
          items={content.faq.items}
          onChange={(v) => update(["faq", "items"], v)}
          fields={[
            { key: "q", label: "Question" },
            { key: "a", label: "Answer", type: "richtext", uploadType: "site" },
          ]}
          addLabel="+ Add Question"
        />
      </Section>

      <Section title="Final CTA" description="Closing call-to-action banner">
        <Field label="Title" value={content.finalCta.title} onChange={(v) => update(["finalCta", "title"], v)} />
        <Field label="Subtitle" value={content.finalCta.subtitle} onChange={(v) => update(["finalCta", "subtitle"], v)} textarea />
        <Field label="Button Text" value={content.finalCta.ctaText} onChange={(v) => update(["finalCta", "ctaText"], v)} />
        <ImageUploadField
          label="Background Photo"
          value={content.finalCta.backgroundImage}
          onChange={(v) => update(["finalCta", "backgroundImage"], v)}
          uploadType="site"
        />
      </Section>

      <div className="pb-10" />
    </form>
  );
}
