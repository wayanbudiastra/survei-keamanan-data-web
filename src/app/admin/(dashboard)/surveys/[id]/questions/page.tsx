import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ApiError, getSurvey, getSurveyQuestionsForEdit } from "@/lib/api-client";
import { SurveyQuestionsForm } from "@/components/admin/survey-questions-form";
import { Badge } from "@/components/ui/badge";

type Props = { params: Promise<{ id: string }> };

// Edit teks pertanyaan survey - per-survey, hanya teks yang bisa diubah
// (jumlah & urutan pertanyaan tetap 9 awareness + 8 behavior).
export default async function SurveyQuestionsPage({ params }: Props) {
  const { id } = await params;

  let survey;
  let questions;
  try {
    [survey, questions] = await Promise.all([getSurvey(id), getSurveyQuestionsForEdit(id)]);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) notFound();
    throw err;
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <Link
          href={`/admin/surveys/${id}`}
          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground mb-1"
        >
          <ArrowLeft className="size-3.5" /> Kembali ke survey
        </Link>
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-semibold">Edit Pertanyaan</h1>
          <Badge className="capitalize">{survey.status}</Badge>
        </div>
        <p className="text-sm text-muted-foreground">{survey.title}</p>
        {survey.status === "active" && (
          <p className="text-xs text-amber-600 dark:text-amber-500 mt-1">
            Survey ini sedang aktif - perubahan teks langsung berlaku untuk responden yang mengisi setelah
            disimpan.
          </p>
        )}
      </div>

      <SurveyQuestionsForm surveyId={id} awareness={questions.awareness} behavior={questions.behavior} />
    </div>
  );
}
