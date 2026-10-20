import mongoose, { Schema } from "mongoose";

function m(name: string, schema: Schema) {
  return mongoose.models[name] ?? mongoose.model(name, schema);
}

export const TeamModel = m(
  "Team",
  new Schema(
    {
      _id:          String,
      name:         { type: String, required: true },
      shortName:    { type: String, required: true },
      logo:         { type: String, default: "" },
      badgeUrl:     String,
      groupId:      { type: String, enum: ["A", "B", "C", "D"] },
      season:       { type: String, default: "2026" },
      primaryColor: { type: String, default: "#C7FF00" },
    },
    { versionKey: false },
  ),
);

export const PlayerModel = m(
  "Player",
  new Schema(
    {
      _id:         String,
      teamId:      { type: String, required: true, index: true },
      name:        { type: String, required: true },
      number:      { type: Number, required: true },
      position:    { type: String, enum: ["GK", "DEF", "MID", "FWD"] },
      goals:       { type: Number, default: 0 },
      assists:     { type: Number, default: 0 },
      yellowCards: { type: Number, default: 0 },
      redCards:    { type: Number, default: 0 },
      season:      { type: String, default: "2026" },
    },
    { versionKey: false },
  ),
);

export const GroupModel = m(
  "Group",
  new Schema(
    {
      _id:    String,
      name:   { type: String, required: true },
      season: { type: String, default: "2026" },
    },
    { versionKey: false },
  ),
);

export const FixtureModel = m(
  "Fixture",
  new Schema(
    {
      _id:        String,
      homeTeamId: { type: String, required: true, index: true },
      awayTeamId: { type: String, required: true, index: true },
      groupId:    { type: String, enum: ["A", "B", "C", "D"] },
      date:       { type: String, required: true },
      time:       { type: String, required: true },
      venue:      { type: String, default: "" },
      status:     { type: String, enum: ["scheduled", "live", "finished"], default: "scheduled" },
      homeScore:  { type: Number, default: null },
      awayScore:  { type: Number, default: null },
      season:     { type: String, default: "2026" },
    },
    { versionKey: false },
  ),
);

export const BannerModel = m(
  "Banner",
  new Schema(
    {
      _id:      String,
      title:    { type: String, required: true },
      subtitle: { type: String, default: "" },
      ctaLabel: { type: String, default: "" },
      ctaHref:  { type: String, default: "/" },
      imageUrl: { type: String, default: "" },
      season:   { type: String, default: "2026" },
    },
    { versionKey: false },
  ),
);

export const MatchStatsModel = m(
  "MatchStats",
  new Schema(
    {
      _id:         String,
      fixtureId:   { type: String, required: true, index: true },
      playerId:    { type: String, required: true },
      goals:       { type: Number, default: 0 },
      assists:     { type: Number, default: 0 },
      yellowCards: { type: Number, default: 0 },
      redCards:    { type: Number, default: 0 },
      isMotm:      { type: Boolean, default: false },
    },
    { versionKey: false },
  ),
);

export const NewsModel = m(
  "NewsItem",
  new Schema(
    {
      _id:         String,
      title:       { type: String, required: true },
      excerpt:     { type: String, default: "" },
      imageUrl:    { type: String, default: "" },
      publishedAt: { type: String, required: true },
      season:      { type: String, default: "2026" },
    },
    { versionKey: false },
  ),
);

export const OTPModel = m(
  "OTP",
  new Schema(
    {
      _id:       String,  // email
      code:      { type: String, required: true },  // HMAC-SHA256 hash
      expiresAt: { type: Date, required: true, index: { expireAfterSeconds: 0 } },
    },
    { versionKey: false },
  ),
);

export const FantasyPlayerModel = m(
  "FantasyPlayer",
  new Schema(
    {
      _id:         String,
      name:        { type: String, required: true },
      teamId:      { type: String, required: true, index: true },
      position:    { type: String, enum: ["GK", "DEF", "MID", "FWD"] },
      price:       { type: Number, default: 0 },
      totalPoints: { type: Number, default: 0 },
      form:        { type: Number, default: 0 },
      selectedBy:  { type: Number, default: 0 },
      goals:       { type: Number, default: 0 },
      assists:     { type: Number, default: 0 },
      cleanSheets: { type: Number, default: 0 },
      season:      { type: String, default: "2026" },
    },
    { versionKey: false },
  ),
);

export const FantasyUserModel = m(
  "FantasyUser",
  new Schema(
    {
      _id:                String,  // phone number as ID
      name:               { type: String, default: "" },
      teamName:           { type: String, default: "" },
      avatarColor:        { type: String, default: "#C7FF00" },
      onboardingComplete: { type: Boolean, default: false },
      freeTransfers:      { type: Number, default: 1 },
      totalPoints:        { type: Number, default: 0 },
      squad: {
        playerIds:     { type: [String], default: [] },
        captainId:     { type: String, default: "" },
        viceCaptainId: { type: String, default: "" },
      },
      season: { type: String, default: "2026" },
    },
    { versionKey: false },
  ),
);

export const FantasyGWEntryModel = m(
  "FantasyGWEntry",
  new Schema(
    {
      _id:           String,
      userId:        { type: String, required: true, index: true },
      gw:            { type: Number, required: true },
      points:        { type: Number, default: 0 },
      transfers:     { type: Number, default: 0 },
      hits:          { type: Number, default: 0 },
      rank:          { type: Number, default: 0 },
      captainId:     { type: String, default: "" },
      captainPoints: { type: Number, default: 0 },
      season:        { type: String, default: "2026" },
    },
    { versionKey: false },
  ),
);
