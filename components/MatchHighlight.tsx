import Link from "next/link";
import Image from "next/image";
import type { Fixture, Team } from "@/types";

interface MatchHighlightProps {
  fixtures: Fixture[];
  teams: Team[];
}

function getTeam(teams: Team[], id: string): Team {
  return teams.find((t) => t.id === id)!;
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { day: "numeric", month: "short" });
}

export default function MatchHighlight({ fixtures, teams }: MatchHighlightProps) {
  const upcoming = fixtures.filter((f) => f.status === "scheduled").slice(0, 3);

  if (upcoming.length === 0) return null;

  return (
    <div className="px-4 pt-5">
      {/* Section header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="w-1 h-5 rounded-full bg-[#C7FF00]" />
          <h2 className="font-heading text-xl text-navy uppercase tracking-wide">Upcoming Matches</h2>
        </div>
        <Link
          href="/fixtures"
          className="text-[10px] font-bold uppercase tracking-wider text-[#00D9FF] hover:underline"
        >
          All Fixtures →
        </Link>
      </div>

      <div className="flex flex-col gap-2">
        {upcoming.map((fix) => {
          const home = getTeam(teams, fix.homeTeamId);
          const away = getTeam(teams, fix.awayTeamId);
          return (
            <div
              key={fix.id}
              className="flex items-center bg-[#F5F7FA] rounded-xl px-4 py-3 gap-2"
            >
              {/* Home */}
              <div className="flex items-center gap-2.5 flex-1 min-w-0">
                <div className="w-11 h-11 flex-shrink-0 relative">
                  <Image
                    src={home.badgeUrl ?? "/badges/t1.png"}
                    alt={home.shortName}
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="min-w-0">
                  <p className="font-heading text-navy text-[13px] uppercase leading-none truncate">
                    {home.shortName}
                  </p>
                  <p className="text-gray-400 text-[9px] truncate mt-0.5">{home.name}</p>
                </div>
              </div>

              {/* VS block */}
              <div className="flex flex-col items-center flex-shrink-0 px-2">
                <span className="font-heading text-[13px] tracking-wider" style={{ color: "#00D9FF" }}>
                  VS
                </span>
                <span className="text-navy text-[9px] font-semibold mt-0.5">{fix.time}</span>
                <span className="text-gray-400 text-[8px]">{fmtDate(fix.date)}</span>
              </div>

              {/* Away */}
              <div className="flex items-center gap-2.5 flex-1 min-w-0 justify-end">
                <div className="min-w-0 text-right">
                  <p className="font-heading text-navy text-[13px] uppercase leading-none truncate">
                    {away.shortName}
                  </p>
                  <p className="text-gray-400 text-[9px] truncate mt-0.5">{away.name}</p>
                </div>
                <div className="w-11 h-11 flex-shrink-0 relative">
                  <Image
                    src={away.badgeUrl ?? "/badges/t1.png"}
                    alt={away.shortName}
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
