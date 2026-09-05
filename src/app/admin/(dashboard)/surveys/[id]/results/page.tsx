import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ApiError, getQuestionResults, listSurveys } from "@/lib/api-client";
import { SurveySelector } from "@/components/admin/survey-selector";
import { QuestionDistributionBar } from "@/components/admin/question-distribution-bar";
import { AwarenessLevelBadge } from "@/components/admin/awareness-level-badge";
import { RiskBadge } from "@/components/admin/risk-badge";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Warna & label per nilai skala 1-5 - konsisten dengan skema warna yang
// sudah dipakai di survey-form.tsx (rose/orange/slate/sky/emerald) supaya
// nilai yang sama selalu terasa sama di seluruh app.
const AWARENESS_COLORS: Record<number, string> = {
  1: "#f43f5e", // rose-500
  2: "#f97316", // orange-500
  3: "#64748b", // slate-500
  4: "#0ea5e9", // sky-500
  5: "#10b981", // emerald-500
};
const AWARENESS_LABELS: Record<number, string> = {
  1: "Sangat Tidak Setuju",
  2: "Tidak Setuju",
  3: "Netral",
  4: "Setuju",
  5: "Sangat Setuju",
};

// Yes = warna risk (konsisten dengan RiskBadge level High), No = warna aman.
const BEHAVIOR_COLORS: Record<string, string> = { yes: "#d03b3b", no: "#0ca30c" };
const BEHAVIOR_LABELS: Record<string, string> = { yes: "Ya", no: "Tidak" };

type Props = { params: Promise<{ id: string }> };

// Hasil Survey per Pertanyaan - distribusi persentase tiap pilihan jawaban
// (melengkapi rata-rata di /admin/dashboard, bukan menggantikan).
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

      <section className="space-y-3">
        <h2 className="text-base font-semibold">Awareness Assessment</h2>
        <div className="space-y-3">
          {data.awareness.map((q, i) => (
            <Card key={q.questionId}>
              <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0 pb-3">
                <CardTitle className="text-sm font-medium leading-snug">
                  {i + 1}. {q.text}
                </CardTitle>
                {q.totalResponses > 0 && q.level && (
                  <div className="flex shrink-0 items-center gap-2">
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {q.avgScore.toFixed(1)} / 5
                    </span>
                    <AwarenessLevelBadge level={q.level} />
                  </div>
                )}
              </CardHeader>
              <CardContent>
                <QuestionDistributionBar
                  distribution={q.distribution}
                  colorForValue={(v) => AWARENESS_COLORS[v]}
                  labelForValue={(v) => AWARENESS_LABELS[v]}
                />
                {q.totalResponses > 0 && (
                  <p className="mt-1.5 text-xs text-muted-foreground">{q.totalResponses} responden menjawab</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-semibold">Behavior Risk Assessment</h2>
        <div className="space-y-3">
          {data.behavior.map((q, i) => (
            <Card key={q.questionId}>
              <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0 pb-3">
                <CardTitle className="text-sm font-medium leading-snug">
                  {i + 1}. {q.text}
                </CardTitle>
                {q.totalResponses > 0 && q.level && (
                  <div className="flex shrink-0 items-center gap-2">
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {q.yesPercentage.toFixed(1)}% Ya
                    </span>
                    <RiskBadge level={q.level} />
                  </div>
                )}
              </CardHeader>
              <CardContent>
                <QuestionDistributionBar
                  distribution={q.distribution}
                  colorForValue={(v) => BEHAVIOR_COLORS[v]}
                  labelForValue={(v) => BEHAVIOR_LABELS[v]}
                />
                {q.totalResponses > 0 && (
                  <p className="mt-1.5 text-xs text-muted-foreground">{q.totalResponses} responden menjawab</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
