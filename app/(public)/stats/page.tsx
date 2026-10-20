import PageHeader from "@/components/PageHeader";
import { getTopScorers, getTeams } from "@/lib/data";
import { Trophy } from "lucide-react";

export default async function StatsPage() {
  const [topScorers, teams] = await Promise.all([getTopScorers(16), getTeams()]);
  const teamMap = Object.fromEntries(teams.map((t) => [t.id, t]));

  return (
    <div>
      <PageHeader title="Stats" subtitle="Top scorers & statistics" />

      <div className="px-4 py-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="w-1 h-5 rounded-full bg-neon-lime" />
          <h2 className="font-heading text-xl text-navy uppercase tracking-wide">Top Scorers</h2>
        </div>

        <div className="rounded-xl overflow-hidden border border-navy-700/30">
          <div className="bg-navy-800 px-4 py-2 flex items-center gap-2">
            <Trophy size={14} className="text-neon-lime" />
            <span className="text-white font-semibold text-sm">Golden Boot Race</span>
          </div>
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-navy-700">
                <th className="text-left pl-4 py-2 text-gray-400 font-medium w-8">#</th>
                <th className="text-left pl-2 py-2 text-gray-400 font-medium">Player</th>
                <th className="text-center px-2 py-2 text-gray-400 font-medium">Club</th>
                <th className="text-center px-2 py-2 text-gray-400 font-medium">Goals</th>
                <th className="text-center px-2 py-2 text-gray-400 font-medium">Ast</th>
              </tr>
            </thead>
            <tbody>
              {topScorers.map((player, i) => {
                const team = teamMap[player.teamId];
                return (
                  <tr
                    key={player.id}
                    className="border-t border-navy-700/30 bg-navy/80 hover:bg-navy-700/50 transition-colors"
                  >
                    <td className="pl-4 py-3 text-center">
                      <span className={i < 3 ? "text-neon-lime font-bold" : "text-gray-400"}>
                        {i + 1}
                      </span>
                    </td>
                    <td className="pl-2 py-3">
                      <p className="text-white font-medium">{player.name}</p>
                      <p className="text-gray-400 text-[10px]">{team?.name}</p>
                    </td>
                    <td className="text-center px-2 py-3 text-xl">{team?.logo}</td>
                    <td className="text-center px-2 py-3 font-bold text-neon-lime">
                      {player.goals}
                    </td>
                    <td className="text-center px-2 py-3 text-gray-300">{player.assists}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
