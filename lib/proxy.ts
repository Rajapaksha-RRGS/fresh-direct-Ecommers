/**
 * lib/proxy.ts — Edge-Compatible API Gateway & Page Router
 *
 * ✅ Edge Runtime safe — imports ONLY: next-auth/jwt · next/server · Web APIs
 * ✅ DATABASE FREE — zero imports from mongoose · mongodb · @/lib/db · @/models/*
 * ✅ JWT-only verification via next-auth/jwt getToken()
 *    - Reads the NextAuth session cookie from the NextRequest directly
 *    - Decrypts Auth.js v5 JWE cookies correctly (HKDF + A256CBC-HS512)
 *    - Role is extracted straight from the JWT payload — no DB lookup ever
 * ✅ RBAC: ADMIN / FARMER / CUSTOMER / PUBLIC
 * ✅ /api/auth/* always bypassed (GET + POST) for NextAuth internals
 * ✅ On success: injects x-user-id · x-user-email · x-user-role headers
 * ✅ Debug log: "Proxy Auth Check - Role: <role>"
 *
 * Why getToken() and NOT auth() or jwtVerify():
 *   • auth()          — with no args calls next/headers (Node.js context) → triggers
 *                       Mongoose buffering timeout in Edge Runtime. BROKEN.
 *   • jose.jwtVerify  — cannot decrypt JWE (only verifies JWS). BROKEN.
 *   • getToken()      — reads request cookies directly, performs HKDF derivation
 *                       + JWE decryption the same way NextAuth signs them. CORRECT.
 */

import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

// ─── Types ────────────────────────────────────────────────────────────────────

interface TokenPayload {
  id?:    string;
  sub?:   string;      // NextAuth always sets sub = user id
  email?: string;
  role?:  string;
  name?:  string;
  iat?:   number;
  exp?:   number;
}

interface RouteRule {
  pattern:      RegExp;
  methods:      string[];
  allowedRoles: string[];  // empty array = public (no auth required)
  public:       boolean;
}

// ─── Route Permission Matrix ──────────────────────────────────────────────────

const ROUTE_RULES: RouteRule[] = [
  // ── PUBLIC ───────────────────────────────────────────────────────────────
  // NextAuth internals: /api/auth/session, /api/auth/csrf, /api/auth/callback/*, etc.
  {
    pattern:      /^\/api\/auth\//,
    methods:      ["GET", "POST"],
    allowedRoles: [],
    public:       true,
  },
  // Public product listings (read-only browsing)
  {
    pattern:      /^\/api\/products(\/.*)?$/,
    methods:      ["GET"],
    allowedRoles: [],
    public:       true,
  },
  // Health / ping check
  {
    pattern:      /^\/api\/health(\/.*)?$/,
    methods:      ["GET"],
    allowedRoles: [],
    public:       true,
  },
  // Farmer self-registration (unauthenticated)
  {
    pattern:      /^\/api\/farmers\/register$/,
    methods:      ["POST"],
    allowedRoles: [],
    public:       true,
  },

  // ── PROTECTED: ADMIN only ─────────────────────────────────────────────────
  {
    pattern:      /^\/api\/admin(\/.*)?$/,
    methods:      ["GET", "POST", "PATCH", "PUT", "DELETE"],
    allowedRoles: ["ADMIN"],
    public:       false,
  },

  // ── PROTECTED: FARMER only ────────────────────────────────────────────────
  {
    pattern:      /^\/api\/farmer(\/.*)?$/,
    methods:      ["GET", "POST", "PATCH", "PUT", "DELETE"],
    allowedRoles: ["FARMER"],
    public:       false,
  },

  // ── PROTECTED: Any authenticated role ────────────────────────────────────
  {
    pattern:      /^\/api\/orders(\/.*)?$/,
    methods:      ["GET", "POST", "PATCH", "DELETE"],
    allowedRoles: ["CUSTOMER", "FARMER", "ADMIN"],
    public:       false,
  },
];

// ─── Helper: find matching rule ───────────────────────────────────────────────

function findRule(pathname: string, method: string): RouteRule | undefined {
  const m = method.toUpperCase();
  return ROUTE_RULES.find(
    (r) => r.pattern.test(pathname) && r.methods.includes(m)
  );
}

