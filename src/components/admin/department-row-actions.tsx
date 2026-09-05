"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Pencil, Trash2, Loader2, Power } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type Department = { id: string; name: string; active: boolean };

export function DepartmentRowActions({ department }: { department: Department }) {
  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);
  const [name, setName] = useState(department.name);
  const [loading, setLoading] = useState(false);

  async function handleRename(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`/api/departments/${department.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Gagal memperbarui departemen");
      }
      toast.success("Departemen berhasil diperbarui");
      setEditOpen(false);
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  }

  async function toggleActive() {
    setLoading(true);
    try {
      const res = await fetch(`/api/departments/${department.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !department.active }),
      });
      if (!res.ok) throw new Error("Gagal mengubah status departemen");
      toast.success(department.active ? "Departemen dinonaktifkan" : "Departemen diaktifkan");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!window.confirm(`Hapus departemen "${department.name}"? Tindakan ini tidak bisa dibatalkan.`)) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/departments/${department.id}`, { method: "DELETE" });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Gagal menghapus departemen");
      }
      toast.success("Departemen dihapus");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex justify-end gap-1">
      <Button size="icon-sm" variant="ghost" disabled={loading} onClick={toggleActive} title={department.active ? "Nonaktifkan" : "Aktifkan"}>
        <Power className="size-3.5" />
      </Button>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogTrigger render={<Button size="icon-sm" variant="ghost" title="Ubah nama" />}>
          <Pencil className="size-3.5" />
        </DialogTrigger>
        <DialogContent className="sm:max-w-sm">
          <form onSubmit={handleRename}>
            <DialogHeader>
              <DialogTitle>Ubah Nama Departemen</DialogTitle>
              <DialogDescription>Nama lama tetap tersimpan pada data respondent sebelumnya.</DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-1.5">
              <Label htmlFor={`dept-name-${department.id}`}>Nama Departemen *</Label>
              <Input
                id={`dept-name-${department.id}`}
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
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

      <Button size="icon-sm" variant="ghost" disabled={loading} onClick={handleDelete} title="Hapus">
        <Trash2 className="size-3.5 text-destructive" />
      </Button>
    </div>
  );
}
