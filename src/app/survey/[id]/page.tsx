import { notFound } from "next/navigation";
import { ApiError, getPublicSurvey } from "@/lib/api-client";
import { SurveyForm } from "@/components/survey/survey-form";
import { ShieldOff } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type Props = { params: Promise<{ id: string }> };

// Halaman publik survey (anonymous, tanpa login). Sesuai R1 PRD.
export default async function SurveyPage({ params }: Props) {
  const { id } = await params;

  let data;
  try {
    data = await getPublicSurvey(id);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) notFound();

    if (err instanceof ApiError && err.status === 403) {
      return (
        <main className="flex-1 flex items-center justify-center px-4 py-12">
          <Card className="max-w-md w-full">
            <CardHeader className="items-center text-center">
              <ShieldOff className="size-8 text-muted-foreground mb-2" />
              <CardTitle>Survey Tidak Tersedia</CardTitle>
              <CardDescription>
                Survey ini sudah ditutup atau belum diaktifkan. Silakan hubungi admin
                MRMIK/IT jika Anda merasa ini adalah kesalahan.
              </CardDescription>
            </CardHeader>
          </Card>
        </main>
      );
    }
    throw err;
  }

  const { survey, departments, experienceOptions, awarenessQuestions, behaviorQuestions } = data;

  return (
    <main className="flex-1 flex items-start sm:items-center justify-center px-4 py-8 sm:py-12">
      <SurveyForm
        survey={{ id: survey.id, title: survey.title, description: survey.description }}
        anonymousMode={survey.anonymousMode}
        departments={departments}
        experienceOptions={experienceOptions}
        awarenessQuestions={awarenessQuestions}
        behaviorQuestions={behaviorQuestions}
      />
    </main>
  );
}
