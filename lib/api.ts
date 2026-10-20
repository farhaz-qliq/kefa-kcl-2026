import { NextResponse } from "next/server";
import { connectDB } from "./mongodb";

export async function requireDB() {
  await connectDB();
}

export const ok = <T>(data: T, status = 200) =>
  NextResponse.json(data, { status });

export const fail = (message: string, status = 400) =>
  NextResponse.json({ error: message }, { status });

export const notFound = (resource = "Resource") =>
  NextResponse.json({ error: `${resource} not found` }, { status: 404 });

export const unauthorized = () =>
  NextResponse.json({ error: "Unauthorized" }, { status: 401 });

export function isAdmin(req: Request): boolean {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return false;
  return req.headers.get("authorization") === `Bearer ${secret}`;
}

// Maps Mongoose lean doc (_id) to TypeScript shape (id)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function toDoc(doc: any): any {
  if (!doc) return doc;
  const { _id, __v, ...rest } = doc;
  return { id: String(_id), ...rest };
}

export const toDocs = (docs: unknown[]) => docs.map(toDoc);
