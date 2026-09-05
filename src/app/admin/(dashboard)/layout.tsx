import { redirect } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { auth } from "@/lib/auth";
import { AdminNav } from "@/components/admin/admin-nav";
import { SignOutButton } from "@/components/admin/sign-out-button";

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  return (
    <div className="flex-1 flex flex-col md:flex-row min-h-screen">
      <aside className="md:w-64 shrink-0 border-b md:border-b-0 md:border-r bg-background p-4 flex md:flex-col gap-4">
        <div className="flex items-center gap-2 px-1">
          <ShieldCheck className="size-5 text-primary" />
          <span className="font-semibold text-sm">Survey Awareness</span>
        </div>
        <div className="flex-1">
          <AdminNav isSuperadmin={session.user.role === "superadmin"} />
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="flex items-center justify-between border-b bg-background px-4 sm:px-6 py-3">
          <div className="text-sm">
            <p className="font-medium">{session.user.name ?? session.user.email}</p>
            <p className="text-muted-foreground text-xs capitalize">{session.user.role}</p>
          </div>
          <SignOutButton />
        </header>
        <main className="flex-1 p-4 sm:p-6 bg-muted/30">{children}</main>
      </div>
    </div>
  );
}
