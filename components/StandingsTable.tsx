import type { StandingRow } from "@/types";
import { cn } from "@/lib/utils";

interface StandingsTableProps {
  groupName: string;
  rows: StandingRow[];
}

const COL_HEADERS = ["#", "Team", "P", "W", "D", "L", "GF", "GA", "GD", "Pts"];

export default function StandingsTable({ groupName, rows }: StandingsTableProps) {
  return (
    <div className="rounded-xl overflow-hidden border border-navy-700/30">
      {/* Group header */}
      <div className="bg-navy-800 px-4 py-2 flex items-center gap-2">
        <span className="w-5 h-5 rounded bg-neon-lime flex items-center justify-center text-navy font-heading text-xs">
          {groupName.replace("Group ", "")}
        </span>
        <span className="text-white font-semibold text-sm">{groupName}</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-navy-700">
              {COL_HEADERS.map((h) => (
                <th
                  key={h}
                  className={cn(
                    "py-2 text-gray-400 font-medium",
                    h === "Team" ? "text-left pl-3 pr-2 w-full" : "text-center px-1 min-w-[28px]"
                  )}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr
                key={row.teamId}
                className={cn(
                  "border-t border-navy-700/30",
                  i === 0 ? "bg-navy-800/60" : "bg-navy/80",
                  "hover:bg-navy-700/50 transition-colors"
                )}
              >
                <td className="py-2.5 text-center px-1">
                  <span
                    className={cn(
                      "font-bold",
                      i === 0
                        ? "text-neon-lime"
                        : i === 1
                          ? "text-electric-cyan"
                          : "text-gray-400"
                    )}
                  >
                    {i + 1}
                  </span>
                </td>
                <td className="py-2.5 pl-3 pr-2">
                  <span className="text-white font-medium">{row.shortName}</span>
                </td>
                <td className="text-center px-1 text-gray-300">{row.played}</td>
                <td className="text-center px-1 text-gray-300">{row.won}</td>
                <td className="text-center px-1 text-gray-300">{row.drawn}</td>
                <td className="text-center px-1 text-gray-300">{row.lost}</td>
                <td className="text-center px-1 text-gray-300">{row.goalsFor}</td>
                <td className="text-center px-1 text-gray-300">{row.goalsAgainst}</td>
                <td
                  className={cn(
                    "text-center px-1 font-medium",
                    row.goalDifference > 0
                      ? "text-neon-lime"
                      : row.goalDifference < 0
                        ? "text-red-400"
                        : "text-gray-300"
                  )}
                >
                  {row.goalDifference > 0 ? "+" : ""}
                  {row.goalDifference}
                </td>
                <td className="text-center px-1 font-bold text-neon-lime">{row.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="bg-navy-800 px-4 py-2 flex gap-4">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-neon-lime" />
          <span className="text-[10px] text-gray-400">Qualification</span>
        </div>
      </div>
    </div>
  );
}
