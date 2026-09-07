"use client";

import { useState } from "react";
import type { QuestionResultDistribution } from "@/lib/api-client";
import { QuestionDistributionBar } from "@/components/admin/question-distribution-bar";
import { QuestionBarChart } from "@/components/admin/question-bar-chart";
import { QuestionPieChart } from "@/components/admin/question-pie-chart";
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

type ViewMode = "stacked" | "bar" | "pie";

// Pilih komponen chart sesuai view mode - dipakai untuk section awareness
// maupun behavior supaya tidak duplikasi percabangan 3 arah dua kali.
function DistributionChart<T extends string | number>({
  view,
  distribution,
  colorForValue,
  labelForValue,
}: {
  view: ViewMode;
  distribution: { value: T; count: number; percentage: number }[];
  colorForValue: (value: T) => string;
  labelForValue: (value: T) => string;
}) {
  if (view === "bar") {
    return <QuestionBarChart distribution={distribution} colorForValue={colorForValue} labelForValue={labelForValue} />;
  }
  if (view === "pie") {
    return <QuestionPieChart distribution={distribution} colorForValue={colorForValue} labelForValue={labelForValue} />;
  }
  return (
    <QuestionDistributionBar distribution={distribution} colorForValue={colorForValue} labelForValue={labelForValue} />
  );
}

// Toggle "Stacked %" (default, 100%-stacked satu bar) vs "Bar Chart"
// (satu bar per pilihan jawaban) vs "Pie Chart" - berlaku untuk kedua
// section sekaligus.
export function QuestionResultsView({ data }: { data: QuestionResultDistribution }) {
  const [view, setView] = useState<ViewMode>("stacked");

  return (
    <>
      <div className="flex justify-end">
        <Tabs value={view} onValueChange={(v) => v && setView(v as ViewMode)}>
          <TabsList>
            <TabsTrigger value="stacked">Stacked %</TabsTrigger>
            <TabsTrigger value="bar">Bar Chart</TabsTrigger>
            <TabsTrigger value="pie">Pie Chart</TabsTrigger>
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
                <DistributionChart
                  view={view}
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
                <DistributionChart
                  view={view}
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
    </>
  );
}
