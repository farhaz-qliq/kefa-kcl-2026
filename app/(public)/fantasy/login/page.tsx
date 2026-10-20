"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Mail, ChevronRight, Shield } from "lucide-react";
import { useFantasyStore } from "@/store/fantasyStore";

export default function FantasyLoginPage() {
  const router  = useRouter();
  const syncUser = useFantasyStore((s) => s.syncUser);

  const [email,   setEmail]   = useState("");
  const [step,    setStep]    = useState<"email" | "otp">("email");
  const [otp,     setOtp]     = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  async function handleSendOTP() {
    if (!email.includes("@")) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/fantasy/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Failed to send OTP"); return; }
      setStep("otp");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleOtpChange(i: number, val: string) {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[i] = val;
    setOtp(next);
    if (val && i < 5) {
      document.getElementById(`otp-${i + 1}`)?.focus();
    }
  }

  function handleOtpKeyDown(i: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !otp[i] && i > 0) {
      document.getElementById(`otp-${i - 1}`)?.focus();
    }
  }

  async function handleVerify() {
    const code = otp.join("");
    if (code.length < 6) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/fantasy/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: code }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Invalid code"); setLoading(false); return; }
      syncUser({
        email:              data.email,
        name:               data.name ?? "",
        teamName:           data.teamName ?? "",
        avatarColor:        data.avatarColor ?? "#C7FF00",
        onboardingComplete: data.onboardingComplete ?? false,
        freeTransfers:      data.freeTransfers ?? 1,
        totalPoints:        data.totalPoints ?? 0,
        squad:              data.squad,
      });
      router.replace(data.onboardingComplete ? "/fantasy" : "/fantasy/onboard");
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-full bg-[#080d18] flex flex-col">
      {/* Top section */}
      <div className="flex flex-col items-center pt-14 pb-8 px-6">
        <div className="w-16 h-16 rounded-2xl bg-[#C7FF00]/10 border border-[#C7FF00]/20 flex items-center justify-center mb-4">
          <Sparkles size={28} style={{ color: "#C7FF00" }} />
        </div>
        <p className="font-heading text-[11px] text-gray-500 uppercase tracking-[0.2em] mb-1">KEFA KCL 2026</p>
        <h1 className="font-heading text-3xl text-white uppercase tracking-wide">Fantasy</h1>
        <p className="text-gray-500 text-[12px] mt-2 text-center">Draft players · Pick captains · Climb the table</p>
      </div>

      {/* Card */}
      <div className="flex-1 bg-white rounded-t-3xl px-6 pt-8 pb-8">
        {step === "email" ? (
          <>
            <div className="flex items-center gap-2 mb-6">
              <Mail size={18} className="text-navy" />
              <h2 className="font-heading text-xl text-navy uppercase">Enter Your Email</h2>
            </div>

            <div className={`flex rounded-xl border-2 overflow-hidden transition-colors mb-4 ${error ? "border-red-300" : "border-gray-200 focus-within:border-[#C7FF00]"}`}>
              <input
                type="email"
                inputMode="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(""); }}
                className="flex-1 px-4 py-3.5 text-navy text-base bg-white outline-none"
                onKeyDown={(e) => e.key === "Enter" && handleSendOTP()}
                autoComplete="email"
              />
            </div>

            {error && <p className="text-red-500 text-xs mb-3">{error}</p>}

            <button
              onClick={handleSendOTP}
              disabled={!email.includes("@") || loading}
              className="w-full py-4 rounded-xl font-heading text-[13px] uppercase tracking-wider flex items-center justify-center gap-2 transition-opacity disabled:opacity-40"
              style={{ backgroundColor: "#C7FF00", color: "#080d18" }}
            >
              {loading ? "Sending…" : (<>Send Code <ChevronRight size={16} /></>)}
            </button>

            <p className="text-gray-400 text-[10px] text-center mt-6 leading-relaxed">
              A 6-digit code will be sent to your email. By continuing you agree to the KEFA Fantasy Terms of Service.
            </p>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2 mb-2">
              <Shield size={18} className="text-navy" />
              <h2 className="font-heading text-xl text-navy uppercase">Verify Code</h2>
            </div>
            <p className="text-gray-500 text-[12px] mb-7">
              6-digit code sent to <span className="font-semibold text-navy">{email}</span>
            </p>

            <div className="flex gap-2 justify-center mb-6">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  id={`otp-${i}`}
                  type="tel"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(i, e)}
                  className="w-11 h-14 text-center text-2xl font-bold text-navy border-2 border-gray-200 rounded-xl outline-none focus:border-[#C7FF00] transition-colors"
                />
              ))}
            </div>

            {error && <p className="text-red-500 text-xs text-center mb-3">{error}</p>}

            <button
              onClick={handleVerify}
              disabled={otp.join("").length < 6 || loading}
              className="w-full py-4 rounded-xl font-heading text-[13px] uppercase tracking-wider flex items-center justify-center gap-2 transition-all disabled:opacity-40"
              style={{ backgroundColor: "#C7FF00", color: "#080d18" }}
            >
              {loading ? "Verifying…" : (<>Verify &amp; Continue <ChevronRight size={16} /></>)}
            </button>

            <button
              onClick={() => { setStep("email"); setOtp(["","","","","",""]); setError(""); }}
              className="w-full mt-3 py-3 text-gray-500 text-sm font-medium"
            >
              ← Change email
            </button>
          </>
        )}
      </div>
    </div>
  );
}
