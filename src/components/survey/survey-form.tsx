"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  ShieldCheck,
  Clock,
  Lock,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Angry,
  Frown,
  Meh,
  Smile,
  Laugh,
  CircleCheck,
  CircleX,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AWARENESS_SCALE } from "@/lib/constants";
import { cn } from "@/lib/utils";

// Ikon + warna standar rating per nilai skala 1-5 (merah -> hijau), dari
// Sangat Tidak Setuju ke Sangat Setuju. Latar kotak selalu diwarnai sesuai
// rating-nya (bukan hanya saat dipilih) - dipilih = warna solid, tidak
// dipilih = tint pudar.
const AWARENESS_SCALE_STYLES: Record<
  string,
  { icon: typeof Angry; base: string; selected: string }
> = {
  "1": {
    icon: Angry,
    base: "bg-rose-50 border-rose-200 text-rose-400 dark:bg-rose-950/40 dark:border-rose-900 dark:text-rose-600",
    selected: "bg-rose-500 border-rose-500 text-white dark:bg-rose-600 dark:border-rose-600",
  },
  "2": {
    icon: Frown,
    base: "bg-orange-50 border-orange-200 text-orange-400 dark:bg-orange-950/40 dark:border-orange-900 dark:text-orange-600",
    selected: "bg-orange-500 border-orange-500 text-white dark:bg-orange-600 dark:border-orange-600",
  },
  "3": {
    icon: Meh,
    base: "bg-slate-100 border-slate-200 text-slate-400 dark:bg-slate-800/40 dark:border-slate-700 dark:text-slate-500",
    selected: "bg-slate-500 border-slate-500 text-white dark:bg-slate-600 dark:border-slate-600",
  },
  "4": {
    icon: Smile,
    base: "bg-sky-50 border-sky-200 text-sky-400 dark:bg-sky-950/40 dark:border-sky-900 dark:text-sky-600",
    selected: "bg-sky-500 border-sky-500 text-white dark:bg-sky-600 dark:border-sky-600",
  },
  "5": {
    icon: Laugh,
    base: "bg-emerald-50 border-emerald-200 text-emerald-400 dark:bg-emerald-950/40 dark:border-emerald-900 dark:text-emerald-600",
    selected: "bg-emerald-500 border-emerald-500 text-white dark:bg-emerald-600 dark:border-emerald-600",
  },
};

type Question = { id: string; text: string };

type SurveyFormProps = {
  survey: { id: string; title: string; description: string | null };
  anonymousMode: boolean;
  departments: string[];
  experienceOptions: { value: string; label: string }[];
  awarenessQuestions: Question[];
  behaviorQuestions: Question[];
};

type Step = "intro" | "info" | "awareness" | "behavior" | "risk";

const STEP_ORDER: Step[] = ["intro", "info", "awareness", "behavior", "risk"];

