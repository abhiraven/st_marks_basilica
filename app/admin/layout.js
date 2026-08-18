import { getSession } from "@/lib/auth-server";
import AdminSidebar from "@/components/admin/AdminSidebar";

export const metadata = {
  title: "Admin | St Mark's Basilica Entry",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }) {
  const session = await getSession();

  if (!session) {
    return <div className="min-h-screen bg-basilica-marble">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-basilica-marble lg:flex">
      <AdminSidebar username={session.username} role={session.role} permissions={session.permissions} />
      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}
