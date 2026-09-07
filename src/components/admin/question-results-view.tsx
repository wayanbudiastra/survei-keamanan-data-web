"use client";

import { useState } from "react";
import type { QuestionResultDistribution } from "@/lib/api-client";
import { QuestionDistributionBar } from "@/components/admin/question-distribution-bar";
import { QuestionBarChart } from "@/components/admin/question-bar-chart";
import { AwarenessLevelBadge } from "@/components/admin/awareness-level-badge";
import { RiskBadge } from "@/components/admin/risk-badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

type ViewMode = "stacked" | "bar";

// Toggle "Stacked %" (default, 100%-stacked satu bar) vs "Bar Chart"
// (satu bar per pilihan jawaban) - berlaku untuk kedua section sekaligus.
export function QuestionResultsView({ data }: { data: QuestionResultDistribution }) {
  const [view, setView] = useState<ViewMode>("stacked");

  return (
    <>
      <div className="flex justify-end">
        <Tabs value={view} onValueChange={(v) => v && setView(v as ViewMode)}>
          <TabsList>
            <TabsTrigger value="stacked">Stacked %</TabsTrigger>
            <TabsTrigger value="bar">Bar Chart</TabsTrigger>
          </TabsList>
        </Tabs>
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
                {view === "stacked" ? (
                  <QuestionDistributionBar
                    distribution={q.distribution}
                    colorForValue={(v) => AWARENESS_COLORS[v]}
                    labelForValue={(v) => AWARENESS_LABELS[v]}
                  />
                ) : (
                  <QuestionBarChart
                    distribution={q.distribution}
                    colorForValue={(v) => AWARENESS_COLORS[v]}
                    labelForValue={(v) => AWARENESS_LABELS[v]}
                  />
                )}
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
                {view === "stacked" ? (
                  <QuestionDistributionBar
                    distribution={q.distribution}
                    colorForValue={(v) => BEHAVIOR_COLORS[v]}
                    labelForValue={(v) => BEHAVIOR_LABELS[v]}
                  />
                ) : (
                  <QuestionBarChart
                    distribution={q.distribution}
                    colorForValue={(v) => BEHAVIOR_COLORS[v]}
                    labelForValue={(v) => BEHAVIOR_LABELS[v]}
                  />
                )}
                {q.totalResponses > 0 && (
                  <p className="mt-1.5 text-xs text-muted-foreground">{q.totalResponses} responden menjawab</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </>
  );
}
