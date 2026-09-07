import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ApiError, getQuestionResults, listSurveys } from "@/lib/api-client";
import { SurveySelector } from "@/components/admin/survey-selector";
import { QuestionResultsView } from "@/components/admin/question-results-view";
import { Badge } from "@/components/ui/badge";

type Props = { params: Promise<{ id: string }> };

// Hasil Survey per Pertanyaan - distribusi persentase tiap pilihan jawaban
// (melengkapi rata-rata di /admin/dashboard, bukan menggantikan). Punya
// toggle tampilan Stacked % / Bar Chart - lihat QuestionResultsView.
export default async function SurveyResultsPage({ params }: Props) {
  const { id } = await params;

  let data;
  try {
    data = await getQuestionResults(id);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) notFound();
    throw err;
  }

  const surveys = await listSurveys();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <Link
            href={`/admin/surveys/${id}`}
            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground mb-1"
          >
            <ArrowLeft className="size-3.5" /> Kembali ke survey
          </Link>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold">Hasil per Pertanyaan</h1>
            <Badge className="capitalize">{data.survey.status}</Badge>
          </div>
          <p className="text-sm text-muted-foreground">{data.survey.title}</p>
        </div>
        <SurveySelector surveys={surveys} selectedId={id} hrefTemplate="/admin/surveys/:id/results" />
      </div>

      <QuestionResultsView data={data} />
    </div>
  );
}
