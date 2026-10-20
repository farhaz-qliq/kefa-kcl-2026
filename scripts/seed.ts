/**
 * Seed MongoDB with mock data.
 * Run: npm run seed
 *
 * Requires MONGODB_URI in .env.local or as an environment variable.
 */

import "dotenv/config";
import mongoose from "mongoose";

// Use relative imports — tsx doesn't resolve @/ aliases for scripts
import { MOCK_TEAMS }   from "../mocks/teams";
import { MOCK_PLAYERS } from "../mocks/players";
import { MOCK_GROUPS }  from "../mocks/groups";
import { MOCK_FIXTURES } from "../mocks/fixtures";
import { MOCK_BANNERS } from "../mocks/banners";
import { MOCK_NEWS }    from "../mocks/news";
import { MOCK_FANTASY_PLAYERS } from "../mocks/fantasyPlayers";

// Inline mini-models (no @/ dependency)
import { TeamModel, PlayerModel, GroupModel, FixtureModel, BannerModel, NewsModel, FantasyPlayerModel } from "../lib/models";

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("❌  MONGODB_URI is not set. Create a .env.local file with MONGODB_URI=<your-connection-string>");
  process.exit(1);
}

async function seed() {
  console.log("⏳  Connecting to MongoDB…");
  await mongoose.connect(MONGODB_URI as string);
  console.log("✅  Connected");

  // Drop existing data
  await Promise.all([
    TeamModel.deleteMany({}),
    PlayerModel.deleteMany({}),
    GroupModel.deleteMany({}),
    FixtureModel.deleteMany({}),
    BannerModel.deleteMany({}),
    NewsModel.deleteMany({}),
    FantasyPlayerModel.deleteMany({}),
  ]);
  console.log("🗑   Cleared existing documents");

  // Teams — use id as _id
  await TeamModel.insertMany(MOCK_TEAMS.map(({ id, ...rest }) => ({ _id: id, ...rest })));
  console.log(`✅  Seeded ${MOCK_TEAMS.length} teams`);

  // Players
  await PlayerModel.insertMany(MOCK_PLAYERS.map(({ id, ...rest }) => ({ _id: id, ...rest })));
  console.log(`✅  Seeded ${MOCK_PLAYERS.length} players`);

  // Groups
  await GroupModel.insertMany(MOCK_GROUPS.map(({ id, ...rest }) => ({ _id: id, ...rest })));
  console.log(`✅  Seeded ${MOCK_GROUPS.length} groups`);

  // Fixtures
  await FixtureModel.insertMany(MOCK_FIXTURES.map(({ id, ...rest }) => ({ _id: id, ...rest })));
  console.log(`✅  Seeded ${MOCK_FIXTURES.length} fixtures`);

  // Banners
  await BannerModel.insertMany(MOCK_BANNERS.map(({ id, ...rest }) => ({ _id: id, ...rest })));
  console.log(`✅  Seeded ${MOCK_BANNERS.length} banners`);

  // News
  await NewsModel.insertMany(MOCK_NEWS.map(({ id, ...rest }) => ({ _id: id, ...rest })));
  console.log(`✅  Seeded ${MOCK_NEWS.length} news items`);

  // Fantasy players
  await FantasyPlayerModel.insertMany(MOCK_FANTASY_PLAYERS.map(({ id, ...rest }) => ({ _id: id, ...rest })));
  console.log(`✅  Seeded ${MOCK_FANTASY_PLAYERS.length} fantasy players`);

  await mongoose.disconnect();
  console.log("🎉  Seeding complete!");
}

seed().catch((err) => {
  console.error("❌  Seed failed:", err);
  process.exit(1);
});
