import Link from "next/link";
import Image from "next/image";
import { Calendar } from "lucide-react";
import type { Fixture, Team } from "@/types";

interface MatchHighlightProps {
  fixtures: Fixture[];
  teams: Team[];
}

function getTeam(teams: Team[], id: string): Team {
  return teams.find((t) => t.id === id)!;
}

function fmtDate(iso: string) {
  const [, m, d] = iso.split("-");
  const months = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
  return `${months[parseInt(m) - 1]} ${parseInt(d)}`;
}

export default function MatchHighlight({ fixtures, teams }: MatchHighlightProps) {
  const upcoming = fixtures.filter((f) => f.status === "scheduled").slice(0, 3);
  if (upcoming.length === 0) return null;

  return (
    <div className="px-4 pt-5">
      {/* Section header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="w-1 h-5 rounded-full bg-[#C7FF00]" />
          <h2 className="font-heading text-xl uppercase tracking-wide">
            <span className="text-navy">UPCOMING </span>
            <span style={{ color: "#00D9FF" }}>MATCHES</span>
          </h2>
        </div>
        <Link
          href="/fixtures"
          className="text-[10px] font-bold uppercase tracking-wider hover:underline"
          style={{ color: "#00D9FF" }}
        >
          All Fixtures →
        </Link>
      </div>

      <div className="flex flex-col gap-3">
        {upcoming.map((fix) => {
          const home = getTeam(teams, fix.homeTeamId);
          const away = getTeam(teams, fix.awayTeamId);
          return (
            <div
              key={fix.id}
              className="relative rounded-2xl overflow-hidden"
              style={{ height: "96px", background: "#080d18" }}
            >
              {/* Stadium grass gradient at bottom */}
              <div className="absolute inset-0"
                style={{
                  background: "radial-gradient(ellipse at 50% 140%, #0a3a1a 0%, #080d18 60%)",
                }} />

              {/* Left lime accent stripe */}
              <div className="absolute left-0 top-0 bottom-0 w-10 overflow-hidden">
                <div className="absolute inset-0"
                  style={{
                    background: "linear-gradient(135deg, #C7FF00 0%, transparent 60%)",
                    clipPath: "polygon(0 0, 60% 0, 30% 100%, 0 100%)",
                    opacity: 0.85,
                  }} />
              </div>

              {/* Right cyan accent stripe */}
              <div className="absolute right-0 top-0 bottom-0 w-10 overflow-hidden">
                <div className="absolute inset-0"
                  style={{
                    background: "linear-gradient(225deg, #00D9FF 0%, transparent 60%)",
                    clipPath: "polygon(40% 0, 100% 0, 100% 100%, 70% 100%)",
                    opacity: 0.85,
                  }} />
              </div>

              {/* Content */}
              <div className="relative z-10 flex items-center h-full px-3 gap-2">

                {/* Home team */}
                <div className="flex items-center gap-2.5 flex-1 min-w-0">
                  {/* Badge with glow ring */}
                  <div className="flex-shrink-0 relative" style={{ width: 56, height: 56 }}>
                    <div className="absolute inset-0 rounded-full"
                      style={{
                        boxShadow: "0 0 12px 3px #C7FF0066",
                        border: "2px solid #C7FF0088",
                        borderRadius: "50%",
                      }} />
                    <div className="absolute inset-1 rounded-full bg-white overflow-hidden">
                      <Image
                        src={home.badgeUrl ?? "/badges/t1.png"}
                        alt={home.shortName}
                        fill
                        className="object-contain p-1.5"
                      />
                    </div>
                  </div>
                  {/* Names */}
                  <div className="min-w-0">
                    <p className="font-heading text-white text-xl leading-none uppercase">{home.shortName}</p>
                    <p className="text-gray-400 text-[10px] mt-0.5 leading-tight line-clamp-2">{home.name}</p>
                  </div>
                </div>

                {/* Center: date / time / VS */}
                <div className="flex flex-col items-center flex-shrink-0 px-1 gap-0.5">
                  <div className="flex items-center gap-1 text-gray-400">
                    <Calendar size={9} />
                    <span className="text-[9px] font-semibold tracking-wider">{fmtDate(fix.date)}</span>
                  </div>
                  <p className="font-heading text-white text-2xl leading-none">{fix.time}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    {/* Wing left */}
                    <svg width="18" height="8" viewBox="0 0 18 8" fill="none">
                      <path d="M18 4 Q12 0 0 4" stroke="#00D9FF" strokeWidth="1.5" fill="none"/>
                      <path d="M18 4 Q12 8 0 4" stroke="#00D9FF" strokeWidth="1.5" fill="none"/>
                    </svg>
                    <span className="font-heading text-sm tracking-widest" style={{ color: "#00D9FF" }}>VS</span>
                    {/* Wing right */}
                    <svg width="18" height="8" viewBox="0 0 18 8" fill="none">
                      <path d="M0 4 Q6 0 18 4" stroke="#00D9FF" strokeWidth="1.5" fill="none"/>
                      <path d="M0 4 Q6 8 18 4" stroke="#00D9FF" strokeWidth="1.5" fill="none"/>
                    </svg>
                  </div>
                </div>

                {/* Away team */}
                <div className="flex items-center gap-2.5 flex-1 min-w-0 justify-end">
                  {/* Names */}
                  <div className="min-w-0 text-right">
                    <p className="font-heading text-white text-xl leading-none uppercase">{away.shortName}</p>
                    <p className="text-gray-400 text-[10px] mt-0.5 leading-tight line-clamp-2">{away.name}</p>
                  </div>
                  {/* Badge with glow ring */}
                  <div className="flex-shrink-0 relative" style={{ width: 56, height: 56 }}>
                    <div className="absolute inset-0 rounded-full"
                      style={{
                        boxShadow: "0 0 12px 3px #00D9FF66",
                        border: "2px solid #00D9FF88",
                        borderRadius: "50%",
                      }} />
                    <div className="absolute inset-1 rounded-full bg-white overflow-hidden">
                      <Image
                        src={away.badgeUrl ?? "/badges/t1.png"}
                        alt={away.shortName}
                        fill
                        className="object-contain p-1.5"
                      />
                    </div>
                  </div>
                </div>

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
