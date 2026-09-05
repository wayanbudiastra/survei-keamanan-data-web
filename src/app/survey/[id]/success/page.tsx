import { CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Page 6: Success Confirmation - halaman akhir, tidak mengarahkan ke mana pun.
export default function SurveySuccessPage() {
  return (
    <main className="flex-1 flex items-center justify-center px-4 py-12">
      <Card className="max-w-md w-full">
        <CardHeader className="items-center text-center space-y-3">
          <div className="rounded-full bg-emerald-500/10 p-4">
            <CheckCircle2 className="size-8 text-emerald-600" />
          </div>
          <CardTitle className="text-xl">Terima Kasih!</CardTitle>
          <CardDescription>
            Jawaban Anda berhasil disimpan. Terima kasih sudah meluangkan waktu untuk
            berpartisipasi mengikuti survey ini — kontribusi Anda membantu meningkatkan
            keamanan data di lingkungan kerja kita.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-sm text-muted-foreground">
            Anda dapat menutup halaman ini sekarang.
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
