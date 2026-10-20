"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Crown, Star, ArrowLeftRight, X, ChevronRight, ChevronLeft,
  Trophy, RefreshCw,
} from "lucide-react";
import { useFantasyStore } from "@/store/fantasyStore";
import { MOCK_FANTASY_PLAYERS } from "@/mocks";
import { MOCK_TEAMS } from "@/mocks";
import { cn } from "@/lib/utils";
import type { FPosition } from "@/types/fantasy";

// ── Shirt helpers ──────────────────────────────────────────────────────────────
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
const SHIRT_PATH = "M 21 4 C 21 4 23.5 14 27 14 C 30.5 14 33 4 33 4 L 51 17 L 44 26 L 40 22 L 40 53 L 14 53 L 14 22 L 10 26 L 3 17 Z";

function Shirt({ color }: { color: string }) {
  const gid   = color.replace(/[^a-zA-Z0-9]/g, "x");
  const light  = lighten(color, 0.42);
  const mid    = lighten(color, 0.12);
  const dark   = darken(color, 0.38);
  const vdark  = darken(color, 0.55);
  return (
    <svg width="52" height="52" viewBox="0 0 54 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={`body-${gid}`} x1="10%" y1="0%" x2="90%" y2="100%">
          <stop offset="0%"   stopColor={light} />
          <stop offset="40%"  stopColor={mid} />
          <stop offset="100%" stopColor={dark} />
        </linearGradient>
        <linearGradient id={`shine-${gid}`} x1="0%" y1="0%" x2="100%" y2="60%">
          <stop offset="0%"   stopColor="white" stopOpacity="0.28" />
          <stop offset="55%"  stopColor="white" stopOpacity="0.06" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`shadow-${gid}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor={vdark} stopOpacity="0" />
          <stop offset="100%" stopColor={vdark} stopOpacity="0.45" />
        </linearGradient>
        <filter id={`drop-${gid}`} x="-20%" y="-20%" width="140%" height="150%">
          <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="rgba(0,0,0,0.45)" />
        </filter>
      </defs>
      <ellipse cx="27" cy="55" rx="15" ry="2.5" fill="rgba(0,0,0,0.22)" />
      <path d={SHIRT_PATH} fill={`url(#body-${gid})`} filter={`url(#drop-${gid})`} />
      <path d={SHIRT_PATH} fill={`url(#shadow-${gid})`} />
      <path d={SHIRT_PATH} fill={`url(#shine-${gid})`} />
      <path d="M 21 4 C 21 4 23.5 14 27 14 C 30.5 14 33 4 33 4" fill="none" stroke={vdark} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M 21.5 4.5 C 21.5 4.5 23.8 13 27 13 C 30.2 13 32.5 4.5 32.5 4.5" fill="none" stroke={light} strokeWidth="0.8" strokeLinecap="round" opacity="0.6" />
      <ellipse cx="19" cy="21" rx="5" ry="3.5" fill="white" opacity="0.16" transform="rotate(-25 19 21)" />
      <line x1="27" y1="15" x2="27" y2="51" stroke="rgba(0,0,0,0.07)" strokeWidth="0.7" />
      <line x1="3"  y1="17" x2="10" y2="26" stroke={light}  strokeWidth="0.8" opacity="0.5" />
      <line x1="51" y1="17" x2="44" y2="26" stroke={vdark} strokeWidth="0.8" opacity="0.7" />
    </svg>
  );
}

function EmptyShirt({ onPitch }: { onPitch: boolean }) {
  return (
    <svg width="52" height="52" viewBox="0 0 54 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="27" cy="55" rx="14" ry="2" fill="rgba(0,0,0,0.08)" />
      <path d={SHIRT_PATH} fill={onPitch ? "rgba(255,255,255,0.07)" : "#f3f4f6"} stroke={onPitch ? "rgba(255,255,255,0.3)" : "#d1d5db"} strokeWidth="1.5" strokeDasharray="4 2" />
      <text x="27" y="32" textAnchor="middle" fontSize="11" fill={onPitch ? "rgba(255,255,255,0.45)" : "#9ca3af"} fontFamily="sans-serif">+</text>
    </svg>
  );
}

// ── Slot definitions ───────────────────────────────────────────────────────────
type SlotDef = { pos: FPosition; isStarter: boolean; index: number };
const SLOTS: SlotDef[] = [
  { pos: "GK",  isStarter: true,  index: 0 },
  { pos: "DEF", isStarter: true,  index: 1 },
  { pos: "DEF", isStarter: true,  index: 2 },
  { pos: "DEF", isStarter: true,  index: 3 },
  { pos: "FWD", isStarter: true,  index: 4 },
  { pos: "FWD", isStarter: true,  index: 5 },
  { pos: "FWD", isStarter: true,  index: 6 },
  { pos: "GK",  isStarter: false, index: 7 },
  { pos: "DEF", isStarter: false, index: 8 },
  { pos: "FWD", isStarter: false, index: 9 },
];

function getTeam(id: string) { return MOCK_TEAMS.find((t) => t.id === id); }

// ── Pitch player slot ──────────────────────────────────────────────────────────
interface ViewSlotProps {
  slotIdx: number;
  playerId: string;
  captainId: string;
  vcId: string;
  swapFrom: number | null;
  onTap: () => void;
  onPitch?: boolean;
}

function ViewSlot({ slotIdx, playerId, captainId, vcId, swapFrom, onTap, onPitch = true }: ViewSlotProps) {
  const player     = playerId ? MOCK_FANTASY_PLAYERS.find((p) => p.id === playerId) : null;
  const team       = player ? getTeam(player.teamId) : null;
  const shirtColor = team?.primaryColor ?? (onPitch ? "#2563eb" : "#e5e7eb");
  const isCap      = !!playerId && playerId === captainId;
  const isVC       = !!playerId && playerId === vcId && !isCap;
  const slot       = SLOTS[slotIdx];

  const isSwapSource = swapFrom === slotIdx;
  const isSwapTarget = swapFrom !== null && swapFrom !== slotIdx && (() => {
    const from = SLOTS[swapFrom];
    return slot.pos === from.pos && slot.isStarter !== from.isStarter;
  })();

  const displayPts = isCap ? (player?.totalPoints ?? 0) * 2 : (player?.totalPoints ?? 0);

  return (
    <button
      onClick={onTap}
      className={cn(
        "flex flex-col items-center gap-0.5 relative rounded-xl p-1 transition-all",
        isSwapSource && "ring-2 ring-[#C7FF00] ring-offset-1 ring-offset-transparent",
        isSwapTarget && "ring-2 ring-[#00D9FF] ring-offset-1 ring-offset-transparent",
      )}
      style={{ minWidth: 52 }}
    >
      <div className="relative">
        {player ? <Shirt color={shirtColor} /> : <EmptyShirt onPitch={onPitch} />}
        {player && team?.badgeUrl && (
          <div className="absolute" style={{ top: 18, left: "50%", transform: "translateX(-50%)", width: 20, height: 20 }}>
            <Image src={team.badgeUrl} alt="" fill className="object-contain drop-shadow-sm" />
          </div>
        )}
        {isCap && (
          <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 bg-[#C7FF00] rounded-full w-5 h-5 flex items-center justify-center shadow">
            <span className="font-heading text-[#080d18] text-[9px] leading-none">C</span>
          </div>
        )}
        {isVC && (
          <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 bg-[#00D9FF] rounded-full w-5 h-5 flex items-center justify-center shadow">
            <Star size={10} color="#080d18" fill="#080d18" />
          </div>
        )}
        {player && (
          <div
            className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 rounded-full min-w-[22px] text-center shadow-sm px-1.5"
            style={{ backgroundColor: isCap ? "#C7FF00" : "rgba(8,13,24,0.85)", paddingTop: 2, paddingBottom: 2 }}
          >
            <span className={cn("text-[8px] font-heading leading-none", isCap ? "text-[#080d18]" : "text-[#C7FF00]")}>
              {displayPts}
            </span>
          </div>
        )}
      </div>
      <span className={cn("text-[9px] font-bold leading-none text-center max-w-[62px] truncate mt-1.5", onPitch ? "text-white" : "text-navy")}>
        {player ? player.name.split(" ")[0] : slot.pos}
      </span>
      {isCap && player && <span className="text-[7px] font-heading text-[#C7FF00] leading-none">2×</span>}
    </button>
  );
}

type Tab = "MY TEAM" | "STATS" | "TABLE";

// ── Mock league data ───────────────────────────────────────────────────────────
interface LeagueEntry {
  id: string;
  managerName: string;
  teamName: string;
  avatarColor: string;
  totalPoints: number;
  gwPoints: number;
  playerIds: string[];   // 10 slots matching SLOTS order
  captainId: string;
  isUser?: boolean;
}

// playerIds order: [GK, DEF, DEF, DEF, FWD, FWD, FWD, GK-sub, DEF-sub, FWD-sub]
const MOCK_MANAGERS: LeagueEntry[] = [
  { id:"m1", managerName:"Kareem Al Sayed",  teamName:"Desert Warriors FC",   avatarColor:"#EF4444", totalPoints:634, gwPoints:72, captainId:"fp78", playerIds:["fp7","fp74","fp8","fp32","fp78","fp90","fp36","fp13","fp2","fp30"] },
  { id:"m2", managerName:"Anjali Nair",       teamName:"Malabar Dream XI",     avatarColor:"#A855F7", totalPoints:612, gwPoints:65, captainId:"fp66", playerIds:["fp31","fp20","fp44","fp62","fp66","fp84","fp48","fp19","fp21","fp54"] },
  { id:"m3", managerName:"Faisal Rahman",     teamName:"Gulf Stars Elite",     avatarColor:"#F59E0B", totalPoints:581, gwPoints:58, captainId:"fp72", playerIds:["fp67","fp68","fp86","fp92","fp72","fp60","fp96","fp25","fp51","fp18"] },
  { id:"m4", managerName:"Ravi Mohan",        teamName:"Kerala Knights",       avatarColor:"#10B981", totalPoints:498, gwPoints:54, captainId:"fp6",  playerIds:["fp1","fp3","fp56","fp75","fp6","fp42","fp24","fp49","fp27","fp12"] },
  { id:"m5", managerName:"Zaid Khalid",       teamName:"Emirates United",      avatarColor:"#00D9FF", totalPoints:475, gwPoints:49, captainId:"fp54", playerIds:["fp55","fp50","fp33","fp80","fp54","fp48","fp60","fp37","fp9","fp96"] },
  { id:"m6", managerName:"Anil Prakash",      teamName:"Calicut Stars",        avatarColor:"#0EA5E9", totalPoints:453, gwPoints:47, captainId:"fp30", playerIds:["fp43","fp14","fp45","fp63","fp30","fp42","fp18","fp61","fp26","fp72"] },
  { id:"m7", managerName:"Sara Thomas",       teamName:"KCL United",           avatarColor:"#EC4899", totalPoints:432, gwPoints:45, captainId:"fp78", playerIds:["fp79","fp15","fp57","fp81","fp36","fp78","fp66","fp85","fp87","fp84"] },
  { id:"m8", managerName:"Javed Hussain",     teamName:"Al Khaliji FC",        avatarColor:"#6B7280", totalPoints:408, gwPoints:42, captainId:"fp90", playerIds:["fp91","fp69","fp93","fp38","fp90","fp6","fp24","fp73","fp39","fp54"] },
];

// ── Mock GW history ────────────────────────────────────────────────────────────
const CURRENT_GW = 6;
const GW_HISTORY = [
  { gw: 1, gwPoints: 62,  seasonPts: 62,  rank: 8 },
  { gw: 2, gwPoints: 48,  seasonPts: 110, rank: 7 },
  { gw: 3, gwPoints: 71,  seasonPts: 181, rank: 6 },
  { gw: 4, gwPoints: 55,  seasonPts: 236, rank: 5 },
  { gw: 5, gwPoints: 83,  seasonPts: 319, rank: 4 },
  { gw: 6, gwPoints: 51,  seasonPts: 370, rank: 4 }, // current GW (live)
];

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function FantasyPage() {
  const router = useRouter();
  const { isAuthenticated, onboardingComplete, user, squad, setSquad, syncUser, logout } = useFantasyStore();

  const [tab,            setTab]            = useState<Tab>("MY TEAM");
  const [localIds,       setLocalIds]       = useState<string[]>(() => squad?.playerIds ?? []);
  const [captainId,      setCaptainId]      = useState(() => squad?.captainId ?? "");
  const [vcId,           setVcId]           = useState(() => squad?.viceCaptainId ?? "");
  const [actionSlot,     setActionSlot]     = useState<number | null>(null);
  const [swapFrom,       setSwapFrom]       = useState<number | null>(null);
  const [leagueView,     setLeagueView]     = useState<string | null>(null);
  const [viewGW,         setViewGW]         = useState(CURRENT_GW);
  const [leagueManagers, setLeagueManagers] = useState<LeagueEntry[]>(MOCK_MANAGERS);

  useEffect(() => {
    if (!isAuthenticated) router.replace("/fantasy/login");
    else if (!onboardingComplete) router.replace("/fantasy/onboard");
  }, [isAuthenticated, onboardingComplete, router]);

  useEffect(() => {
    if (squad) {
      setLocalIds(squad.playerIds);
      setCaptainId(squad.captainId);
      setVcId(squad.viceCaptainId);
    }
  }, [squad]);

  // Sync from API on mount
  useEffect(() => {
    if (!isAuthenticated || !user?.email) return;
    fetch(`/api/fantasy/squad?userId=${encodeURIComponent(user.email)}`)
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (data?.squad?.playerIds?.length) {
          syncUser({
            email:              user.email,
            name:               user.name,
            teamName:           user.teamName,
            avatarColor:        user.avatarColor,
            onboardingComplete: true,
            freeTransfers:      data.freeTransfers ?? 1,
            totalPoints:        data.totalPoints ?? 0,
            squad:              data.squad,
          });
        }
      })
      .catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const persistSquad = useCallback((playerIds: string[], captain: string, vc: string) => {
    if (!user?.email) return;
    fetch("/api/fantasy/squad", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.email, playerIds, captainId: captain, viceCaptainId: vc }),
    }).catch(() => {});
  }, [user?.email]);

  const loadLeague = useCallback(() => {
    fetch("/api/fantasy/league")
      .then((r) => r.ok ? r.json() : null)
      .then((data: LeagueEntry[] | null) => {
        if (data?.length) setLeagueManagers(data.filter((e) => e.id !== user?.email));
      })
      .catch(() => {});
  }, [user?.email]);

  if (!isAuthenticated || !onboardingComplete || !squad || !user) return null;

  const starters = SLOTS.filter((s) => s.isStarter);
  const subs     = SLOTS.filter((s) => !s.isStarter);

  const totalPts = localIds.reduce((acc, id) => {
    const p = MOCK_FANTASY_PLAYERS.find((x) => x.id === id);
    return acc + (id === captainId ? (p?.totalPoints ?? 0) * 2 : (p?.totalPoints ?? 0));
  }, 0);

  // League standings: merge API managers + current user, sort by pts
  const leagueEntries: (LeagueEntry & { rank: number })[] = [
    ...leagueManagers,
    { id: "user", managerName: user.name, teamName: user.teamName, avatarColor: user.avatarColor, totalPoints: totalPts, gwPoints: 0, playerIds: localIds, captainId, isUser: true },
  ]
    .sort((a, b) => b.totalPoints - a.totalPoints)
    .map((e, i) => ({ ...e, rank: i + 1 }));

  // MY TEAM handlers
  function handleSlotTap(slotIdx: number) {
    if (!localIds[slotIdx]) return;
    if (swapFrom !== null) {
      if (swapFrom === slotIdx) { setSwapFrom(null); return; }
      const from = SLOTS[swapFrom], to = SLOTS[slotIdx];
      if (to.pos === from.pos && to.isStarter !== from.isStarter) {
        const next = [...localIds];
        [next[swapFrom], next[slotIdx]] = [next[slotIdx], next[swapFrom]];
        setLocalIds(next);
        setSquad({ playerIds: next, captainId, viceCaptainId: vcId });
        persistSquad(next, captainId, vcId);
      }
      setSwapFrom(null);
      return;
    }
    setActionSlot(slotIdx);
  }
  function handleSetCaptain(playerId: string) {
    const newCap = captainId === playerId ? "" : playerId;
    setCaptainId(newCap);
    setSquad({ playerIds: localIds, captainId: newCap, viceCaptainId: vcId });
    persistSquad(localIds, newCap, vcId);
    setActionSlot(null);
  }
  function handleSetVC(playerId: string) {
    const newVC = vcId === playerId ? "" : playerId;
    setVcId(newVC);
    setSquad({ playerIds: localIds, captainId, viceCaptainId: newVC });
    persistSquad(localIds, captainId, newVC);
    setActionSlot(null);
  }
  function startSwap(slotIdx: number) { setActionSlot(null); setSwapFrom(slotIdx); }

  const captainPlayer = MOCK_FANTASY_PLAYERS.find((p) => p.id === captainId);

  // STATS computations
  const squadGoals   = localIds.reduce((acc, id) => acc + (MOCK_FANTASY_PLAYERS.find((p) => p.id === id)?.goals        ?? 0), 0);
  const squadAssists = localIds.reduce((acc, id) => acc + (MOCK_FANTASY_PLAYERS.find((p) => p.id === id)?.assists      ?? 0), 0);
  const squadCS      = localIds.reduce((acc, id) => acc + (MOCK_FANTASY_PLAYERS.find((p) => p.id === id)?.cleanSheets  ?? 0), 0);

  return (
    <div className="relative flex flex-col h-full bg-[#f5f7fa] overflow-hidden">

      {/* ── Header ── */}
      <div className="bg-[#080d18] px-5 pt-5 pb-4 shrink-0">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className="w-11 h-11 rounded-xl font-heading text-base flex items-center justify-center text-[#080d18]"
              style={{ backgroundColor: user.avatarColor }}
            >
              {user.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <p className="font-heading text-white text-[16px] uppercase leading-none">{user.teamName}</p>
              <p className="text-gray-500 text-[10px] mt-0.5">{user.name}</p>
            </div>
          </div>
          <button onClick={logout} className="text-gray-600 text-[10px] uppercase tracking-wide border border-gray-800 rounded-lg px-2.5 py-1">
            Logout
          </button>
        </div>
      </div>

      {/* ── Tab bar ── */}
      <div className="bg-[#080d18] border-t border-white/5 shrink-0">
        <div className="flex">
          {(["MY TEAM", "STATS", "TABLE"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => { setTab(t); if (t === "TABLE") loadLeague(); }}
              className={cn(
                "flex-1 py-3 text-[10px] font-bold uppercase tracking-wide transition-colors border-b-2",
                tab === t ? "text-[#C7FF00] border-[#C7FF00]" : "text-gray-500 border-transparent",
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* ── Tab content ── */}
      <div className="flex-1 overflow-y-auto">

        {/* ── MY TEAM ── */}
        {tab === "MY TEAM" && (
          <div className="pb-8">
            {/* GW navigator + stats */}
            {(() => {
              const gwData = GW_HISTORY.find((g) => g.gw === viewGW) ?? GW_HISTORY[GW_HISTORY.length - 1];
              const isLive = viewGW === CURRENT_GW;
              return (
                <div className="bg-[#080d18] px-4 pt-3 pb-4">
                  {/* GW row */}
                  <div className="flex items-center justify-between mb-3">
                    <button
                      onClick={() => setViewGW((g) => Math.max(1, g - 1))}
                      disabled={viewGW === 1}
                      className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center disabled:opacity-30 transition-opacity"
                    >
                      <ChevronLeft size={16} className="text-white" />
                    </button>
                    <div className="flex items-center gap-2">
                      <span className="font-heading text-white text-[14px] uppercase tracking-wider">
                        Gameweek {viewGW}
                      </span>
                      {isLive && (
                        <span className="bg-[#C7FF00]/15 border border-[#C7FF00]/30 text-[#C7FF00] text-[8px] font-bold uppercase tracking-wider rounded-full px-2 py-0.5">
                          Live
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => setViewGW((g) => Math.min(CURRENT_GW, g + 1))}
                      disabled={viewGW === CURRENT_GW}
                      className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center disabled:opacity-30 transition-opacity"
                    >
                      <ChevronRight size={16} className="text-white" />
                    </button>
                  </div>
                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: "GW Points",  value: gwData.gwPoints.toString(),  color: "#C7FF00" },
                      { label: "Season Pts", value: gwData.seasonPts.toString(), color: "#C7FF00", large: true },
                      { label: "Rank",       value: `#${gwData.rank}`,           color: "#00D9FF" },
                    ].map(({ label, value, color, large }) => (
                      <div key={label} className="bg-white/5 rounded-xl py-3 text-center">
                        <p className={`font-heading leading-none ${large ? "text-3xl" : "text-xl"}`} style={{ color }}>{value}</p>
                        <p className="text-gray-500 text-[9px] uppercase tracking-wide mt-1">{label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}

            {swapFrom !== null && (
              <div className="mx-4 mt-3 rounded-xl bg-[#00D9FF]/10 border border-[#00D9FF]/30 px-4 py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ArrowLeftRight size={13} className="text-[#00D9FF]" />
                  <span className="text-[#00D9FF] text-[11px] font-bold uppercase tracking-wide">
                    Select a {SLOTS[swapFrom].pos} {SLOTS[swapFrom].isStarter ? "from bench" : "from starting XI"}
                  </span>
                </div>
                <button onClick={() => setSwapFrom(null)} className="w-6 h-6 bg-[#00D9FF]/20 rounded-full flex items-center justify-center">
                  <X size={12} className="text-[#00D9FF]" />
                </button>
              </div>
            )}

            {/* Pitch */}
            <div className="mx-4 mt-3 rounded-2xl overflow-hidden relative" style={{ background: "linear-gradient(175deg, #1e8c35 0%, #166b28 50%, #1a7a30 100%)" }}>
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 300 240" preserveAspectRatio="none">
                {[0,1,2,3,4,5].map((i) => <rect key={i} x="0" y={i*40} width="300" height="20" fill="rgba(0,0,0,0.04)" />)}
                <rect x="6"   y="6"   width="288" height="228" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" />
                <line x1="6"  y1="120" x2="294"  y2="120"     stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
                <circle cx="150" cy="120" r="30" fill="none"   stroke="rgba(255,255,255,0.2)"  strokeWidth="1" />
                <circle cx="150" cy="120" r="2"  fill="rgba(255,255,255,0.3)" />
                <rect x="88"  y="6"   width="124" height="40"  fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
                <rect x="112" y="6"   width="76"  height="18"  fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
                <rect x="88"  y="194" width="124" height="40"  fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
                <rect x="112" y="216" width="76"  height="18"  fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
                <rect x="6"   y="68"  width="12"  height="104" rx="2" fill="rgba(8,13,24,0.82)" />
                <text transform="rotate(-90 12 120)" x="12" y="120" textAnchor="middle" fontSize="5" fill="#C7FF00" fontFamily="Anton,sans-serif" letterSpacing="1.2">LA PERFUME</text>
                <rect x="282" y="68"  width="12"  height="104" rx="2" fill="rgba(8,13,24,0.82)" />
                <text transform="rotate(90 288 120)" x="288" y="120" textAnchor="middle" fontSize="5" fill="#C7FF00" fontFamily="Anton,sans-serif" letterSpacing="1.2">LA PERFUME</text>
              </svg>
              <div className="relative z-10 pt-8 pb-10 px-2">
                <div className="flex justify-around mb-6">
                  {starters.filter((s) => s.pos === "FWD").map((s) => (
                    <ViewSlot key={s.index} slotIdx={s.index} playerId={localIds[s.index]} captainId={captainId} vcId={vcId} swapFrom={swapFrom} onTap={() => handleSlotTap(s.index)} onPitch />
                  ))}
                </div>
                <div className="flex justify-around mb-6">
                  {starters.filter((s) => s.pos === "DEF").map((s) => (
                    <ViewSlot key={s.index} slotIdx={s.index} playerId={localIds[s.index]} captainId={captainId} vcId={vcId} swapFrom={swapFrom} onTap={() => handleSlotTap(s.index)} onPitch />
                  ))}
                </div>
                <div className="flex justify-center">
                  {starters.filter((s) => s.pos === "GK").map((s) => (
                    <ViewSlot key={s.index} slotIdx={s.index} playerId={localIds[s.index]} captainId={captainId} vcId={vcId} swapFrom={swapFrom} onTap={() => handleSlotTap(s.index)} onPitch />
                  ))}
                </div>
              </div>
            </div>

            {/* Subs bench */}
            <div className="mx-4 mt-2 bg-white rounded-2xl border border-gray-100 px-4 pt-2.5 pb-3">
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-4 rounded-full bg-gray-300" />
                  <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-gray-400">Substitutes</p>
                </div>
                <Link href="/fantasy/onboard" className="text-[10px] font-bold text-[#00D9FF] uppercase tracking-wide">Edit Squad →</Link>
              </div>
              <div className="flex justify-around">
                {subs.map((s) => (
                  <ViewSlot key={s.index} slotIdx={s.index} playerId={localIds[s.index]} captainId={captainId} vcId={vcId} swapFrom={swapFrom} onTap={() => handleSlotTap(s.index)} onPitch={false} />
                ))}
              </div>
            </div>

            {captainPlayer && (
              <div className="mx-4 mt-3 rounded-xl bg-[#C7FF00]/10 border border-[#C7FF00]/30 px-4 py-3 flex items-center gap-3">
                <div className="w-9 h-9 relative flex-shrink-0">
                  {getTeam(captainPlayer.teamId)?.badgeUrl && (
                    <Image src={getTeam(captainPlayer.teamId)!.badgeUrl!} alt="" fill className="object-contain" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[9px] text-gray-500 uppercase tracking-wide">Captain · 2× Points</p>
                  <p className="font-heading text-navy text-[14px] uppercase leading-none">{captainPlayer.name}</p>
                </div>
                <div className="w-7 h-7 rounded-full bg-[#C7FF00] flex items-center justify-center shrink-0">
                  <span className="font-heading text-[#080d18] text-[13px] leading-none">C</span>
                </div>
              </div>
            )}

            <div className="mx-4 mt-3 rounded-xl border border-dashed border-gray-200 px-4 py-3 flex items-center justify-between">
              <div>
                <p className="text-navy text-[12px] font-semibold">Edit your squad</p>
                <p className="text-gray-400 text-[10px] mt-0.5">Tap a player to swap starters/bench</p>
              </div>
              <Link href="/fantasy/onboard" className="text-[#00D9FF] text-[10px] font-bold uppercase tracking-wide flex items-center gap-1">
                Edit <ChevronRight size={12} />
              </Link>
            </div>
          </div>
        )}

        {/* ── STATS ── */}
        {tab === "STATS" && (
          <div className="pb-8">
            {/* Summary grid */}
            <div className="mx-4 mt-4 grid grid-cols-2 gap-2">
              {[
                { label: "Season Pts",    value: totalPts,      color: "#C7FF00" },
                { label: "Squad Goals",   value: squadGoals,    color: "#C7FF00" },
                { label: "Assists",       value: squadAssists,  color: "#00D9FF" },
                { label: "Clean Sheets",  value: squadCS,       color: "#00D9FF" },
              ].map(({ label, value, color }) => (
                <div key={label} className="bg-white rounded-xl border border-gray-100 px-4 py-3.5 text-center">
                  <p className="font-heading text-3xl leading-none" style={{ color }}>{value}</p>
                  <p className="text-gray-400 text-[9px] uppercase tracking-wide mt-1.5">{label}</p>
                </div>
              ))}
            </div>

            {/* Player stats table */}
            <div className="px-4 mt-4">
              <div className="flex items-center mb-2 px-1">
                <span className="flex-1 text-[9px] font-bold text-gray-400 uppercase">Player</span>
                <span className="w-7 text-center text-[9px] font-bold text-gray-400">G</span>
                <span className="w-7 text-center text-[9px] font-bold text-[#00D9FF]">A</span>
                <span className="w-7 text-center text-[9px] font-bold text-[#00D9FF]">CS</span>
                <span className="w-10 text-right text-[9px] font-bold text-gray-400">PTS</span>
              </div>
              {[...localIds]
                .map((id) => MOCK_FANTASY_PLAYERS.find((p) => p.id === id))
                .filter(Boolean)
                .sort((a, b) => b!.totalPoints - a!.totalPoints)
                .map((p) => {
                  const team  = getTeam(p!.teamId);
                  const isCap = p!.id === captainId;
                  const isVC  = p!.id === vcId && !isCap;
                  const slot  = SLOTS.find((s) => localIds[s.index] === p!.id);
                  const isSub = slot ? !slot.isStarter : false;
                  return (
                    <div key={p!.id} className="flex items-center gap-2 bg-white rounded-xl border border-gray-100 px-3 py-2.5 mb-1.5">
                      <div className="w-8 h-8 relative shrink-0">
                        {team?.badgeUrl && <Image src={team.badgeUrl} alt="" fill className="object-contain" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="text-navy font-semibold text-[12px] leading-none truncate">{p!.name}</p>
                          {isCap && <span className="font-heading text-[7px] text-[#080d18] bg-[#C7FF00] rounded px-1 py-0.5 leading-none">C</span>}
                          {isVC  && <span className="font-heading text-[7px] text-[#080d18] bg-[#00D9FF] rounded px-1 py-0.5 leading-none">V</span>}
                          {isSub && <span className="text-[7px] text-gray-400 border border-gray-200 rounded px-1 leading-none py-0.5">SUB</span>}
                        </div>
                        <p className="text-gray-400 text-[9px] mt-0.5">{team?.shortName} · {p!.position}</p>
                      </div>
                      <span className="w-7 text-center font-heading text-navy text-[12px]">{p!.goals}</span>
                      <span className="w-7 text-center font-heading text-[#00D9FF] text-[12px]">{p!.assists}</span>
                      <span className="w-7 text-center font-heading text-[#00D9FF] text-[12px]">
                        {(p!.position === "GK" || p!.position === "DEF") ? p!.cleanSheets : "—"}
                      </span>
                      <span className="w-10 text-right font-heading text-navy text-[13px]">{p!.totalPoints}</span>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* ── TABLE ── */}
        {tab === "TABLE" && (
          <div className="pb-8">
            {/* League header card */}
            <div className="mx-4 mt-4 rounded-2xl bg-[#080d18] px-4 py-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#C7FF00]/10 border border-[#C7FF00]/20 flex items-center justify-center shrink-0">
                <Trophy size={20} style={{ color: "#C7FF00" }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-heading text-white text-[15px] uppercase leading-none">KEFA KCL 2026</p>
                <p className="text-gray-500 text-[10px] mt-0.5">Mini League · {leagueEntries.length} managers</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-gray-500 text-[9px] uppercase">Your rank</p>
                <p className="font-heading text-[#C7FF00] text-xl leading-none">
                  #{leagueEntries.find((e) => e.isUser)?.rank ?? "—"}
                </p>
              </div>
            </div>

            {/* Column headers */}
            <div className="mx-4 mt-3 flex items-center px-3 mb-1">
              <span className="w-7 text-[9px] font-bold text-gray-400 uppercase">#</span>
              <span className="flex-1 text-[9px] font-bold text-gray-400 uppercase">Manager</span>
              <span className="w-10 text-right text-[9px] font-bold text-gray-400 uppercase">GW</span>
              <span className="w-12 text-right text-[9px] font-bold text-gray-400 uppercase">Total</span>
            </div>

            {/* Standings rows */}
            <div className="px-4">
              {leagueEntries.map((entry) => {
                const medal = entry.rank === 1 ? "#C7FF00" : entry.rank === 2 ? "#00D9FF" : entry.rank === 3 ? "#F59E0B" : null;
                return (
                  <button
                    key={entry.id}
                    onClick={() => setLeagueView(entry.id)}
                    className={cn(
                      "w-full flex items-center gap-2 rounded-xl px-3 py-2.5 mb-1.5 text-left transition-all",
                      entry.isUser ? "bg-[#C7FF00]/10 border border-[#C7FF00]/30" : "bg-white border border-gray-100",
                    )}
                  >
                    <div className="w-7 shrink-0 flex items-center justify-center">
                      {medal
                        ? <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: medal }}>
                            <span className="font-heading text-[#080d18] text-[9px] leading-none">{entry.rank}</span>
                          </div>
                        : <span className="text-gray-400 text-[11px] font-bold">{entry.rank}</span>
                      }
                    </div>

                    <div
                      className="w-8 h-8 rounded-lg font-heading text-[11px] flex items-center justify-center text-[#080d18] shrink-0"
                      style={{ backgroundColor: entry.avatarColor }}
                    >
                      {entry.managerName.slice(0, 2).toUpperCase()}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className={cn("font-semibold text-[12px] leading-none truncate", entry.isUser ? "text-navy" : "text-navy")}>
                        {entry.teamName}
                      </p>
                      <p className="text-gray-400 text-[9px] mt-0.5 truncate">{entry.managerName}</p>
                    </div>

                    <div className="w-10 text-right shrink-0">
                      <span className="text-gray-400 text-[11px] font-semibold">{entry.gwPoints}</span>
                    </div>
                    <div className="w-12 text-right shrink-0">
                      <span className={cn("font-heading text-[14px]", entry.isUser ? "text-[#C7FF00]" : "text-navy")}>
                        {entry.totalPoints}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ── MY TEAM action sheet ── */}
      {actionSlot !== null && (() => {
        const pid   = localIds[actionSlot] ?? "";
        const p     = MOCK_FANTASY_PLAYERS.find((x) => x.id === pid);
        const team  = p ? getTeam(p.teamId) : null;
        const slot  = SLOTS[actionSlot];
        const isCap = pid === captainId;
        const isVC  = pid === vcId;
        const hasSwapTarget = SLOTS.some((s) => s.index !== actionSlot && s.pos === slot.pos && s.isStarter !== slot.isStarter && !!localIds[s.index]);
        return (
          <div className="absolute inset-0 bg-black/40 z-40 flex flex-col justify-end" onClick={() => setActionSlot(null)}>
            <div className="bg-white rounded-t-2xl px-5 pt-4 pb-8" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 relative flex-shrink-0">
                  {team?.badgeUrl && <Image src={team.badgeUrl} alt="" fill className="object-contain" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-navy text-[15px]">{p?.name}</p>
                  <p className="text-gray-400 text-[11px]">{team?.shortName} · {p?.totalPoints} pts</p>
                </div>
                <button onClick={() => setActionSlot(null)} className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center">
                  <X size={14} className="text-gray-500" />
                </button>
              </div>
              {slot.isStarter && (
                <button onClick={() => handleSetCaptain(pid)} className="w-full flex items-center gap-3 py-3.5 border-b border-gray-100">
                  <Crown size={16} style={{ color: isCap ? "#C7FF00" : "#9ca3af" }} />
                  <span className="text-navy font-semibold text-[14px]">{isCap ? "Remove Captain" : "Make Captain (2× pts)"}</span>
                  {isCap && <span className="ml-auto text-[10px] text-[#C7FF00] font-bold">Active</span>}
                </button>
              )}
              {slot.isStarter && !isCap && (
                <button onClick={() => handleSetVC(pid)} className="w-full flex items-center gap-3 py-3.5 border-b border-gray-100">
                  <Star size={16} style={{ color: isVC ? "#00D9FF" : "#9ca3af" }} />
                  <span className="text-navy font-semibold text-[14px]">{isVC ? "Remove Vice Captain" : "Make Vice Captain"}</span>
                  {isVC && <span className="ml-auto text-[10px] text-[#00D9FF] font-bold">Active</span>}
                </button>
              )}
              {hasSwapTarget && (
                <button onClick={() => startSwap(actionSlot)} className="w-full flex items-center gap-3 py-3.5 border-b border-gray-100">
                  <ArrowLeftRight size={16} className="text-gray-400" />
                  <span className="text-navy font-semibold text-[14px]">{slot.isStarter ? "Swap with Bench" : "Move to Starting XI"}</span>
                </button>
              )}
              <Link href={`/fantasy/player/${pid}`} onClick={() => setActionSlot(null)} className="w-full flex items-center gap-3 py-3.5 border-b border-gray-100">
                <ChevronRight size={16} className="text-gray-400" />
                <span className="text-navy font-semibold text-[14px]">View Profile</span>
              </Link>
              <Link href="/fantasy/onboard" onClick={() => setActionSlot(null)} className="w-full flex items-center gap-3 py-3.5">
                <RefreshCw size={16} className="text-gray-400" />
                <span className="text-gray-500 font-semibold text-[14px]">Edit Full Squad</span>
              </Link>
            </div>
          </div>
        );
      })()}

      {/* ── League team viewer ── */}
      {leagueView !== null && (() => {
        const entry = leagueEntries.find((e) => e.id === leagueView);
        if (!entry) return null;
        const eStarters = SLOTS.filter((s) => s.isStarter);
        const eSubs     = SLOTS.filter((s) => !s.isStarter);
        const capPlayer = MOCK_FANTASY_PLAYERS.find((p) => p.id === entry.captainId);
        const capTeam   = capPlayer ? getTeam(capPlayer.teamId) : null;
        return (
          <div className="absolute inset-0 bg-[#f5f7fa] z-50 flex flex-col overflow-hidden">
            {/* Header */}
            <div className="bg-[#080d18] px-5 pt-5 pb-4 shrink-0">
              <div className="flex items-center gap-3 mb-4">
                <button onClick={() => setLeagueView(null)} className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                  <ChevronLeft size={18} className="text-white" />
                </button>
                <div
                  className="w-9 h-9 rounded-xl font-heading text-sm flex items-center justify-center text-[#080d18] shrink-0"
                  style={{ backgroundColor: entry.avatarColor }}
                >
                  {entry.managerName.slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-heading text-white text-[15px] uppercase leading-none truncate">{entry.teamName}</p>
                  <p className="text-gray-500 text-[10px] mt-0.5">{entry.managerName}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-heading text-[#C7FF00] text-xl leading-none">{entry.totalPoints}</p>
                  <p className="text-gray-500 text-[8px] uppercase">Season pts</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: "GW Points",  value: entry.gwPoints.toString(), color: "#C7FF00" },
                  { label: "Season Pts", value: entry.totalPoints.toString(), color: "#C7FF00" },
                  { label: "Rank",       value: `#${entry.rank}`,           color: "#00D9FF" },
                ].map(({ label, value, color }) => (
                  <div key={label} className="bg-white/5 rounded-xl py-2.5 text-center">
                    <p className="font-heading text-lg leading-none" style={{ color }}>{value}</p>
                    <p className="text-gray-500 text-[8px] uppercase tracking-wide mt-1">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Pitch + bench */}
            <div className="flex-1 overflow-y-auto pb-6">
              {/* Pitch */}
              <div className="mx-4 mt-3 rounded-2xl overflow-hidden relative" style={{ background: "linear-gradient(175deg, #1e8c35 0%, #166b28 50%, #1a7a30 100%)" }}>
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 300 240" preserveAspectRatio="none">
                  {[0,1,2,3,4,5].map((i) => <rect key={i} x="0" y={i*40} width="300" height="20" fill="rgba(0,0,0,0.04)" />)}
                  <rect x="6"   y="6"   width="288" height="228" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" />
                  <line x1="6"  y1="120" x2="294"  y2="120"     stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
                  <circle cx="150" cy="120" r="30" fill="none"   stroke="rgba(255,255,255,0.2)"  strokeWidth="1" />
                  <circle cx="150" cy="120" r="2"  fill="rgba(255,255,255,0.3)" />
                  <rect x="88"  y="6"   width="124" height="40"  fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
                  <rect x="112" y="6"   width="76"  height="18"  fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
                  <rect x="88"  y="194" width="124" height="40"  fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
                  <rect x="112" y="216" width="76"  height="18"  fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
                  <rect x="6"   y="68"  width="12"  height="104" rx="2" fill="rgba(8,13,24,0.82)" />
                  <text transform="rotate(-90 12 120)" x="12" y="120" textAnchor="middle" fontSize="5" fill="#C7FF00" fontFamily="Anton,sans-serif" letterSpacing="1.2">LA PERFUME</text>
                  <rect x="282" y="68"  width="12"  height="104" rx="2" fill="rgba(8,13,24,0.82)" />
                  <text transform="rotate(90 288 120)" x="288" y="120" textAnchor="middle" fontSize="5" fill="#C7FF00" fontFamily="Anton,sans-serif" letterSpacing="1.2">LA PERFUME</text>
                </svg>
                <div className="relative z-10 pt-8 pb-10 px-2">
                  <div className="flex justify-around mb-6">
                    {eStarters.filter((s) => s.pos === "FWD").map((s) => (
                      <ViewSlot key={s.index} slotIdx={s.index} playerId={entry.playerIds[s.index] ?? ""} captainId={entry.captainId} vcId="" swapFrom={null} onTap={() => {}} onPitch />
                    ))}
                  </div>
                  <div className="flex justify-around mb-6">
                    {eStarters.filter((s) => s.pos === "DEF").map((s) => (
                      <ViewSlot key={s.index} slotIdx={s.index} playerId={entry.playerIds[s.index] ?? ""} captainId={entry.captainId} vcId="" swapFrom={null} onTap={() => {}} onPitch />
                    ))}
                  </div>
                  <div className="flex justify-center">
                    {eStarters.filter((s) => s.pos === "GK").map((s) => (
                      <ViewSlot key={s.index} slotIdx={s.index} playerId={entry.playerIds[s.index] ?? ""} captainId={entry.captainId} vcId="" swapFrom={null} onTap={() => {}} onPitch />
                    ))}
                  </div>
                </div>
              </div>

              {/* Subs */}
              <div className="mx-4 mt-2 bg-white rounded-2xl border border-gray-100 px-4 pt-2.5 pb-3">
                <div className="flex items-center gap-2 mb-2.5">
                  <div className="w-1 h-4 rounded-full bg-gray-300" />
                  <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-gray-400">Substitutes</p>
                </div>
                <div className="flex justify-around">
                  {eSubs.map((s) => (
                    <ViewSlot key={s.index} slotIdx={s.index} playerId={entry.playerIds[s.index] ?? ""} captainId={entry.captainId} vcId="" swapFrom={null} onTap={() => {}} onPitch={false} />
                  ))}
                </div>
              </div>

              {/* Captain callout */}
              {capPlayer && (
                <div className="mx-4 mt-3 rounded-xl bg-[#C7FF00]/10 border border-[#C7FF00]/30 px-4 py-3 flex items-center gap-3">
                  <div className="w-9 h-9 relative shrink-0">
                    {capTeam?.badgeUrl && <Image src={capTeam.badgeUrl} alt="" fill className="object-contain" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[9px] text-gray-500 uppercase tracking-wide">Captain · 2× Points</p>
                    <p className="font-heading text-navy text-[14px] uppercase leading-none">{capPlayer.name}</p>
                  </div>
                  <div className="w-7 h-7 rounded-full bg-[#C7FF00] flex items-center justify-center shrink-0">
                    <span className="font-heading text-[#080d18] text-[13px] leading-none">C</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })()}
    </div>
  );
}
