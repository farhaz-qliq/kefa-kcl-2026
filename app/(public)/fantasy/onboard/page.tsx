"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ChevronRight, ChevronLeft, Crown, X, Search, Check } from "lucide-react";
import { useFantasyStore } from "@/store/fantasyStore";
import { MOCK_FANTASY_PLAYERS, FANTASY_BUDGET } from "@/mocks";
import { MOCK_TEAMS } from "@/mocks";
import type { FPosition } from "@/types/fantasy";
import { cn } from "@/lib/utils";

// ── 7-a-side: 1GK 3DEF 3FWD + subs: 1GK 1DEF 1FWD = 10 total ────────────────
type SlotDef = { pos: FPosition; isStarter: boolean; index: number };

const SLOTS: SlotDef[] = [
  // Starting (7)
  { pos: "GK",  isStarter: true,  index: 0 },
  { pos: "DEF", isStarter: true,  index: 1 },
  { pos: "DEF", isStarter: true,  index: 2 },
  { pos: "DEF", isStarter: true,  index: 3 },
  { pos: "FWD", isStarter: true,  index: 4 },
  { pos: "FWD", isStarter: true,  index: 5 },
  { pos: "FWD", isStarter: true,  index: 6 },
  // Subs (3)
  { pos: "GK",  isStarter: false, index: 7 },
  { pos: "DEF", isStarter: false, index: 8 },
  { pos: "FWD", isStarter: false, index: 9 },
];

const AVATAR_COLORS = ["#C7FF00", "#00D9FF", "#FF6B6B", "#A855F7", "#F59E0B", "#10B981"];

function getTeam(id: string) { return MOCK_TEAMS.find((t) => t.id === id); }

