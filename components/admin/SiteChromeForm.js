"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Field, ImageUploadField, Repeater, Section, setPath } from "./FormFields";

export default function SiteChromeForm({ initialContent }) {
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

    try {
      const res = await fetch("/api/admin/site-chrome", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setMessage(data.error || "Failed to save changes.");
        return;
      }
      setMessage("Saved! The navbar and footer are now updated.");
      router.refresh();
    } catch {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  const columns = content.footer.columns || [];

  function updateColumn(idx, key, value) {
    const next = columns.map((c, i) => (i === idx ? { ...c, [key]: value } : c));
    update(["footer", "columns"], next);
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

      <Section title="Logo" description="Shown at the top-left of every page" defaultOpen>
        <ImageUploadField
          label="Logo"
          value={content.logo.src}
          onChange={(v) => update(["logo", "src"], v)}
          uploadType="site-chrome"
          altValue={content.logo.alt}
          onAltChange={(v) => update(["logo", "alt"], v)}
          altLabel="Alt Text (for accessibility & SEO)"
        />
      </Section>

      <Section title="Top Navigation" description="Links shown in the header, left to right" defaultOpen>
        <Repeater
          items={content.navbar.items}
          onChange={(v) => update(["navbar", "items"], v)}
          fields={[
            { key: "label", label: "Label" },
            { key: "href", label: "Link" },
          ]}
          addLabel="+ Add Nav Link"
        />
        <div className="grid gap-3 sm:grid-cols-2">
          <Field
            label={'Mobile "Book Now" Button Text'}
            value={content.navbar.bookNowLabel}
            onChange={(v) => update(["navbar", "bookNowLabel"], v)}
          />
          <Field
            label={'Mobile "Book Now" Button Link'}
            value={content.navbar.bookNowHref}
            onChange={(v) => update(["navbar", "bookNowHref"], v)}
          />
        </div>
      </Section>

      <Section title="Footer — About" description="The blurb in the first footer column" defaultOpen>
        <Field
          label="Heading"
          value={content.footer.about.heading}
          onChange={(v) => update(["footer", "about", "heading"], v)}
        />
        <Field
          label="Text"
          value={content.footer.about.text}
          onChange={(v) => update(["footer", "about", "text"], v)}
          textarea
        />
      </Section>

      {columns.map((column, idx) => (
        <Section
          key={idx}
          title={`Footer — ${column.heading || `Column ${idx + 1}`}`}
          description="Column heading and its links"
          defaultOpen
        >
          <Field label="Heading" value={column.heading} onChange={(v) => updateColumn(idx, "heading", v)} />
          <Repeater
            items={column.links}
            onChange={(v) => updateColumn(idx, "links", v)}
            fields={[
              { key: "label", label: "Label" },
              { key: "href", label: "Link" },
            ]}
            addLabel="+ Add Link"
          />
        </Section>
      ))}

      <Section title="Footer — Copyright" description="Shown at the very bottom of every page" defaultOpen>
        <Field
          label="Copyright Text"
          value={content.footer.copyright}
          onChange={(v) => update(["footer", "copyright"], v)}
          textarea
          hint="The current year and © are added automatically — just write the text that follows it."
        />
      </Section>
    </form>
  );
}
