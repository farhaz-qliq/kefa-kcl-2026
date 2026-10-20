import { type NextRequest } from "next/server";
import { z } from "zod";
import { requireDB, ok, fail } from "@/lib/api";
import { TeamModel, FixtureModel } from "@/lib/models";

const GroupSchema = z.enum(["A", "B", "C", "D"]);

export async function GET(req: NextRequest) {
  await requireDB();

  const groupParam = req.nextUrl.searchParams.get("groupId");
  const groups = groupParam
    ? [GroupSchema.parse(groupParam)]
    : (["A", "B", "C", "D"] as const);

  if (groupParam && !GroupSchema.safeParse(groupParam).success) {
    return fail("Invalid groupId — must be A, B, C, or D");
  }

  const [allTeams, allFixtures] = await Promise.all([
    TeamModel.find({}).lean(),
    FixtureModel.find({ status: "finished" }).lean(),
  ]);

  const result: Record<string, unknown[]> = {};

  for (const gid of groups) {
    const groupTeams    = allTeams.filter((t) => t.groupId === gid);
    const groupFixtures = allFixtures.filter((f) => f.groupId === gid);

    const rows = groupTeams.map((team) => {
      let W = 0, D = 0, L = 0, GF = 0, GA = 0;
      for (const fix of groupFixtures) {
        const isHome = fix.homeTeamId === String(team._id);
        const isAway = fix.awayTeamId === String(team._id);
        if (!isHome && !isAway) continue;
        const hs  = fix.homeScore ?? 0;
        const as_ = fix.awayScore ?? 0;
        GF += isHome ? hs  : as_;
        GA += isHome ? as_ : hs;
        const mine = isHome ? hs  : as_;
        const opp  = isHome ? as_ : hs;
        if (mine > opp) W++;
        else if (mine === opp) D++;
        else L++;
      }
      return {
        teamId:         String(team._id),
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

  return ok(result);
}
