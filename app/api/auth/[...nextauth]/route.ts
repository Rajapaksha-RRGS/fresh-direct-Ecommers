// app/api/auth/[...nextauth]/route.ts
// Auth.js v5 — Route Handler using lib/auth.ts
import { handlers } from "@/lib/auth";

export const { GET, POST } = handlers;
