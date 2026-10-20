import { connectDB } from "@/lib/mongodb";
import { FantasyUserModel } from "@/lib/models";
import { ok } from "@/lib/api";

export async function GET() {
  const conn = await connectDB();
  if (!conn) return ok([]);

  const users = await FantasyUserModel
    .find({ onboardingComplete: true })
    .select("_id name teamName avatarColor totalPoints squad")
    .sort({ totalPoints: -1 })
    .lean();

  return ok(users.map((u, i) => {
    const doc = u as Record<string, unknown>;
    const squad = doc.squad as { playerIds?: string[]; captainId?: string } | undefined;
    return {
      id:           String(doc._id),
      managerName:  String(doc.name ?? ""),
      teamName:     String(doc.teamName ?? ""),
      avatarColor:  String(doc.avatarColor ?? "#C7FF00"),
      totalPoints:  Number(doc.totalPoints ?? 0),
      playerIds:    squad?.playerIds ?? [],
      captainId:    squad?.captainId ?? "",
      rank:         i + 1,
    };
  }));
}
