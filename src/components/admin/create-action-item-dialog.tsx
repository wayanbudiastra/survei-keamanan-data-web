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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Survey = { id: string; title: string };

export function CreateActionItemDialog({ surveys }: { surveys: Survey[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("MEDIUM");
  const [owner, setOwner] = useState("");
  const [targetDept, setTargetDept] = useState("");
  const [targetDate, setTargetDate] = useState(() =>
    new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
  );
  const [surveyId, setSurveyId] = useState<string>(surveys[0]?.id ?? "");
  const [notes, setNotes] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/action-items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          priority,
          owner,
          targetDept: targetDept || undefined,
          targetDate,
          surveyId: surveyId || undefined,
          notes: notes || undefined,
        }),
      });
      if (!res.ok) throw new Error("Gagal membuat action item");
      toast.success("Action item berhasil dibuat");
      setOpen(false);
      setTitle("");
      setOwner("");
      setTargetDept("");
      setNotes("");
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
        <Plus className="size-4" /> Buat Action Item
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Buat Action Item</DialogTitle>
            <DialogDescription>Tindak lanjut hasil survey dengan owner &amp; deadline jelas.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-1.5">
              <Label htmlFor="ai-title">Judul *</Label>
              <Input id="ai-title" required value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Priority</Label>
                <Select value={priority} onValueChange={(v) => v && setPriority(v)}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="HIGH">High</SelectItem>
                    <SelectItem value="MEDIUM">Medium</SelectItem>
                    <SelectItem value="LOW">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="ai-date">Target Tanggal</Label>
                <Input id="ai-date" type="date" value={targetDate} onChange={(e) => setTargetDate(e.target.value)} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="ai-owner">Owner *</Label>
                <Input id="ai-owner" required value={owner} onChange={(e) => setOwner(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="ai-dept">Target Departemen</Label>
                <Input id="ai-dept" value={targetDept} onChange={(e) => setTargetDept(e.target.value)} />
              </div>
            </div>
            {surveys.length > 0 && (
              <div className="space-y-1.5">
                <Label>Terkait Survey</Label>
                <Select value={surveyId} onValueChange={(v) => v && setSurveyId(v)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih survey (opsional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {surveys.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="space-y-1.5">
              <Label htmlFor="ai-notes">Catatan</Label>
              <Textarea id="ai-notes" rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} />
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
