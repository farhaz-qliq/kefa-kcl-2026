"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Trophy, Calendar, BarChart2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Home", href: "/", icon: Home },
  { label: "Fantasy", href: "/fantasy", icon: Sparkles },
  { label: "Fixtures", href: "/fixtures", icon: Calendar },
  { label: "Table", href: "/points-table", icon: Trophy },
  { label: "Stats", href: "/stats", icon: BarChart2 },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="w-full h-16 bg-navy border-t border-navy-700 shrink-0">
      <ul className="flex items-center justify-around h-full">
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
          const active = pathname === href || (href !== "/" && pathname.startsWith(href));
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                className={cn(
                  "flex flex-col items-center gap-0.5 py-2 text-[10px] font-medium transition-colors",
                  active ? "text-neon-lime" : "text-gray-400 hover:text-white"
                )}
              >
                <Icon
                  size={20}
                  className={cn("transition-all", active && "drop-shadow-[0_0_6px_#C7FF00]")}
                />
                <span>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
