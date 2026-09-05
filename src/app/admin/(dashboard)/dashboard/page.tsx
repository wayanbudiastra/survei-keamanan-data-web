import Link from "next/link";
import { Users, Percent, ShieldCheck, ShieldAlert, ClipboardList, Plus } from "lucide-react";
import { getAnalytics, listActionItems, listSurveys } from "@/lib/api-client";
import { StatCard } from "@/components/admin/stat-card";
import { SurveySelector } from "@/components/admin/survey-selector";
import { AwarenessBarChart } from "@/components/admin/awareness-bar-chart";
import { RiskBadge } from "@/components/admin/risk-badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Props = { searchParams: Promise<{ survey?: string }> };

// A6: Dashboard Overview - top metrics, charts, department heatmap.
export default async function AdminDashboardPage({ searchParams }: Props) {
  const { survey: surveyParam } = await searchParams;

  const surveys = await listSurveys();

  if (surveys.length === 0) {
    return (
      <div className="max-w-lg mx-auto text-center py-16 space-y-4">
        <ClipboardList className="size-10 text-muted-foreground mx-auto" />
        <h2 className="text-lg font-semibold">Belum ada survey</h2>
        <p className="text-sm text-muted-foreground">
          Buat survey campaign pertama Anda untuk mulai mengumpulkan data awareness staff.
        </p>
        <Link href="/admin/surveys" className={buttonVariants()}>
          <Plus className="size-4" /> Buat Survey
        </Link>
      </div>
    );
  }

  const selectedId =
    surveyParam && surveys.some((s) => s.id === surveyParam)
      ? surveyParam
      : (surveys.find((s) => s.status === "active")?.id ?? surveys[0].id);

  const analytics = await getAnalytics(selectedId);
  const actionItems = (await listActionItems(selectedId))
    .sort((a, b) => new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime())
    .slice(0, 5);

  const { summary, awarenessBreakdown, departmentHeatmap, topRiskAreas, weakAwarenessAreas } = analytics;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Dashboard Overview</h1>
          <p className="text-sm text-muted-foreground">{analytics.survey.title}</p>
        </div>
        <SurveySelector surveys={surveys} selectedId={selectedId} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Respondents"
          value={String(summary.totalRespondents)}
          subtext={`${summary.completedRespondents} selesai mengisi`}
          icon={Users}
        />
        <StatCard
          label="Response Rate"
          value={`${summary.responseRate}%`}
          icon={Percent}
        />
        <StatCard
          label="Awareness Score"
          value={`${summary.overallAwarenessScore || 0} / 5`}
          subtext={summary.overallAwarenessLevel}
          icon={ShieldCheck}
        />
        <StatCard
          label="Behavior Risk"
          value={`${summary.overallBehaviorRisk || 0}%`}
          subtext={summary.overallBehaviorRiskLevel}
          icon={ShieldAlert}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Awareness Score per Pertanyaan</CardTitle>
            <CardDescription>Skala 1-5 dari seluruh respondent yang menjawab.</CardDescription>
          </CardHeader>
          <CardContent>
            {summary.totalRespondents > 0 ? (
              <AwarenessBarChart data={awarenessBreakdown} />
            ) : (
              <p className="text-sm text-muted-foreground py-10 text-center">Belum ada data.</p>
            )}
            <Link
              href={`/admin/surveys/${selectedId}/results`}
              className="mt-3 inline-block text-xs text-primary hover:underline"
            >
              Lihat detail per pertanyaan →
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Department Heatmap</CardTitle>
            <CardDescription>Awareness score &amp; behavior risk per departemen.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {departmentHeatmap.length === 0 && (
              <p className="text-sm text-muted-foreground py-10 text-center">Belum ada data.</p>
            )}
            {departmentHeatmap
              .sort((a, b) => b.behaviorRiskPercent - a.behaviorRiskPercent)
              .map((d) => (
                <div
                  key={d.department}
                  className="flex items-center justify-between rounded-md border px-3 py-2 text-sm"
                >
                  <span className="font-medium">{d.department}</span>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>Awareness {d.avgAwarenessScore}/5</span>
                    <span>Risk {d.behaviorRiskPercent}%</span>
                    <RiskBadge level={d.riskLevel} />
                  </div>
                </div>
              ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Top Risk Areas</CardTitle>
            <CardDescription>Behavior dengan persentase &quot;Ya&quot; tertinggi.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {topRiskAreas.map((q) => (
              <div key={q.questionId} className="text-sm flex items-start justify-between gap-3">
                <span className="text-muted-foreground line-clamp-2">{q.text}</span>
                <Badge variant="outline" className="shrink-0">
                  {q.yesPercentage}%
                </Badge>
              </div>
            ))}
            {topRiskAreas.length === 0 && <p className="text-sm text-muted-foreground">Belum ada data.</p>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Weak Awareness Areas</CardTitle>
            <CardDescription>Skor awareness terendah.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {weakAwarenessAreas.map((q) => (
              <div key={q.questionId} className="text-sm flex items-start justify-between gap-3">
                <span className="text-muted-foreground line-clamp-2">{q.text}</span>
                <Badge variant="outline" className="shrink-0">
                  {q.avgScore}/5
                </Badge>
              </div>
            ))}
            {weakAwarenessAreas.length === 0 && <p className="text-sm text-muted-foreground">Belum ada data.</p>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base">Action Items</CardTitle>
              <CardDescription>Terbaru</CardDescription>
            </div>
            <Link href="/admin/action-items" className={buttonVariants({ size: "sm", variant: "ghost" })}>
              Lihat semua
            </Link>
          </CardHeader>
          <CardContent className="space-y-2">
            {actionItems.map((item) => (
              <div key={item.id} className="text-sm flex items-start justify-between gap-3">
                <span className="text-muted-foreground line-clamp-2">{item.title}</span>
                <Badge
                  variant={item.status === "completed" ? "default" : "outline"}
                  className="shrink-0 capitalize"
                >
                  {item.status.replace("_", " ")}
                </Badge>
              </div>
            ))}
            {actionItems.length === 0 && <p className="text-sm text-muted-foreground">Belum ada action item.</p>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
