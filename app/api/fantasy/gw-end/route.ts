// POST /api/fantasy/gw-end
// Call this after each gameweek completes to reset free transfers for all users.
// Requires admin secret header: x-admin-secret: <ADMIN_SECRET env var>

import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { FantasyUserModel } from "@/lib/models";
import { ok, fail } from "@/lib/api";
import { isUnlimitedTransfers, FREE_TRANSFERS_PER_GW } from "@/lib/fantasyConfig";

export async function POST(req: NextRequest) {
  // Simple admin guard
  const secret = req.headers.get("x-admin-secret");
  if (!process.env.ADMIN_SECRET || secret !== process.env.ADMIN_SECRET) {
    return fail("Unauthorized", 401);
  }

  const conn = await connectDB();
  if (!conn) return fail("DB unavailable", 503);

  if (isUnlimitedTransfers) {
    // Post-group-stage: transfers are unlimited, nothing to reset
    return ok({ message: "Unlimited transfer phase — no reset needed", updated: 0 });
  }

  // Reset all users to 2 free transfers
  const result = await FantasyUserModel.updateMany(
    {},
    { $set: { freeTransfers: FREE_TRANSFERS_PER_GW } }
  );

  return ok({
    message: `GW end processed — free transfers reset to ${FREE_TRANSFERS_PER_GW}`,
    updated: result.modifiedCount,
  });
}
