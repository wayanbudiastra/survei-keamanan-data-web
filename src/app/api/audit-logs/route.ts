import { NextRequest, NextResponse } from "next/server";
import { requireSuperadmin } from "@/lib/api-auth";
import { listAuditLogs, proxyApiCall } from "@/lib/api-client";

// GET /api/audit-logs - Get audit trail (superadmin only). A12. Pengecekan
// role superadmin dilakukan DI SINI (Next.js) - survey-api-server sendiri
// tidak tahu konsep role, lihat PRD.md bagian "Perbedaan Penting".
export async function GET(req: NextRequest) {
  const { error } = await requireSuperadmin();
  if (error) return error;

  const limit = Number(req.nextUrl.searchParams.get("limit") ?? 100);
  const { data, error: apiError } = await proxyApiCall(() => listAuditLogs(limit));
  if (apiError) return NextResponse.json(apiError.body, { status: apiError.status });
  return NextResponse.json(data);
}
