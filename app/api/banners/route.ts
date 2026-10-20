import { type NextRequest } from "next/server";
import { z } from "zod";
import { requireDB, ok, fail, unauthorized, isAdmin, toDocs } from "@/lib/api";
import { BannerModel } from "@/lib/models";

const BannerSchema = z.object({
  id:       z.string().min(1),
  title:    z.string().min(1),
  subtitle: z.string().optional().default(""),
  ctaLabel: z.string().optional().default(""),
  ctaHref:  z.string().optional().default("/"),
  imageUrl: z.string().optional().default(""),
  season:   z.string().optional().default("2026"),
});

export async function GET() {
  await requireDB();
  const docs = await BannerModel.find({}).lean();
  return ok(toDocs(docs));
}

export async function POST(req: NextRequest) {
  if (!isAdmin(req)) return unauthorized();
  await requireDB();

  const body = await req.json().catch(() => null);
  const parsed = BannerSchema.safeParse(body);
  if (!parsed.success) return fail(parsed.error.issues[0].message);

  const { id, ...rest } = parsed.data;
  const existing = await BannerModel.findById(id).lean();
  if (existing) return fail("Banner with this ID already exists", 409);

  const doc = await BannerModel.create({ _id: id, ...rest });
  return ok(toDocs([doc.toObject()])[0], 201);
}
