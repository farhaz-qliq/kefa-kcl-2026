"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { ChevronLeft, TrendingUp, TrendingDown, Calendar, Target, Shuffle, Trophy, BarChart2, type LucideIcon } from "lucide-react";
import { MOCK_TEAMS } from "@/mocks";
import { cn } from "@/lib/utils";
import type { Player, Team } from "@/types";

// ── Deterministic mock stats ───────────────────────────────────────────────────
function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function deriveStats(player: Player) {
  const h = hash(player.id);
  const matches   = 8 + (h % 5);
  const points    = player.goals * 6 + player.assists * 3 + matches * 2;
  const avgPoints = Math.round((points / matches) * 10) / 10;
  const price     = Math.round((4.5 + player.goals * 0.28 + player.assists * 0.18) * 10) / 10;
  const priceDelta = (((h % 9) - 3) * 0.1);
  const selectedBy = 4 + (h % 37);
  const age        = 20 + (h % 13);
  const height     = 169 + (h % 27);
  const weight     = 65 + (h % 25);
  const foot       = h % 5 === 0 ? "Left" : "Right";
  const form       = Array.from({ length: 5 }, (_, i) => 1 + ((h * (i * 4 + 7)) % 11));
  const shotsPerMatch = Math.round((1.2 + (h % 25) / 10) * 10) / 10;
  const shotAcc    = 42 + (h % 38);
  const bigChances = 2 + (h % 10);
  return { matches, points, avgPoints, price, priceDelta, selectedBy, age, height, weight, foot, form, shotsPerMatch, shotAcc, bigChances };
}

function genRecentMatches(player: Player) {
  const h = hash(player.id);
  const opponents = MOCK_TEAMS.filter((t) => t.id !== player.teamId);
  return Array.from({ length: 5 }, (_, i) => {
    const opp      = opponents[(h + i * 13) % opponents.length];
    const hGoals   = (h + i * 7) % 4;
    const aGoals   = (h + i * 11) % 3;
    const isHome   = (h + i) % 2 === 0;
    const myGoals  = isHome ? hGoals : aGoals;
    const oppGoals = isHome ? aGoals : hGoals;
    const result: "W" | "D" | "L" =
      myGoals > oppGoals ? "W" : myGoals === oppGoals ? "D" : "L";
    const goals   = result !== "L" ? (h + i * 5) % 2 : 0;
    const assists = goals === 0 && result === "W" ? (h + i * 3) % 2 : 0;
    const pts =
      result === "W" ? goals * 4 + assists * 3 + 3 :
      result === "D" ? goals * 4 + assists * 3 + 1 :
      Math.max(0, goals * 4 + assists * 3 - 1);
    return { gw: 6 - i, opponent: opp, score: `${hGoals} - ${aGoals}`, result, goals, assists, pts };
  });
}

const RESULT_BG: Record<"W" | "D" | "L", string> = {
  W: "#22C55E", D: "#F59E0B", L: "#EF4444",
};

const POS_LABEL: Record<string, string> = {
  GK: "Goalkeeper", DEF: "Defender", MID: "Midfielder", FWD: "Forward",
};

// ── Form line chart ────────────────────────────────────────────────────────────
function FormChart({ data }: { data: number[] }) {
  const W = 150, H = 54;
  const min = Math.min(...data), max = Math.max(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => [
    (i / (data.length - 1)) * (W - 16) + 8,
    H - 8 - ((v - min) / range) * (H - 20),
  ] as [number, number]);
  const pointsStr = pts.map(([x, y]) => `${x},${y}`).join(" ");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 54 }}>
      <polyline
        fill="none"
        stroke="#00D9FF"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={pointsStr}
      />
      {pts.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={3.5} fill="white" stroke="#00D9FF" strokeWidth="2" />
      ))}
    </svg>
  );
}

