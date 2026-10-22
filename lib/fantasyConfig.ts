// ── Fantasy league configuration ──────────────────────────────────────────────
// Flip FANTASY_LIVE when GW2 kicks off.
// Increment CURRENT_GW after each gameweek completes.
// GROUP_STAGE_GWS = total GWs in the group stage (after this, unlimited transfers).

export const FANTASY_LIVE      = false;
export const CURRENT_GW        = 2;
export const GROUP_STAGE_GWS   = 3;   // GW1–GW3 are group stage
export const FREE_TRANSFERS_PER_GW = 2;

// After group stage ends (CURRENT_GW > GROUP_STAGE_GWS), transfers are unlimited.
export const isUnlimitedTransfers = CURRENT_GW > GROUP_STAGE_GWS;
