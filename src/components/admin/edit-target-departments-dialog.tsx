"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Pencil, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type Props = {
  surveyId: string;
  /** Semua departemen aktif saat ini (termasuk yang baru dibuat setelah survey ini ada). */
  allDepartments: string[];
  /** Departemen yang sedang jadi target survey ini (snapshot saat dibuat/terakhir diedit). */
  currentTargets: string[];
};

// Edit target departemen survey yang SUDAH ADA - dibutuhkan karena
// targetDepartments cuma snapshot nama departemen saat survey dibuat/
// terakhir diedit. Departemen baru yang dibuat belakangan TIDAK otomatis
// masuk ke survey lama - admin perlu menambahkannya manual di sini.
export function EditTargetDepartmentsDialog({ surveyId, allDepartments, currentTargets }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selected, setSelected] = useState<string[]>(currentTargets);

  function toggle(dept: string) {
    setSelected((prev) => (prev.includes(dept) ? prev.filter((d) => d !== dept) : [...prev, dept]));
  }

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch(`/api/surveys/${surveyId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetDepartments: selected }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(typeof body.error === "string" ? body.error : "Gagal menyimpan target departemen");
      }
      toast.success("Target departemen berhasil diperbarui.");
      setOpen(false);
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setSaving(false);
    }
  }

  // Departemen lama yang tersimpan di survey ini tapi sudah dihapus/tidak
  // aktif lagi di master data - tetap ditampilkan (tercentang) supaya admin
  // sadar dan bisa memilih untuk melepasnya, bukan hilang diam-diam.
  const staleTargets = currentTargets.filter((d) => !allDepartments.includes(d));
  const options = [...allDepartments, ...staleTargets];

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (v) setSelected(currentTargets);
      }}
    >
      <DialogTrigger render={<Button size="sm" variant="ghost" />}>
        <Pencil className="size-3.5" /> Edit
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Target Departemen</DialogTitle>
          <DialogDescription>
            Termasuk departemen yang baru dibuat setelah survey ini ada - centang untuk menambahkannya sebagai
            target.
          </DialogDescription>
        </DialogHeader>
        <div className="py-2">
          {options.length === 0 ? (
            <p className="text-xs text-muted-foreground">
              Belum ada departemen. Tambahkan lewat menu &quot;Departemen / Unit&quot;.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {options.map((d) => (
                <label key={d} className="flex items-center gap-2 text-sm">
                  <Checkbox checked={selected.includes(d)} onCheckedChange={() => toggle(d)} />
                  {d}
                  {staleTargets.includes(d) && (
                    <span className="text-[10px] text-muted-foreground">(nonaktif)</span>
                  )}
                </label>
              ))}
            </div>
          )}
        </div>
        <DialogFooter>
          <Button onClick={handleSave} disabled={saving}>
            {saving && <Loader2 className="size-4 animate-spin" />}
            Simpan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
