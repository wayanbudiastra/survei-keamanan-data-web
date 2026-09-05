import { NextRequest, NextResponse } from "next/server";
import { getPublicSurvey, proxyApiCall } from "@/lib/api-client";

type Params = { params: Promise<{ id: string }> };

// GET /api/surveys/[id]/public - Get survey form (respondent - no auth). R1.
export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const { data, error } = await proxyApiCall(() => getPublicSurvey(id));
  if (error) return NextResponse.json(error.body, { status: error.status });
  return NextResponse.json(data);
}
