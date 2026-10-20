import { type NextRequest } from "next/server";
import { z } from "zod";
import { requireDB, ok, fail, unauthorized, isAdmin, toDocs } from "@/lib/api";
import { PlayerModel } from "@/lib/models";

const PlayerSchema = z.object({
  id:          z.string().min(1),
  teamId:      z.string().min(1),
  name:        z.string().min(1),
  number:      z.number().int().min(1),
  position:    z.enum(["GK", "DEF", "MID", "FWD"]),
  goals:       z.number().int().min(0).optional().default(0),
  assists:     z.number().int().min(0).optional().default(0),
  yellowCards: z.number().int().min(0).optional().default(0),
  redCards:    z.number().int().min(0).optional().default(0),
  season:      z.string().optional().default("2026"),
});

export async function GET(req: NextRequest) {
  await requireDB();
  const teamId = req.nextUrl.searchParams.get("teamId");
  const query = teamId ? { teamId } : {};
  const docs = await PlayerModel.find(query).lean();
  return ok(toDocs(docs));
}

export async function POST(req: NextRequest) {
  if (!isAdmin(req)) return unauthorized();
  await requireDB();

  const body = await req.json().catch(() => null);
  const parsed = PlayerSchema.safeParse(body);
  if (!parsed.success) return fail(parsed.error.issues[0].message);

  const { id, ...rest } = parsed.data;
  const existing = await PlayerModel.findById(id).lean();
  if (existing) return fail("Player with this ID already exists", 409);

  const doc = await PlayerModel.create({ _id: id, ...rest });
  return ok(toDocs([doc.toObject()])[0], 201);
}
