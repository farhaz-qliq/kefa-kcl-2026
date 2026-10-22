import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { FantasyUserModel } from "@/lib/models";
import { ok, fail, notFound } from "@/lib/api";
import { FREE_TRANSFERS_PER_GW } from "@/lib/fantasyConfig";

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");
  if (!userId) return fail("userId required", 400);

  const conn = await connectDB();
  if (!conn) return fail("DB unavailable", 503);

  const user = await FantasyUserModel.findById(userId).lean();
  if (!user) return notFound();

  const u = user as Record<string, unknown>;
  return ok({
    squad:         u.squad,
    freeTransfers: u.freeTransfers,
    totalPoints:   u.totalPoints,
  });
}

// Initial squad save (onboarding)
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { userId, playerIds, captainId, viceCaptainId, name, teamName, avatarColor } = body;
  if (!userId || !playerIds) return fail("userId and playerIds required", 400);

  const conn = await connectDB();
  if (!conn) return fail("DB unavailable", 503);

  const user = await FantasyUserModel.findByIdAndUpdate(
    userId,
    {
      $set: {
        ...(name        && { name }),
        ...(teamName    && { teamName }),
        ...(avatarColor && { avatarColor }),
        squad:              { playerIds, captainId: captainId ?? "", viceCaptainId: viceCaptainId ?? "" },
        onboardingComplete: true,
        freeTransfers:      FREE_TRANSFERS_PER_GW,
      },
    },
    { new: true, upsert: true },
  ).lean();

  const u = user as Record<string, unknown>;
  return ok({ squad: u.squad, onboardingComplete: true });
}

// Partial squad update (captain/VC/bench swap)
export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const { userId, playerIds, captainId, viceCaptainId } = body;
  if (!userId) return fail("userId required", 400);

  const conn = await connectDB();
  if (!conn) return fail("DB unavailable", 503);

  const update: Record<string, unknown> = {};
  if (playerIds)    update["squad.playerIds"]     = playerIds;
  if (captainId !== undefined) update["squad.captainId"] = captainId;
  if (viceCaptainId !== undefined) update["squad.viceCaptainId"] = viceCaptainId;

  const user = await FantasyUserModel.findByIdAndUpdate(userId, { $set: update }, { new: true }).lean();
  if (!user) return notFound();

  const u = user as Record<string, unknown>;
  return ok({ squad: u.squad });
}
