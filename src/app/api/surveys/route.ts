import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api-auth";
import { createSurvey, listSurveys, proxyApiCall } from "@/lib/api-client";

// GET /api/surveys - List all surveys (admin). Proxy tipis ke survey-api-server.
export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const { data, error: apiError } = await proxyApiCall(() => listSurveys());
  if (apiError) return NextResponse.json(apiError.body, { status: apiError.status });
  return NextResponse.json(data);
}

// POST /api/surveys - Create new survey campaign (admin)
export async function POST(req: NextRequest) {
  const { session, error } = await requireAdmin();
  if (error) return error;

  const body = await req.json();
  const { data, error: apiError } = await proxyApiCall(() =>
    createSurvey({ ...body, createdBy: session!.user.id })
  );
  if (apiError) return NextResponse.json(apiError.body, { status: apiError.status });
  return NextResponse.json(data, { status: 201 });
}
