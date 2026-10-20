import { connectDB } from "@/lib/mongodb";
import { FantasyPlayerModel } from "@/lib/models";
import { ok } from "@/lib/api";
import { MOCK_FANTASY_PLAYERS } from "@/mocks";

export async function GET() {
  const conn = await connectDB();
  if (!conn) return ok(MOCK_FANTASY_PLAYERS);

  const docs = await FantasyPlayerModel.find({}).lean();
  if (!docs.length) return ok(MOCK_FANTASY_PLAYERS);

  return ok(docs.map((d) => {
    const doc = d as Record<string, unknown>;
    return {
      id:          String(doc._id),
      name:        doc.name,
      teamId:      doc.teamId,
      position:    doc.position,
      price:       doc.price,
      totalPoints: doc.totalPoints,
      form:        doc.form,
      selectedBy:  doc.selectedBy,
      goals:       doc.goals,
      assists:     doc.assists,
      cleanSheets: doc.cleanSheets,
    };
  }));
}
