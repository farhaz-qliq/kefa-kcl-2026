import type { Team, Player, Group, Fixture, StandingRow, Banner, NewsItem, GroupName } from "@/types";
import { MOCK_TEAMS, MOCK_PLAYERS, MOCK_FIXTURES, MOCK_GROUPS, MOCK_BANNERS, MOCK_NEWS } from "@/mocks";
import { connectDB } from "./mongodb";
import { TeamModel, PlayerModel, GroupModel, FixtureModel, BannerModel, NewsModel } from "./models";

// ── Connection helper ──────────────────────────────────────────────────────

async function db(): Promise<boolean> {
  if (!process.env.MONGODB_URI) return false;
  try {
    await connectDB();
    return true;
  } catch {
    console.warn("[data] MongoDB unavailable — falling back to mock data");
    return false;
  }
}

// Lean documents have _id instead of id; remap for TypeScript types.
function withId<T extends object>(doc: T & { _id: string }): T & { id: string } {
  const { _id, ...rest } = doc;
  return { id: _id, ...rest } as T & { id: string };
}

// ── Teams ──────────────────────────────────────────────────────────────────

export async function getTeams(): Promise<Team[]> {
  if (await db()) {
    const docs = await TeamModel.find({}).lean();
    return docs.map(withId) as Team[];
  }
  return MOCK_TEAMS;
}

export async function getTeamById(id: string): Promise<Team | undefined> {
  if (await db()) {
    const doc = await TeamModel.findById(id).lean();
    return doc ? (withId(doc) as Team) : undefined;
  }
  return MOCK_TEAMS.find((t) => t.id === id);
}

// ── Players ────────────────────────────────────────────────────────────────

export async function getPlayers(): Promise<Player[]> {
  if (await db()) {
    const docs = await PlayerModel.find({}).lean();
    return docs.map(withId) as Player[];
  }
  return MOCK_PLAYERS;
}

export async function getPlayersByTeam(teamId: string): Promise<Player[]> {
  if (await db()) {
    const docs = await PlayerModel.find({ teamId }).lean();
    return docs.map(withId) as Player[];
  }
  return MOCK_PLAYERS.filter((p) => p.teamId === teamId);
}

export async function getPlayerById(id: string): Promise<Player | undefined> {
  if (await db()) {
    const doc = await PlayerModel.findById(id).lean();
    return doc ? (withId(doc) as Player) : undefined;
  }
  return MOCK_PLAYERS.find((p) => p.id === id);
}

// ── Groups ─────────────────────────────────────────────────────────────────

export async function getGroups(): Promise<Group[]> {
  if (await db()) {
    const docs = await GroupModel.find({}).lean();
    return docs.map(withId) as Group[];
  }
  return MOCK_GROUPS;
}

// ── Fixtures ───────────────────────────────────────────────────────────────

export async function getFixtures(groupId?: GroupName): Promise<Fixture[]> {
  if (await db()) {
    const query = groupId ? { groupId } : {};
    const docs = await FixtureModel.find(query).lean();
    return docs.map(withId) as Fixture[];
  }
  if (groupId) return MOCK_FIXTURES.filter((f) => f.groupId === groupId);
  return MOCK_FIXTURES;
}

export async function getFixturesByTeam(teamId: string): Promise<Fixture[]> {
  if (await db()) {
    const docs = await FixtureModel.find({ $or: [{ homeTeamId: teamId }, { awayTeamId: teamId }] }).lean();
    return docs.map(withId) as Fixture[];
  }
  return MOCK_FIXTURES.filter((f) => f.homeTeamId === teamId || f.awayTeamId === teamId);
}

// ── Banners ────────────────────────────────────────────────────────────────

export async function getBanners(): Promise<Banner[]> {
  if (await db()) {
    const docs = await BannerModel.find({}).lean();
    return docs.map(withId) as Banner[];
  }
  return MOCK_BANNERS;
}

// ── News ───────────────────────────────────────────────────────────────────

export async function getNews(): Promise<NewsItem[]> {
  if (await db()) {
    const docs = await NewsModel.find({}).sort({ publishedAt: -1 }).lean();
    return docs.map(withId) as NewsItem[];
  }
  return MOCK_NEWS;
}

// ── Standings (computed, not stored) ──────────────────────────────────────

export async function getStandings(groupId?: GroupName): Promise<Record<GroupName, StandingRow[]>> {
  const groups: GroupName[] = groupId ? [groupId] : ["A", "B", "C", "D"];
  const [allTeams, allFixtures] = await Promise.all([getTeams(), getFixtures()]);
  const result = {} as Record<GroupName, StandingRow[]>;

  for (const gid of groups) {
    const groupTeams    = allTeams.filter((t) => t.groupId === gid);
    const groupFixtures = allFixtures.filter((f) => f.groupId === gid && f.status === "finished");

    const rows: StandingRow[] = groupTeams.map((team) => {
      let W = 0, D = 0, L = 0, GF = 0, GA = 0;
      for (const fix of groupFixtures) {
        const isHome = fix.homeTeamId === team.id;
        const isAway = fix.awayTeamId === team.id;
        if (!isHome && !isAway) continue;
        const hs  = fix.homeScore ?? 0;
        const as_ = fix.awayScore ?? 0;
        GF += isHome ? hs  : as_;
        GA += isHome ? as_ : hs;
        const myGoals  = isHome ? hs  : as_;
        const oppGoals = isHome ? as_ : hs;
        if (myGoals > oppGoals) W++;
        else if (myGoals === oppGoals) D++;
        else L++;
      }
      return {
        teamId:         team.id,
        teamName:       team.name,
        shortName:      team.shortName,
        groupId:        gid,
        played:         W + D + L,
        won:            W,
        drawn:          D,
        lost:           L,
        goalsFor:       GF,
        goalsAgainst:   GA,
        goalDifference: GF - GA,
        points:         W * 3 + D,
      };
    });

    rows.sort((a, b) => {
      if (b.points         !== a.points)         return b.points         - a.points;
      if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
      return b.goalsFor - a.goalsFor;
    });

    result[gid] = rows;
  }

  return result;
}

// ── Top Scorers ────────────────────────────────────────────────────────────

export async function getTopScorers(limit = 10): Promise<Player[]> {
  if (await db()) {
    const docs = await PlayerModel.find({}).sort({ goals: -1 }).limit(limit).lean();
    return docs.map(withId) as Player[];
  }
  return [...MOCK_PLAYERS].sort((a, b) => b.goals - a.goals).slice(0, limit);
}
