export type Season = "2026";

export type Position = "GK" | "DEF" | "MID" | "FWD";

export type FixtureStatus = "scheduled" | "live" | "finished";

export type GroupName = "A" | "B" | "C" | "D";

export interface Team {
  id: string;
  name: string;
  shortName: string;
  logo: string;
  badgeUrl?: string;
  groupId: GroupName;
  season: Season;
  primaryColor: string;
}

export interface Player {
  id: string;
  teamId: string;
  name: string;
  number: number;
  position: Position;
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
  season: Season;
}

export interface Group {
  id: GroupName;
  name: string;
  season: Season;
}

export interface Fixture {
  id: string;
  homeTeamId: string;
  awayTeamId: string;
  groupId: GroupName;
  date: string;
  time: string;
  venue: string;
  status: FixtureStatus;
  homeScore: number | null;
  awayScore: number | null;
  season: Season;
}

export interface StandingRow {
  teamId: string;
  teamName: string;
  shortName: string;
  groupId: GroupName;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
  imageUrl: string;
  season: Season;
}

export interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  imageUrl: string;
  publishedAt: string;
  season: Season;
}

export interface MatchStats {
  id: string;
  fixtureId: string;
  playerId: string;
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
  isMotm: boolean;
}
