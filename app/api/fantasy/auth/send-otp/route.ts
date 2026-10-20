import { NextRequest } from "next/server";
import { createHmac, randomInt } from "crypto";
import { connectDB } from "@/lib/mongodb";
import { OTPModel } from "@/lib/models";
import { ok, fail } from "@/lib/api";

function hashOTP(otp: string, email: string) {
  return createHmac("sha256", process.env.ADMIN_SECRET ?? "kefa-secret")
    .update(`${otp}:${email.toLowerCase()}`)
    .digest("hex");
}

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  if (!email || !email.includes("@")) return fail("valid email required", 400);

  let conn;
  try { conn = await connectDB(); } catch { conn = null; }
  if (!conn) return fail("Service unavailable — please try again shortly", 503);

  const otp       = String(randomInt(100000, 999999));
  const hash      = hashOTP(otp, email);
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

  await OTPModel.findByIdAndUpdate(
    email.toLowerCase(),
    { code: hash, expiresAt },
    { upsert: true },
  );

  const apiKey = process.env.RESEND_API_KEY;
  if (apiKey) {
    const { Resend } = await import("resend");
    const resend = new Resend(apiKey);
    const from = process.env.RESEND_FROM ?? "KEFA Fantasy <onboarding@resend.dev>";
    await resend.emails.send({
      from,
      to: email,
      subject: "Your KEFA Fantasy verification code",
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;background:#080d18;border-radius:16px">
          <h1 style="font-size:24px;font-weight:900;color:#C7FF00;margin:0 0 8px;letter-spacing:0.05em">KEFA FANTASY</h1>
          <p style="color:#9ca3af;font-size:13px;margin:0 0 32px">KCL 2026 · Fantasy League</p>
          <p style="color:#f9fafb;font-size:15px;margin:0 0 24px">Your verification code is:</p>
          <div style="background:#111827;border:2px solid #C7FF00;border-radius:12px;padding:24px;text-align:center;margin:0 0 24px">
            <span style="font-size:40px;font-weight:900;letter-spacing:0.25em;color:#C7FF00">${otp}</span>
          </div>
          <p style="color:#6b7280;font-size:12px;margin:0">Valid for 5 minutes. Do not share this code.</p>
        </div>
      `,
    });
  } else {
    // Dev mode: log to console
    console.log(`[KEFA Fantasy OTP] ${email} → ${otp}`);
  }

  return ok({ sent: true });
}
