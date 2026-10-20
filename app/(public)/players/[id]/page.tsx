import { notFound } from "next/navigation";
import { MOCK_PLAYERS, MOCK_TEAMS } from "@/mocks";
import PlayerProfile from "@/components/PlayerProfile";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function PlayerProfilePage({ params }: Props) {
  const { id } = await params;
  const player = MOCK_PLAYERS.find((p) => p.id === id);
  const team = player ? MOCK_TEAMS.find((t) => t.id === player.teamId) : undefined;
  if (!player || !team) notFound();
  return <PlayerProfile player={player} team={team} />;
}

export function generateStaticParams() {
  return MOCK_PLAYERS.map((p) => ({ id: p.id }));
}
