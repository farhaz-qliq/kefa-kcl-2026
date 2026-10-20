"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Player, Team, Position } from "@/types";

const POSITIONS: { key: Position | "ALL"; label: string }[] = [
  { key: "ALL", label: "All" },
  { key: "GK",  label: "GK" },
  { key: "DEF", label: "DEF" },
  { key: "MID", label: "MID" },
  { key: "FWD", label: "FWD" },
];

const POS_COLOR: Record<Position, string> = {
  GK:  "#F59E0B",
  DEF: "#3B82F6",
  MID: "#10B981",
  FWD: "#EF4444",
};

interface Props {
  players: Player[];
  teamMap: Record<string, Team>;
}

export default function PlayerList({ players, teamMap }: Props) {
  const [pos, setPos] = useState<Position | "ALL">("ALL");
  const [search, setSearch] = useState("");

  const filtered = players.filter((p) => {
    if (pos !== "ALL" && p.position !== pos) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="pb-8">
      {/* Filter tabs */}
      <div className="sticky top-0 bg-white z-10 border-b border-gray-100 px-4 pt-3 pb-0">
        <div className="flex gap-1 mb-3">
          {POSITIONS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setPos(key)}
              className={cn(
                "flex-1 py-2 rounded-lg text-[11px] font-bold uppercase transition-colors",
                pos === key
                  ? "bg-[#080d18] text-[#C7FF00]"
                  : "bg-gray-100 text-gray-500"
              )}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2.5 mb-3">
          <span className="text-gray-400 text-[12px]">🔍</span>
          <input
            type="text"
            placeholder="Search player…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-navy text-[13px] outline-none placeholder:text-gray-400"
          />
          {search && (
            <button onClick={() => setSearch("")} className="text-gray-400 text-[11px]">✕</button>
          )}
        </div>
      </div>

      {/* Count */}
      <p className="px-4 pt-3 pb-1 text-gray-400 text-[10px] uppercase tracking-wide font-bold">
        {filtered.length} player{filtered.length !== 1 ? "s" : ""}
      </p>

      {/* List */}
      <div className="px-4 flex flex-col gap-1.5">
        {filtered.map((p) => {
          const team = teamMap[p.teamId];
          const posColor = POS_COLOR[p.position];
          return (
            <Link
              key={p.id}
              href={`/players/${p.id}`}
              className="flex items-center gap-3 bg-white rounded-xl border border-gray-100 px-3 py-2.5 hover:border-gray-200 transition-colors"
            >
              {/* Number */}
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 font-heading text-[13px]"
                style={{ backgroundColor: posColor + "15", color: posColor }}
              >
                {p.number}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-navy font-semibold text-[13px] leading-none truncate">{p.name}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  {team?.badgeUrl && (
                    <div className="w-3.5 h-3.5 relative shrink-0">
                      <Image src={team.badgeUrl} alt="" fill className="object-contain" />
                    </div>
                  )}
                  <p className="text-gray-400 text-[9px] truncate">{team?.shortName}</p>
                </div>
              </div>

              {/* Position badge */}
              <span
                className="text-[9px] font-bold px-2 py-0.5 rounded-full shrink-0"
                style={{ backgroundColor: posColor + "15", color: posColor }}
              >
                {p.position}
              </span>

              {/* Stats */}
              <div className="flex gap-3 text-[10px] shrink-0">
                {p.goals > 0 && (
                  <span className="text-gray-500">⚽ <span className="text-navy font-bold">{p.goals}</span></span>
                )}
                {p.assists > 0 && (
                  <span className="text-gray-500">🅰️ <span className="text-navy font-bold">{p.assists}</span></span>
                )}
              </div>

              <ChevronRight size={14} className="text-gray-300 shrink-0" />
            </Link>
          );
        })}

        {filtered.length === 0 && (
          <p className="text-center text-gray-400 text-sm py-12">No players found</p>
        )}
      </div>
    </div>
  );
}