export function SurveyForm({
  survey,
  anonymousMode,
  departments,
  experienceOptions,
  awarenessQuestions,
  behaviorQuestions,
}: SurveyFormProps) {
  const router = useRouter();
  const [step, setStep] = useState<Step>("intro");
  const [submitting, setSubmitting] = useState(false);

  const [info, setInfo] = useState({
    name: "",
    email: "",
    department: "",
    jobTitle: "",
    experience: "",
    trainingDone: "",
  });
  const [awareness, setAwareness] = useState<Record<string, string>>({});
  const [behavior, setBehavior] = useState<Record<string, string>>({});
  const [riskText, setRiskText] = useState("");
  const [suggestionText, setSuggestionText] = useState("");

  const pageIndex = STEP_ORDER.indexOf(step); // 0=intro..4=risk
  const progressPercent = pageIndex === 0 ? 0 : (pageIndex / 4) * 100;

  function goNext() {
    if (step === "info") {
      if (!info.department) {
        toast.error("Mohon pilih unit/departemen tugas Anda.");
        return;
      }
      if (!anonymousMode && (!info.experience || !info.trainingDone)) {
        toast.error("Mohon lengkapi pengalaman kerja dan status pelatihan.");
        return;
      }
    }
    if (step === "awareness" && Object.keys(awareness).length < awarenessQuestions.length) {
      toast.error("Mohon jawab semua pertanyaan awareness.");
      return;
    }
    if (step === "behavior" && Object.keys(behavior).length < behaviorQuestions.length) {
      toast.error("Mohon jawab semua pertanyaan behavior.");
      return;
    }
    const idx = STEP_ORDER.indexOf(step);
    setStep(STEP_ORDER[Math.min(idx + 1, STEP_ORDER.length - 1)]);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function goBack() {
    const idx = STEP_ORDER.indexOf(step);
    setStep(STEP_ORDER[Math.max(idx - 1, 0)]);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSubmit() {
    setSubmitting(true);
    try {
      const answers = [
        ...awarenessQuestions.map((q) => ({
          questionId: q.id,
          questionType: "awareness" as const,
          answer: awareness[q.id],
        })),
        ...behaviorQuestions.map((q) => ({
          questionId: q.id,
          questionType: "behavior" as const,
          answer: behavior[q.id],
        })),
        ...(riskText.trim()
          ? [{ questionId: "risk_text", questionType: "text" as const, answer: riskText.trim() }]
          : []),
        ...(suggestionText.trim()
          ? [{ questionId: "suggestion_text", questionType: "text" as const, answer: suggestionText.trim() }]
          : []),
      ];

      const res = await fetch("/api/responses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          surveyId: survey.id,
          respondent: anonymousMode
            ? { department: info.department, trainingDone: false }
            : {
                name: info.name || undefined,
                email: info.email || undefined,
                department: info.department,
                jobTitle: info.jobTitle || undefined,
                experience: info.experience || undefined,
                trainingDone: info.trainingDone === "yes",
              },
          answers,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Gagal mengirim survey");
      }

      router.push(`/survey/${survey.id}/success`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Terjadi kesalahan, coba lagi.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card className="w-full max-w-2xl">
      {step !== "intro" && (
        <div className="px-6 pt-6">
          <Progress value={progressPercent} />
          <p className="text-xs text-muted-foreground mt-1.5">Halaman {pageIndex} dari 4</p>
        </div>
      )}

      {step === "intro" && (
        <>
          <CardHeader className="items-center text-center space-y-3 pt-8">
            <div className="rounded-full bg-primary/10 p-4">
              <ShieldCheck className="size-8 text-primary" />
            </div>
            <CardTitle className="text-xl">{survey.title}</CardTitle>
            <CardDescription>
              {survey.description ??
                "Survey kesadaran & perilaku keamanan data pasien di lingkungan rumah sakit."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground justify-center">
              <Clock className="size-4" />
              Estimasi waktu pengisian: 5-10 menit
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground justify-center">
              <Lock className="size-4" />
              {anonymousMode
                ? "Survey ini anonim - Anda hanya perlu mengisi unit/departemen tugas"
                : "Nama bersifat opsional, jawaban Anda dijaga kerahasiaannya"}
            </div>
          </CardContent>
          <CardFooter className="justify-center pb-8">
            <Button size="lg" onClick={goNext}>
              Mulai Survey <ChevronRight className="size-4" />
            </Button>
          </CardFooter>
        </>
      )}

      {step === "info" && (
        <>
          <CardHeader>
            <CardTitle>Informasi Responden</CardTitle>
            <CardDescription>
              {anonymousMode
                ? "Bagian 1 - survey ini anonim, cukup pilih unit/departemen tugas Anda."
                : "Bagian 1 - data ini membantu analisis per departemen."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label>{anonymousMode ? "Unit / Departemen Tugas *" : "Departemen / Unit *"}</Label>
              <Select value={info.department} onValueChange={(v) => setInfo({ ...info, department: v ?? "" })}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih unit/departemen" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {!anonymousMode && (
              <>
                <div className="space-y-1.5">
                  <Label htmlFor="name">Nama (opsional)</Label>
                  <Input
                    id="name"
                    value={info.name}
                    onChange={(e) => setInfo({ ...info, name: e.target.value })}
                    placeholder="Nama Anda"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email (opsional)</Label>
                  <Input
                    id="email"
                    type="email"
                    value={info.email}
                    onChange={(e) => setInfo({ ...info, email: e.target.value })}
                    placeholder="nama@rumahsakit.id"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="jobTitle">Jabatan (opsional)</Label>
                  <Input
                    id="jobTitle"
                    value={info.jobTitle}
                    onChange={(e) => setInfo({ ...info, jobTitle: e.target.value })}
                    placeholder="cth. Perawat, Staff IT"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Pengalaman Kerja *</Label>
                  <RadioGroup
                    value={info.experience}
                    onValueChange={(v) => setInfo({ ...info, experience: v })}
                    className="grid grid-cols-2 gap-2"
                  >
                    {experienceOptions.map((opt) => (
                      <label
                        key={opt.value}
                        className={cn(
                          "flex items-center gap-2 rounded-md border px-3 py-2 text-sm cursor-pointer",
                          info.experience === opt.value && "border-primary bg-primary/5"
                        )}
                      >
                        <RadioGroupItem value={opt.value} />
                        {opt.label}
                      </label>
                    ))}
                  </RadioGroup>
                </div>
                <div className="space-y-1.5">
                  <Label>Pernah mengikuti pelatihan keamanan data? *</Label>
                  <RadioGroup
                    value={info.trainingDone}
                    onValueChange={(v) => setInfo({ ...info, trainingDone: v })}
                    className="grid grid-cols-2 gap-2"
                  >
                    {[
                      { value: "yes", label: "Ya" },
                      { value: "no", label: "Tidak" },
                    ].map((opt) => (
                      <label
                        key={opt.value}
                        className={cn(
                          "flex items-center gap-2 rounded-md border px-3 py-2 text-sm cursor-pointer",
                          info.trainingDone === opt.value && "border-primary bg-primary/5"
                        )}
                      >
                        <RadioGroupItem value={opt.value} />
                        {opt.label}
                      </label>
                    ))}
                  </RadioGroup>
                </div>
              </>
            )}
          </CardContent>
          <StepFooter onBack={goBack} onNext={goNext} />
        </>
      )}

      {step === "awareness" && (
        <>
          <CardHeader>
            <CardTitle>Awareness Assessment</CardTitle>
            <CardDescription>
              Bagian 2 - seberapa setuju Anda dengan pernyataan berikut? (1 = Sangat Tidak Setuju, 5 = Sangat
              Setuju)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {awarenessQuestions.map((q, i) => (
              <div key={q.id} className="space-y-2">
                <p className="text-sm font-medium">
                  {i + 1}. {q.text}
                </p>
                <RadioGroup
                  value={awareness[q.id] ?? ""}
                  onValueChange={(v) => setAwareness({ ...awareness, [q.id]: v })}
                  className="grid grid-cols-5 gap-1"
                >
                  {AWARENESS_SCALE.map((s) => {
                    const { icon: Icon, base, selected: selectedStyle } = AWARENESS_SCALE_STYLES[s.value];
                    const selected = awareness[q.id] === s.value;
                    return (
                      <label
                        key={s.value}
                        title={s.label}
                        className={cn(
                          "flex flex-col items-center gap-0.5 rounded-md border px-1 py-1.5 text-[10px] text-center cursor-pointer transition-colors has-[:focus-visible]:ring-3 has-[:focus-visible]:ring-ring/50",
                          selected ? selectedStyle : base
                        )}
                      >
                        <RadioGroupItem value={s.value} className="sr-only" />
                        <Icon className="size-4" />
                        <span className="font-medium">{s.value}</span>
                      </label>
                    );
                  })}
                </RadioGroup>
              </div>
            ))}
          </CardContent>
          <StepFooter onBack={goBack} onNext={goNext} />
        </>
      )}

      {step === "behavior" && (
        <>
          <CardHeader>
            <CardTitle>Behavior Risk Assessment</CardTitle>
            <CardDescription>Bagian 3 - jawab jujur sesuai kebiasaan Anda sehari-hari.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {behaviorQuestions.map((q, i) => (
              <div key={q.id} className="space-y-2">
                <p className="text-sm font-medium">
                  {i + 1}. {q.text}
                </p>
                <RadioGroup
                  value={behavior[q.id] ?? ""}
                  onValueChange={(v) => setBehavior({ ...behavior, [q.id]: v })}
                  className="grid grid-cols-2 gap-2"
                >
                  {[
                    { value: "yes", label: "Ya", icon: CircleCheck, className: "text-amber-500" },
                    { value: "no", label: "Tidak", icon: CircleX, className: "text-emerald-500" },
                  ].map((opt) => {
                    const selected = behavior[q.id] === opt.value;
                    return (
                      <label
                        key={opt.value}
                        className={cn(
                          "flex items-center gap-2 rounded-md border px-3 py-2 text-sm cursor-pointer transition-colors has-[:focus-visible]:border-ring has-[:focus-visible]:ring-3 has-[:focus-visible]:ring-ring/50",
                          selected ? "border-primary bg-primary/5" : "hover:bg-muted/60"
                        )}
                      >
                        <RadioGroupItem value={opt.value} className="sr-only" />
                        <opt.icon className={cn("size-4", selected ? opt.className : "text-muted-foreground/40")} />
                        {opt.label}
                      </label>
                    );
                  })}
                </RadioGroup>
              </div>
            ))}
          </CardContent>
          <StepFooter onBack={goBack} onNext={goNext} />
        </>
      )}

      {step === "risk" && (
        <>
          <CardHeader>
            <CardTitle>Identifikasi Risiko &amp; Saran</CardTitle>
            <CardDescription>Bagian 4 - opsional, bantu kami memahami kondisi di lapangan.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="riskText">Risiko keamanan data yang Anda ketahui/alami</Label>
              <Textarea
                id="riskText"
                rows={4}
                value={riskText}
                onChange={(e) => setRiskText(e.target.value)}
                placeholder="Tuliskan risiko yang Anda ketahui atau pernah alami..."
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="suggestionText">Saran perbaikan keamanan data</Label>
              <Textarea
                id="suggestionText"
                rows={4}
                value={suggestionText}
                onChange={(e) => setSuggestionText(e.target.value)}
                placeholder="Tuliskan saran Anda..."
              />
            </div>
          </CardContent>
          <CardFooter className="justify-between">
            <Button variant="outline" onClick={goBack} disabled={submitting}>
              <ChevronLeft className="size-4" /> Kembali
            </Button>
            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting && <Loader2 className="size-4 animate-spin" />}
              Submit Survey
            </Button>
          </CardFooter>
        </>
      )}
    </Card>
  );
}

function StepFooter({
  onBack,
  onNext,
  backLabel = "Kembali",
}: {
  onBack: () => void;
  onNext: () => void;
  backLabel?: string;
}) {
  return (
    <CardFooter className="justify-between">
      <Button variant="outline" onClick={onBack}>
        <ChevronLeft className="size-4" /> {backLabel}
      </Button>
      <Button onClick={onNext}>
        Lanjut <ChevronRight className="size-4" />
      </Button>
    </CardFooter>
  );
}
