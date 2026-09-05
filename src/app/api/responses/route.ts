import { NextRequest, NextResponse } from "next/server";
import { proxyApiCall, submitResponse } from "@/lib/api-client";

// POST /api/responses - Submit survey responses (anonymous, R1/R5/R6). Proxy
// tipis ke survey-api-server.
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { data, error } = await proxyApiCall(() => submitResponse(body));
  if (error) return NextResponse.json(error.body, { status: error.status });
  return NextResponse.json(data, { status: 201 });
}
