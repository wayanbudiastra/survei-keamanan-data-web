import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api-auth";
import { createDepartment, listDepartments, proxyApiCall } from "@/lib/api-client";

// GET /api/departments?q=&page=&pageSize= - List departments (admin only)
export async function GET(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const q = req.nextUrl.searchParams.get("q") ?? undefined;
  const page = req.nextUrl.searchParams.get("page");
  const pageSize = req.nextUrl.searchParams.get("pageSize");

  const { data, error: apiError } = await proxyApiCall(() =>
    listDepartments({
      q,
      page: page ? Number(page) : undefined,
      pageSize: pageSize ? Number(pageSize) : undefined,
    })
  );
  if (apiError) return NextResponse.json(apiError.body, { status: apiError.status });
  return NextResponse.json(data);
}

// POST /api/departments - Create department (admin only)
export async function POST(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const body = await req.json();
  const { data, error: apiError } = await proxyApiCall(() => createDepartment(body));
  if (apiError) return NextResponse.json(apiError.body, { status: apiError.status });
  return NextResponse.json(data, { status: 201 });
}
