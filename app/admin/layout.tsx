"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Users, Shield, Calendar, ImageIcon, Newspaper, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Teams", href: "/admin/teams", icon: Shield },
  { label: "Players", href: "/admin/players", icon: Users },
  { label: "Fixtures", href: "/admin/fixtures", icon: Calendar },
  { label: "Banners", href: "/admin/banners", icon: ImageIcon },
  { label: "News", href: "/admin/news", icon: Newspaper },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (pathname === "/admin/login") {
      setReady(true);
      return;
    }
    const auth = localStorage.getItem("kefa_admin_auth");
    if (!auth) {
      router.replace("/admin/login");
    } else {
      setReady(true);
    }
  }, [pathname, router]);

  if (pathname === "/admin/login") return <>{children}</>;
  if (!ready) return <div className="min-h-screen bg-navy" />;

  function logout() {
    localStorage.removeItem("kefa_admin_auth");
    router.push("/admin/login");
  }

  return (
    <div className="flex min-h-screen bg-surface">
      <aside className="w-52 bg-navy flex flex-col min-h-screen flex-shrink-0">
        <div className="px-4 py-5 border-b border-navy-700">
          <p className="text-[10px] text-gray-400 uppercase tracking-widest">Admin Panel</p>
          <p className="font-heading text-xl text-neon-lime leading-none mt-1 neon-glow">
            KEFA KCL 2026
          </p>
        </div>
        <nav className="flex-1 py-4 flex flex-col gap-1 px-2">
          {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
            const active = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
                  active
                    ? "bg-neon-lime text-navy font-semibold"
                    : "text-gray-300 hover:bg-navy-700 hover:text-white"
                )}
              >
                <Icon size={16} />
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-navy-700">
          <button
            onClick={logout}
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm text-gray-400 hover:text-red-400 hover:bg-navy-700 transition-colors"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto min-w-0">{children}</main>
    </div>
  );
}
