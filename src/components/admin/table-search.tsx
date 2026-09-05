"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

/**
 * Search box yang menyinkronkan nilainya ke query param `q` di URL (debounced),
 * dan mereset `page` ke 1 setiap kali pencarian berubah. Server component yang
 * merender tabel membaca `q`/`page` dari searchParams.
 */
export function TableSearch({ placeholder = "Cari..." }: { placeholder?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get("q") ?? "");

  useEffect(() => {
    setValue(searchParams.get("q") ?? "");
  }, [searchParams]);

  useEffect(() => {
    const current = searchParams.get("q") ?? "";
    if (value === current) return;

    const timeout = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) params.set("q", value);
      else params.delete("q");
      params.delete("page");
      router.push(`${pathname}?${params.toString()}`);
    }, 300);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <div className="relative w-full sm:w-64">
      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="pl-8 pr-8"
      />
      {value && (
        <Button
          type="button"
          size="icon-xs"
          variant="ghost"
          className="absolute right-1 top-1/2 -translate-y-1/2"
          onClick={() => setValue("")}
        >
          <X className="size-3.5" />
        </Button>
      )}
    </div>
  );
}
