import { listActionItems, listSurveys } from "@/lib/api-client";
import { CreateActionItemDialog } from "@/components/admin/create-action-item-dialog";
import { ActionItemStatusSelect } from "@/components/admin/action-item-status-select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const PRIORITY_VARIANT: Record<string, "destructive" | "default" | "secondary"> = {
  HIGH: "destructive",
  MEDIUM: "default",
  LOW: "secondary",
};

// Action Item Tracker. A11.
export default async function ActionItemsPage() {
  const [items, surveys] = await Promise.all([listActionItems(), listSurveys()]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Action Item Tracker</h1>
          <p className="text-sm text-muted-foreground">
            Tindak lanjut hasil survey dengan owner, priority, dan deadline.
          </p>
        </div>
        <CreateActionItemDialog surveys={surveys.map((s) => ({ id: s.id, title: s.title }))} />
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Action Item</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Target</TableHead>
                <TableHead>Survey</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium max-w-[280px]">
                    <p>{item.title}</p>
                    {item.notes && <p className="text-xs text-muted-foreground mt-0.5">{item.notes}</p>}
                  </TableCell>
                  <TableCell>
                    <Badge variant={PRIORITY_VARIANT[item.priority]}>{item.priority}</Badge>
                  </TableCell>
                  <TableCell className="text-sm">{item.owner}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {new Date(item.targetDate).toLocaleDateString("id-ID")}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{item.survey?.title ?? "-"}</TableCell>
                  <TableCell>
                    <ActionItemStatusSelect id={item.id} status={item.status} />
                  </TableCell>
                </TableRow>
              ))}
              {items.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-sm text-muted-foreground py-10">
                    Belum ada action item.
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
