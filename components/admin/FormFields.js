"use client";

import { useState } from "react";
import RichTextEditor from "./RichTextEditor";
import MediaLibraryPicker from "./MediaLibraryPicker";
import { contentToHtml } from "@/lib/post-content";

// Shared building blocks for the admin content editors (Home, About,
// Contact). Originally lived only inside HomeContentForm.js; pulled out
// here so every page-content editor can reuse the same inputs instead of
// re-implementing them.

export function setPath(obj, path, value) {
  if (path.length === 0) return value;
  const [key, ...rest] = path;
  const base = obj && typeof obj === "object" ? obj : Array.isArray(obj) ? [] : {};
  const clone = Array.isArray(base) ? [...base] : { ...base };
  clone[key] = setPath(base[key], rest, value);
  return clone;
}

export function Field({ label, value, onChange, textarea = false, type, hint }) {
  const effectiveType = type || (textarea ? "textarea" : "text");
  const isLines = effectiveType === "lines";
  const isTextarea = effectiveType === "textarea" || isLines;
  const displayValue = isLines ? (Array.isArray(value) ? value.join("\n") : value || "") : value ?? "";

  function handleChange(e) {
    onChange(isLines ? e.target.value.split("\n") : e.target.value);
  }

  return (
    <div>
      <label className="block text-xs font-semibold text-basilica-marbleBlack/70 mb-1">{label}</label>
      {isTextarea ? (
        <textarea
          value={displayValue}
          onChange={handleChange}
          rows={isLines ? 4 : 3}
          className="w-full rounded-lg border border-basilica-marbleDark/25 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-basilica-marbleDark"
        />
      ) : (
        <input
          type="text"
          value={displayValue}
          onChange={handleChange}
          className="w-full rounded-lg border border-basilica-marbleDark/25 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-basilica-marbleDark"
        />
      )}
      {hint && <p className="mt-1 text-[11px] text-basilica-marbleBlack/40">{hint}</p>}
    </div>
  );
}

export function Checkbox({ label, checked, onChange, hint, confirmOnCheck, confirmOnUncheck }) {
  function handleChange(e) {
    const next = e.target.checked;
    const message = next ? confirmOnCheck : confirmOnUncheck;
    if (message && !window.confirm(message)) {
      // User backed out — leave state as-is; the controlled `checked` prop
      // will keep the input showing its previous value on re-render.
      return;
    }
    onChange(next);
  }

  return (
    <label className="flex items-start gap-2.5 text-sm font-medium text-basilica-marbleBlack cursor-pointer">
      <input
        type="checkbox"
        checked={Boolean(checked)}
        onChange={handleChange}
        className="mt-0.5 h-4 w-4 rounded border-basilica-marbleDark/40"
      />
      <span>
        {label}
        {hint && <span className="block text-xs font-normal text-basilica-marbleBlack/40">{hint}</span>}
      </span>
    </label>
  );
}

export function ImageUploadField({
  label,
  value,
  onChange,
  uploadType = "site",
  altValue,
  onAltChange,
  altLabel = "Alt Text (for accessibility & SEO)",
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [libraryOpen, setLibraryOpen] = useState(false);

  async function handleFileChange(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setUploading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", uploadType);
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Upload failed.");
        return;
      }
      onChange(data.url);
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <label className="block text-xs font-semibold text-basilica-marbleBlack/70 mb-1">{label}</label>
      <div className="flex items-center gap-3">
        {value && (
          <img src={value} alt="" className="h-16 w-24 shrink-0 rounded-lg border border-basilica-marbleDark/25 object-cover" />
        )}
        <label className="inline-flex cursor-pointer items-center rounded-full border border-basilica-marbleDark/25 bg-white px-4 py-2 text-xs font-semibold text-basilica-marbleBlack hover:bg-basilica-marbleDark/5 transition">
          {uploading ? "Uploading…" : value ? "Replace Photo" : "Upload Photo"}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleFileChange}
            disabled={uploading}
            className="hidden"
          />
        </label>
        <button
          type="button"
          onClick={() => setLibraryOpen(true)}
          className="inline-flex items-center rounded-full border border-basilica-marbleDark/25 bg-white px-4 py-2 text-xs font-semibold text-basilica-marbleBlack hover:bg-basilica-marbleDark/5 transition"
        >
          Choose from Library
        </button>
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      {libraryOpen && (
        <MediaLibraryPicker
          folder={uploadType}
          onSelect={(url) => onChange(url)}
          onClose={() => setLibraryOpen(false)}
        />
      )}
      {onAltChange && (
        <div className="mt-2">
          <label className="block text-xs font-semibold text-basilica-marbleBlack/70 mb-1">{altLabel}</label>
          <input
            type="text"
            value={altValue ?? ""}
            onChange={(e) => onAltChange(e.target.value)}
            className="w-full rounded-lg border border-basilica-marbleDark/25 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-basilica-marbleDark"
          />
        </div>
      )}
    </div>
  );
}

