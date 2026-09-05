"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const TRANSITIONS: Record<string, { next: string; label: string; variant?: "default" | "destructive" }[]> = {
  draft: [{ next: "active", label: "Aktifkan Survey" }],
  active: [{ next: "closed", label: "Tutup Survey", variant: "destructive" }],
  closed: [{ next: "active", label: "Buka Kembali" }],
};

export function SurveyStatusActions({ surveyId, status }: { surveyId: string; status: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function changeStatus(next: string) {
    setLoading(true);
    try {
      const res = await fetch(`/api/surveys/${surveyId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      if (!res.ok) throw new Error("Gagal mengubah status survey");
      toast.success("Status survey diperbarui");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  }

  const options = TRANSITIONS[status] ?? [];

  return (
    <div className="flex gap-2">
      {options.map((opt) => (
        <Button key={opt.next} size="sm" variant={opt.variant ?? "default"} disabled={loading} onClick={() => changeStatus(opt.next)}>
          {loading && <Loader2 className="size-4 animate-spin" />}
          {opt.label}
        </Button>
      ))}
    </div>
  );
}
