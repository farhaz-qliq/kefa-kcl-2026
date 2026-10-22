import React from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Users, Shield, CircleDot, Settings, Hand, User, ChevronRight } from "lucide-react";
import { getTeamById, getPlayersByTeam, getFixturesByTeam, getTeams } from "@/lib/data";
import PageHeader from "@/components/PageHeader";
import FixtureCard from "@/components/FixtureCard";
import type { Position, Player, Team } from "@/types";

const POSITION_ORDER: Position[] = ["GK", "DEF", "MID", "FWD"];

const POSITION_META: Record<Position, { label: string; singular: string; LucideIcon: React.ElementType }> = {
  GK:  { label: "Goalkeepers", singular: "Goalkeeper", LucideIcon: Hand },
  DEF: { label: "Defenders",   singular: "Defender",   LucideIcon: Shield },
  MID: { label: "Midfielders", singular: "Midfielder",  LucideIcon: Settings },
  FWD: { label: "Forwards",    singular: "Forward",    LucideIcon: CircleDot },
};

// Per-position color tokens
const POS_COLOR: Record<Position, { accent: string; badgeBg: string; badgeText: string; count: string }> = {
  GK:  { accent: "#C7FF00", badgeBg: "#C7FF0030", badgeText: "#3d6600", count: "#5a8c00" },
  DEF: { accent: "#00D9FF", badgeBg: "#00D9FF22", badgeText: "#006b80", count: "#0095b3" },
  MID: { accent: "#F59E0B", badgeBg: "#F59E0B22", badgeText: "#7a4800", count: "#b86a00" },
  FWD: { accent: "#D4A017", badgeBg: "#D4A01722", badgeText: "#6b4e00", count: "#9b7000" },
};

interface Props {
  params: Promise<{ id: string }>;
}

