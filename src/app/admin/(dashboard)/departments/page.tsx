import { listDepartments } from "@/lib/api-client";
import { CreateDepartmentDialog } from "@/components/admin/create-department-dialog";
import { DepartmentRowActions } from "@/components/admin/department-row-actions";
import { TableSearch } from "@/components/admin/table-search";
import { Pagination } from "@/components/admin/pagination";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const PAGE_SIZE = 10;

type Props = { searchParams: Promise<{ q?: string; page?: string }> };

// Department/Unit Management - CRUD, admin only (dilindungi middleware + layout).
// Pencarian + paging (10/halaman) sekarang dilakukan oleh survey-api-server
// (PostgreSQL `contains` + mode "insensitive") - lihat GET /api/departments.
export default async function DepartmentsPage({ searchParams }: Props) {
  const { q = "", page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(pageParam ?? "1", 10) || 1);

  const { items: departments, totalItems } = await listDepartments({ q: q.trim() || undefined, page, pageSize: PAGE_SIZE });
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));

  const buildHref = (targetPage: number) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    params.set("page", String(targetPage));
    return `/admin/departments?${params.toString()}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Departemen / Unit</h1>
          <p className="text-sm text-muted-foreground">
            Daftar departemen yang muncul sebagai pilihan di form survey &amp; target campaign.
          </p>
        </div>
        <CreateDepartmentDialog />
      </div>

      <Card>
        <CardContent className="p-4 border-b">
          <TableSearch placeholder="Cari nama departemen..." />
        </CardContent>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Departemen</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Dibuat</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {departments.map((dept) => (
                <TableRow key={dept.id}>
                  <TableCell className="font-medium">{dept.name}</TableCell>
                  <TableCell>
                    <Badge variant={dept.active ? "default" : "outline"}>
                      {dept.active ? "Aktif" : "Nonaktif"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {new Date(dept.createdAt).toLocaleDateString("id-ID")}
                  </TableCell>
                  <TableCell>
                    <DepartmentRowActions department={dept} />
                  </TableCell>
                </TableRow>
              ))}
              {departments.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-sm text-muted-foreground py-10">
                    {q
                      ? `Tidak ada departemen yang cocok dengan "${q}".`
                      : 'Belum ada departemen. Klik "Tambah Departemen" untuk membuat yang pertama.'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
        <Pagination page={page} totalPages={totalPages} totalItems={totalItems} pageSize={PAGE_SIZE} buildHref={buildHref} />
      </Card>
    </div>
  );
}
