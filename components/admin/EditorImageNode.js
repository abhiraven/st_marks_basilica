"use client";

import { useEffect, useRef, useState } from "react";
import { NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react";
import Image from "@tiptap/extension-image";

const WIDTH_PRESETS = [
  { label: "25%", value: "25%" },
  { label: "50%", value: "50%" },
  { label: "75%", value: "75%" },
  { label: "Full", value: "100%" },
];

function ImageNodeView({ node, updateAttributes, deleteNode }) {
  const [panelOpen, setPanelOpen] = useState(false);
  const [alt, setAlt] = useState(node.attrs.alt || "");
  const [title, setTitle] = useState(node.attrs.title || "");
  const [caption, setCaption] = useState(node.attrs.caption || "");
  const panelRef = useRef(null);

  // Keep the local fields in sync if the attrs change from elsewhere
  // (undo/redo, or a different image being edited reusing this instance).
  useEffect(() => {
    setAlt(node.attrs.alt || "");
    setTitle(node.attrs.title || "");
    setCaption(node.attrs.caption || "");
  }, [node.attrs.alt, node.attrs.title, node.attrs.caption]);

  useEffect(() => {
    if (!panelOpen) return;
    function handleClick(e) {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setPanelOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [panelOpen]);

  function saveText() {
    updateAttributes({ alt, title, caption: caption.trim() || null });
  }

  function closePanel() {
    saveText();
    setPanelOpen(false);
  }

  const width = node.attrs.width || "100%";

  return (
    <NodeViewWrapper className="relative" data-drag-handle>
      <img
        src={node.attrs.src}
        alt={node.attrs.alt || ""}
        title={node.attrs.title || ""}
        style={{ width }}
        onClick={() => setPanelOpen((v) => !v)}
        className={`block max-w-full rounded-2xl cursor-pointer transition ${
          panelOpen ? "ring-2 ring-basilica-bronze" : ""
        }`}
      />

      {node.attrs.caption && !panelOpen && (
        <p className="mt-1.5 text-center text-xs italic text-basilica-marbleBlack/60">{node.attrs.caption}</p>
      )}

      {panelOpen && (
        <div
          ref={panelRef}
          contentEditable={false}
          className="absolute left-0 top-full z-20 mt-2 w-80 rounded-xl border border-basilica-marbleDark/25 bg-white p-3 shadow-lg"
        >
          <label className="block text-xs font-semibold text-basilica-marbleBlack/70 mb-1">
            Alt Text <span className="font-normal text-basilica-marbleBlack/40">(for accessibility &amp; SEO)</span>
          </label>
          <input
            type="text"
            value={alt}
            onChange={(e) => setAlt(e.target.value)}
            onBlur={saveText}
            placeholder="Describe this image"
            className="w-full rounded-lg border border-basilica-marbleDark/25 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-basilica-marbleDark"
          />

          <label className="block text-xs font-semibold text-basilica-marbleBlack/70 mb-1 mt-2.5">
            Title <span className="font-normal text-basilica-marbleBlack/40">(shown as a tooltip on hover)</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={saveText}
            placeholder="Optional"
            className="w-full rounded-lg border border-basilica-marbleDark/25 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-basilica-marbleDark"
          />

          <label className="block text-xs font-semibold text-basilica-marbleBlack/70 mb-1 mt-2.5">
            Caption <span className="font-normal text-basilica-marbleBlack/40">(shown below the image)</span>
          </label>
          <input
            type="text"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            onBlur={saveText}
            placeholder="Optional"
            className="w-full rounded-lg border border-basilica-marbleDark/25 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-basilica-marbleDark"
          />

          <div className="mt-2.5">
            <label className="block text-xs font-semibold text-basilica-marbleBlack/70 mb-1">Size</label>
            <div className="flex flex-wrap gap-1.5">
              {WIDTH_PRESETS.map((preset) => (
                <button
                  key={preset.value}
                  type="button"
                  onClick={() => updateAttributes({ width: preset.value })}
                  className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                    width === preset.value
                      ? "border-basilica-marbleBlack bg-basilica-marbleBlack text-white"
                      : "border-basilica-marbleDark/25 text-basilica-marbleBlack hover:bg-basilica-marbleDark/10"
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <button
              type="button"
              onClick={() => deleteNode()}
              className="text-xs font-semibold text-red-500 hover:text-red-700"
            >
              Delete Image
            </button>
            <button
              type="button"
              onClick={closePanel}
              className="rounded-full bg-basilica-marbleBlack px-3 py-1.5 text-xs font-bold text-white hover:bg-basilica-marbleBlack/90"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </NodeViewWrapper>
  );
}

// Extends Tiptap's base Image extension (which already has src/alt/title)
// with `width` (for resizing) and `caption` attributes, and a custom node
// view so clicking an inserted image opens a small panel to edit alt text,
// title, caption, resize it, or delete it. Saved as real HTML: alt/title
// attributes and an inline width style on the <img>, and — when a caption
// is set — the image is wrapped in a <figure> with a <figcaption>, exactly
// like a standard WordPress image block.
export const ResizableImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: "100%",
        renderHTML: (attrs) => (attrs.width ? { style: `width: ${attrs.width}` } : {}),
        parseHTML: (element) => element.style.width || element.getAttribute("width") || "100%",
      },
      caption: {
        default: null,
        // Rendered as a sibling <figcaption> in renderHTML() below, not as
        // an attribute on the <img> tag itself.
        renderHTML: () => ({}),
        parseHTML: (element) => element.closest("figure")?.querySelector("figcaption")?.textContent || null,
      },
    };
  },
  parseHTML() {
    return [
      // Without this, ProseMirror's generic HTML parser doesn't recognize
      // <figcaption> (it's not mapped to any node type), so it falls back
      // to treating its text as loose content and auto-wraps it in its own
      // paragraph — duplicating the caption into the post body every time
      // the editor's HTML gets re-parsed (which happens right after saving
      // a caption). The caption text itself is still recovered correctly
      // via the `caption` attribute's parseHTML above (element.closest
      // ("figure")...); this rule just stops the raw <figcaption> element
      // from ALSO being parsed as a separate paragraph.
      { tag: "figure.editor-image-figure > figcaption", ignore: true },
      ...(this.parent?.() ?? []),
    ];
  },
  renderHTML({ HTMLAttributes, node }) {
    const img = ["img", HTMLAttributes];
    if (node.attrs.caption) {
      return ["figure", { class: "editor-image-figure" }, img, ["figcaption", {}, node.attrs.caption]];
    }
    return img;
  },
  addNodeView() {
    return ReactNodeViewRenderer(ImageNodeView);
  },
});