// ── Squad player card ─────────────────────────────────────────────────────────
function PlayerCard({ player, squadNo, matchesPlayed }: {
  player: Player; team: Team; squadNo: number; matchesPlayed: number;
}) {
  const meta   = POSITION_META[player.position];
  const colors = POS_COLOR[player.position];

  return (
    <Link
      href={`/players/${player.id}`}
      className="flex items-center bg-white rounded-2xl overflow-hidden"
      style={{
        minHeight: 76,
        borderLeft: `4px solid ${colors.accent}`,
        boxShadow: "0 1px 4px rgba(0,0,0,0.06), 0 2px 10px rgba(0,0,0,0.04)",
      }}
    >
      {/* Avatar */}
      <div
        className="flex-shrink-0 mx-2 flex items-center justify-center rounded-xl"
        style={{ width: 40, height: 40, background: "#F0F2F5" }}
      >
        <User size={20} color="#9CA3AF" strokeWidth={1.5} />
      </div>

      {/* Squad number badge */}
      <div
        className="flex-shrink-0 flex items-center justify-center font-heading font-black mr-2"
        style={{
          width: 28, height: 28,
          background: colors.badgeBg,
          color: colors.badgeText,
          borderRadius: 7,
          fontSize: 13,
        }}
      >
        {player.number > 0 ? player.number : squadNo}
      </div>

      {/* Name + position — flex-1 takes the remaining space */}
      <div
        className="flex-1 min-w-0 py-3"
        style={{ borderRight: "1px solid #E5E7EB", overflow: "hidden" }}
      >
        <p
          className="font-heading font-black leading-tight"
          style={{ fontSize: 16, color: "#101828", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", paddingRight: 6 }}
        >
          {player.name}
        </p>
        <p style={{ fontSize: 11, color: "#98A2B3", marginTop: 1 }}>{meta.singular}</p>
      </div>

      {/* Stats: MP · G · A */}
      {([["MP", matchesPlayed], ["G", player.goals], ["A", player.assists]] as [string, number][]).map(([lbl, val]) => (
        <div
          key={lbl}
          className="flex-shrink-0 flex flex-col items-center justify-center py-3"
          style={{ width: 40, borderRight: "1px solid #E5E7EB" }}
        >
          <span style={{ fontSize: 8, color: "#98A2B3", fontWeight: 700, letterSpacing: "0.05em" }}>{lbl}</span>
          <span style={{ fontSize: 18, fontWeight: 900, color: "#101828", lineHeight: 1.2 }}>{val}</span>
        </div>
      ))}

      {/* Chevron */}
      <div className="flex-shrink-0 px-2">
        <ChevronRight size={14} color="#D1D5DB" />
      </div>
    </Link>
  );
}

export default async function TeamPage({ params }: Props) {
  const { id } = await params;
  const [team, players, fixtures, allTeams] = await Promise.all([
    getTeamById(id),
    getPlayersByTeam(id),
    getFixturesByTeam(id),
    getTeams(),
  ]);

  if (!team) notFound();

  const teamMap = Object.fromEntries(allTeams.map((t) => [t.id, t]));

  const playersByPos = POSITION_ORDER.reduce<Record<Position, typeof players>>(
    (acc, pos) => { acc[pos] = players.filter((p) => p.position === pos); return acc; },
    { GK: [], DEF: [], MID: [], FWD: [] }
  );

  const results  = fixtures.filter((f) => f.status !== "scheduled");
  const upcoming = fixtures.filter((f) => f.status === "scheduled");

  return (
    <div>
      <PageHeader title={team.name} subtitle={`Group ${team.groupId} · Arkey KCL 2026`} />

      {/* Team badge strip */}
      <div className="flex items-center gap-4 px-4 py-4 bg-[#080d18] border-b border-white/5">
        {team.badgeUrl ? (
          <div className="relative w-16 h-16 flex-shrink-0">
            <div className="absolute inset-0 rounded-full"
              style={{ boxShadow: "0 0 12px 3px #C7FF0044", border: "2px solid #C7FF0066", borderRadius: "50%" }} />
            <div className="absolute inset-1 rounded-full bg-white overflow-hidden">
              <Image src={team.badgeUrl} alt={team.shortName} fill className="object-contain p-1.5" />
            </div>
          </div>
        ) : (
          <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center text-3xl">{team.logo}</div>
        )}
        <div>
          <p className="font-heading text-white text-2xl uppercase leading-none">{team.shortName}</p>
          <p className="text-[#C7FF00] text-[10px] font-bold tracking-widest uppercase mt-1">Group {team.groupId}</p>
          <p className="text-gray-500 text-[10px] mt-0.5">{team.name}</p>
        </div>
      </div>

      {/* Squad */}
      {players.length > 0 && (
        <div className="px-4 py-5" style={{ background: "#F5F7FA" }}>
          {/* Squad header */}
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-heading text-xl uppercase tracking-wide flex items-center gap-2" style={{ color: "#101828" }}>
              <span className="w-[4px] h-6 rounded-sm" style={{ background: "#C7FF00" }} />
              Squad
            </h2>
            <div className="flex items-center gap-1.5 text-[11px]" style={{ color: "#98A2B3" }}>
              <Users size={12} />
              <span>{players.length} Players</span>
            </div>
          </div>

          {(() => {
            let squadCounter = 0;
            return (
              <div className="flex flex-col gap-6">
                {POSITION_ORDER.map((pos) => {
                  const group = playersByPos[pos];
                  if (group.length === 0) return null;
                  const meta   = POSITION_META[pos];
                  const colors = POS_COLOR[pos];
                  const Icon   = meta.LucideIcon;
                  return (
                    <div key={pos}>
                      {/* Position group header */}
                      <div className="flex items-center gap-3 mb-3">
                        <div
                          className="flex-shrink-0 flex items-center justify-center rounded-full"
                          style={{ width: 36, height: 36, background: colors.accent }}
                        >
                          <Icon size={18} color="white" strokeWidth={2} />
                        </div>
                        <p className="font-heading font-black uppercase tracking-wider" style={{ fontSize: 14, color: "#101828" }}>
                          {meta.label}{" "}
                          <span style={{ color: colors.count }}>({group.length})</span>
                        </p>
                      </div>

                      {/* Player cards */}
                      <div className="flex flex-col gap-2">
                        {group.map((player) => {
                          squadCounter += 1;
                          return (
                            <PlayerCard
                              key={player.id}
                              player={player}
                              team={team}
                              squadNo={squadCounter}
                              matchesPlayed={results.length}
                            />
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })()}
        </div>
      )}

      {/* Results */}
      {results.length > 0 && (
        <div className="px-4 pb-5">
          <h2 className="font-heading text-lg text-navy uppercase tracking-wide mb-4 flex items-center gap-2">
            <span className="w-1 h-5 rounded-full bg-[#00D9FF]" />
            Results
          </h2>
          <div className="flex flex-col gap-3">
            {results.map((f) => {
              const home = teamMap[f.homeTeamId];
              const away = teamMap[f.awayTeamId];
              if (!home || !away) return null;
              return <FixtureCard key={f.id} fixture={f} homeTeam={home} awayTeam={away} />;
            })}
          </div>
        </div>
      )}

      {/* Upcoming */}
      {upcoming.length > 0 && (
        <div className="px-4 pb-5">
          <h2 className="font-heading text-lg text-navy uppercase tracking-wide mb-4 flex items-center gap-2">
            <span className="w-1 h-5 rounded-full bg-gray-300" />
            Upcoming
          </h2>
          <div className="flex flex-col gap-3">
            {upcoming.map((f) => {
              const home = teamMap[f.homeTeamId];
              const away = teamMap[f.awayTeamId];
              if (!home || !away) return null;
              return <FixtureCard key={f.id} fixture={f} homeTeam={home} awayTeam={away} />;
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export async function generateStaticParams() {
  const teams = await getTeams();
  return teams.map((t) => ({ id: t.id }));
}
