"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { ChevronLeft, Calendar, Target, Shuffle, Trophy, BarChart2, MapPin, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Player, Team, Fixture } from "@/types";
import type { FantasyPlayer } from "@/types/fantasy";

// ── Helpers ───────────────────────────────────────────────────────────────────
function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function fmtShortDate(iso: string) {
  const [, m, d] = iso.split("-");
  const months = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
  return `${months[parseInt(m)-1]} ${parseInt(d)}`;
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
  const shotsPerMatch = Math.round((1.2 + (h % 25) / 10) * 10) / 10;
  const shotAcc    = 42 + (h % 38);
  const bigChances = 2 + (h % 10);
  return { matches, points, avgPoints, price, priceDelta, selectedBy, age, height, weight, foot, shotsPerMatch, shotAcc, bigChances };
}

// Compute per-match fantasy points from finished fixtures
function computeForm(player: Player, fixtures: Fixture[], teamId: string): number[] {
  const finished = fixtures
    .filter((f) => f.status === "finished")
    .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time));

  const last5 = finished.slice(-5);

  return last5.map((f) => {
    const isHome  = f.homeTeamId === teamId;
    const myGoals  = isHome ? (f.homeScore ?? 0) : (f.awayScore ?? 0);
    const oppGoals = isHome ? (f.awayScore ?? 0) : (f.homeScore ?? 0);

    let pts = 2; // appearance
    if (myGoals > oppGoals) pts += 4;        // win
    else if (myGoals === oppGoals) pts += 1; // draw

    // clean sheet bonus
    if (oppGoals === 0 && (player.position === "GK" || player.position === "DEF")) pts += 4;

    return pts;
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
export default function PlayerProfile({
  player, team, fixtures = [], allTeams = [], fantasyPlayer = null,
}: {
  player: Player; team: Team; fixtures?: Fixture[]; allTeams?: Team[]; fantasyPlayer?: FantasyPlayer | null;
}) {
  const router = useRouter();
  const derived   = deriveStats(player);
  const formData  = computeForm(player, fixtures, team.id);

  // Real stats — use live data where available, fall back to derived
  const matchesPlayed = fixtures.filter((f) => f.status === "finished").length;
  const totalPoints   = fantasyPlayer?.totalPoints ?? 0;
  const avgPoints     = matchesPlayed > 0 ? Math.round((totalPoints / matchesPlayed) * 10) / 10 : 0;
  const price         = fantasyPlayer?.price    ?? derived.price;
  const selectedBy    = fantasyPlayer?.selectedBy ?? derived.selectedBy;

  const teamMap = Object.fromEntries(allTeams.map((t) => [t.id, t]));

  const recentMatches = fixtures
    .filter((f) => f.status === "finished")
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 3);

  const upcomingMatches = fixtures
    .filter((f) => f.status === "scheduled")
    .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time))
    .slice(0, 3);

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

          <div className="flex items-center gap-2.5 mb-3">
            {team.badgeUrl && (
              <div className="relative flex-shrink-0" style={{ width: 44, height: 44 }}>
                <div className="absolute inset-0 rounded-full"
                  style={{ boxShadow: "0 0 12px 3px #00D9FF55", border: "2px solid #00D9FF88", borderRadius: "50%" }} />
                <div className="absolute inset-1 rounded-full bg-white overflow-hidden">
                  <Image src={team.badgeUrl} alt={team.shortName} fill className="object-contain p-1" />
                </div>
              </div>
            )}
            <div>
              <p className="text-white text-[13px] font-bold leading-none">{team.shortName}</p>
              <p className="text-gray-400 text-[10px] mt-0.5">{POS_LABEL[player.position] ?? player.position}</p>
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
                  { Icon: Calendar,  label: "Matches", value: matchesPlayed },
                  { Icon: Target,    label: "Goals",   value: player.goals },
                  { Icon: Shuffle,   label: "Assists", value: player.assists },
                  { Icon: Trophy,    label: "Points",  value: totalPoints,    color: "#C7FF00" },
                  { Icon: BarChart2, label: "Avg Pts", value: avgPoints, color: "#00D9FF" },
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
              <FormChart data={formData} />
              <div className="flex gap-1 mt-1.5">
                {formData.map((v, i) => (
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
                AED {price.toFixed(1)}m
              </p>
              <div className="mt-3 flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-[10px]">Selected By</span>
                  <span className="text-navy font-bold text-[11px]">{selectedBy}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-[10px]">Total Points</span>
                  <span className="text-navy font-bold text-[11px]">{totalPoints}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Matches */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <p className="font-semibold text-navy text-[13px]">Recent Matches</p>
            </div>
            {recentMatches.length === 0 ? (
              <p className="text-gray-400 text-xs text-center py-5">No matches played yet</p>
            ) : (
              <>
                <div className="flex items-center px-4 py-1.5 bg-gray-50 border-b border-gray-100">
                  <span className="w-16 text-[8px] font-bold text-gray-400 uppercase">Date</span>
                  <span className="flex-1 text-[8px] font-bold text-gray-400 uppercase ml-1">Opponent</span>
                  <span className="w-14 text-center text-[8px] font-bold text-gray-400 uppercase">Result</span>
                  <span className="w-6 text-center text-[8px] font-bold text-gray-400 uppercase">G</span>
                  <span className="w-6 text-center text-[8px] font-bold text-gray-400 uppercase">A</span>
                  <span className="w-8 text-right text-[8px] font-bold text-gray-400 uppercase">Pts</span>
                </div>
                {recentMatches.map((f) => {
                  const isHome   = f.homeTeamId === team.id;
                  const oppId    = isHome ? f.awayTeamId : f.homeTeamId;
                  const opp      = teamMap[oppId];
                  const myGoals  = isHome ? (f.homeScore ?? 0) : (f.awayScore ?? 0);
                  const oppGoals = isHome ? (f.awayScore ?? 0) : (f.homeScore ?? 0);
                  const result: "W"|"D"|"L" = myGoals > oppGoals ? "W" : myGoals === oppGoals ? "D" : "L";
                  return (
                    <div key={f.id} className="flex items-center px-4 py-2.5 border-b border-gray-50 last:border-0">
                      <span className="w-16 text-[10px] text-gray-400">{fmtShortDate(f.date)}</span>
                      <div className="flex items-center gap-2 flex-1 min-w-0 ml-1">
                        {opp?.badgeUrl && (
                          <div className="w-5 h-5 relative shrink-0 rounded-full bg-white overflow-hidden border border-gray-100">
                            <Image src={opp.badgeUrl} alt="" fill className="object-contain p-0.5" />
                          </div>
                        )}
                        <span className="text-navy text-[11px] font-semibold truncate">{opp?.shortName ?? oppId}</span>
                      </div>
                      <div className="w-14 flex items-center justify-center gap-1.5">
                        <span className="text-gray-400 text-[9px]">{myGoals} - {oppGoals}</span>
                        <span className="w-4 h-4 rounded flex items-center justify-center text-[7px] font-bold text-white shrink-0"
                          style={{ backgroundColor: RESULT_BG[result] }}>
                          {result}
                        </span>
                      </div>
                      <span className="w-6 text-center font-heading text-navy text-[12px]">0</span>
                      <span className="w-6 text-center font-heading text-navy text-[12px]">0</span>
                      <span className="w-8 text-right font-heading text-[#00D9FF] text-[13px]">0</span>
                    </div>
                  );
                })}
              </>
            )}
          </div>

          {/* Upcoming Matches */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <p className="font-semibold text-navy text-[13px]">Upcoming Fixtures</p>
            </div>
            {upcomingMatches.length === 0 ? (
              <p className="text-gray-400 text-xs text-center py-5">No upcoming fixtures</p>
            ) : (
              upcomingMatches.map((f) => {
                const isHome = f.homeTeamId === team.id;
                const oppId  = isHome ? f.awayTeamId : f.homeTeamId;
                const opp    = teamMap[oppId];
                return (
                  <div key={f.id} className="flex items-center px-4 py-3 border-b border-gray-50 last:border-0 gap-3">
                    <div className="w-5 h-5 relative shrink-0 rounded-full bg-white overflow-hidden border border-gray-100">
                      {opp?.badgeUrl && <Image src={opp.badgeUrl} alt="" fill className="object-contain p-0.5" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-navy text-[12px] font-semibold truncate">
                        {isHome ? "vs" : "@"} {opp?.shortName ?? oppId}
                      </p>
                      <div className="flex items-center gap-1 text-gray-400 text-[9px] mt-0.5">
                        <MapPin size={8} />
                        <span className="truncate">{f.venue}</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-navy font-heading text-[13px]">{f.time}</p>
                      <p className="text-gray-400 text-[9px]">{fmtShortDate(f.date)}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>

        </div>
    </div>
  );
}
