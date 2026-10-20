"use client";

interface TeamBadgeProps {
  shortName: string;
  primaryColor: string;
  size?: "sm" | "md" | "lg";
}

const SIZE_MAP = {
  sm: { w: 32, h: 37 },
  md: { w: 44, h: 51 },
  lg: { w: 56, h: 65 },
};

// Deterministic style picker so every team always gets the same variant
function pickStyle(shortName: string): 0 | 1 | 2 | 3 {
  const code = shortName.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return (code % 4) as 0 | 1 | 2 | 3;
}

// Hex → rgb components
function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
}

// Darken a hex color by factor (0-1)
function darken(hex: string, factor: number): string {
  const { r, g, b } = hexToRgb(hex);
  const d = (v: number) => Math.max(0, Math.floor(v * (1 - factor)));
  return `rgb(${d(r)},${d(g)},${d(b)})`;
}

// Lighten toward white
function lighten(hex: string, factor: number): string {
  const { r, g, b } = hexToRgb(hex);
  const l = (v: number) => Math.min(255, Math.floor(v + (255 - v) * factor));
  return `rgb(${l(r)},${l(g)},${l(b)})`;
}

// Proper heraldic shield path (pointed bottom)
function shield(w: number, h: number): string {
  const r = w * 0.14;
  const midX = w / 2;
  const bodyEnd = h * 0.62;
  return [
    `M ${r} 0`,
    `L ${w - r} 0`,
    `Q ${w} 0 ${w} ${r}`,
    `L ${w} ${bodyEnd}`,
    `Q ${w} ${h * 0.84} ${midX} ${h}`,
    `Q 0 ${h * 0.84} 0 ${bodyEnd}`,
    `L 0 ${r}`,
    `Q 0 0 ${r} 0 Z`,
  ].join(" ");
}

