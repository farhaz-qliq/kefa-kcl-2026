import { type NextRequest } from "next/server";
import { z } from "zod";
import { requireDB, ok, fail, unauthorized, isAdmin, toDocs } from "@/lib/api";
import { FixtureModel } from "@/lib/models";

const FixtureSchema = z.object({
  id:         z.string().min(1),
  homeTeamId: z.string().min(1),
  awayTeamId: z.string().min(1),
  groupId:    z.enum(["A", "B", "C", "D"]),
  date:       z.string().min(1),
  time:       z.string().min(1),
  venue:      z.string().optional().default(""),
  status:     z.enum(["scheduled", "live", "finished"]).optional().default("scheduled"),
  homeScore:  z.number().int().min(0).nullable().optional().default(null),
  awayScore:  z.number().int().min(0).nullable().optional().default(null),
  season:     z.string().optional().default("2026"),
});

export async function GET(req: NextRequest) {
  await requireDB();
  const groupId = req.nextUrl.searchParams.get("groupId");
  const query = groupId ? { groupId } : {};
  const docs = await FixtureModel.find(query).sort({ date: 1, time: 1 }).lean();
  return ok(toDocs(docs));
}

export async function POST(req: NextRequest) {
  if (!isAdmin(req)) return unauthorized();
  await requireDB();

  const body = await req.json().catch(() => null);
  const parsed = FixtureSchema.safeParse(body);
  if (!parsed.success) return fail(parsed.error.issues[0].message);

  const { id, ...rest } = parsed.data;
  const existing = await FixtureModel.findById(id).lean();
  if (existing) return fail("Fixture with this ID already exists", 409);

  const doc = await FixtureModel.create({ _id: id, ...rest });
  return ok(toDocs([doc.toObject()])[0], 201);
}
