import Link from "next/link";
import { Sparkles, Users, Star, ChevronRight, Trophy, Zap } from "lucide-react";

export default function FantasyTeaser() {
  return (
    <div className="px-4 pt-4">
      <div className="relative rounded-2xl overflow-hidden bg-[#080d18] px-5 py-3">
        {/* Pitch watermark */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 300 160" fill="none">
            <rect x="10" y="10" width="280" height="140" stroke="white" strokeWidth="2" />
            <line x1="150" y1="10" x2="150" y2="150" stroke="white" strokeWidth="2" />
            <circle cx="150" cy="80" r="28" stroke="white" strokeWidth="2" />
            <circle cx="150" cy="80" r="2" fill="white" />
            <rect x="10" y="45" width="40" height="70" stroke="white" strokeWidth="2" />
            <rect x="250" y="45" width="40" height="70" stroke="white" strokeWidth="2" />
          </svg>
        </div>
        {/* Right glow */}
        <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-[#C7FF00]/8 to-transparent pointer-events-none" />

        {/* Badges row */}
        <div className="relative z-10 flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1.5 bg-[#00D9FF]/15 border border-[#00D9FF]/25 rounded-full px-3 py-1">
            <Sparkles size={9} className="text-[#00D9FF]" />
            <span className="text-[#00D9FF] text-[10px] font-bold uppercase tracking-[0.15em]">Fantasy League</span>
          </div>
          <div className="flex items-center gap-1 bg-[#C7FF00]/15 border border-[#C7FF00]/40 rounded-full px-2.5 py-1">
            <Zap size={8} className="text-[#C7FF00]" fill="#C7FF00" />
            <span className="text-[#C7FF00] text-[9px] font-bold uppercase tracking-wider">Live Now</span>
          </div>
        </div>

        {/* Headline */}
        <div className="relative z-10 leading-none mb-2">
          <p className="font-heading text-[22px] text-white uppercase leading-none">BUILD YOUR</p>
          <p
            className="font-heading text-[22px] uppercase leading-none"
            style={{ color: "#C7FF00", textShadow: "0 0 20px #C7FF0055" }}
          >
            DREAM XI
          </p>
        </div>

        <p className="relative z-10 text-gray-400 text-[11px] mb-2 leading-relaxed">
          Pick from all 16 teams, assign your captain & win prizes.
        </p>

        {/* Feature chips */}
        <div className="relative z-10 flex gap-2.5 mb-3">
          {[
            { Icon: Users,   label: "16 Teams" },
            { Icon: Star,    label: "Captains" },
            { Icon: Trophy,  label: "Win Prizes" },
          ].map(({ Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5"
            >
              <Icon size={10} className="text-[#C7FF00]" />
              <span className="text-white/70 text-[9px] font-semibold uppercase tracking-wide">{label}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <Link
          href="/fantasy"
          className="relative z-10 inline-flex items-center gap-2 rounded-full font-heading text-[10px] uppercase tracking-wider px-4 py-2 transition-opacity hover:opacity-90 active:scale-95"
          style={{ backgroundColor: "#C7FF00", color: "#080d18" }}
        >
          <Sparkles size={10} />
          Build Your Team
          <ChevronRight size={10} />
        </Link>
      </div>
    </div>
  );
}
