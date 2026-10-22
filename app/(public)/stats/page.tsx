import Image from "next/image";
import { Suspense } from "react";
import PageHeader from "@/components/PageHeader";
import StatsTabDropdown from "@/components/StatsTabDropdown";
import { getTopScorers, getTopAssists, getTopCleanSheets, getTeams } from "@/lib/data";
import { Trophy, Footprints, ShieldCheck } from "lucide-react";
import { GoalIcon } from "@/components/StatIcons";

// Rank badge colours
const RANK_STYLE: Record<number, { bg: string; text: string }> = {
  1: { bg: "#C7FF00", text: "#2d4a00" },
  2: { bg: "#B3E5FC", text: "#01579B" },
  3: { bg: "#FFCCBC", text: "#BF360C" },
};
function rankStyle(i: number) {
  return RANK_STYLE[i + 1] ?? { bg: "#E5E7EB", text: "#6B7280" };
}

const TAB_META = {
  goals:       { label: "Golden Boot Race",   Icon: Trophy,      banner: "linear-gradient(135deg, #0d1f35 0%, #0f2d4a 60%, #0d3320 100%)" },
  assists:     { label: "Most Assists",        Icon: Footprints,  banner: "linear-gradient(135deg, #0d1f35 0%, #1a2d4a 60%, #12183a 100%)" },
  cleansheets: { label: "Most Clean Sheets",   Icon: ShieldCheck, banner: "linear-gradient(135deg, #0d1f35 0%, #0d2635 60%, #0a2218 100%)" },
} as const;

type Tab = keyof typeof TAB_META;

interface Props {
  searchParams: Promise<{ tab?: string }>;
}

