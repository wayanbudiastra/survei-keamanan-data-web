import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

/**
 * Guard untuk API routes admin. Mengembalikan session jika terautentikasi,
 * atau NextResponse 401 yang harus langsung di-return oleh caller.
 */
export async function requireAdmin() {
  const session = await auth();
  if (!session?.user) {
    return { session: null, error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  return { session, error: null };
}

export async function requireSuperadmin() {
  const { session, error } = await requireAdmin();
  if (error) return { session: null, error };
  if (session!.user.role !== "superadmin") {
    return { session: null, error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }
  return { session, error: null };
}
