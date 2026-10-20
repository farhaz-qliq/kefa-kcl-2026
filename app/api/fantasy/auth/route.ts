import { NextRequest } from "next/server";
import { createHmac } from "crypto";
import { connectDB } from "@/lib/mongodb";
import { OTPModel, FantasyUserModel } from "@/lib/models";
import { ok, fail } from "@/lib/api";

function hashOTP(otp: string, email: string) {
  return createHmac("sha256", process.env.ADMIN_SECRET ?? "kefa-secret")
    .update(`${otp}:${email.toLowerCase()}`)
    .digest("hex");
}

export async function POST(req: NextRequest) {
  const { email, otp } = await req.json();
  if (!email || !otp) return fail("email and otp required", 400);

  const conn = await connectDB();
  if (!conn) return fail("DB unavailable", 503);

  const normalEmail = email.toLowerCase();

  // Verify OTP
  const record = await OTPModel.findById(normalEmail).lean();
  if (!record) return fail("OTP not found or expired", 401);

  const rec = record as Record<string, unknown>;
  if (new Date(rec.expiresAt as string) < new Date()) {
    await OTPModel.findByIdAndDelete(normalEmail);
    return fail("OTP expired", 401);
  }

  const expected = hashOTP(String(otp), normalEmail);
  if (rec.code !== expected) return fail("Invalid OTP", 401);

  // OTP valid — delete it (one-time use)
  await OTPModel.findByIdAndDelete(normalEmail);

  // Create or get user
  let user = await FantasyUserModel.findById(normalEmail).lean();
  if (!user) {
    const created = await FantasyUserModel.create({ _id: normalEmail });
    user = created.toObject();
  }

  const u = user as Record<string, unknown>;
  return ok({
    email:              String(u._id ?? ""),
    name:               String(u.name ?? ""),
    teamName:           String(u.teamName ?? ""),
    avatarColor:        String(u.avatarColor ?? "#C7FF00"),
    onboardingComplete: Boolean(u.onboardingComplete),
    freeTransfers:      Number(u.freeTransfers ?? 1),
    totalPoints:        Number(u.totalPoints ?? 0),
    squad: u.onboardingComplete ? (u.squad as object) : undefined,
  });
}
