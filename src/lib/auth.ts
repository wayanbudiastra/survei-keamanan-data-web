import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { verifyCredentials } from "@/lib/api-client";
import authConfig from "@/lib/auth.config";

// NextAuth.js v5 config - full version (Node.js runtime only, API routes &
// server components). Middleware uses the edge-safe auth.config.ts instead.
//
// Kredensial admin TIDAK lagi diverifikasi langsung terhadap database di sini
// - authorize() memanggil survey-api-server lewat POST /api/auth/verify
// (lihat lib/api-client.ts dan PRD.md di project survey-api-server). Audit
// log LOGIN juga sudah dicatat di sisi API server, tidak perlu diulang di sini.
//
// Respondent (staff) yang mengisi survey TIDAK memerlukan login (anonymous
// access, lihat R1 di PRD) - auth ini hanya untuk halaman /admin.
export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;
        if (!email || !password) return null;

        const user = await verifyCredentials(email, password);
        if (!user) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          department: user.department,
        };
      },
    }),
  ],
});
