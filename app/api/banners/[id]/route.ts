import { type NextRequest } from "next/server";
import { z } from "zod";
import { requireDB, ok, fail, notFound, unauthorized, isAdmin, toDoc } from "@/lib/api";
import { BannerModel } from "@/lib/models";

const PatchSchema = z.object({
  title:    z.string().min(1).optional(),
  subtitle: z.string().optional(),
  ctaLabel: z.string().optional(),
  ctaHref:  z.string().optional(),
  imageUrl: z.string().optional(),
  season:   z.string().optional(),
});

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  await requireDB();
  const doc = await BannerModel.findById(id).lean();
  if (!doc) return notFound("Banner");
  return ok(toDoc(doc));
}

export async function PATCH(req: NextRequest, { params }: Params) {
  if (!isAdmin(req)) return unauthorized();
  const { id } = await params;
  await requireDB();

  const body = await req.json().catch(() => null);
  const parsed = PatchSchema.safeParse(body);
  if (!parsed.success) return fail(parsed.error.issues[0].message);

  const doc = await BannerModel.findByIdAndUpdate(id, { $set: parsed.data }, { new: true }).lean();
  if (!doc) return notFound("Banner");
  return ok(toDoc(doc));
}

export async function DELETE(req: NextRequest, { params }: Params) {
  if (!isAdmin(req)) return unauthorized();
  const { id } = await params;
  await requireDB();

  const doc = await BannerModel.findByIdAndDelete(id).lean();
  if (!doc) return notFound("Banner");
  return ok({ success: true });
}
