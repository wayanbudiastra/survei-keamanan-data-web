import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api-auth";
import { deleteSurvey, getSurvey, proxyApiCall, updateSurvey } from "@/lib/api-client";

type Params = { params: Promise<{ id: string }> };

// GET /api/surveys/[id] - Detail survey (admin)
export async function GET(_req: NextRequest, { params }: Params) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;
  const { data, error: apiError } = await proxyApiCall(() => getSurvey(id));
  if (apiError) return NextResponse.json(apiError.body, { status: apiError.status });
  return NextResponse.json(data);
}

// PATCH /api/surveys/[id] - Update survey (admin)
export async function PATCH(req: NextRequest, { params }: Params) {
  const { session, error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;
  const body = await req.json();
  const { data, error: apiError } = await proxyApiCall(() =>
    updateSurvey(id, { ...body, actorUserId: session!.user.id })
  );
  if (apiError) return NextResponse.json(apiError.body, { status: apiError.status });
  return NextResponse.json(data);
}

// DELETE /api/surveys/[id] - Delete survey (admin)
export async function DELETE(_req: NextRequest, { params }: Params) {
  const { session, error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;
  const { data, error: apiError } = await proxyApiCall(() => deleteSurvey(id, session!.user.id));
  if (apiError) return NextResponse.json(apiError.body, { status: apiError.status });
  return NextResponse.json(data);
}
