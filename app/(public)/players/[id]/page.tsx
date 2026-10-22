import { notFound } from "next/navigation";
import { MOCK_PLAYERS, MOCK_TEAMS, MOCK_FANTASY_PLAYERS } from "@/mocks";
import { getFixturesByTeam, getTeams } from "@/lib/data";
import PlayerProfile from "@/components/PlayerProfile";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function PlayerProfilePage({ params }: Props) {
  const { id } = await params;
  const player = MOCK_PLAYERS.find((p) => p.id === id);
  const team = player ? MOCK_TEAMS.find((t) => t.id === player.teamId) : undefined;
  if (!player || !team) notFound();

  // Match fantasy player by name + teamId
  const fantasyPlayer = MOCK_FANTASY_PLAYERS.find(
    (fp) => fp.teamId === player.teamId && fp.name.toLowerCase() === player.name.toLowerCase()
  ) ?? null;

  const [fixtures, allTeams] = await Promise.all([
    getFixturesByTeam(team.id),
    getTeams(),
  ]);

  return <PlayerProfile player={player} team={team} fixtures={fixtures} allTeams={allTeams} fantasyPlayer={fantasyPlayer} />;
}

export function generateStaticParams() {
  return MOCK_PLAYERS.map((p) => ({ id: p.id }));
}
