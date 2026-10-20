import Link from "next/link";
import Image from "next/image";
import { getTeams } from "@/lib/data";
import { ChevronRight } from "lucide-react";
import type { GroupName } from "@/types";

const GROUP_COLORS: Record<GroupName, string> = {
  A: "#C7FF00",
  B: "#00D9FF",
  C: "#F59E0B",
  D: "#A855F7",
};

export default async function TeamsPage() {
  const teams = await getTeams();
  const groups: GroupName[] = ["A", "B", "C", "D"];

  return (
    <div className="pb-8">
      {/* Header */}
      <div className="bg-[#080d18] px-4 pt-8 pb-6">
        <p className="text-[#C7FF00] text-[10px] font-bold tracking-[0.25em] uppercase mb-1">KEFA KCL 2026</p>
        <h1 className="font-heading text-3xl text-white uppercase leading-none">Teams</h1>
        <p className="text-gray-500 text-[11px] mt-1">16 clubs · 4 groups · Season 6</p>
      </div>

      <div className="px-4 pt-4 flex flex-col gap-6">
        {groups.map((g) => {
          const groupTeams = teams.filter((t) => t.groupId === g);
          const accent = GROUP_COLORS[g];
          return (
            <div key={g}>
              {/* Group header */}
              <div className="flex items-center gap-2 mb-2.5">
                <div
                  className="w-6 h-6 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: accent + "20" }}
                >
                  <span className="font-heading text-[11px] leading-none" style={{ color: accent }}>
                    {g}
                  </span>
                </div>
                <p className="font-heading text-[13px] text-navy uppercase tracking-wide">Group {g}</p>
              </div>

              <div className="flex flex-col gap-2">
                {groupTeams.map((team) => (
                  <Link
                    key={team.id}
                    href={`/teams/${team.id}`}
                    className="flex items-center gap-3 bg-white rounded-xl border border-gray-100 px-3 py-3 hover:border-gray-200 transition-colors"
                  >
                    <div className="w-12 h-12 relative shrink-0">
                      {team.badgeUrl ? (
                        <Image src={team.badgeUrl} alt={team.shortName} fill className="object-contain" />
                      ) : (
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                          style={{ backgroundColor: team.primaryColor + "20" }}
                        >
                          {team.logo}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-heading text-navy text-[14px] uppercase leading-none truncate">
                        {team.shortName}
                      </p>
                      <p className="text-gray-400 text-[10px] mt-0.5 truncate">{team.name}</p>
                    </div>
                    <div
                      className="text-[9px] font-bold px-2 py-0.5 rounded-full shrink-0"
                      style={{ backgroundColor: accent + "15", color: accent }}
                    >
                      GRP {g}
                    </div>
                    <ChevronRight size={15} className="text-gray-300 shrink-0" />
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
