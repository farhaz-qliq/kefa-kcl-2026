import { getPlayers, getTeams } from "@/lib/data";
import PlayerList from "@/components/PlayerList";

export default async function PlayersPage() {
  const [players, teams] = await Promise.all([getPlayers(), getTeams()]);
  const teamMap = Object.fromEntries(teams.map((t) => [t.id, t]));

  return (
    <div>
      <div className="bg-[#080d18] px-4 pt-8 pb-6">
        <p className="text-[#C7FF00] text-[10px] font-bold tracking-[0.25em] uppercase mb-1">KEFA KCL 2026</p>
        <h1 className="font-heading text-3xl text-white uppercase leading-none">Players</h1>
        <p className="text-gray-500 text-[11px] mt-1">{players.length} players · Season 6</p>
      </div>
      <PlayerList players={players} teamMap={teamMap} />
    </div>
  );
}
