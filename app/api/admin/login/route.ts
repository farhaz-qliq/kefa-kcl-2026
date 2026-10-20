import { type NextRequest } from "next/server";
import { ok, fail } from "@/lib/api";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body?.email || !body?.password) return fail("Email and password required");

  const validEmail    = process.env.ADMIN_EMAIL;
  const validPassword = process.env.ADMIN_PASSWORD;
  const token         = process.env.ADMIN_SECRET;

  if (!validEmail || !validPassword || !token) {
    return fail("Admin credentials not configured", 500);
  }

  if (body.email !== validEmail || body.password !== validPassword) {
    return fail("Invalid credentials", 401);
  }

  return ok({ token });
}
