import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { FantasyUserModel } from "@/lib/models";
import { ok, fail, notFound } from "@/lib/api";
import { isUnlimitedTransfers } from "@/lib/fantasyConfig";

export async function POST(req: NextRequest) {
  const { userId, outId, inId } = await req.json();
  if (!userId || !outId || !inId) return fail("userId, outId, inId required", 400);

  const conn = await connectDB();
  if (!conn) return fail("DB unavailable", 503);

  const user = await FantasyUserModel.findById(userId);
  if (!user) return notFound();

  const squad = user.squad as { playerIds: string[]; captainId: string; viceCaptainId: string };
  if (!squad?.playerIds?.includes(outId)) return fail("outId not in squad", 400);
  if (squad.playerIds.includes(inId))     return fail("inId already in squad", 400);

  // Block if no free transfers left (unless post-group-stage unlimited phase)
  const currentFT = user.freeTransfers as number;
  if (!isUnlimitedTransfers && currentFT <= 0) {
    return fail("No free transfers remaining", 403);
  }

  const playerIds     = squad.playerIds.map((id: string) => (id === outId ? inId : id));
  const captainId     = squad.captainId === outId     ? inId : squad.captainId;
  const viceCaptainId = squad.viceCaptainId === outId ? inId : squad.viceCaptainId;

  user.squad         = { playerIds, captainId, viceCaptainId };
  // Only deduct in group stage; unlimited phase keeps count untouched
  if (!isUnlimitedTransfers) {
    user.freeTransfers = Math.max(0, currentFT - 1);
  }
  await user.save();

  return ok({
    squad:         user.squad,
    freeTransfers: isUnlimitedTransfers ? "∞" : user.freeTransfers,
    unlimited:     isUnlimitedTransfers,
  });
}
