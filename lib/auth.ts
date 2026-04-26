/**
 * lib/auth.ts — Full NextAuth Configuration (Node.js Runtime ONLY)
 *
 * ❌ NOT Edge-safe — imports mongoose, bcryptjs, User model
 * ✅ Used ONLY by API route handlers and server components
 * ✅ Spreads authConfig so that JWT/session callbacks are identical
 *    to what the Edge proxy reads — guarantees the 'role' field is
 *    always present and consistent.
 *
 * Edge middleware uses auth.config.ts → lib/proxy.ts instead.
 */

import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { connectDB } from "@/lib/mongoose";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { authConfig } from "@/auth.config";

export const { handlers, signIn, signOut, auth } = NextAuth({
  // Spread the shared Edge-safe config (callbacks, pages, session strategy)
  ...authConfig,

  // Override callbacks to inject Node.js DB synchronization routines
  callbacks: {
    ...authConfig.callbacks,
    async signIn({ user, account, profile }) {
      // ── Google User Persistence ──────────────────────────────
      if (account?.provider === "google") {
        await connectDB();
        let dbUser = await User.findOne({ email: user.email });

        if (!dbUser) {
          // Generate dummy hash since Google handles auth natively
          const dummyHash = await bcrypt.hash(Math.random().toString(36), 10);
          dbUser = await User.create({
            name: user.name || "Google User",
            email: user.email,
            passwordHash: dummyHash,
            role: "CUSTOMER", // Force default scope role setup
            isActive: true,
          });
        }

        // Replace Google ID with true MongoDB ObjectId seamlessly
        user.id = dbUser._id.toString();
        // Push role into the user object so jwt() callback can persist it
        (user as any).role = dbUser.role;
      }
      return true;
    },
  },

  // Add the Node.js-only providers (DB access happens here)
  providers: [
    // Google OAuth — for customer sign-ins
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),

    // Credentials — for ADMIN / FARMER staff login
    Credentials({
      name: "Staff Login",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectDB();

        const user = await User.findOne({
          email: credentials?.email as string,
        }).select("+passwordHash");

        if (!user) throw new Error("Invalid Email or Password");
        if (!user.passwordHash) throw new Error("Password not set");

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.passwordHash,
        );
        if (!isValid) throw new Error("Invalid Email or Password");

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role, // "ADMIN" | "FARMER" | "CUSTOMER"
        };
      },
    }),
  ],
});
