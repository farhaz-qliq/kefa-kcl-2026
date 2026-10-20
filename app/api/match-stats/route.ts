import { type NextRequest } from "next/server";
import { requireDB, ok, fail, unauthorized, isAdmin, toDocs } from "@/lib/api";
import { MatchStatsModel } from "@/lib/models";

export async function GET(req: NextRequest) {
  await requireDB();
  const fixtureId = req.nextUrl.searchParams.get("fixtureId");
  if (!fixtureId) return fail("fixtureId query param required");
  const docs = await MatchStatsModel.find({ fixtureId }).lean();
  return ok(toDocs(docs));
}

// Bulk save — replaces all stats for a fixture
export async function POST(req: NextRequest) {
  if (!isAdmin(req)) return unauthorized();
  await requireDB();

  const body = await req.json().catch(() => null);
  if (!body?.fixtureId || !Array.isArray(body.stats)) {
    return fail("fixtureId and stats[] required");
  }

  const { fixtureId, stats } = body as {
    fixtureId: string;
    stats: Array<{
      playerId: string;
      goals: number;
      assists: number;
      yellowCards: number;
      redCards: number;
      isMotm: boolean;
    }>;
  };

  // Delete existing stats for this fixture then re-insert
  await MatchStatsModel.deleteMany({ fixtureId });

  if (stats.length > 0) {
    const docs = stats.map((s, i) => ({
      _id:         `ms-${fixtureId}-${i}`,
      fixtureId,
      playerId:    s.playerId,
      goals:       s.goals       ?? 0,
      assists:     s.assists     ?? 0,
      yellowCards: s.yellowCards ?? 0,
      redCards:    s.redCards    ?? 0,
      isMotm:      s.isMotm      ?? false,
    }));
    await MatchStatsModel.insertMany(docs);
  }

  const saved = await MatchStatsModel.find({ fixtureId }).lean();
  return ok(toDocs(saved), 201);
}
