import type { Fixture, GroupName } from "@/types";

// Venue: Star International School Ground, Dubai
// All times are UAE local time (24h) — converted from PM schedule
// Masters fixtures (MA/MB/MC/MD) excluded — KCL Youth only
// Teams:
//  Group A: t1=FAVF, t2=ABR, t3=HIM, t4=HGGH
//  Group B: t5=YAS,  t6=RMS, t7=LGA, t8=KEY
//  Group C: t9=RIV,  t10=THA, t11=YBID, t12=LSS
//  Group D: t13=SPU, t14=DDP, t15=FAM, t16=GTZ

type FixtureSeed = {
  id: string;
  home: string;
  away: string;
  group: GroupName;
  date: string;
  time: string;
  status: Fixture["status"];
  hs: number | null;
  as: number | null;
};

const seeds: FixtureSeed[] = [

  // ── GW 1 · Saturday 24 October 2026 ─────────────────────────────────────────
  { id: "f1",  home: "t1",  away: "t2",  group: "A", date: "2026-10-24", time: "21:30", status: "scheduled", hs: null, as: null },
  // Frangulf Advocates Valluvanad FC vs Abreco Freight FC

  { id: "f2",  home: "t5",  away: "t6",  group: "B", date: "2026-10-24", time: "22:20", status: "scheduled", hs: null, as: null },
  // Yasmed RAK L7 FC vs RM Sporting

  { id: "f3",  home: "t11", away: "t12", group: "C", date: "2026-10-24", time: "23:00", status: "scheduled", hs: null, as: null },
  // Yusuf Bhai I Docs FC vs Little Star Strikers

  { id: "f4",  home: "t13", away: "t14", group: "D", date: "2026-10-24", time: "23:50", status: "scheduled", hs: null, as: null },
  // Shooters Padne UAE vs DDP Freight Hustlers FC

  // ── GW 1 · Sunday 25 October 2026 ───────────────────────────────────────────
  { id: "f5",  home: "t3",  away: "t4",  group: "A", date: "2026-10-25", time: "17:50", status: "scheduled", hs: null, as: null },
  // Himalayacool Arakkal FC vs Hala Group Gold Hill Arab

  { id: "f6",  home: "t7",  away: "t8",  group: "B", date: "2026-10-25", time: "18:40", status: "scheduled", hs: null, as: null },
  // Leen Group G7 Al Ain vs Keynes FC

  { id: "f7",  home: "t9",  away: "t10", group: "C", date: "2026-10-25", time: "20:20", status: "scheduled", hs: null, as: null },
  // Riviere Water Ezhimala vs Thabbey Sporting

  { id: "f8",  home: "t15", away: "t16", group: "D", date: "2026-10-25", time: "21:10", status: "scheduled", hs: null, as: null },
  // Team Famous vs GTZ Shipping FC

  // ── GW 2 · Sunday 01 November 2026 ──────────────────────────────────────────
  { id: "f9",  home: "t6",  away: "t8",  group: "B", date: "2026-11-01", time: "17:00", status: "scheduled", hs: null, as: null },
  // RM Sporting vs Keynes FC

  { id: "f10", home: "t13", away: "t15", group: "D", date: "2026-11-01", time: "17:50", status: "scheduled", hs: null, as: null },
  // Shooters Padne UAE vs Team Famous

  { id: "f11", home: "t2",  away: "t4",  group: "A", date: "2026-11-01", time: "18:40", status: "scheduled", hs: null, as: null },
  // Abreco Freight FC vs Hala Group Gold Hill Arab

  { id: "f12", home: "t9",  away: "t11", group: "C", date: "2026-11-01", time: "19:30", status: "scheduled", hs: null, as: null },
  // Riviere Water Ezhimala vs Yusuf Bhai I Docs FC

  { id: "f13", home: "t1",  away: "t3",  group: "A", date: "2026-11-01", time: "20:20", status: "scheduled", hs: null, as: null },
  // Frangulf Advocates Valluvanad FC vs Himalayacool Arakkal FC

  { id: "f14", home: "t10", away: "t12", group: "C", date: "2026-11-01", time: "21:10", status: "scheduled", hs: null, as: null },
  // Thabbey Sporting vs Little Star Strikers

  { id: "f15", home: "t5",  away: "t7",  group: "B", date: "2026-11-01", time: "22:00", status: "scheduled", hs: null, as: null },
  // Yasmed RAK L7 FC vs Leen Group G7 Al Ain

  // ── GW 3 · Saturday 07 November 2026 ────────────────────────────────────────
  { id: "f16", home: "t1",  away: "t4",  group: "A", date: "2026-11-07", time: "22:50", status: "scheduled", hs: null, as: null },
  // Frangulf Advocates Valluvanad FC vs Hala Group Gold Hill Arab

  // ── GW 3 · Sunday 08 November 2026 ──────────────────────────────────────────
  { id: "f17", home: "t9",  away: "t12", group: "C", date: "2026-11-08", time: "18:40", status: "scheduled", hs: null, as: null },
  // Riviere Water Ezhimala vs Little Star Strikers

  { id: "f18", home: "t5",  away: "t8",  group: "B", date: "2026-11-08", time: "19:30", status: "scheduled", hs: null, as: null },
  // Yasmed RAK L7 FC vs Keynes FC

  { id: "f19", home: "t2",  away: "t3",  group: "A", date: "2026-11-08", time: "20:20", status: "scheduled", hs: null, as: null },
  // Abreco Freight FC vs Himalayacool Arakkal FC

  { id: "f20", home: "t14", away: "t16", group: "D", date: "2026-11-08", time: "21:10", status: "scheduled", hs: null, as: null },
  // DDP Freight Hustlers FC vs GTZ Shipping FC

  { id: "f21", home: "t6",  away: "t7",  group: "B", date: "2026-11-08", time: "22:00", status: "scheduled", hs: null, as: null },
  // RM Sporting vs Leen Group G7 Al Ain

  // ── GW 4 · Sunday 15 November 2026 ──────────────────────────────────────────
  { id: "f22", home: "t14", away: "t15", group: "D", date: "2026-11-15", time: "18:40", status: "scheduled", hs: null, as: null },
  // DDP Freight Hustlers FC vs Team Famous

  { id: "f23", home: "t13", away: "t16", group: "D", date: "2026-11-15", time: "20:20", status: "scheduled", hs: null, as: null },
  // Shooters Padne UAE vs GTZ Shipping FC

  { id: "f24", home: "t10", away: "t11", group: "C", date: "2026-11-15", time: "21:10", status: "scheduled", hs: null, as: null },
  // Thabbey Sporting vs Yusuf Bhai I Docs FC

  // ── QF Day 1 · Saturday 28 November 2026 (Youth) ────────────────────────────
  // Youth QF1: Group A Winner vs Group B Runner-up  — 22:00  (teams TBD)
  // Masters QF1 & QF2 same day (excluded)

  // ── QF Day 2 · Sunday 29 November 2026 (Youth) ──────────────────────────────
  // Youth QF2: Group B Winner vs Group A Runner-up  — 17:50  (teams TBD)
  // Youth QF3: Group C Winner vs Group D Runner-up  — 18:40  (teams TBD)
  // Youth QF4: Group D Winner vs Group C Runner-up  — 20:20  (teams TBD)

  // ── Semi Finals · Wednesday 02 December 2026 ────────────────────────────────
  // Youth SF1 — 18:00  (teams TBD)
  // Youth SF2 — 20:00  (teams TBD)

  // ── Finals Day · Sunday 06 December 2026 ────────────────────────────────────
  // Youth 3rd Place Playoff — 17:00  (teams TBD)
  // Youth Final             — 19:00  (teams TBD)
];

export const MOCK_FIXTURES: Fixture[] = seeds.map((s) => ({
  id:         s.id,
  homeTeamId: s.home,
  awayTeamId: s.away,
  groupId:    s.group,
  date:       s.date,
  time:       s.time,
  venue:      "Star International School Ground, Dubai",
  status:     s.status,
  homeScore:  s.hs,
  awayScore:  s.as,
  season:     "2026",
}));
