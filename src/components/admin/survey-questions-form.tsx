"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { EditableQuestion } from "@/lib/api-client";

type Props = {
  surveyId: string;
  awareness: EditableQuestion[];
  behavior: EditableQuestion[];
};

export function SurveyQuestionsForm({ surveyId, awareness, behavior }: Props) {
  const router = useRouter();
  const [awarenessText, setAwarenessText] = useState<Record<string, string>>(
    Object.fromEntries(awareness.map((q) => [q.questionId, q.text]))
  );
  const [behaviorText, setBehaviorText] = useState<Record<string, string>>(
    Object.fromEntries(behavior.map((q) => [q.questionId, q.text]))
  );
  const [awarenessActive, setAwarenessActive] = useState<Record<string, boolean>>(
    Object.fromEntries(awareness.map((q) => [q.questionId, q.active]))
  );
  const [behaviorActive, setBehaviorActive] = useState<Record<string, boolean>>(
    Object.fromEntries(behavior.map((q) => [q.questionId, q.active]))
  );
  const [saving, setSaving] = useState(false);

  const dirty =
    awareness.some(
      (q) => awarenessText[q.questionId] !== q.text || awarenessActive[q.questionId] !== q.active
    ) ||
    behavior.some(
      (q) => behaviorText[q.questionId] !== q.text || behaviorActive[q.questionId] !== q.active
    );

  async function handleSave() {
    setSaving(true);
    try {
      const questions: EditableQuestion[] = [
        ...awareness.map((q) => ({
          questionId: q.questionId,
          text: awarenessText[q.questionId].trim(),
          active: awarenessActive[q.questionId],
        })),
        ...behavior.map((q) => ({
          questionId: q.questionId,
          text: behaviorText[q.questionId].trim(),
          active: behaviorActive[q.questionId],
        })),
      ];

      const empty = questions.find((q) => q.text.length < 3);
      if (empty) {
        toast.error("Setiap pertanyaan minimal 3 karakter.");
        return;
      }

      const res = await fetch(`/api/surveys/${surveyId}/questions`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questions }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(typeof body.error === "string" ? body.error : "Gagal menyimpan pertanyaan");
      }

      toast.success("Pertanyaan berhasil disimpan.");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Awareness Assessment (skala 1-5)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {awareness.map((q, i) => (
            <div
              key={q.questionId}
              className={cn("space-y-1.5 rounded-md border p-3", !awarenessActive[q.questionId] && "opacity-60")}
            >
              <div className="flex items-center justify-between gap-3">
                <Label htmlFor={q.questionId}>
                  {i + 1}. {q.questionId}
                </Label>
                <label className="flex items-center gap-2 text-xs text-muted-foreground shrink-0">
                  {awarenessActive[q.questionId] ? "Aktif" : "Nonaktif"}
                  <Switch
                    checked={awarenessActive[q.questionId]}
                    onCheckedChange={(v) => setAwarenessActive({ ...awarenessActive, [q.questionId]: v })}
                  />
                </label>
              </div>
              <Textarea
                id={q.questionId}
                rows={2}
                value={awarenessText[q.questionId] ?? ""}
                onChange={(e) => setAwarenessText({ ...awarenessText, [q.questionId]: e.target.value })}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Behavior Risk Assessment (Ya/Tidak)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {behavior.map((q, i) => (
            <div
              key={q.questionId}
              className={cn("space-y-1.5 rounded-md border p-3", !behaviorActive[q.questionId] && "opacity-60")}
            >
              <div className="flex items-center justify-between gap-3">
                <Label htmlFor={q.questionId}>
                  {i + 1}. {q.questionId}
                </Label>
                <label className="flex items-center gap-2 text-xs text-muted-foreground shrink-0">
                  {behaviorActive[q.questionId] ? "Aktif" : "Nonaktif"}
                  <Switch
                    checked={behaviorActive[q.questionId]}
                    onCheckedChange={(v) => setBehaviorActive({ ...behaviorActive, [q.questionId]: v })}
                  />
                </label>
              </div>
              <Textarea
                id={q.questionId}
                rows={2}
                value={behaviorText[q.questionId] ?? ""}
                onChange={(e) => setBehaviorText({ ...behaviorText, [q.questionId]: e.target.value })}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex justify-end sticky bottom-4">
        <Button onClick={handleSave} disabled={saving || !dirty} size="lg">
          {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
          Simpan Perubahan
        </Button>
      </div>
    </div>
  );
}
