import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api-auth";
import { getAnalytics, proxyApiCall } from "@/lib/api-client";

type Params = { params: Promise<{ id: string }> };

// GET /api/analytics/[surveyId] - Analytics data (scores, heatmap, per-question breakdown). A6-A8.
export async function GET(_req: NextRequest, { params }: Params) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id: surveyId } = await params;
  const { data, error: apiError } = await proxyApiCall(() => getAnalytics(surveyId));
  if (apiError) return NextResponse.json(apiError.body, { status: apiError.status });
  return NextResponse.json(data);
}
