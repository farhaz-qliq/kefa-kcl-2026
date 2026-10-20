import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI ?? "";

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Cached connection across hot-reloads in Next.js dev
const globalWithMongoose = global as typeof globalThis & { __mongoose?: MongooseCache };

export async function connectDB(): Promise<typeof mongoose | null> {
  if (!MONGODB_URI) return null;

  if (!globalWithMongoose.__mongoose) {
    globalWithMongoose.__mongoose = { conn: null, promise: null };
  }
  const cache = globalWithMongoose.__mongoose;

  if (cache.conn) return cache.conn;

  if (!cache.promise) {
    cache.promise = mongoose.connect(MONGODB_URI, { bufferCommands: false });
  }

  try {
    cache.conn = await cache.promise;
    return cache.conn;
  } catch (err) {
    cache.promise = null;
    throw err;
  }
}
