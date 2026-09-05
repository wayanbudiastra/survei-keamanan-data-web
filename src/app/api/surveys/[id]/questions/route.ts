import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api-auth";
import { getSurveyQuestionsForEdit, proxyApiCall, updateSurveyQuestions } from "@/lib/api-client";

type Params = { params: Promise<{ id: string }> };

// GET /api/surveys/[id]/questions - Daftar pertanyaan survey untuk diedit (admin)
export async function GET(_req: NextRequest, { params }: Params) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;
  const { data, error: apiError } = await proxyApiCall(() => getSurveyQuestionsForEdit(id));
  if (apiError) return NextResponse.json(apiError.body, { status: apiError.status });
  return NextResponse.json(data);
}

// PUT /api/surveys/[id]/questions - Update teks pertanyaan (bulk, admin)
export async function PUT(req: NextRequest, { params }: Params) {
  const { session, error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;
  const body = await req.json();
  const { data, error: apiError } = await proxyApiCall(() =>
    updateSurveyQuestions(id, body.questions, session!.user.id)
  );
  if (apiError) return NextResponse.json(apiError.body, { status: apiError.status });
  return NextResponse.json(data);
}