export default async function StatsPage({ searchParams }: Props) {
  const { tab: rawTab } = await searchParams;
  const tab: Tab = (rawTab === "assists" || rawTab === "cleansheets") ? rawTab : "goals";
  const meta = TAB_META[tab];

  const teams = await getTeams();
  const teamMap = Object.fromEntries(teams.map((t) => [t.id, t]));

  // Fetch the right dataset
  const rows =
    tab === "assists"     ? await getTopAssists(16) :
    tab === "cleansheets" ? await getTopCleanSheets(16) :
                            await getTopScorers(16);

  const headingLabel =
    tab === "assists"     ? "Top Assists" :
    tab === "cleansheets" ? "Clean Sheet Kings" :
                            "Top Scorers";

  return (
    <div className="min-h-screen" style={{ background: "#F5F7FA" }}>
      <PageHeader title="Stats" subtitle="Top scorers & statistics" />

      <div className="px-4 py-5">

        {/* Section heading + dropdown */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading text-2xl uppercase tracking-wide flex items-center gap-2" style={{ color: "#101828" }}>
            <span className="w-[4px] h-7 rounded-sm" style={{ background: "#C7FF00" }} />
            {headingLabel}
          </h2>
          <Suspense>
            <StatsTabDropdown active={tab} />
          </Suspense>
        </div>

        {/* Card */}
        <div className="rounded-2xl overflow-hidden" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.10)" }}>

          {/* Banner */}
          <div
            className="relative flex items-center gap-3 px-5 py-4 overflow-hidden"
            style={{ background: meta.banner, minHeight: 72 }}
          >
            <div className="absolute right-0 top-0 bottom-0 w-48 pointer-events-none"
              style={{ background: "radial-gradient(ellipse at 80% 50%, #C7FF0022 0%, transparent 70%)" }} />
            <meta.Icon size={28} color="#C7FF00" strokeWidth={1.8} style={{ flexShrink: 0, position: "relative" }} />
            <span className="font-heading font-black text-white text-xl" style={{ position: "relative" }}>
              {meta.label}
            </span>
          </div>

          {/* Column headers */}
          <div
            className="flex items-center px-4 py-3 gap-2"
            style={{ background: "#1a2a3a", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
          >
            <span className="font-bold text-[11px] w-8 text-center" style={{ color: "#64748B" }}>#</span>
            <span className="flex-1 font-bold text-[11px]" style={{ color: "#64748B" }}>Player</span>
            <span className="font-bold text-[11px] w-14 text-center" style={{ color: "#64748B" }}>Club</span>

            {tab === "goals" && (
              <div className="flex flex-col items-center" style={{ width: 56 }}>
                <GoalIcon size={18} />
                <span className="text-[9px] font-semibold mt-0.5" style={{ color: "#64748B" }}>Goals</span>
              </div>
            )}
            {tab === "assists" && (
              <div className="flex flex-col items-center" style={{ width: 56 }}>
                <div className="relative" style={{ width: 20, height: 20 }}>
                  <Image src="/assist.png" alt="Assists" fill className="object-contain" />
                </div>
                <span className="text-[9px] font-semibold mt-0.5" style={{ color: "#64748B" }}>Assists</span>
              </div>
            )}
            {tab === "cleansheets" && (
              <div className="flex flex-col items-center" style={{ width: 56 }}>
                <ShieldCheck size={18} color="#00D9FF" strokeWidth={1.8} />
                <span className="text-[9px] font-semibold mt-0.5" style={{ color: "#64748B" }}>Clean Sheets</span>
              </div>
            )}
          </div>

          {/* Rows */}
          <div style={{ background: "#ffffff" }}>
            {rows.length === 0 && (
              <p className="text-center py-8 text-sm" style={{ color: "#98A2B3" }}>No data yet</p>
            )}
            {rows.map((player, i) => {
              const teamId = player.teamId;
              const team   = teamMap[teamId];
              const rs     = rankStyle(i);

              const statValue =
                tab === "assists"     ? (player as { assists: number }).assists :
                tab === "cleansheets" ? (player as { cleanSheets: number }).cleanSheets :
                                        (player as { goals: number }).goals;

              const statColor = statValue > 0 ? "#C7FF00" : "#101828";

              return (
                <div
                  key={player.id}
                  className="flex items-center px-4 py-3 gap-2"
                  style={{ borderBottom: "1px solid #F1F5F9" }}
                >
                  {/* Rank badge */}
                  <div
                    className="flex-shrink-0 flex items-center justify-center font-heading font-black rounded-xl"
                    style={{ width: 32, height: 32, background: rs.bg, color: rs.text, fontSize: 14 }}
                  >
                    {i + 1}
                  </div>

                  {/* Name + team */}
                  <div className="flex-1 min-w-0">
                    <p className="font-heading font-black leading-tight truncate" style={{ fontSize: 15, color: "#101828" }}>
                      {player.name}
                    </p>
                    <p className="truncate" style={{ fontSize: 10, color: "#98A2B3", marginTop: 1 }}>{team?.name}</p>
                  </div>

                  {/* Club badge */}
                  <div className="flex-shrink-0 w-14 flex justify-center">
                    <div
                      className="relative flex items-center justify-center rounded-full bg-white overflow-hidden"
                      style={{ width: 38, height: 38, border: "2px solid #C7FF0066", padding: 2 }}
                    >
                      {team?.badgeUrl ? (
                        <Image src={team.badgeUrl} alt={team.shortName ?? ""} fill className="object-contain p-1" />
                      ) : (
                        <span className="text-lg">{team?.logo}</span>
                      )}
                    </div>
                  </div>

                  {/* Stat value */}
                  <div className="flex-shrink-0 flex items-center justify-center gap-1.5" style={{ width: 56 }}>
                    {tab === "goals" && <GoalIcon size={16} />}
                    {tab === "assists" && (
                      <div className="relative flex-shrink-0" style={{ width: 18, height: 18 }}>
                        <Image src="/assist.png" alt="A" fill className="object-contain" />
                      </div>
                    )}
                    {tab === "cleansheets" && (
                      <ShieldCheck size={16} color="#00D9FF" strokeWidth={1.8} />
                    )}
                    <span className="font-heading font-black text-sm" style={{ color: statColor }}>
                      {statValue}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
