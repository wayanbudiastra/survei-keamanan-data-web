import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api-auth";
import { createActionItem, listActionItems, proxyApiCall } from "@/lib/api-client";

// GET /api/action-items?surveyId=... - List action items (admin)
export async function GET(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const surveyId = req.nextUrl.searchParams.get("surveyId") ?? undefined;
  const { data, error: apiError } = await proxyApiCall(() => listActionItems(surveyId));
  if (apiError) return NextResponse.json(apiError.body, { status: apiError.status });
  return NextResponse.json(data);
}

// POST /api/action-items - Create action item (admin). A11.
export async function POST(req: NextRequest) {
  const { session, error } = await requireAdmin();
  if (error) return error;

  const body = await req.json();
  const { data, error: apiError } = await proxyApiCall(() =>
    createActionItem({ ...body, createdBy: session!.user.id })
  );
  if (apiError) return NextResponse.json(apiError.body, { status: apiError.status });
  return NextResponse.json(data, { status: 201 });
}
