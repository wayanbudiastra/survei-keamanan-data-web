import Link from "next/link";
import { listActiveDepartments, listSurveys } from "@/lib/api-client";
import { CreateSurveyDialog } from "@/components/admin/create-survey-dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const STATUS_VARIANT: Record<string, "default" | "secondary" | "outline"> = {
  draft: "outline",
  active: "default",
  closed: "secondary",
};

// Survey Management page - list, create. A2/A3/A4.
export default async function SurveysPage() {
  const [surveys, departments] = await Promise.all([listSurveys(), listActiveDepartments()]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Survey Management</h1>
          <p className="text-sm text-muted-foreground">Kelola campaign survey awareness keamanan data.</p>
        </div>
        <CreateSurveyDialog departments={departments.map((d) => d.name)} />
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Judul</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Respondents</TableHead>
                <TableHead>Periode</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {surveys.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-medium">{s.title}</TableCell>
                  <TableCell>
                    <Badge variant={STATUS_VARIANT[s.status]} className="capitalize">
                      {s.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{s.totalRespondents}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {new Date(s.startDate).toLocaleDateString("id-ID")} -{" "}
                    {new Date(s.endDate).toLocaleDateString("id-ID")}
                  </TableCell>
                  <TableCell className="text-right">
                    <Link href={`/admin/surveys/${s.id}`} className="text-sm text-primary hover:underline">
                      Kelola
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
              {surveys.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-sm text-muted-foreground py-10">
                    Belum ada survey. Klik &quot;Buat Survey&quot; untuk membuat campaign pertama.
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
