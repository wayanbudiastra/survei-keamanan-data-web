import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api-auth";
import { deleteActionItem, proxyApiCall, updateActionItem } from "@/lib/api-client";

type Params = { params: Promise<{ id: string }> };

// PATCH /api/action-items/[id] - Update action item status/notes (admin)
export async function PATCH(req: NextRequest, { params }: Params) {
  const { session, error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;
  const body = await req.json();
  const { data, error: apiError } = await proxyApiCall(() =>
    updateActionItem(id, { ...body, actorUserId: session!.user.id })
  );
  if (apiError) return NextResponse.json(apiError.body, { status: apiError.status });
  return NextResponse.json(data);
}

// DELETE /api/action-items/[id] - Delete action item (admin)
export async function DELETE(_req: NextRequest, { params }: Params) {
  const { session, error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;
  const { data, error: apiError } = await proxyApiCall(() => deleteActionItem(id, session!.user.id));
  if (apiError) return NextResponse.json(apiError.body, { status: apiError.status });
  return NextResponse.json(data);
}
