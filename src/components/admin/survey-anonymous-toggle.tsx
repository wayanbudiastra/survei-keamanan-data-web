"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, EyeOff, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SurveyAnonymousToggle({
  surveyId,
  anonymousMode,
}: {
  surveyId: string;
  anonymousMode: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function toggle() {
    setLoading(true);
    try {
      const res = await fetch(`/api/surveys/${surveyId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ anonymousMode: !anonymousMode }),
      });
      if (!res.ok) throw new Error("Gagal mengubah mode anonim");
      toast.success(
        anonymousMode
          ? "Mode anonim dimatikan - form baru akan meminta nama, email, dan jabatan responden."
          : "Mode anonim diaktifkan - form hanya meminta unit/departemen tugas."
      );
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-between gap-4 rounded-md border px-3 py-2.5">
      <div className="text-sm">
        <p className="font-medium">{anonymousMode ? "Survey Anonim" : "Survey dengan Identitas"}</p>
        <p className="text-xs text-muted-foreground">
          {anonymousMode
            ? "Responden hanya mengisi unit/departemen tugas."
            : "Responden dapat mengisi nama, email, dan jabatan (opsional)."}
        </p>
      </div>
      <Button size="sm" variant="outline" disabled={loading} onClick={toggle}>
        {loading ? (
          <Loader2 className="size-4 animate-spin" />
        ) : anonymousMode ? (
          <Eye className="size-4" />
        ) : (
          <EyeOff className="size-4" />
        )}
        {anonymousMode ? "Aktifkan Identitas" : "Jadikan Anonim"}
      </Button>
    </div>
  );
}