export function Repeater({ items, onChange, fields, addLabel = "+ Add Item" }) {
  const list = Array.isArray(items) ? items : [];

  function updateItem(idx, key, value) {
    const next = list.map((item, i) => (i === idx ? { ...item, [key]: value } : item));
    onChange(next);
  }

  function removeItem(idx) {
    onChange(list.filter((_, i) => i !== idx));
  }

  function addItem() {
    const blank = Object.fromEntries(fields.map((f) => [f.key, ""]));
    onChange([...list, blank]);
  }

  return (
    <div className="flex flex-col gap-3">
      {list.map((item, idx) => (
        <div key={idx} className="rounded-xl border border-basilica-marbleDark/15 bg-basilica-marble/40 p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-basilica-marbleBlack/50">Item {idx + 1}</span>
            <button
              type="button"
              onClick={() => removeItem(idx)}
              className="text-xs font-semibold text-red-500 hover:text-red-700"
            >
              Remove
            </button>
          </div>
          <div className="mt-2 grid gap-3 sm:grid-cols-2">
            {fields.map((f) => (
              <div
                key={f.key}
                className={
                  f.textarea || f.type === "textarea" || f.type === "lines" || f.type === "image" || f.type === "richtext"
                    ? "sm:col-span-2"
                    : ""
                }
              >
                {f.type === "image" ? (
                  <ImageUploadField
                    label={f.label}
                    value={item[f.key]}
                    onChange={(v) => updateItem(idx, f.key, v)}
                    uploadType={f.uploadType}
                  />
                ) : f.type === "richtext" ? (
                  <div>
                    <label className="block text-xs font-semibold text-basilica-marbleBlack/70 mb-1">{f.label}</label>
                    <RichTextEditor
                      value={contentToHtml(item[f.key])}
                      onChange={(v) => updateItem(idx, f.key, v)}
                      uploadType={f.uploadType}
                    />
                  </div>
                ) : (
                  <Field
                    label={f.label}
                    value={item[f.key]}
                    onChange={(v) => updateItem(idx, f.key, v)}
                    textarea={f.textarea}
                    type={f.type}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={addItem}
        className="self-start rounded-full border border-basilica-marbleDark/25 px-4 py-2 text-xs font-semibold text-basilica-marbleBlack hover:bg-basilica-marbleDark/5 transition"
      >
        {addLabel}
      </button>
    </div>
  );
}

export function Section({ title, description, defaultOpen = false, children }) {
  return (
    <details
      open={defaultOpen}
      className="group rounded-2xl border border-basilica-marbleDark/15 bg-white overflow-hidden"
    >
      <summary className="cursor-pointer list-none px-5 py-4 flex items-center justify-between">
        <div>
          <h2 className="font-display text-base font-bold text-basilica-marbleBlack">{title}</h2>
          {description && <p className="mt-0.5 text-xs text-basilica-marbleBlack/50">{description}</p>}
        </div>
        <span className="text-basilica-marbleBlack/40 text-lg group-open:rotate-180 transition-transform">
          ⌄
        </span>
      </summary>
      <div className="border-t border-basilica-marbleDark/10 px-5 py-5 flex flex-col gap-4">{children}</div>
    </details>
  );
}
