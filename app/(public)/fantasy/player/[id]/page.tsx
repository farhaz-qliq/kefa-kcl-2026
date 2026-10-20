import { notFound } from "next/navigation";
import Image from "next/image";
import { MOCK_FANTASY_PLAYERS } from "@/mocks";
import { MOCK_TEAMS } from "@/mocks";
import FantasyPlayerBack from "./FantasyPlayerBack";
import { Trophy, Target, Shuffle, ShieldCheck, TrendingUp, Users } from "lucide-react";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function FantasyPlayerPage({ params }: Props) {
  const { id } = await params;
  const player  = MOCK_FANTASY_PLAYERS.find((p) => p.id === id);
  const team    = player ? MOCK_TEAMS.find((t) => t.id === player.teamId) : undefined;
  if (!player || !team) notFound();

  const nameParts = player.name.trim().split(" ");
  const firstName = nameParts[0];
  const restName  = nameParts.slice(1).join(" ");

  const POS_LABEL: Record<string, string> = {
    GK: "Goalkeeper", DEF: "Defender", MID: "Midfielder", FWD: "Forward",
  };

  const stats = [
    { Icon: Trophy,     label: "Total Pts",   value: player.totalPoints, color: "#C7FF00" },
    { Icon: TrendingUp, label: "Form",         value: player.form.toFixed(1), color: "#00D9FF" },
    { Icon: Target,     label: "Goals",        value: player.goals },
    { Icon: Shuffle,    label: "Assists",      value: player.assists },
    { Icon: ShieldCheck,label: "Clean Sheets", value: player.cleanSheets },
    { Icon: Users,      label: "Selected By",  value: `${player.selectedBy}%` },
  ];

  return (
    <div className="bg-[#f5f7fa] min-h-full pb-8">

      {/* Hero */}
      <div className="relative bg-[#080d18] overflow-hidden pb-6">
        {/* Geometric backdrop */}
        <div
          className="absolute left-0 top-0 bottom-0 w-[45%] overflow-hidden"
          style={{ background: `linear-gradient(150deg, ${team.primaryColor}50 0%, transparent 80%)` }}
        >
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 160 220" preserveAspectRatio="none" fill="none">
            <polygon points="0,0 130,0 70,220 0,220" fill={team.primaryColor} opacity="0.12" />
            <polygon points="40,0 160,0 100,220 40,220" fill={team.primaryColor} opacity="0.06" />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center select-none pointer-events-none">
            <span className="font-heading leading-none" style={{ fontSize: 90, color: team.primaryColor, opacity: 0.2 }}>
              FP
            </span>
          </div>
        </div>

        <FantasyPlayerBack />

        {/* Player info */}
        <div className="relative z-10 ml-[44%] pr-5 pt-6 pb-2">
          <div className="leading-none mb-3">
            <p className="font-heading text-[22px] text-white uppercase leading-tight">{firstName}</p>
            {restName && (
              <p className="font-heading text-[22px] uppercase leading-tight" style={{ color: "#C7FF00" }}>
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

          {/* Price badge */}
          <div className="inline-flex items-center gap-1.5 bg-white/10 border border-white/15 rounded-xl px-3 py-1.5">
            <p className="text-gray-400 text-[9px] uppercase tracking-wide">Price</p>
            <p className="font-heading text-[#C7FF00] text-[15px] leading-none">
              AED {player.price.toFixed(1)}M
            </p>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="px-4 mt-4 grid grid-cols-3 gap-2">
        {stats.map(({ Icon, label, value, color }) => (
          <div key={label} className="bg-white rounded-2xl border border-gray-100 px-3 py-3.5 flex flex-col items-center gap-1.5">
            <Icon size={15} className="text-gray-400" />
            <p className="font-heading text-[22px] leading-none" style={{ color: color ?? "#080d18" }}>
              {value}
            </p>
            <p className="text-gray-400 text-[8px] uppercase tracking-wide text-center leading-none">
              {label}
            </p>
          </div>
        ))}
      </div>

      {/* Position info card */}
      <div className="mx-4 mt-3 bg-white rounded-2xl border border-gray-100 px-4 py-3.5 flex items-center gap-3">
        <div className="w-10 h-10 relative shrink-0">
          {team.badgeUrl && <Image src={team.badgeUrl} alt="" fill className="object-contain" />}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-navy font-semibold text-[13px] leading-none">{player.name}</p>
          <p className="text-gray-400 text-[10px] mt-0.5">{team.name} · {POS_LABEL[player.position]}</p>
        </div>
        <div
          className="text-[9px] font-bold px-2.5 py-1 rounded-full shrink-0"
          style={{ backgroundColor: team.primaryColor + "20", color: team.primaryColor }}
        >
          {player.position}
        </div>
      </div>
    </div>
  );
}

export function generateStaticParams() {
  return MOCK_FANTASY_PLAYERS.map((p) => ({ id: p.id }));
}
