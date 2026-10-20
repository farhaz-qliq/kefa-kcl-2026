import { type NextRequest } from "next/server";
import { z } from "zod";
import { requireDB, ok, fail, notFound, unauthorized, isAdmin, toDoc } from "@/lib/api";
import { PlayerModel } from "@/lib/models";

const PatchSchema = z.object({
  teamId:      z.string().optional(),
  name:        z.string().min(1).optional(),
  number:      z.number().int().min(1).optional(),
  position:    z.enum(["GK", "DEF", "MID", "FWD"]).optional(),
  goals:       z.number().int().min(0).optional(),
  assists:     z.number().int().min(0).optional(),
  yellowCards: z.number().int().min(0).optional(),
  redCards:    z.number().int().min(0).optional(),
  season:      z.string().optional(),
});

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  await requireDB();
  const doc = await PlayerModel.findById(id).lean();
  if (!doc) return notFound("Player");
  return ok(toDoc(doc));
}

export async function PATCH(req: NextRequest, { params }: Params) {
  if (!isAdmin(req)) return unauthorized();
  const { id } = await params;
  await requireDB();

  const body = await req.json().catch(() => null);
  const parsed = PatchSchema.safeParse(body);
  if (!parsed.success) return fail(parsed.error.issues[0].message);

  const doc = await PlayerModel.findByIdAndUpdate(id, { $set: parsed.data }, { new: true }).lean();
  if (!doc) return notFound("Player");
  return ok(toDoc(doc));
}

export async function DELETE(req: NextRequest, { params }: Params) {
  if (!isAdmin(req)) return unauthorized();
  const { id } = await params;
  await requireDB();

  const doc = await PlayerModel.findByIdAndDelete(id).lean();
  if (!doc) return notFound("Player");
  return ok({ success: true });
}
