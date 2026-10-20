import { type NextRequest } from "next/server";
import { z } from "zod";
import { requireDB, ok, fail, unauthorized, isAdmin, toDocs } from "@/lib/api";
import { NewsModel } from "@/lib/models";

const NewsSchema = z.object({
  id:          z.string().min(1),
  title:       z.string().min(1),
  excerpt:     z.string().optional().default(""),
  imageUrl:    z.string().optional().default(""),
  publishedAt: z.string().min(1),
  season:      z.string().optional().default("2026"),
});

export async function GET() {
  await requireDB();
  const docs = await NewsModel.find({}).sort({ publishedAt: -1 }).lean();
  return ok(toDocs(docs));
}

export async function POST(req: NextRequest) {
  if (!isAdmin(req)) return unauthorized();
  await requireDB();

  const body = await req.json().catch(() => null);
  const parsed = NewsSchema.safeParse(body);
  if (!parsed.success) return fail(parsed.error.issues[0].message);

  const { id, ...rest } = parsed.data;
  const existing = await NewsModel.findById(id).lean();
  if (existing) return fail("News item with this ID already exists", 409);

  const doc = await NewsModel.create({ _id: id, ...rest });
  return ok(toDocs([doc.toObject()])[0], 201);
}
