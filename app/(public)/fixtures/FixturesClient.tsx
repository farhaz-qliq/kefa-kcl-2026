"use client";

import { useState } from "react";
import FixtureCard from "@/components/FixtureCard";
import type { Fixture, Team, GroupName } from "@/types";
import { cn } from "@/lib/utils";

const GROUPS: Array<{ label: string; value: GroupName | "ALL" }> = [
  { label: "All", value: "ALL" },
  { label: "Group A", value: "A" },
  { label: "Group B", value: "B" },
  { label: "Group C", value: "C" },
  { label: "Group D", value: "D" },
];

interface Props {
  fixtures: Fixture[];
  teamMap: Record<string, Team>;
}

export default function FixturesClient({ fixtures, teamMap }: Props) {
  const [activeGroup, setActiveGroup] = useState<GroupName | "ALL">("ALL");

  const filtered =
    activeGroup === "ALL" ? fixtures : fixtures.filter((f) => f.groupId === activeGroup);

  // Group by date
  const byDate = filtered.reduce<Record<string, Fixture[]>>((acc, f) => {
    (acc[f.date] ??= []).push(f);
    return acc;
  }, {});

  const sortedDates = Object.keys(byDate).sort();

  return (
    <div>
      {/* Filter chips */}
      <div className="flex gap-2 px-4 py-4 overflow-x-auto scrollbar-none">
        {GROUPS.map(({ label, value }) => (
          <button
            key={value}
            onClick={() => setActiveGroup(value)}
            className={cn(
              "flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold border transition-colors",
              activeGroup === value
                ? "bg-neon-lime text-navy border-neon-lime"
                : "bg-transparent text-gray-500 border-gray-300 hover:border-navy"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="px-4 flex flex-col gap-6 pb-4">
        {sortedDates.map((date) => (
          <div key={date}>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
              {formatDate(date)}
            </p>
            <div className="flex flex-col gap-3">
              {byDate[date].map((fixture) => {
                const home = teamMap[fixture.homeTeamId];
                const away = teamMap[fixture.awayTeamId];
                if (!home || !away) return null;
                return <FixtureCard key={fixture.id} fixture={fixture} homeTeam={home} awayTeam={away} />;
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

function formatDate(dateStr: string) {
  const [year, m, d] = dateStr.split("-");
  return `${MONTHS[parseInt(m) - 1]} ${parseInt(d)}, ${year}`;
}
