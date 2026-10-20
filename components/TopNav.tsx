"use client";

import { useState } from "react";
import { Menu, Bell, X, Shield, Users, BarChart2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/teams",   label: "Teams",   Icon: Shield,    desc: "All 16 clubs · Group stage" },
  { href: "/players", label: "Players", Icon: Users,     desc: "Squads & player profiles" },
  { href: "/stats",   label: "Stats",   Icon: BarChart2, desc: "Top scorers & assists" },
];

export default function TopNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <header className="w-full h-14 bg-white border-b border-gray-100 flex items-center justify-between px-4 shrink-0 z-40">
        <button
          onClick={() => setOpen(true)}
          className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-50 transition-colors"
          aria-label="Open menu"
        >
          <Menu size={22} className="text-navy" strokeWidth={2.5} />
        </button>

        <div className="text-center leading-none">
          <p className="font-heading text-2xl text-navy tracking-wide">KEFA</p>
          <p className="text-[11px] font-semibold text-gray-400 tracking-[0.2em] uppercase -mt-0.5">KCL 2026</p>
        </div>

        <button
          className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-50 transition-colors relative"
          aria-label="Notifications"
        >
          <Bell size={22} className="text-navy" strokeWidth={2} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#C7FF00] border-2 border-white" />
        </button>
      </header>

      {/* Drawer */}
      {open && (
        <div className="fixed inset-0 z-[100] flex" onClick={() => setOpen(false)}>
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60" />

          {/* Panel */}
          <div
            className="relative w-[78%] max-w-[300px] h-full bg-[#080d18] flex flex-col shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Branding */}
            <div className="flex items-center justify-between px-5 pt-8 pb-5 border-b border-white/10">
              <div>
                <p className="font-heading text-[26px] text-white tracking-wide leading-none">KEFA</p>
                <p className="text-[#C7FF00] text-[10px] font-bold tracking-[0.3em] uppercase mt-1">KCL 2026</p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center"
              >
                <X size={16} className="text-white" />
              </button>
            </div>

            {/* Nav links */}
            <div className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-1">
              {LINKS.map(({ href, label, Icon, desc }) => {
                const active = pathname === href || pathname.startsWith(href + "/");
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-4 px-4 py-3.5 rounded-xl transition-colors border",
                      active
                        ? "bg-[#C7FF00]/10 border-[#C7FF00]/20"
                        : "border-transparent hover:bg-white/5"
                    )}
                  >
                    <div className={cn(
                      "w-9 h-9 rounded-lg flex items-center justify-center shrink-0",
                      active ? "bg-[#C7FF00]/15" : "bg-white/10"
                    )}>
                      <Icon size={18} className={active ? "text-[#C7FF00]" : "text-gray-400"} />
                    </div>
                    <div>
                      <p className={cn(
                        "font-heading text-[15px] uppercase leading-none",
                        active ? "text-[#C7FF00]" : "text-white"
                      )}>
                        {label}
                      </p>
                      <p className="text-gray-500 text-[10px] mt-0.5">{desc}</p>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Footer */}
            <div className="px-5 py-5 border-t border-white/10">
              <p className="text-gray-600 text-[9px] uppercase tracking-[0.2em]">
                Powered by La Perfume · Season 6
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