// ── Heat blobs SVG ─────────────────────────────────────────────────────────────
// ── Main component ─────────────────────────────────────────────────────────────
export default function PlayerProfile({ player, team }: { player: Player; team: Team }) {
  const router = useRouter();
  const stats   = deriveStats(player);
  const matches = genRecentMatches(player);

  const nameParts = player.name.trim().split(" ");
  const firstName = nameParts[0];
  const restName  = nameParts.slice(1).join(" ");

  return (
    <div className="bg-[#f5f7fa] min-h-full pb-8">

      {/* ── Hero ── */}
      <div className="relative bg-[#080d18] overflow-hidden" style={{ minHeight: 240 }}>
        {/* coloured geometry left panel */}
        <div
          className="absolute left-0 top-0 bottom-0 w-[48%] overflow-hidden"
          style={{ background: `linear-gradient(150deg, ${team.primaryColor}55 0%, transparent 80%)` }}
        >
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 160 240" preserveAspectRatio="none" fill="none">
            <polygon points="0,0 130,0 70,240 0,240"  fill={team.primaryColor} opacity="0.12" />
            <polygon points="40,0 160,0 100,240 40,240" fill={team.primaryColor} opacity="0.06" />
            <line x1="0" y1="0" x2="160" y2="240" stroke={team.primaryColor} strokeWidth="0.8" opacity="0.2" />
            <line x1="40" y1="0" x2="160" y2="200" stroke={team.primaryColor} strokeWidth="0.5" opacity="0.15" />
          </svg>
          {/* large shirt number watermark */}
          <div className="absolute inset-0 flex items-center justify-center select-none pointer-events-none">
            <span
              className="font-heading leading-none"
              style={{ fontSize: 110, color: team.primaryColor, opacity: 0.18 }}
            >
              {player.number}
            </span>
          </div>
          {/* team badge */}
          {team.badgeUrl && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-16 h-16 opacity-20">
              <Image src={team.badgeUrl} alt="" fill className="object-contain" />
            </div>
          )}
        </div>

        {/* back button */}
        <button
          onClick={() => router.back()}
          className="absolute top-5 left-4 w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center z-10"
        >
          <ChevronLeft size={18} className="text-white" />
        </button>

        {/* Right: player info */}
        <div className="relative z-10 ml-[46%] pr-4 pt-6 pb-5">
          <p className="text-[#00D9FF] font-bold text-[14px] leading-none mb-1.5">
            #{player.number}
          </p>
          <div className="leading-none mb-3">
            <p className="font-heading text-[24px] text-white uppercase leading-tight">{firstName}</p>
            {restName && (
              <p className="font-heading text-[24px] uppercase leading-tight" style={{ color: "#C7FF00" }}>
                {restName}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2 mb-3">
            {team.badgeUrl && (
              <div className="w-7 h-7 relative shrink-0">
                <Image src={team.badgeUrl} alt="" fill className="object-contain" />
              </div>
            )}
            <div>
              <p className="text-white text-[11px] font-bold leading-none">{team.shortName}</p>
              <p className="text-gray-500 text-[9px] mt-0.5">{POS_LABEL[player.position] ?? player.position}</p>
            </div>
          </div>

        </div>
      </div>

      {/* ── Content ── */}
      <div className="px-4 pt-4 flex flex-col gap-3">

          {/* Stats strip */}
          <div className="bg-white rounded-2xl border border-gray-100 px-2 py-3">
            <div className="flex">
              {(
                [
                  { Icon: Calendar,  label: "Matches", value: stats.matches },
                  { Icon: Target,    label: "Goals",   value: player.goals },
                  { Icon: Shuffle,   label: "Assists", value: player.assists },
                  { Icon: Trophy,    label: "Points",  value: stats.points,    color: "#C7FF00" },
                  { Icon: BarChart2, label: "Avg Pts", value: stats.avgPoints, color: "#00D9FF" },
                ] as { Icon: LucideIcon; label: string; value: number; color?: string }[]
              ).map(({ Icon, label, value, color }, i, arr) => (
                <div
                  key={label}
                  className={cn(
                    "flex-1 flex flex-col items-center gap-1 py-1",
                    i < arr.length - 1 && "border-r border-gray-100"
                  )}
                >
                  <Icon size={16} className="text-gray-400" />
                  <p
                    className="font-heading text-[20px] leading-none"
                    style={{ color: color ?? "#080d18" }}
                  >
                    {value}
                  </p>
                  <p className="text-gray-400 text-[7.5px] uppercase tracking-wide text-center leading-none">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Current Form + Player Price */}
          <div className="flex gap-3">
            <div className="flex-1 bg-white rounded-2xl border border-gray-100 px-3 py-3">
              <div className="flex items-center justify-between mb-1.5">
                <p className="font-semibold text-navy text-[12px]">Current Form</p>
                <p className="text-gray-400 text-[9px]">Last 5 Matches</p>
              </div>
              <FormChart data={stats.form} />
              <div className="flex gap-1 mt-1.5">
                {stats.form.map((v, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded py-1 font-heading text-[10px] leading-none text-center"
                    style={{
                      backgroundColor: v >= 8 ? "#C7FF00" : v >= 5 ? "#00D9FF20" : "#f3f4f6",
                      color: v >= 8 ? "#080d18" : v >= 5 ? "#00D9FF" : "#9ca3af",
                    }}
                  >
                    {v}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex-1 bg-white rounded-2xl border border-gray-100 px-3 py-3">
              <p className="font-semibold text-navy text-[12px] mb-2">Player Price</p>
              <p className="font-heading text-[26px] text-navy leading-none">
                £{stats.price.toFixed(1)}m
              </p>
              <div
                className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 mt-1.5"
                style={{
                  backgroundColor: stats.priceDelta >= 0 ? "#22C55E20" : "#EF444420",
                  color: stats.priceDelta >= 0 ? "#22C55E" : "#EF4444",
                }}
              >
                {stats.priceDelta >= 0
                  ? <TrendingUp size={9} />
                  : <TrendingDown size={9} />
                }
                <span className="text-[9px] font-bold">
                  {stats.priceDelta >= 0 ? "+" : ""}{stats.priceDelta.toFixed(1)}m
                </span>
              </div>
              <div className="mt-3 flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-[10px]">Selected By</span>
                  <span className="text-navy font-bold text-[11px]">{stats.selectedBy}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-[10px]">Total Points</span>
                  <span className="text-navy font-bold text-[11px]">{stats.points}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Matches */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <p className="font-semibold text-navy text-[13px]">Recent Matches</p>
              <span className="text-[#00D9FF] text-[10px] font-bold">View All →</span>
            </div>
            <div className="flex items-center px-4 py-1.5 bg-gray-50 border-b border-gray-100">
              <span className="w-7 text-[8px] font-bold text-gray-400 uppercase">GW</span>
              <span className="flex-1 text-[8px] font-bold text-gray-400 uppercase ml-1">Opponent</span>
              <span className="w-14 text-center text-[8px] font-bold text-gray-400 uppercase">Result</span>
              <span className="w-6 text-center text-[8px] font-bold text-gray-400 uppercase">G</span>
              <span className="w-6 text-center text-[8px] font-bold text-gray-400 uppercase">A</span>
              <span className="w-8 text-right text-[8px] font-bold text-gray-400 uppercase">Pts</span>
            </div>
            {matches.map((m, i) => (
              <div key={i} className="flex items-center px-4 py-2.5 border-b border-gray-50 last:border-0">
                <span className="w-7 text-[11px] font-bold text-gray-400">{m.gw}</span>
                <div className="flex items-center gap-2 flex-1 min-w-0 ml-1">
                  {m.opponent.badgeUrl && (
                    <div className="w-5 h-5 relative shrink-0">
                      <Image src={m.opponent.badgeUrl} alt="" fill className="object-contain" />
                    </div>
                  )}
                  <span className="text-navy text-[11px] font-semibold truncate">{m.opponent.shortName}</span>
                </div>
                <div className="w-14 flex items-center justify-center gap-1.5">
                  <span className="text-gray-400 text-[9px]">{m.score}</span>
                  <span
                    className="w-4 h-4 rounded flex items-center justify-center text-[7px] font-bold text-white shrink-0"
                    style={{ backgroundColor: RESULT_BG[m.result] }}
                  >
                    {m.result}
                  </span>
                </div>
                <span className="w-6 text-center font-heading text-navy text-[12px]">{m.goals}</span>
                <span className="w-6 text-center font-heading text-navy text-[12px]">{m.assists}</span>
                <span className="w-8 text-right font-heading text-[#00D9FF] text-[13px]">{m.pts}</span>
              </div>
            ))}
          </div>

        </div>
    </div>
  );
}
