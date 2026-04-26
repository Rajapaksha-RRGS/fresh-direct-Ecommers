/**
 * lib/mongoose.ts — Singleton MongoDB connection with global cache.
 *
 * Uses a global variable to cache the connection across hot-reloads in
 * Next.js dev mode. Without this, each hot-reload would open a new
 * connection and quickly exhaust the MongoDB Atlas connection pool.
 *
 * KEY FIX: `bufferCommands: false` — disables Mongoose's internal command
 * queue. When buffering is ON, Mongoose silently queues all DB operations
 * until a connection is established, then times out after 10 000 ms if the
 * connection never comes. Turning it OFF causes an immediate error instead,
 * which is far easier to debug.
 */

import mongoose, { Connection } from "mongoose";

interface MongooseCache {
  conn: Connection | null;
  promise: Promise<Connection> | null;
}

// Extend the global object so TypeScript is happy with the cache property.
declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

// Reuse the cached instance across hot-reloads; initialise once if missing.
let cached: MongooseCache = global.mongooseCache ?? { conn: null, promise: null };
global.mongooseCache = cached;

export async function connectDB(): Promise<Connection> {
  // Return the existing connection immediately if already open.
  if (cached.conn) {
    return cached.conn;
  }

  // Only create the connection promise once (prevents duplicate connections).
  if (!cached.promise) {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error(
        "MONGODB_URI is not defined. Add it to your .env.local file."
      );
    }

    const opts: mongoose.ConnectOptions = {
      // ─── Critical: disable buffering so we get an immediate error ─────────
      bufferCommands: false,
      // ─── Optional: explicit DB name fallback ────────────────────────────
      dbName: process.env.MONGODB_DB || "framer",
    };

    cached.promise = mongoose
      .connect(uri, opts)
      .then((m) => m.connection)
      .catch((err) => {
        // Reset the promise so the next request retries the connection.
        cached.promise = null;
        throw err;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

