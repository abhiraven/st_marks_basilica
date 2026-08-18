// Blog post content used to be a plain-text mini-format: "## " for headings,
// **bold** for emphasis, and a blank line between paragraphs. The admin
// panel now uses a real rich-text (WordPress-style) editor that saves actual
// HTML, but posts written before that switch still have the old plain-text
// content saved in the database. These helpers keep both working:
//   - looksLikeHtml(): true once a post has been saved from the new editor
//   - legacyTextToHtml(): upgrades old plain-text content to HTML, both for
//     showing it correctly on the public blog page, and for pre-filling the
//     new rich-text editor the first time an old post is opened for editing.

export function looksLikeHtml(content) {
  return /<\/?(p|h1|h2|h3|h4|ul|ol|li|blockquote|strong|em|a|img|br|hr|table|thead|tbody|tr|td|th)[\s>]/i.test(
    String(content || "")
  );
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function inlineMarkdownToHtml(text) {
  // **bold** -> <strong>bold</strong>
  return escapeHtml(text).replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
}

export function legacyTextToHtml(content) {
  const blocks = String(content || "")
    .split("\n\n")
    .map((b) => b.trim())
    .filter(Boolean);

  return blocks
    .map((block) => {
      if (block.startsWith("## ")) {
        return `<h2>${inlineMarkdownToHtml(block.replace(/^##\s+/, ""))}</h2>`;
      }
      return `<p>${inlineMarkdownToHtml(block)}</p>`;
    })
    .join("\n");
}

// Always-safe way to get displayable/editable HTML for a post's content,
// regardless of which format it was saved in.
export function contentToHtml(content) {
  if (!content) return "";
  return looksLikeHtml(content) ? content : legacyTextToHtml(content);
}
