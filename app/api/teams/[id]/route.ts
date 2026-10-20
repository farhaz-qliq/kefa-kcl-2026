import { type NextRequest } from "next/server";
import { z } from "zod";
import { requireDB, ok, fail, notFound, unauthorized, isAdmin, toDoc } from "@/lib/api";
import { TeamModel } from "@/lib/models";

const PatchSchema = z.object({
  name:         z.string().min(1).optional(),
  shortName:    z.string().min(1).optional(),
  logo:         z.string().optional(),
  badgeUrl:     z.string().optional(),
  groupId:      z.enum(["A", "B", "C", "D"]).optional(),
  season:       z.string().optional(),
  primaryColor: z.string().optional(),
});

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  await requireDB();
  const doc = await TeamModel.findById(id).lean();
  if (!doc) return notFound("Team");
  return ok(toDoc(doc));
}

export async function PATCH(req: NextRequest, { params }: Params) {
  if (!isAdmin(req)) return unauthorized();
  const { id } = await params;
  await requireDB();

  const body = await req.json().catch(() => null);
  const parsed = PatchSchema.safeParse(body);
  if (!parsed.success) return fail(parsed.error.issues[0].message);

  const doc = await TeamModel.findByIdAndUpdate(id, { $set: parsed.data }, { new: true }).lean();
  if (!doc) return notFound("Team");
  return ok(toDoc(doc));
}

export async function DELETE(req: NextRequest, { params }: Params) {
  if (!isAdmin(req)) return unauthorized();
  const { id } = await params;
  await requireDB();

  const doc = await TeamModel.findByIdAndDelete(id).lean();
  if (!doc) return notFound("Team");
  return ok({ success: true });
}
