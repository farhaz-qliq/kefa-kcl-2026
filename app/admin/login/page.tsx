"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const schema = z.object({
  email:    z.string().email("Invalid email"),
  password: z.string().min(1, "Required"),
});
type FormData = z.infer<typeof schema>;

export default function AdminLoginPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(data: FormData) {
    setServerError("");
    setLoading(true);
    try {
      const res  = await fetch("/api/admin/login", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) {
        setServerError(json.error ?? "Login failed");
        return;
      }
      localStorage.setItem("kefa_admin_auth",  "true");
      localStorage.setItem("kefa_admin_token", json.token);
      router.push("/admin/teams");
    } catch {
      setServerError("Network error — try again");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <p className="text-electric-cyan text-xs uppercase tracking-widest mb-2">Admin Panel</p>
          <h1 className="font-heading text-4xl text-neon-lime neon-glow">KEFA KCL 2026</h1>
          <p className="text-gray-400 text-sm mt-2">Presented by La Perfume</p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-navy-800 rounded-2xl p-6 flex flex-col gap-4 border border-navy-700"
        >
          <div className="flex flex-col gap-1.5">
            <Label className="text-gray-300 text-sm">Email</Label>
            <Input
              {...register("email")}
              placeholder="admin@kefa.com"
              className="bg-navy-700 border-navy-600 text-white placeholder:text-gray-500"
            />
            {errors.email && <p className="text-red-400 text-xs">{errors.email.message}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-gray-300 text-sm">Password</Label>
            <Input
              type="password"
              {...register("password")}
              placeholder="••••••••"
              className="bg-navy-700 border-navy-600 text-white placeholder:text-gray-500"
            />
            {errors.password && <p className="text-red-400 text-xs">{errors.password.message}</p>}
          </div>

          {serverError && (
            <p className="text-red-400 text-xs text-center">{serverError}</p>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-neon-lime text-navy font-heading text-sm mt-2 hover:bg-neon-lime/90 disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Sign In"}
          </Button>
        </form>
      </div>
    </div>
  );
}
