import { type NextRequest } from "next/server";
import { z } from "zod";
import { requireDB, ok, fail, unauthorized, isAdmin, toDocs } from "@/lib/api";
import { TeamModel } from "@/lib/models";

const TeamSchema = z.object({
  id:           z.string().min(1),
  name:         z.string().min(1),
  shortName:    z.string().min(1),
  logo:         z.string().optional().default(""),
  badgeUrl:     z.string().optional(),
  groupId:      z.enum(["A", "B", "C", "D"]),
  season:       z.string().optional().default("2026"),
  primaryColor: z.string().optional().default("#C7FF00"),
});

export async function GET() {
  await requireDB();
  const docs = await TeamModel.find({}).lean();
  return ok(toDocs(docs));
}

export async function POST(req: NextRequest) {
  if (!isAdmin(req)) return unauthorized();
  await requireDB();

  const body = await req.json().catch(() => null);
  const parsed = TeamSchema.safeParse(body);
  if (!parsed.success) return fail(parsed.error.issues[0].message);

  const { id, ...rest } = parsed.data;
  const existing = await TeamModel.findById(id).lean();
  if (existing) return fail("Team with this ID already exists", 409);

  const doc = await TeamModel.create({ _id: id, ...rest });
  return ok(toDocs([doc.toObject()])[0], 201);
}
