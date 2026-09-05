"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ClipboardList, ListChecks, FileClock, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/surveys", label: "Survey Management", icon: ClipboardList },
  { href: "/admin/departments", label: "Departemen / Unit", icon: Building2 },
  { href: "/admin/action-items", label: "Action Items", icon: ListChecks },
] as const;

export function AdminNav({ isSuperadmin }: { isSuperadmin: boolean }) {
  const pathname = usePathname();

  const items = isSuperadmin
    ? [...NAV_ITEMS, { href: "/admin/audit-logs", label: "Audit Log", icon: FileClock }]
    : NAV_ITEMS;

  return (
    <nav className="flex flex-col gap-1">
      {items.map((item) => {
        const active = pathname === item.href || pathname.startsWith(item.href + "/");
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <Icon className="size-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
