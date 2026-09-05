import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api-auth";
import { deleteDepartment, proxyApiCall, updateDepartment } from "@/lib/api-client";

type Params = { params: Promise<{ id: string }> };

// PATCH /api/departments/[id] - Update department (rename / activate-deactivate). Admin only.
export async function PATCH(req: NextRequest, { params }: Params) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;
  const body = await req.json();
  const { data, error: apiError } = await proxyApiCall(() => updateDepartment(id, body));
  if (apiError) return NextResponse.json(apiError.body, { status: apiError.status });
  return NextResponse.json(data);
}

// DELETE /api/departments/[id] - Delete department. Admin only.
export async function DELETE(_req: NextRequest, { params }: Params) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;
  const { data, error: apiError } = await proxyApiCall(() => deleteDepartment(id));
  if (apiError) return NextResponse.json(apiError.body, { status: apiError.status });
  return NextResponse.json(data);
}
