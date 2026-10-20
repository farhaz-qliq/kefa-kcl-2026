import type { Fixture, GroupName } from "@/types";

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
  // Group A
  { id: "f1",  home: "t1", away: "t2", group: "A", date: "2026-10-01", time: "18:00", status: "finished", hs: 3, as: 1 },
  { id: "f2",  home: "t3", away: "t4", group: "A", date: "2026-10-01", time: "20:00", status: "finished", hs: 2, as: 2 },
  { id: "f3",  home: "t1", away: "t3", group: "A", date: "2026-10-05", time: "18:00", status: "finished", hs: 1, as: 0 },
  { id: "f4",  home: "t2", away: "t4", group: "A", date: "2026-10-05", time: "20:00", status: "finished", hs: 4, as: 2 },
  { id: "f5",  home: "t1", away: "t4", group: "A", date: "2026-10-10", time: "18:00", status: "live",     hs: 2, as: 1 },
  { id: "f6",  home: "t2", away: "t3", group: "A", date: "2026-10-10", time: "20:00", status: "scheduled", hs: null, as: null },
  // Group B
  { id: "f7",  home: "t5", away: "t6", group: "B", date: "2026-10-02", time: "18:00", status: "finished", hs: 2, as: 3 },
  { id: "f8",  home: "t7", away: "t8", group: "B", date: "2026-10-02", time: "20:00", status: "finished", hs: 1, as: 1 },
  { id: "f9",  home: "t5", away: "t7", group: "B", date: "2026-10-06", time: "18:00", status: "finished", hs: 3, as: 0 },
  { id: "f10", home: "t6", away: "t8", group: "B", date: "2026-10-06", time: "20:00", status: "finished", hs: 2, as: 2 },
  { id: "f11", home: "t5", away: "t8", group: "B", date: "2026-10-11", time: "18:00", status: "scheduled", hs: null, as: null },
  { id: "f12", home: "t6", away: "t7", group: "B", date: "2026-10-11", time: "20:00", status: "scheduled", hs: null, as: null },
  // Group C
  { id: "f13", home: "t9",  away: "t10", group: "C", date: "2026-10-03", time: "18:00", status: "finished", hs: 0, as: 2 },
  { id: "f14", home: "t11", away: "t12", group: "C", date: "2026-10-03", time: "20:00", status: "finished", hs: 3, as: 1 },
  { id: "f15", home: "t9",  away: "t11", group: "C", date: "2026-10-07", time: "18:00", status: "finished", hs: 1, as: 1 },
  { id: "f16", home: "t10", away: "t12", group: "C", date: "2026-10-07", time: "20:00", status: "finished", hs: 2, as: 0 },
  { id: "f17", home: "t9",  away: "t12", group: "C", date: "2026-10-12", time: "18:00", status: "scheduled", hs: null, as: null },
  { id: "f18", home: "t10", away: "t11", group: "C", date: "2026-10-12", time: "20:00", status: "scheduled", hs: null, as: null },
  // Group D
  { id: "f19", home: "t13", away: "t14", group: "D", date: "2026-10-04", time: "18:00", status: "finished", hs: 2, as: 2 },
  { id: "f20", home: "t15", away: "t16", group: "D", date: "2026-10-04", time: "20:00", status: "finished", hs: 1, as: 3 },
  { id: "f21", home: "t13", away: "t15", group: "D", date: "2026-10-08", time: "18:00", status: "finished", hs: 4, as: 1 },
  { id: "f22", home: "t14", away: "t16", group: "D", date: "2026-10-08", time: "20:00", status: "finished", hs: 3, as: 2 },
  { id: "f23", home: "t13", away: "t16", group: "D", date: "2026-10-13", time: "18:00", status: "scheduled", hs: null, as: null },
  { id: "f24", home: "t14", away: "t15", group: "D", date: "2026-10-13", time: "20:00", status: "scheduled", hs: null, as: null },
];

export const MOCK_FIXTURES: Fixture[] = seeds.map((s) => ({
  id: s.id,
  homeTeamId: s.home,
  awayTeamId: s.away,
  groupId: s.group,
  date: s.date,
  time: s.time,
  venue: "KCL Arena, Dubai",
  status: s.status,
  homeScore: s.hs,
  awayScore: s.as,
  season: "2026",
}));
