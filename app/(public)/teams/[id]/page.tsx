import { notFound } from "next/navigation";
import { getTeamById, getPlayersByTeam, getFixturesByTeam, getTeams } from "@/lib/data";
import PageHeader from "@/components/PageHeader";
import FixtureCard from "@/components/FixtureCard";
import { Badge } from "@/components/ui/badge";
import type { Position } from "@/types";

const POSITION_ORDER: Position[] = ["GK", "DEF", "MID", "FWD"];
const POSITION_LABELS: Record<Position, string> = {
  GK: "Goalkeeper",
  DEF: "Defenders",
  MID: "Midfielders",
  FWD: "Forwards",
};

interface Props {
  params: Promise<{ id: string }>;
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

  const results = fixtures.filter((f) => f.status !== "scheduled");
  const upcoming = fixtures.filter((f) => f.status === "scheduled");

  return (
    <div>
      <PageHeader title={team.name} subtitle={`Group ${team.groupId} · KEFA KCL 2026`} />

      {/* Team badge strip */}
      <div className="flex items-center gap-4 px-4 py-4 bg-navy-800">
        <div className="w-16 h-16 rounded-2xl bg-navy-700 flex items-center justify-center text-4xl">
          {team.logo}
        </div>
        <div>
          <p className="text-white font-heading text-2xl uppercase">{team.shortName}</p>
          <Badge className="bg-neon-lime/20 text-neon-lime border-0 text-xs mt-1">
            Group {team.groupId}
          </Badge>
        </div>
      </div>

      {/* Squad */}
      <div className="px-4 py-5">
        <h2 className="font-heading text-lg text-navy uppercase tracking-wide mb-4 flex items-center gap-2">
          <span className="w-1 h-5 rounded-full bg-neon-lime" />
          Squad
        </h2>
        <div className="flex flex-col gap-5">
          {POSITION_ORDER.map((pos) => {
            const group = playersByPos[pos];
            if (group.length === 0) return null;
            return (
              <div key={pos}>
                <p className="text-xs font-semibold text-electric-cyan uppercase tracking-wider mb-2">
                  {POSITION_LABELS[pos]}
                </p>
                <div className="flex flex-col gap-1.5">
                  {group.map((player) => (
                    <div
                      key={player.id}
                      className="flex items-center gap-3 bg-navy rounded-xl px-3 py-2.5"
                    >
                      <span className="w-7 h-7 rounded-lg bg-navy-700 flex items-center justify-center text-neon-lime font-heading text-sm flex-shrink-0">
                        {player.number}
                      </span>
                      <span className="text-white text-sm font-medium flex-1 min-w-0 truncate">
                        {player.name}
                      </span>
                      <div className="flex gap-3 text-[10px] text-gray-400 flex-shrink-0">
                        {player.goals > 0 && (
                          <span>
                            ⚽ <span className="text-white">{player.goals}</span>
                          </span>
                        )}
                        {player.assists > 0 && (
                          <span>
                            🅰️ <span className="text-white">{player.assists}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Results */}
      {results.length > 0 && (
        <div className="px-4 pb-5">
          <h2 className="font-heading text-lg text-navy uppercase tracking-wide mb-4 flex items-center gap-2">
            <span className="w-1 h-5 rounded-full bg-electric-cyan" />
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
            <span className="w-1 h-5 rounded-full bg-gray-400" />
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