// ─── Core: read + decode session token ───────────────────────────────────────
//
// getToken() reads the cookie from the NextRequest object directly —
// no headers(), no AsyncLocalStorage, no Node.js context.
// It decrypts the JWE using HKDF(NEXTAUTH_SECRET, cookieName) exactly
// as NextAuth signed it, then returns the plain JWT payload.

async function getSessionToken(
  request: NextRequest
): Promise<TokenPayload | null> {
  try {
    const token = await getToken({
      req:    request,
      secret: process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET ?? "",
    });

    if (!token) return null;

    return token as TokenPayload;
  } catch (err) {
    console.error("[Proxy] getToken failed:", err);
    return null;
  }
}

// ─── API Gateway ──────────────────────────────────────────────────────────────

async function handleApiRoute(request: NextRequest): Promise<NextResponse> {
  const { pathname } = new URL(request.url);
  const method       = request.method.toUpperCase();

  const rule = findRule(pathname, method);

  // ── No rule → 404 (default-deny posture) ─────────────────────────────────
  if (!rule) {
    return NextResponse.json(
      {
        success: false,
        code:    "NOT_FOUND",
        message: `No route configured for ${method} ${pathname}`,
      },
      { status: 404 }
    );
  }

  // ── Public route → pass through immediately ───────────────────────────────
  if (rule.public) {
    return NextResponse.next();
  }

  // ── Protected: decode JWT from cookie (database-free) ────────────────────
  const payload = await getSessionToken(request);

  // Required debug log
  console.log("Proxy Auth Check - Role:", payload?.role ?? "NO_SESSION");

  if (!payload) {
    return NextResponse.json(
      {
        success: false,
        code:    "UNAUTHORIZED",
        message: "No active session. Please sign in.",
      },
      { status: 401 }
    );
  }

  // ── RBAC: check role against route's allowed list ─────────────────────────
  const userRole = payload.role ?? "";
  if (rule.allowedRoles.length > 0 && !rule.allowedRoles.includes(userRole)) {
    return NextResponse.json(
      {
        success: false,
        code:    "FORBIDDEN",
        message: `Role '${userRole}' cannot access ${pathname}. Required: [${rule.allowedRoles.join(", ")}]`,
      },
      { status: 403 }
    );
  }

  // ── Authorized: inject user identity headers for downstream handlers ───────
  const headers = new Headers(request.headers);
  headers.set("x-user-id",    payload.id ?? payload.sub ?? "");
  headers.set("x-user-email", payload.email ?? "");
  headers.set("x-user-role",  userRole);

  return NextResponse.next({ request: { headers } });
}

// ─── Page Router ──────────────────────────────────────────────────────────────

const PUBLIC_PAGES = new Set(["/", "/login", "/register"]);

async function handlePageRoute(request: NextRequest): Promise<NextResponse> {
  const { pathname } = new URL(request.url);

  // Always-public pages and routes
  if (PUBLIC_PAGES.has(pathname) || pathname.startsWith("/products")) {
    return NextResponse.next();
  }

  // Protected page sections
  const isAdminPath  = pathname.startsWith("/admin");
  const isFarmerPath = pathname.startsWith("/farmer");

  if (isAdminPath || isFarmerPath) {
    const payload = await getSessionToken(request);

    // Required debug log
    console.log("Proxy Auth Check - Role:", payload?.role ?? "NO_SESSION");

    // Not signed in → redirect to login
    if (!payload) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    const role = payload.role ?? "";

    // Signed in but wrong role → 403 JSON (not a redirect)
    if (isAdminPath && role !== "ADMIN") {
      return NextResponse.json(
        {
          success: false,
          code:    "FORBIDDEN",
          message: `Role '${role}' is not authorised to access admin pages.`,
        },
        { status: 403 }
      );
    }

    if (isFarmerPath && role !== "FARMER") {
      return NextResponse.json(
        {
          success: false,
          code:    "FORBIDDEN",
          message: `Role '${role}' is not authorised to access farmer pages.`,
        },
        { status: 403 }
      );
    }

    // Correct role → allow through
    return NextResponse.next();
  }

  // Everything else → allow
  return NextResponse.next();
}

// ─── Main Export ──────────────────────────────────────────────────────────────

export async function proxy(request: NextRequest): Promise<NextResponse> {
  const { pathname } = new URL(request.url);

  if (pathname.startsWith("/api/")) {
    return handleApiRoute(request);
  }

  return handlePageRoute(request);
}
