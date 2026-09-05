"use client";

import { useRouter } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function SurveySelector({
  surveys,
  selectedId,
  hrefTemplate = "/admin/dashboard?survey=:id",
}: {
  surveys: { id: string; title: string; status: string }[];
  selectedId: string;
  /**
   * Tujuan navigasi saat survey diganti - string template dengan placeholder
   * `:id` (BUKAN function - komponen ini "use client", fungsi dari Server
   * Component tidak bisa diserialisasi lewat props). Default: dashboard
   * overview. Contoh lain: "/admin/surveys/:id/results".
   */
  hrefTemplate?: string;
}) {
  const router = useRouter();

  return (
    <Select value={selectedId} onValueChange={(v) => v && router.push(hrefTemplate.replace(":id", v))}>
      <SelectTrigger className="w-full sm:w-[320px]">
        <SelectValue placeholder="Pilih survey" />
      </SelectTrigger>
      <SelectContent>
        {surveys.map((s) => (
          <SelectItem key={s.id} value={s.id}>
            {s.title} ({s.status})
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
