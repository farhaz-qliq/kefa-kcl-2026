import { type NextRequest } from "next/server";
import { z } from "zod";
import { requireDB, ok, fail, notFound, unauthorized, isAdmin, toDoc } from "@/lib/api";
import { NewsModel } from "@/lib/models";

const PatchSchema = z.object({
  title:       z.string().min(1).optional(),
  excerpt:     z.string().optional(),
  imageUrl:    z.string().optional(),
  publishedAt: z.string().optional(),
  season:      z.string().optional(),
});

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  await requireDB();
  const doc = await NewsModel.findById(id).lean();
  if (!doc) return notFound("News item");
  return ok(toDoc(doc));
}

export async function PATCH(req: NextRequest, { params }: Params) {
  if (!isAdmin(req)) return unauthorized();
  const { id } = await params;
  await requireDB();

  const body = await req.json().catch(() => null);
  const parsed = PatchSchema.safeParse(body);
  if (!parsed.success) return fail(parsed.error.issues[0].message);

  const doc = await NewsModel.findByIdAndUpdate(id, { $set: parsed.data }, { new: true }).lean();
  if (!doc) return notFound("News item");
  return ok(toDoc(doc));
}

export async function DELETE(req: NextRequest, { params }: Params) {
  if (!isAdmin(req)) return unauthorized();
  const { id } = await params;
  await requireDB();

  const doc = await NewsModel.findByIdAndDelete(id).lean();
  if (!doc) return notFound("News item");
  return ok({ success: true });
}
