import type { NextAuthConfig } from "next-auth";

// Konfigurasi NextAuth yang edge-safe (dipakai middleware.ts).
// Provider Credentials (yang memanggil survey-api-server lewat lib/api-client.ts)
// hanya didaftarkan di lib/auth.ts, supaya file ini tetap ringan untuk Edge runtime.
export default {
  session: { strategy: "jwt", maxAge: 30 * 60 },
  pages: { signIn: "/admin/login" },
  providers: [],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.role = (user as { role?: string }).role ?? "admin";
        token.department = (user as { department?: string | null }).department ?? null;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.department = token.department as string | null;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
