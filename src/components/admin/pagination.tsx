import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type PaginationProps = {
  page: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  /** Base path + existing query params (tanpa `page`) untuk dibangun jadi href tiap halaman. */
  buildHref: (page: number) => string;
};

// Kontrol paginasi server-rendered (link biasa, tidak perlu client component).
export function Pagination({ page, totalPages, totalItems, pageSize, buildHref }: PaginationProps) {
  if (totalItems === 0) return null;

  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, totalItems);

  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3 border-t text-sm">
      <p className="text-muted-foreground">
        Menampilkan {from}-{to} dari {totalItems}
      </p>
      <div className="flex items-center gap-2">
        <PageLink href={buildHref(page - 1)} disabled={page <= 1} label="Sebelumnya" icon="prev" />
        <span className="text-muted-foreground text-xs px-1">
          Halaman {page} / {totalPages}
        </span>
        <PageLink href={buildHref(page + 1)} disabled={page >= totalPages} label="Berikutnya" icon="next" />
      </div>
    </div>
  );
}

function PageLink({
  href,
  disabled,
  label,
  icon,
}: {
  href: string;
  disabled: boolean;
  label: string;
  icon: "prev" | "next";
}) {
  if (disabled) {
    return (
      <span className={cn(buttonVariants({ variant: "outline", size: "sm" }), "pointer-events-none opacity-50")}>
        {icon === "prev" && <ChevronLeft className="size-4" />}
        {label}
        {icon === "next" && <ChevronRight className="size-4" />}
      </span>
    );
  }

  return (
    <Link href={href} className={buttonVariants({ variant: "outline", size: "sm" })}>
      {icon === "prev" && <ChevronLeft className="size-4" />}
      {label}
      {icon === "next" && <ChevronRight className="size-4" />}
    </Link>
  );
}
