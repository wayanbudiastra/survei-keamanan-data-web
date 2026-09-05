"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";

export function CreateSurveyDialog({ departments }: { departments: string[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [endDate, setEndDate] = useState(() =>
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
  );
  const [depts, setDepts] = useState<string[]>([]);
  const [anonymousMode, setAnonymousMode] = useState(true);

  function toggleDept(dept: string) {
    setDepts((prev) => (prev.includes(dept) ? prev.filter((d) => d !== dept) : [...prev, dept]));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/surveys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description: description || undefined,
          startDate,
          endDate,
          targetDepartments: depts,
          anonymousMode,
        }),
      });
      if (!res.ok) throw new Error("Gagal membuat survey");
      toast.success("Survey berhasil dibuat sebagai draft.");
      setOpen(false);
      setTitle("");
      setDescription("");
      setDepts([]);
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button size="sm" />}>
        <Plus className="size-4" /> Buat Survey
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Buat Survey Campaign</DialogTitle>
            <DialogDescription>Survey dibuat sebagai draft, aktifkan setelah siap.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-1.5">
              <Label htmlFor="title">Judul Survey *</Label>
              <Input id="title" required value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="description">Deskripsi</Label>
              <Textarea
                id="description"
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="startDate">Tanggal Mulai</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="endDate">Tanggal Selesai</Label>
                <Input id="endDate" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
              </div>
            </div>
            <label className="flex items-start gap-2 rounded-md border px-3 py-2.5 text-sm cursor-pointer">
              <Checkbox checked={anonymousMode} onCheckedChange={(v) => setAnonymousMode(v === true)} className="mt-0.5" />
              <span>
                <span className="font-medium">Survey anonim</span>
                <br />
                <span className="text-xs text-muted-foreground">
                  Responden cukup mengisi unit/departemen tugas, tanpa nama, email, atau jabatan. Bisa diubah
                  kapan saja lewat halaman kelola survey.
                </span>
              </span>
            </label>
            <div className="space-y-1.5">
              <Label>Target Departemen</Label>
              {departments.length === 0 ? (
                <p className="text-xs text-muted-foreground">
                  Belum ada departemen. Tambahkan lewat menu &quot;Departemen / Unit&quot;.
                </p>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {departments.map((d) => (
                    <label key={d} className="flex items-center gap-2 text-sm">
                      <Checkbox checked={depts.includes(d)} onCheckedChange={() => toggleDept(d)} />
                      {d}
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="size-4 animate-spin" />}
              Simpan
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
