import { Clock, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Fixture, Team } from "@/types";
import { cn } from "@/lib/utils";

interface FixtureCardProps {
  fixture: Fixture;
  homeTeam: Team;
  awayTeam: Team;
}

const STATUS_STYLES = {
  live: "bg-red-500 text-white animate-pulse",
  finished: "bg-navy-700 text-gray-300",
  scheduled: "bg-navy-700 text-electric-cyan",
};

const STATUS_LABELS = {
  live: "LIVE",
  finished: "FT",
  scheduled: "Upcoming",
};

export default function FixtureCard({ fixture, homeTeam, awayTeam }: FixtureCardProps) {
  const isFinishedOrLive = fixture.status !== "scheduled";

  return (
    <div className="bg-navy rounded-xl overflow-hidden">
      {/* Group / Status header */}
      <div className="flex items-center justify-between px-4 py-2 bg-navy-700">
        <span className="text-gray-400 text-xs font-medium uppercase tracking-wider">
          Group {fixture.groupId}
        </span>
        <Badge
          className={cn(
            "text-[10px] font-semibold px-2 py-0.5 rounded-full border-0",
            STATUS_STYLES[fixture.status]
          )}
        >
          {STATUS_LABELS[fixture.status]}
        </Badge>
      </div>

      {/* Score row */}
      <div className="flex items-center justify-between px-4 py-4 gap-2">
        {/* Home team */}
        <div className="flex-1 flex flex-col items-center gap-1">
          <span className="text-2xl">{homeTeam.logo}</span>
          <span className="text-white text-xs font-semibold text-center leading-tight">
            {homeTeam.shortName}
          </span>
        </div>

        {/* Score / Time */}
        <div className="flex flex-col items-center min-w-[80px]">
          {isFinishedOrLive ? (
            <span
              className={cn(
                "font-heading text-3xl tracking-widest",
                fixture.status === "live" ? "text-neon-lime neon-glow" : "text-white"
              )}
            >
              {fixture.homeScore ?? 0} — {fixture.awayScore ?? 0}
            </span>
          ) : (
            <div className="text-center">
              <p className="text-neon-lime font-heading text-2xl">{fixture.time}</p>
              <p className="text-gray-400 text-xs mt-0.5">{formatDate(fixture.date)}</p>
            </div>
          )}
        </div>

        {/* Away team */}
        <div className="flex-1 flex flex-col items-center gap-1">
          <span className="text-2xl">{awayTeam.logo}</span>
          <span className="text-white text-xs font-semibold text-center leading-tight">
            {awayTeam.shortName}
          </span>
        </div>
      </div>

      {/* Venue / time footer */}
      <div className="flex items-center justify-between px-4 pb-3 gap-2">
        <div className="flex items-center gap-1 text-gray-400 text-[10px]">
          <MapPin size={10} />
          <span>{fixture.venue}</span>
        </div>
        {fixture.status === "finished" && (
          <div className="flex items-center gap-1 text-gray-400 text-[10px]">
            <Clock size={10} />
            <span>{fixture.time}</span>
          </div>
        )}
      </div>
    </div>
  );
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
  });
}