// ── Step 1: Minimal Setup ─────────────────────────────────────────────────────
function StepSetup({ onNext }: { onNext: () => void }) {
  const { user, setProfile, setTeamName } = useFantasyStore();
  const [name,  setName]  = useState(user?.name ?? "");
  const [tname, setTname] = useState(user?.teamName ?? "");
  const [color, setColor] = useState(user?.avatarColor ?? AVATAR_COLORS[0]);

  function save() {
    setProfile(name.trim(), color);
    setTeamName(tname.trim());
    onNext();
  }

  return (
    <div className="flex flex-col gap-5 px-6 pt-8 pb-8 h-full">
      {/* Inputs */}
      <div>
        <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1.5 block">Manager Name</label>
        <input
          type="text"
          placeholder="e.g. Shanif Ali"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border-2 border-gray-200 rounded-xl px-4 py-3.5 text-navy text-[15px] outline-none focus:border-[#C7FF00] transition-colors"
        />
      </div>
      <div>
        <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1.5 block">Team Name</label>
        <input
          type="text"
          placeholder="e.g. Gulf Warriors XI"
          value={tname}
          maxLength={24}
          onChange={(e) => setTname(e.target.value)}
          className="w-full border-2 border-gray-200 rounded-xl px-4 py-3.5 text-navy text-[15px] outline-none focus:border-[#C7FF00] transition-colors"
        />
      </div>

      <button
        onClick={save}
        disabled={name.trim().length < 2 || tname.trim().length < 2}
        className="mt-auto w-full py-4 rounded-xl font-heading text-[13px] uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-40 transition-opacity"
        style={{ backgroundColor: "#C7FF00", color: "#080d18" }}
      >
        Build My Squad <ChevronRight size={16} />
      </button>
    </div>
  );
}

// ── 3D Football Shirt SVG ─────────────────────────────────────────────────────
function hexToRgb(hex: string) {
  const h = hex.replace("#", "");
  return { r: parseInt(h.slice(0, 2), 16), g: parseInt(h.slice(2, 4), 16), b: parseInt(h.slice(4, 6), 16) };
}
function lighten(hex: string, f: number) {
  const { r, g, b } = hexToRgb(hex);
  return `rgb(${Math.min(255, Math.round(r + (255 - r) * f))},${Math.min(255, Math.round(g + (255 - g) * f))},${Math.min(255, Math.round(b + (255 - b) * f))})`;
}
function darken(hex: string, f: number) {
  const { r, g, b } = hexToRgb(hex);
  return `rgb(${Math.round(r * (1 - f))},${Math.round(g * (1 - f))},${Math.round(b * (1 - f))})`;
}

// Shirt path (viewBox 0 0 54 56)
const SHIRT_PATH = "M 21 4 C 21 4 23.5 14 27 14 C 30.5 14 33 4 33 4 L 51 17 L 44 26 L 40 22 L 40 53 L 14 53 L 14 22 L 10 26 L 3 17 Z";

function Shirt({ color }: { color: string }) {
  const gid = color.replace(/[^a-zA-Z0-9]/g, "x");
  const light  = lighten(color, 0.42);
  const mid    = lighten(color, 0.12);
  const dark   = darken(color, 0.38);
  const vdark  = darken(color, 0.55);

  return (
    <svg width="52" height="52" viewBox="0 0 54 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        {/* Main body gradient — top-left bright, bottom-right dark */}
        <linearGradient id={`body-${gid}`} x1="10%" y1="0%" x2="90%" y2="100%">
          <stop offset="0%"   stopColor={light} />
          <stop offset="40%"  stopColor={mid} />
          <stop offset="100%" stopColor={dark} />
        </linearGradient>
        {/* Left-half shine overlay */}
        <linearGradient id={`shine-${gid}`} x1="0%" y1="0%" x2="100%" y2="60%">
          <stop offset="0%"   stopColor="white" stopOpacity="0.28" />
          <stop offset="55%"  stopColor="white" stopOpacity="0.06" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </linearGradient>
        {/* Right-half dark shadow */}
        <linearGradient id={`shadow-${gid}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor={vdark} stopOpacity="0" />
          <stop offset="100%" stopColor={vdark} stopOpacity="0.45" />
        </linearGradient>
        {/* Drop shadow filter */}
        <filter id={`drop-${gid}`} x="-20%" y="-20%" width="140%" height="150%">
          <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="rgba(0,0,0,0.45)" />
        </filter>
        {/* Inner collar gradient */}
        <linearGradient id={`collar-${gid}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor={dark} />
          <stop offset="100%" stopColor={mid} />
        </linearGradient>
      </defs>

      {/* Ground shadow */}
      <ellipse cx="27" cy="55" rx="15" ry="2.5" fill="rgba(0,0,0,0.22)" />

      {/* Main shirt — drop shadow + gradient */}
      <path d={SHIRT_PATH} fill={`url(#body-${gid})`} filter={`url(#drop-${gid})`} />

      {/* Right-side shadow overlay */}
      <path d={SHIRT_PATH} fill={`url(#shadow-${gid})`} />

      {/* Left-side shine overlay */}
      <path d={SHIRT_PATH} fill={`url(#shine-${gid})`} />

      {/* Collar inner groove (darker) */}
      <path
        d="M 21 4 C 21 4 23.5 14 27 14 C 30.5 14 33 4 33 4"
        fill="none" stroke={vdark} strokeWidth="2.5" strokeLinecap="round"
      />
      {/* Collar rim highlight */}
      <path
        d="M 21.5 4.5 C 21.5 4.5 23.8 13 27 13 C 30.2 13 32.5 4.5 32.5 4.5"
        fill="none" stroke={light} strokeWidth="0.8" strokeLinecap="round" opacity="0.6"
      />

      {/* Specular glare spot — upper left chest */}
      <ellipse cx="19" cy="21" rx="5" ry="3.5" fill="white" opacity="0.16"
        transform="rotate(-25 19 21)" />

      {/* Subtle centre fold crease */}
      <line x1="27" y1="15" x2="27" y2="51" stroke="rgba(0,0,0,0.07)" strokeWidth="0.7" />

      {/* Sleeve edge highlight left */}
      <line x1="3" y1="17" x2="10" y2="26" stroke={light} strokeWidth="0.8" opacity="0.5" />
      {/* Sleeve edge shadow right */}
      <line x1="51" y1="17" x2="44" y2="26" stroke={vdark} strokeWidth="0.8" opacity="0.7" />
    </svg>
  );
}

function EmptyShirt({ onPitch }: { onPitch: boolean }) {
  return (
    <svg width="52" height="52" viewBox="0 0 54 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="27" cy="55" rx="14" ry="2" fill="rgba(0,0,0,0.08)" />
      <path
        d={SHIRT_PATH}
        fill={onPitch ? "rgba(255,255,255,0.07)" : "#f3f4f6"}
        stroke={onPitch ? "rgba(255,255,255,0.3)" : "#d1d5db"}
        strokeWidth="1.5"
        strokeDasharray="4 2"
      />
      <text x="27" y="32" textAnchor="middle" fontSize="11"
        fill={onPitch ? "rgba(255,255,255,0.45)" : "#9ca3af"} fontFamily="sans-serif">+</text>
    </svg>
  );
}

// ── Pitch Slot ────────────────────────────────────────────────────────────────
interface PlayerSlotProps {
  slot: SlotDef;
  playerId: string | null;
  isCaptain: boolean;
  onTap: () => void;
  onPitch?: boolean;
}

function PlayerSlot({ slot, playerId, isCaptain, onTap, onPitch = true }: PlayerSlotProps) {
  const player = playerId ? MOCK_FANTASY_PLAYERS.find((p) => p.id === playerId) : null;
  const team   = player ? getTeam(player.teamId) : null;
  const shirtColor = team?.primaryColor ?? (onPitch ? "rgba(255,255,255,0.15)" : "#e5e7eb");
  const nameColor  = onPitch ? "text-white" : "text-navy";
  const posColor   = onPitch ? "text-white/50" : "text-gray-400";

  return (
    <button onClick={onTap} className="flex flex-col items-center gap-0.5 relative" style={{ minWidth: 52 }}>
      <div className="relative">
        {player ? <Shirt color={shirtColor} /> : <EmptyShirt onPitch={onPitch} />}

        {/* Badge overlay on shirt chest */}
        {player && team?.badgeUrl && (
          <div className="absolute" style={{ top: 18, left: "50%", transform: "translateX(-50%)", width: 20, height: 20 }}>
            <Image src={team.badgeUrl} alt={team.shortName} fill className="object-contain drop-shadow-sm" />
          </div>
        )}

        {/* Captain crown */}
        {isCaptain && (
          <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 bg-[#C7FF00] rounded-full w-5 h-5 flex items-center justify-center shadow">
            <Crown size={10} color="#080d18" />
          </div>
        )}
      </div>

      {player ? (
        <>
          <span className={cn("text-[9px] font-bold leading-none text-center max-w-[60px] truncate mt-0.5", nameColor)}>
            {player.name.split(" ")[0]}
          </span>
          <span className={cn("text-[8px] leading-none", posColor)}>
            {team?.shortName}
          </span>
        </>
      ) : (
        <span className={cn("text-[8px] font-bold uppercase mt-0.5", posColor)}>{slot.pos}</span>
      )}
    </button>
  );
}

// ── Step 2: Pitch Squad Builder ───────────────────────────────────────────────
function StepSquad({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  // squad[i] = playerId or null, aligned to SLOTS
  const [squad,    setSquad]    = useState<(string | null)[]>(Array(10).fill(null));
  const [captain,  setCaptain]  = useState<number | null>(null); // slot index
  const [picker,   setPicker]   = useState<number | null>(null); // slot index opening picker
  const [action,   setAction]   = useState<number | null>(null); // slot index for action sheet
  const [search,   setSearch]   = useState("");

  const spent = squad.reduce((acc, id) => {
    if (!id) return acc;
    return acc + (MOCK_FANTASY_PLAYERS.find((p) => p.id === id)?.price ?? 0);
  }, 0);
  const remaining = Math.round((FANTASY_BUDGET - spent) * 10) / 10;
  const filled    = squad.filter(Boolean).length;
  const complete  = filled === 10;

  // Auto-pick captain (highest-points starter) when squad is full and none set
  useEffect(() => {
    if (filled === 10 && captain === null) {
      const best = SLOTS
        .filter((s) => s.isStarter && squad[s.index])
        .map((s) => ({ idx: s.index, pts: MOCK_FANTASY_PLAYERS.find((p) => p.id === squad[s.index])?.totalPoints ?? 0 }))
        .sort((a, b) => b.pts - a.pts)[0];
      if (best) setCaptain(best.idx);
    }
  }, [filled, captain, squad]);

  const pickerSlot = picker !== null ? SLOTS[picker] : null;

  const availablePlayers = useCallback(() => {
    if (!pickerSlot) return [];
    const usedIds = squad.filter(Boolean) as string[];
    return MOCK_FANTASY_PLAYERS
      .filter((p) => {
        if (p.position !== pickerSlot.pos) return false;
        if (usedIds.includes(p.id)) return false;
        if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
        const teamCount = usedIds.filter((id) => MOCK_FANTASY_PLAYERS.find((x) => x.id === id)?.teamId === p.teamId).length;
        if (teamCount >= 3) return false;
        if (spent + p.price > FANTASY_BUDGET + 0.01) return false;
        return true;
      })
      .sort((a, b) => b.totalPoints - a.totalPoints);
  }, [pickerSlot, squad, search, spent]);

  function pickPlayer(playerId: string) {
    if (picker === null) return;
    const next = [...squad];
    next[picker] = playerId;
    setSquad(next);
    setPicker(null);
    setSearch("");
  }

  function removePlayer(slotIdx: number) {
    const next = [...squad];
    next[slotIdx] = null;
    setSquad(next);
    if (captain === slotIdx) setCaptain(null);
    setAction(null);
  }

  function handleSlotTap(i: number) {
    if (squad[i]) {
      setAction(i);
    } else {
      setPicker(i);
    }
  }

  function finishSquad() {
    if (!complete) return;
    const capId  = captain !== null ? (squad[captain] ?? "") : "";
    const vcSlot = squad.findIndex((id, i) => i !== captain && !!id && SLOTS[i].isStarter);
    const vcId   = vcSlot >= 0 ? (squad[vcSlot] ?? "") : "";
    // Write data BEFORE navigating
    window.__fantasySquadData = { playerIds: squad.filter(Boolean) as string[], captainId: capId, viceCaptainId: vcId };
    onNext();
  }

  // Pitch row helpers
  const starters = SLOTS.filter((s) => s.isStarter);
  const subs     = SLOTS.filter((s) => !s.isStarter);

  return (
    <div className="flex flex-col h-full bg-[#f5f7fa]">
      {/* Budget bar */}
      <div className="px-4 py-3 bg-white border-b border-gray-100">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[11px] font-bold text-navy uppercase tracking-wide">Budget</span>
          <span className={cn("font-heading text-[13px]", remaining < 5 ? "text-red-500" : "text-navy")}>
            AED {remaining.toFixed(1)}M left
          </span>
        </div>
        <div className="h-1.5 bg-gray-100 rounded-full">
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${(filled / 10) * 100}%`, backgroundColor: "#C7FF00" }}
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-gray-400 text-[10px]">{filled}/10 players</span>
          <span className="text-gray-400 text-[10px]">
            {captain !== null ? `${MOCK_FANTASY_PLAYERS.find(p => p.id === squad[captain])?.name.split(" ")[0]} © captain` : "Tap player to change captain"}
          </span>
        </div>
      </div>

      {/* Pitch */}
      <div className="mx-4 mt-2 rounded-2xl overflow-hidden relative" style={{ background: "linear-gradient(175deg, #1e8c35 0%, #166b28 50%, #1a7a30 100%)" }}>
        {/* Pitch stripe pattern */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 300 240" preserveAspectRatio="none">
          {/* Alternating grass stripes */}
          {[0,1,2,3,4,5].map(i => (
            <rect key={i} x="0" y={i*40} width="300" height="20" fill="rgba(0,0,0,0.04)" />
          ))}
          {/* Boundary */}
          <rect x="6" y="6" width="288" height="228" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" />
          {/* Centre line */}
          <line x1="6" y1="120" x2="294" y2="120" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
          {/* Centre circle */}
          <circle cx="150" cy="120" r="30" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
          <circle cx="150" cy="120" r="2" fill="rgba(255,255,255,0.3)" />
          {/* Top penalty box */}
          <rect x="88" y="6" width="124" height="40" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
          <rect x="112" y="6" width="76" height="18" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
          {/* Bottom penalty box */}
          <rect x="88" y="194" width="124" height="40" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
          <rect x="112" y="216" width="76" height="18" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />

          {/* ── La Perfume sideline ad boards (vertical) ── */}
          <rect x="6" y="68" width="12" height="104" rx="2" fill="rgba(8,13,24,0.82)" />
          <text transform="rotate(-90 12 120)" x="12" y="120" textAnchor="middle" fontSize="5" fill="#C7FF00" fontFamily="Anton,sans-serif" letterSpacing="1.2">LA PERFUME</text>

          <rect x="282" y="68" width="12" height="104" rx="2" fill="rgba(8,13,24,0.82)" />
          <text transform="rotate(90 288 120)" x="288" y="120" textAnchor="middle" fontSize="5" fill="#C7FF00" fontFamily="Anton,sans-serif" letterSpacing="1.2">LA PERFUME</text>
        </svg>

        {/* Player positions */}
        <div className="relative z-10 pt-8 pb-10 px-2">
          {/* FWD row */}
          <div className="flex justify-around mb-6">
            {starters.filter(s => s.pos === "FWD").map((s) => (
              <PlayerSlot key={s.index} slot={s} playerId={squad[s.index]} isCaptain={captain === s.index} onTap={() => handleSlotTap(s.index)} onPitch />
            ))}
          </div>
          {/* DEF row */}
          <div className="flex justify-around mb-6">
            {starters.filter(s => s.pos === "DEF").map((s) => (
              <PlayerSlot key={s.index} slot={s} playerId={squad[s.index]} isCaptain={captain === s.index} onTap={() => handleSlotTap(s.index)} onPitch />
            ))}
          </div>
          {/* GK row */}
          <div className="flex justify-center">
            {starters.filter(s => s.pos === "GK").map((s) => (
              <PlayerSlot key={s.index} slot={s} playerId={squad[s.index]} isCaptain={captain === s.index} onTap={() => handleSlotTap(s.index)} onPitch />
            ))}
          </div>
        </div>
      </div>

      {/* Subs bench — always fully visible, white card */}
      <div className="mx-4 mt-2 bg-white rounded-2xl border border-gray-100 px-4 pt-2.5 pb-3">
        <div className="flex items-center gap-2 mb-2.5">
          <div className="w-1 h-4 rounded-full bg-gray-300" />
          <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-gray-400">Substitutes</p>
        </div>
        <div className="flex justify-around">
          {subs.map((s) => (
            <PlayerSlot key={s.index} slot={s} playerId={squad[s.index]} isCaptain={captain === s.index} onTap={() => handleSlotTap(s.index)} onPitch={false} />
          ))}
        </div>
      </div>

      {/* Bottom nav */}
      <div className="flex gap-3 px-4 mt-3 pb-4">
        <button onClick={onBack} className="w-12 h-12 rounded-xl border-2 border-gray-200 flex items-center justify-center text-gray-400 bg-white">
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={finishSquad}
          disabled={!complete}
          className="flex-1 py-3 rounded-xl font-heading text-[12px] uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-40 transition-opacity"
          style={{ backgroundColor: "#C7FF00", color: "#080d18" }}
        >
          Confirm Squad <ChevronRight size={14} />
        </button>
      </div>

      {/* Action sheet (tap filled player) */}
      {action !== null && squad[action] && (() => {
        const p = MOCK_FANTASY_PLAYERS.find((x) => x.id === squad[action]);
        const team = p ? getTeam(p.teamId) : null;
        const isCap = captain === action;
        return (
          <div className="absolute inset-0 bg-black/40 z-40 flex flex-col justify-end" onClick={() => setAction(null)}>
            <div className="bg-white rounded-t-2xl px-5 pt-4 pb-8" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 relative flex-shrink-0">
                  {team?.badgeUrl && <Image src={team.badgeUrl} alt="" fill className="object-contain" />}
                </div>
                <div>
                  <p className="font-semibold text-navy text-[15px]">{p?.name}</p>
                  <p className="text-gray-400 text-[11px]">{team?.shortName} · AED {p?.price.toFixed(1)}M · {p?.totalPoints} pts</p>
                </div>
              </div>
              {SLOTS[action].isStarter && (
                <button
                  onClick={() => { setCaptain(isCap ? null : action); setAction(null); }}
                  className="w-full flex items-center gap-3 py-3.5 border-b border-gray-100"
                >
                  <Crown size={16} style={{ color: isCap ? "#C7FF00" : "#9ca3af" }} />
                  <span className="text-navy font-semibold text-[14px]">{isCap ? "Remove Captain" : "Make Captain (2× pts)"}</span>
                  {isCap && <Check size={14} style={{ color: "#C7FF00" }} className="ml-auto" />}
                </button>
              )}
              <button
                onClick={() => removePlayer(action)}
                className="w-full flex items-center gap-3 py-3.5"
              >
                <X size={16} className="text-red-400" />
                <span className="text-red-500 font-semibold text-[14px]">Remove Player</span>
              </button>
            </div>
          </div>
        );
      })()}

      {/* Player picker bottom sheet */}
      {picker !== null && pickerSlot && (
        <div className="absolute inset-0 bg-black/40 z-40 flex flex-col justify-end">
          <div className="bg-white rounded-t-2xl flex flex-col" style={{ maxHeight: "70%" }}>
            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-gray-100 flex-shrink-0">
              <h3 className="font-heading text-[16px] text-navy uppercase">
                Select {pickerSlot.pos} {pickerSlot.isStarter ? "" : "· Sub"}
              </h3>
              <button onClick={() => { setPicker(null); setSearch(""); }} className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                <X size={15} />
              </button>
            </div>
            {/* Search */}
            <div className="px-4 py-2 flex-shrink-0">
              <div className="flex items-center gap-2 bg-[#f5f7fa] rounded-xl px-3 py-2.5">
                <Search size={13} className="text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="flex-1 bg-transparent text-navy text-sm outline-none"
                  autoFocus
                />
              </div>
            </div>
            {/* List */}
            <div className="overflow-y-auto flex-1 px-4 pb-6">
              {availablePlayers().map((p) => {
                const team = getTeam(p.teamId);
                return (
                  <button
                    key={p.id}
                    onClick={() => pickPlayer(p.id)}
                    className="w-full flex items-center gap-3 py-3 border-b border-gray-100 text-left"
                  >
                    <div className="w-10 h-10 relative flex-shrink-0">
                      {team?.badgeUrl && <Image src={team.badgeUrl} alt="" fill className="object-contain" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-navy font-semibold text-[13px] leading-none">{p.name}</p>
                      <p className="text-gray-400 text-[10px] mt-0.5">{team?.shortName} · {p.position}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-navy font-heading text-[12px]">AED {p.price.toFixed(1)}M</p>
                      <p className="text-gray-400 text-[10px]">{p.totalPoints} pts</p>
                    </div>
                  </button>
                );
              })}
              {availablePlayers().length === 0 && (
                <p className="text-gray-400 text-sm text-center py-8">No players available</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Global temp data bridge ───────────────────────────────────────────────────
declare global {
  interface Window {
    __fantasySquadData?: { playerIds: string[]; captainId: string; viceCaptainId: string };
  }
}

// ── Main Onboard Page ─────────────────────────────────────────────────────────
export default function OnboardPage() {
  const router = useRouter();
  const { isAuthenticated, setSquad } = useFantasyStore();
  const [step,  setStep]  = useState(0);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) router.replace("/fantasy/login");
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  async function finishOnboarding() {
    const data = window.__fantasySquadData;
    if (!data) return;

    const { user } = useFantasyStore.getState();
    try {
      await fetch("/api/fantasy/squad", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId:       user?.email ?? "",
          playerIds:    data.playerIds,
          captainId:    data.captainId,
          viceCaptainId: data.viceCaptainId,
          name:         user?.name,
          teamName:     user?.teamName,
          avatarColor:  user?.avatarColor,
        }),
      });
    } catch { /* persist to Zustand regardless */ }

    setSquad(data);
    setSaved(true);
    setTimeout(() => router.replace("/fantasy"), 1600);
  }

  return (
    <div className="relative flex flex-col h-full bg-white overflow-hidden">
      {/* Minimal step dots */}
      <div className="flex items-center gap-2 justify-center pt-3 pb-1 shrink-0">
        {[0, 1].map((i) => (
          <div
            key={i}
            className={cn("rounded-full transition-all", i === step ? "w-6 h-2" : "w-2 h-2 bg-gray-200")}
            style={i === step ? { backgroundColor: "#C7FF00" } : undefined}
          />
        ))}
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto relative">
        {step === 0 && <StepSetup onNext={() => setStep(1)} />}
        {step === 1 && <StepSquad onNext={finishOnboarding} onBack={() => setStep(0)} />}
      </div>

      {/* ── Squad saved overlay ── */}
      {saved && (
        <div className="absolute inset-0 z-50 bg-[#080d18] flex flex-col items-center justify-center px-8">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
            style={{ backgroundColor: "#C7FF00" }}
          >
            <Check size={40} strokeWidth={3} className="text-[#080d18]" />
          </div>
          <p className="font-heading text-white text-[26px] uppercase leading-none text-center mb-2">
            Squad Saved!
          </p>
          <p className="text-gray-500 text-[13px] text-center">
            Your fantasy squad is ready. Good luck!
          </p>
          <div className="mt-8 flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ backgroundColor: "#C7FF00", animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
