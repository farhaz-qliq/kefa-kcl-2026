import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { FantasyUserModel } from "@/lib/models";
import { ok, fail, notFound } from "@/lib/api";

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const { userId, name, teamName, avatarColor } = body;
  if (!userId) return fail("userId required", 400);

  const conn = await connectDB();
  if (!conn) return fail("DB unavailable", 503);

  const update: Record<string, string> = {};
  if (name)        update.name        = name;
  if (teamName)    update.teamName    = teamName;
  if (avatarColor) update.avatarColor = avatarColor;

  const user = await FantasyUserModel.findByIdAndUpdate(userId, { $set: update }, { new: true }).lean();
  if (!user) return notFound();

  const u = user as Record<string, unknown>;
  return ok({ name: u.name, teamName: u.teamName, avatarColor: u.avatarColor });
}
