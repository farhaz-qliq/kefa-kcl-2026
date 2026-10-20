import { type NextRequest } from "next/server";
import { z } from "zod";
import { requireDB, ok, fail, notFound, unauthorized, isAdmin, toDoc } from "@/lib/api";
import { FixtureModel } from "@/lib/models";

const PatchSchema = z.object({
  homeTeamId: z.string().optional(),
  awayTeamId: z.string().optional(),
  groupId:    z.enum(["A", "B", "C", "D"]).optional(),
  date:       z.string().optional(),
  time:       z.string().optional(),
  venue:      z.string().optional(),
  status:     z.enum(["scheduled", "live", "finished"]).optional(),
  homeScore:  z.number().int().min(0).nullable().optional(),
  awayScore:  z.number().int().min(0).nullable().optional(),
  season:     z.string().optional(),
});

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  await requireDB();
  const doc = await FixtureModel.findById(id).lean();
  if (!doc) return notFound("Fixture");
  return ok(toDoc(doc));
}

export async function PATCH(req: NextRequest, { params }: Params) {
  if (!isAdmin(req)) return unauthorized();
  const { id } = await params;
  await requireDB();

  const body = await req.json().catch(() => null);
  const parsed = PatchSchema.safeParse(body);
  if (!parsed.success) return fail(parsed.error.issues[0].message);

  const doc = await FixtureModel.findByIdAndUpdate(id, { $set: parsed.data }, { new: true }).lean();
  if (!doc) return notFound("Fixture");
  return ok(toDoc(doc));
}

export async function DELETE(req: NextRequest, { params }: Params) {
  if (!isAdmin(req)) return unauthorized();
  const { id } = await params;
  await requireDB();

  const doc = await FixtureModel.findByIdAndDelete(id).lean();
  if (!doc) return notFound("Fixture");
  return ok({ success: true });
}
