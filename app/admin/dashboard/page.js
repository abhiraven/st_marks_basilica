import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth-server";
import { hasPageAccess } from "@/lib/admin-pages";
import { sql, ensureSchema } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  if (!hasPageAccess(session, "dashboard")) redirect("/admin/users");

  await ensureSchema();
  const posts = await sql`SELECT * FROM posts ORDER BY created_at DESC`;
  const publishedCount = posts.filter((p) => p.published).length;
  const draftCount = posts.length - publishedCount;
  const categoryCount = new Set(posts.map((p) => p.category || "Travel Tips")).size;
  const recentPosts = posts.slice(0, 5);
  const canManagePosts = hasPageAccess(session, "posts");

  const stats = [
    { label: "Total Posts", value: posts.length, icon: "📝" },
    { label: "Published", value: publishedCount, icon: "✅" },
    { label: "Drafts", value: draftCount, icon: "✏️" },
    { label: "Categories", value: categoryCount, icon: "🏷️" },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="font-display text-2xl font-bold text-basilica-marbleBlack">
        Welcome back, {session.username}
      </h1>
      <p className="mt-1 text-sm text-basilica-marbleBlack/60">
        Here's what's happening with the St Mark's Basilica blog.
      </p>

      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-basilica-marbleDark/15 bg-white p-5">
            <span className="text-xl">{s.icon}</span>
            <div className="mt-2 font-display text-2xl font-bold text-basilica-marbleBlack">{s.value}</div>
            <div className="text-xs text-basilica-marbleBlack/60">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        {canManagePosts && (
          <>
            <Link
              href="/admin/posts/new"
              className="inline-flex items-center rounded-full bg-basilica-bronze px-5 py-2.5 text-sm font-bold text-white hover:bg-basilica-bronzeDark transition"
            >
              + New Post
            </Link>
            <Link
              href="/admin/posts"
              className="inline-flex items-center rounded-full border border-basilica-marbleDark/25 px-5 py-2.5 text-sm font-semibold text-basilica-marbleBlack hover:bg-basilica-marbleDark/5 transition"
            >
              Manage Blog Posts
            </Link>
          </>
        )}
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center rounded-full border border-basilica-marbleDark/25 px-5 py-2.5 text-sm font-semibold text-basilica-marbleBlack hover:bg-basilica-marbleDark/5 transition"
        >
          View Site ↗
        </a>
      </div>

      <div className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-basilica-marbleBlack">Recent Posts</h2>
          {canManagePosts && (
            <Link href="/admin/posts" className="text-sm font-semibold text-basilica-bronze hover:text-basilica-bronzeDark">
              View all →
            </Link>
          )}
        </div>

        <div className="mt-4 overflow-x-auto rounded-2xl border border-basilica-marbleDark/15 bg-white">
          {recentPosts.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-basilica-marbleBlack/50">
              No posts yet. Create your first one.
            </p>
          ) : (
            <table className="w-full text-sm">
              <tbody>
                {recentPosts.map((post) => (
                  <tr key={post.id} className="border-b border-basilica-marbleDark/10 last:border-0">
                    <td className="px-4 py-3 font-medium text-basilica-marbleBlack">{post.title}</td>
                    <td className="px-4 py-3 text-basilica-marbleBlack/60">{post.category || "Travel Tips"}</td>
                    <td className="px-4 py-3">
                      {post.published ? (
                        <span className="inline-flex rounded-full bg-green-100 text-green-700 px-2.5 py-0.5 text-xs font-semibold">
                          Published
                        </span>
                      ) : (
                        <span className="inline-flex rounded-full bg-gray-100 text-gray-600 px-2.5 py-0.5 text-xs font-semibold">
                          Draft
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {canManagePosts && (
                        <Link
                          href={`/admin/posts/${post.id}/edit`}
                          className="text-sm font-semibold text-basilica-marbleDark hover:text-basilica-marbleBlack"
                        >
                          Edit
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
