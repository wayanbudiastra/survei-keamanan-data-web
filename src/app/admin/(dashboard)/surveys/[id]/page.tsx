import Link from "next/link";
import { notFound } from "next/navigation";
import { BarChart3, ListChecks, Pencil } from "lucide-react";
import { ApiError, getSurvey, listSurveyRespondents } from "@/lib/api-client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { SurveyLinkCard } from "@/components/admin/survey-link-card";
import { SurveyStatusActions } from "@/components/admin/survey-status-actions";
import { SurveyAnonymousToggle } from "@/components/admin/survey-anonymous-toggle";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type Props = { params: Promise<{ id: string }> };

// Survey Management detail - status, link/QR, respondent count. A2/A4.
export default async function SurveyDetailPage({ params }: Props) {
  const { id } = await params;

  let survey;
  try {
    survey = await getSurvey(id);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) notFound();
    throw err;
  }

  const respondentsPage = await listSurveyRespondents(id, { pageSize: 100 });
  const respondents = respondentsPage.items;
  const completed = respondents.filter((r) => r.completed).length;
  const targetDepartments: string[] = survey.targetDepartments ?? [];

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold">{survey.title}</h1>
            <Badge className="capitalize">{survey.status}</Badge>
          </div>
          {survey.description && <p className="text-sm text-muted-foreground mt-1">{survey.description}</p>}
        </div>
        <div className="flex shrink-0 gap-2">
          <Link
            href={`/admin/surveys/${survey.id}/questions`}
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            <Pencil className="size-4" /> Edit Pertanyaan
          </Link>
          <Link
            href={`/admin/surveys/${survey.id}/results`}
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            <ListChecks className="size-4" /> Hasil per Pertanyaan
          </Link>
          <Link
            href={`/admin/dashboard?survey=${survey.id}`}
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            <BarChart3 className="size-4" /> Lihat Analytics
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Status Survey</CardTitle>
          <CardDescription>
            Periode: {new Date(survey.startDate).toLocaleDateString("id-ID")} -{" "}
            {new Date(survey.endDate).toLocaleDateString("id-ID")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <SurveyStatusActions surveyId={survey.id} status={survey.status} />
          {targetDepartments.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-2">
              {targetDepartments.map((d) => (
                <Badge key={d} variant="outline">
                  {d}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Privasi Responden</CardTitle>
          <CardDescription>
            Atur apakah responden diminta mengisi nama/email/jabatan, atau cukup unit tugas saja.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SurveyAnonymousToggle surveyId={survey.id} anonymousMode={survey.anonymousMode} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Link &amp; QR Code Survey</CardTitle>
          <CardDescription>
            {survey.status === "active"
              ? "Survey aktif - link di bawah bisa langsung dibagikan."
              : "Aktifkan survey terlebih dahulu agar link bisa diakses staff."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SurveyLinkCard surveyId={survey.id} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Respondents</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-6 text-sm">
          <div>
            <p className="text-2xl font-bold">{survey._count.respondents}</p>
            <p className="text-muted-foreground">Total mengisi</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{completed}</p>
            <p className="text-muted-foreground">Selesai</p>
          </div>
        </CardContent>
        {respondents.length > 0 && (
          <CardContent className="p-0 border-t">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama</TableHead>
                  <TableHead>Departemen</TableHead>
                  <TableHead>Jabatan</TableHead>
                  <TableHead>Selesai</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {respondents.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">
                      {r.name ?? <span className="text-muted-foreground italic">Anonim</span>}
                      {r.email && <span className="block text-xs text-muted-foreground">{r.email}</span>}
                    </TableCell>
                    <TableCell>{r.department ?? "-"}</TableCell>
                    <TableCell>{r.jobTitle ?? "-"}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {r.completedAt ? new Date(r.completedAt).toLocaleString("id-ID") : "-"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
