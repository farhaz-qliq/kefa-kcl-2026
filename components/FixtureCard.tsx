import Image from "next/image";
import { MapPin, Calendar } from "lucide-react";
import type { Fixture, Team } from "@/types";

interface FixtureCardProps {
  fixture: Fixture;
  homeTeam: Team;
  awayTeam: Team;
}

function formatDate(dateStr: string) {
  const [, m, d] = dateStr.split("-");
  const months = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
  return `${months[parseInt(m) - 1]} ${parseInt(d)}`;
}

export default function FixtureCard({ fixture, homeTeam, awayTeam }: FixtureCardProps) {
  const isLive      = fixture.status === "live";
  const isFinished  = fixture.status === "finished";
  const isScheduled = fixture.status === "scheduled";

  const statusLabel = isLive ? "LIVE" : isFinished ? "FT" : "Upcoming";
  const statusColor = isLive ? "#ff3b3b" : isFinished ? "#888" : "#00D9FF";

  return (
    <div className="relative rounded-2xl overflow-hidden" style={{ background: "#080d18" }}>

      {/* Stadium grass gradient */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 160%, #0a3a1a 0%, #080d18 55%)" }} />

      {/* Left lime accent */}
      <div className="absolute left-0 top-0 bottom-0 w-8 overflow-hidden pointer-events-none">
        <div className="absolute inset-0"
          style={{
            background: "linear-gradient(135deg, #C7FF00 0%, transparent 65%)",
            clipPath: "polygon(0 0, 55% 0, 25% 100%, 0 100%)",
            opacity: 0.8,
          }} />
      </div>

      {/* Right cyan accent */}
      <div className="absolute right-0 top-0 bottom-0 w-8 overflow-hidden pointer-events-none">
        <div className="absolute inset-0"
          style={{
            background: "linear-gradient(225deg, #00D9FF 0%, transparent 65%)",
            clipPath: "polygon(45% 0, 100% 0, 100% 100%, 75% 100%)",
            opacity: 0.8,
          }} />
      </div>

      {/* Group + status bar */}
      <div className="relative z-10 flex items-center justify-between px-4 pt-2.5 pb-1">
        <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">
          Group {fixture.groupId}
        </span>
        <span
          className="text-[10px] font-bold uppercase tracking-wider"
          style={{ color: statusColor }}
        >
          {isLive && <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500 mr-1 animate-pulse align-middle" />}
          {statusLabel}
        </span>
      </div>

      {/* Main row */}
      <div className="relative z-10 flex items-center px-3 pb-2 gap-2">

        {/* Home team */}
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          <div className="flex-shrink-0 relative" style={{ width: 52, height: 52 }}>
            <div className="absolute inset-0 rounded-full"
              style={{ boxShadow: "0 0 10px 2px #C7FF0055", border: "2px solid #C7FF0077", borderRadius: "50%" }} />
            <div className="absolute inset-1 rounded-full bg-white overflow-hidden">
              <Image src={homeTeam.badgeUrl ?? "/badges/t1.png"} alt={homeTeam.shortName} fill className="object-contain p-1" />
            </div>
          </div>
          <div className="min-w-0">
            <p className="font-heading text-white text-lg leading-none uppercase">{homeTeam.shortName}</p>
            <p className="text-gray-400 text-[10px] mt-0.5 leading-tight line-clamp-2">{homeTeam.name}</p>
          </div>
        </div>

        {/* Center */}
        <div className="flex flex-col items-center flex-shrink-0 px-1">
          {isScheduled ? (
            <>
              <div className="flex items-center gap-1 text-gray-400 mb-0.5">
                <Calendar size={8} />
                <span className="text-[8px] font-semibold tracking-wider">{formatDate(fixture.date)}</span>
              </div>
              <p className="font-heading text-white text-2xl leading-none">{fixture.time}</p>
              <div className="flex items-center gap-1 mt-1">
                <svg width="16" height="7" viewBox="0 0 16 7" fill="none">
                  <path d="M16 3.5 Q10 0 0 3.5" stroke="#00D9FF" strokeWidth="1.2" fill="none"/>
                  <path d="M16 3.5 Q10 7 0 3.5" stroke="#00D9FF" strokeWidth="1.2" fill="none"/>
                </svg>
                <span className="font-heading text-xs tracking-widest" style={{ color: "#00D9FF" }}>VS</span>
                <svg width="16" height="7" viewBox="0 0 16 7" fill="none">
                  <path d="M0 3.5 Q6 0 16 3.5" stroke="#00D9FF" strokeWidth="1.2" fill="none"/>
                  <path d="M0 3.5 Q6 7 16 3.5" stroke="#00D9FF" strokeWidth="1.2" fill="none"/>
                </svg>
              </div>
            </>
          ) : (
            <span
              className="font-heading text-3xl tracking-widest"
              style={{ color: isLive ? "#C7FF00" : "#fff" }}
            >
              {fixture.homeScore ?? 0} — {fixture.awayScore ?? 0}
            </span>
          )}
        </div>

        {/* Away team */}
        <div className="flex items-center gap-2.5 flex-1 min-w-0 justify-end">
          <div className="min-w-0 text-right">
            <p className="font-heading text-white text-lg leading-none uppercase">{awayTeam.shortName}</p>
            <p className="text-gray-400 text-[10px] mt-0.5 leading-tight line-clamp-2">{awayTeam.name}</p>
          </div>
          <div className="flex-shrink-0 relative" style={{ width: 52, height: 52 }}>
            <div className="absolute inset-0 rounded-full"
              style={{ boxShadow: "0 0 10px 2px #00D9FF55", border: "2px solid #00D9FF77", borderRadius: "50%" }} />
            <div className="absolute inset-1 rounded-full bg-white overflow-hidden">
              <Image src={awayTeam.badgeUrl ?? "/badges/t1.png"} alt={awayTeam.shortName} fill className="object-contain p-1" />
            </div>
          </div>
        </div>

      </div>

      {/* Venue footer */}
      <div className="relative z-10 flex items-center gap-1 px-4 pb-2.5 text-gray-500 text-[9px]">
        <MapPin size={9} />
        <span>{fixture.venue}</span>
      </div>

    </div>
  );
}
