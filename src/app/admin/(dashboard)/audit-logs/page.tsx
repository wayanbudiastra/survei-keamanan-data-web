import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { listAuditLogs } from "@/lib/api-client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const ACTION_VARIANT: Record<string, "default" | "destructive" | "secondary" | "outline"> = {
  CREATE: "default",
  UPDATE: "secondary",
  DELETE: "destructive",
  EXPORT: "outline",
  LOGIN: "outline",
};

// Audit Trail / Logs (superadmin only). A12.
export default async function AuditLogsPage() {
  const session = await auth();
  if (session?.user.role !== "superadmin") redirect("/admin/dashboard");

  const logs = await listAuditLogs(200);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Audit Log</h1>
        <p className="text-sm text-muted-foreground">
          Catatan seluruh aksi admin untuk kebutuhan compliance KARS MRMIK 2.1.3.
        </p>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Waktu</TableHead>
                <TableHead>Aksi</TableHead>
                <TableHead>Entity</TableHead>
                <TableHead>User</TableHead>
                <TableHead>IP</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                    {new Date(log.createdAt).toLocaleString("id-ID")}
                  </TableCell>
                  <TableCell>
                    <Badge variant={ACTION_VARIANT[log.action] ?? "outline"}>{log.action}</Badge>
                  </TableCell>
                  <TableCell className="text-sm">
                    {log.entityType}
                    {log.entityId && <span className="text-muted-foreground"> #{log.entityId.slice(0, 8)}</span>}
                  </TableCell>
                  <TableCell className="text-sm">{log.user?.name ?? log.user?.email ?? "-"}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{log.ipAddress ?? "-"}</TableCell>
                </TableRow>
              ))}
              {logs.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-sm text-muted-foreground py-10">
                    Belum ada log.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
