/**
 * Reset all fantasy users' squads so they can rebuild from scratch.
 * Run: npm run reset-squads
 *
 * Requires MONGODB_URI in .env.local or as an environment variable.
 * This clears squad.playerIds, captainId, viceCaptainId and sets
 * onboardingComplete=false so every user goes through onboarding again.
 */

import "dotenv/config";
import mongoose from "mongoose";
import { FantasyUserModel } from "../lib/models";
import { FREE_TRANSFERS_PER_GW } from "../lib/fantasyConfig";

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("❌  MONGODB_URI is not set. Add it to .env.local");
  process.exit(1);
}

async function resetSquads() {
  console.log("⏳  Connecting to MongoDB…");
  await mongoose.connect(MONGODB_URI as string);
  console.log("✅  Connected");

  const total = await FantasyUserModel.countDocuments({});
  console.log(`👥  Found ${total} fantasy user(s)`);

  const result = await FantasyUserModel.updateMany(
    {},
    {
      $set: {
        "squad.playerIds":     [],
        "squad.captainId":     "",
        "squad.viceCaptainId": "",
        onboardingComplete:    false,
        freeTransfers:         FREE_TRANSFERS_PER_GW,
        totalPoints:           0,
      },
    },
  );

  console.log(`✅  Reset ${result.modifiedCount} squad(s) — users will rebuild from scratch on next login`);
  await mongoose.disconnect();
}

resetSquads().catch((err) => {
  console.error("❌  Error:", err);
  process.exit(1);
});
