import Link from "next/link";

const STATS = [
  { label: "Teams", value: "16", href: "/points-table" },
  { label: "Fixtures", value: "24", href: "/fixtures" },
  { label: "Points Table", value: "4 Groups", href: "/points-table" },
  { label: "Top Scorers", value: "View", href: "/stats" },
];

export default function StatsStrip() {
  return (
    <div className="grid grid-cols-4 bg-navy-800 divide-x divide-navy-700">
      {STATS.map(({ label, value, href }) => (
        <Link
          key={label}
          href={href}
          className="flex flex-col items-center py-3 px-1 hover:bg-navy-700 transition-colors group"
        >
          <span className="font-heading text-lg text-neon-lime group-hover:neon-glow leading-none">
            {value}
          </span>
          <span className="text-gray-400 text-[10px] mt-0.5 text-center leading-tight">{label}</span>
        </Link>
      ))}
    </div>
  );
}
