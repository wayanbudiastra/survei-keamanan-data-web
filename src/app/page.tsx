import Link from "next/link";
import { ShieldCheck, ClipboardList, LayoutDashboard } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <main className="flex-1 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl space-y-8 text-center">
        <div className="flex flex-col items-center gap-3">
          <div className="rounded-full bg-primary/10 p-4">
            <ShieldCheck className="size-10 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">
            Security Awareness Survey System
          </h1>
          <p className="text-muted-foreground max-w-md">
            Survey kesadaran &amp; perilaku keamanan data pasien sesuai KARS MRMIK
            2.1.3 dan UU No. 27/2022 tentang Perlindungan Data Pribadi.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <CardHeader className="items-center text-center">
              <ClipboardList className="size-6 text-primary mb-1" />
              <CardTitle className="text-base">Staff / Responden</CardTitle>
              <CardDescription>
                Isi survey via link atau QR code yang dibagikan admin Anda.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground">
              Butuh link survey aktif dari admin MRMIK/IT untuk mulai mengisi.
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="items-center text-center">
              <LayoutDashboard className="size-6 text-primary mb-1" />
              <CardTitle className="text-base">Admin</CardTitle>
              <CardDescription>
                Kelola campaign survey, pantau dashboard, dan kelola action item.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/admin/login" className={buttonVariants({ size: "sm" })}>
                Masuk ke Dashboard
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