export default function TeamBadge({ shortName, primaryColor, size = "md" }: TeamBadgeProps) {
  const { w, h } = SIZE_MAP[size];
  const abbr = shortName.slice(0, 4).toUpperCase();
  const style = pickStyle(shortName);
  const uid = `${shortName}-${size}`;

  const dark = darken(primaryColor, 0.35);
  const light = lighten(primaryColor, 0.55);

  const fontSize = size === "sm" ? 7 : size === "md" ? 9.5 : 12;
  const shieldD = shield(w, h);

  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label={shortName}
    >
      <defs>
        <clipPath id={`shield-clip-${uid}`}>
          <path d={shieldD} />
        </clipPath>
        <linearGradient id={`grad-v-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={light} />
          <stop offset="100%" stopColor={dark} />
        </linearGradient>
        <linearGradient id={`grad-diag-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={primaryColor} />
          <stop offset="50%" stopColor={dark} />
          <stop offset="100%" stopColor={primaryColor} />
        </linearGradient>
      </defs>

      {/* ── Style 0: Top-band crest ── */}
      {style === 0 && (
        <g clipPath={`url(#shield-clip-${uid})`}>
          {/* White body */}
          <rect x="0" y="0" width={w} height={h} fill="#f8f9fb" />
          {/* Colored top band */}
          <rect x="0" y="0" width={w} height={h * 0.36} fill={`url(#grad-v-${uid})`} />
          {/* Divider line */}
          <line x1="0" y1={h * 0.36} x2={w} y2={h * 0.36} stroke={dark} strokeWidth="1.5" />
          {/* Thin accent line inside band */}
          <line x1={w * 0.15} y1={h * 0.17} x2={w * 0.85} y2={h * 0.17} stroke="rgba(255,255,255,0.35)" strokeWidth="0.75" />
          {/* Abbreviation */}
          <text x={w / 2} y={h * 0.68} textAnchor="middle" dominantBaseline="middle"
            fontSize={fontSize} fontWeight="900" fontFamily="'Anton','Arial Black',sans-serif"
            letterSpacing="0.04em" fill="#0d1526">{abbr}</text>
          {/* Year tag */}
          <text x={w / 2} y={h * 0.87} textAnchor="middle" dominantBaseline="middle"
            fontSize={fontSize * 0.6} fontWeight="700" fontFamily="'Inter','Arial',sans-serif"
            fill={primaryColor} opacity="0.9">2026</text>
        </g>
      )}

      {/* ── Style 1: Full-color crest with white text ── */}
      {style === 1 && (
        <g clipPath={`url(#shield-clip-${uid})`}>
          <rect x="0" y="0" width={w} height={h} fill={`url(#grad-v-${uid})`} />
          {/* Inner white frame */}
          <path d={shield(w * 0.84, h * 0.84)} transform={`translate(${w * 0.08}, ${h * 0.05})`}
            fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1" />
          {/* White horizontal stripe center */}
          <rect x="0" y={h * 0.42} width={w} height={h * 0.17} fill="rgba(255,255,255,0.12)" />
          {/* Abbreviation */}
          <text x={w / 2} y={h * 0.56} textAnchor="middle" dominantBaseline="middle"
            fontSize={fontSize} fontWeight="900" fontFamily="'Anton','Arial Black',sans-serif"
            letterSpacing="0.04em" fill="#ffffff">{abbr}</text>
          {/* Dots at top */}
          <circle cx={w * 0.38} cy={h * 0.18} r={w * 0.045} fill="rgba(255,255,255,0.5)" />
          <circle cx={w * 0.5} cy={h * 0.14} r={w * 0.055} fill="rgba(255,255,255,0.7)" />
          <circle cx={w * 0.62} cy={h * 0.18} r={w * 0.045} fill="rgba(255,255,255,0.5)" />
          {/* Year */}
          <text x={w / 2} y={h * 0.82} textAnchor="middle" dominantBaseline="middle"
            fontSize={fontSize * 0.6} fontWeight="700" fontFamily="'Inter','Arial',sans-serif"
            fill="rgba(255,255,255,0.7)">2026</text>
        </g>
      )}

      {/* ── Style 2: Diagonal split ── */}
      {style === 2 && (
        <g clipPath={`url(#shield-clip-${uid})`}>
          {/* White base */}
          <rect x="0" y="0" width={w} height={h} fill="#f8f9fb" />
          {/* Diagonal color half */}
          <polygon points={`0,0 ${w},0 ${w},${h} 0,${h}`}
            fill={`url(#grad-diag-${uid})`} opacity="1" clipPath={`url(#shield-clip-${uid})`} />
          <polygon points={`${w * 0.52},0 ${w},0 ${w},${h * 0.8}`} fill="#f8f9fb" />
          {/* Diagonal divider */}
          <line x1={w * 0.5} y1="0" x2={w} y2={h * 0.78} stroke={dark} strokeWidth="1.5" />
          {/* Abbreviation */}
          <text x={w * 0.38} y={h * 0.58} textAnchor="middle" dominantBaseline="middle"
            fontSize={fontSize} fontWeight="900" fontFamily="'Anton','Arial Black',sans-serif"
            letterSpacing="0.03em" fill="#ffffff">{abbr}</text>
          {/* Year */}
          <text x={w / 2} y={h * 0.85} textAnchor="middle" dominantBaseline="middle"
            fontSize={fontSize * 0.6} fontWeight="700" fontFamily="'Inter','Arial',sans-serif"
            fill={primaryColor}>2026</text>
        </g>
      )}

      {/* ── Style 3: Vertical split ── */}
      {style === 3 && (
        <g clipPath={`url(#shield-clip-${uid})`}>
          {/* Right half color */}
          <rect x="0" y="0" width={w} height={h} fill="#f8f9fb" />
          <rect x={w / 2} y="0" width={w / 2} height={h} fill={primaryColor} />
          {/* Center divider */}
          <line x1={w / 2} y1="0" x2={w / 2} y2={h} stroke={dark} strokeWidth="1.5" />
          {/* Bottom color band */}
          <rect x="0" y={h * 0.78} width={w} height={h * 0.22} fill={dark} />
          {/* Abbreviation split: dark half white, light half dark */}
          <text x={w / 2} y={h * 0.55} textAnchor="middle" dominantBaseline="middle"
            fontSize={fontSize} fontWeight="900" fontFamily="'Anton','Arial Black',sans-serif"
            letterSpacing="0.04em" fill="#0d1526">{abbr}</text>
          <clipPath id={`right-${uid}`}>
            <rect x={w / 2} y="0" width={w / 2} height={h} />
          </clipPath>
          <text x={w / 2} y={h * 0.55} textAnchor="middle" dominantBaseline="middle"
            fontSize={fontSize} fontWeight="900" fontFamily="'Anton','Arial Black',sans-serif"
            letterSpacing="0.04em" fill="#ffffff" clipPath={`url(#right-${uid})`}>{abbr}</text>
          {/* Year */}
          <text x={w / 2} y={h * 0.88} textAnchor="middle" dominantBaseline="middle"
            fontSize={fontSize * 0.6} fontWeight="700" fontFamily="'Inter','Arial',sans-serif"
            fill="rgba(255,255,255,0.85)">2026</text>
        </g>
      )}

      {/* Shield border (always on top) */}
      <path d={shieldD} fill="none" stroke={dark} strokeWidth="1.5" />
      {/* Inner inset border for depth */}
      <path
        d={shield(w * 0.86, h * 0.86)}
        transform={`translate(${w * 0.07}, ${h * 0.04})`}
        fill="none"
        stroke={style === 1 ? "rgba(255,255,255,0.2)" : `${primaryColor}55`}
        strokeWidth="0.75"
      />
    </svg>
  );
}
