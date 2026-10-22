"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Trophy, ChevronDown, Footprints, ShieldCheck } from "lucide-react";

const TABS = [
  { key: "goals",       label: "Golden Boot Race", Icon: Trophy },
  { key: "assists",     label: "Most Assists",      Icon: Footprints },
  { key: "cleansheets", label: "Most Clean Sheets", Icon: ShieldCheck },
] as const;

export default function StatsTabDropdown({ active }: { active: string }) {
  const router      = useRouter();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const current = TABS.find((t) => t.key === active) ?? TABS[0];

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function select(key: string) {
    setOpen(false);
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", key);
    router.push(`?${params.toString()}`);
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 px-3 py-2 rounded-full text-[13px] font-semibold"
        style={{ background: "#F0FBD4", color: "#3d6600", border: "1px solid #C7FF0066" }}
      >
        <current.Icon size={14} strokeWidth={2} />
        <span>{current.label}</span>
        <ChevronDown size={13} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div
          className="absolute right-0 mt-1 rounded-xl overflow-hidden z-50"
          style={{ minWidth: 190, background: "#fff", boxShadow: "0 4px 20px rgba(0,0,0,0.12)", border: "1px solid #E5E7EB" }}
        >
          {TABS.map(({ key, label, Icon }) => (
            <button
              key={key}
              onClick={() => select(key)}
              className="w-full flex items-center gap-2.5 px-4 py-3 text-left text-[13px] hover:bg-gray-50 transition-colors"
              style={{
                fontWeight: key === active ? 700 : 500,
                color: key === active ? "#3d6600" : "#374151",
                background: key === active ? "#F0FBD4" : "transparent",
              }}
            >
              <Icon size={14} strokeWidth={2} />
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
