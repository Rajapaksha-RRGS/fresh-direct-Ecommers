import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI || process.env.DATABASE_URL;

// Cache the client across lambda invocations in development
declare global {
  // eslint-disable-next-line no-var
  var _mongoClient: MongoClient | undefined;
}

let cachedClient = (global as any)._mongoClient as MongoClient | undefined;
if (!cachedClient && uri) {
  cachedClient = new MongoClient(uri);
  (global as any)._mongoClient = cachedClient;
}

export async function GET() {
  try {
    if (!uri) {
      return new Response(JSON.stringify({ error: "Missing MongoDB connection string (MONGODB_URI or DATABASE_URL)" }), { status: 500 });
    }

    // connect (connect is idempotent if already connected)
    await cachedClient!.connect();

    const db = cachedClient!.db();
    const admin = db.admin();
    const ping = await admin.command({ ping: 1 });
    const collections = await db.listCollections().toArray();

    return new Response(JSON.stringify({ ok: true, ping, collections: collections.map(c => c.name) }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ ok: false, error: String(err) }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}
