"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession, SessionProvider } from "next-auth/react";
import "@/app/styles/admin/admin-layout.css";

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();

  const navItems = [
    { href: "/admin", label: "Dashboard", exact: true },
    { href: "/admin/blog", label: "Blog Posts", exact: false },
    { href: "/admin/projects", label: "Projects", exact: true },
    {
      href: "/admin/projects/featured-order",
      label: "↳ Featured Order",
      exact: false,
    },
    { href: "/admin/testimonials", label: "Testimonials", exact: false },
    { href: "/admin/settings", label: "Settings", exact: false },
  ];

  // Add Users link only for ADMIN role
  if (session?.user?.role === "ADMIN") {
    navItems.splice(6, 0, {
      href: "/admin/users",
      label: "Users",
      exact: false,
    });
  }

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <h2>CMS Admin</h2>
        <nav className="admin-nav">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={
                item.exact
                  ? pathname === item.href
                    ? "active"
                    : ""
                  : pathname.startsWith(item.href)
                    ? "active"
                    : ""
              }
            >
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      <main className="admin-main">
        <div className="admin-header">
          <h1>Content Management System</h1>
          <div className="admin-user-info">
            <span>{session?.user?.email}</span>
            <span className="badge">{session?.user?.role}</span>
            <button onClick={() => signOut({ callbackUrl: "/admin/login" })}>
              Logout
            </button>
          </div>
        </div>

        <div className="admin-content">{children}</div>
      </main>
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </SessionProvider>
  );
}
