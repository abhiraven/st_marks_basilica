// Catalog of admin sections that page access can be granted for. Admins
// always have full access to everything regardless of this list — it only
// restricts editors. The Users page itself isn't in here: every logged-in
// account can always view it (and edit their own password), independent
// of page permissions.
export const ADMIN_PAGES = [
  { key: "dashboard", label: "Dashboard", description: "Overview stats and recent posts" },
  { key: "home", label: "Home Page", description: "Edit homepage content, sections, and tour cards" },
  { key: "about", label: "About Page", description: "Edit the About Us page text and photos" },
  { key: "contact", label: "Contact Page", description: "Edit the Contact Us page text and details" },
  { key: "privacy", label: "Privacy Policy", description: "Edit the Privacy Policy page" },
  { key: "site-chrome", label: "Navbar & Footer", description: "Edit the logo, top navigation, and footer shown on every page" },
  { key: "posts", label: "Blog Posts", description: "Create, edit, and publish blog posts" },
];

export function hasPageAccess(session, pageKey) {
  if (!session) return false;
  if (session.role === "admin") return true;
  return Array.isArray(session.permissions) && session.permissions.includes(pageKey);
}
