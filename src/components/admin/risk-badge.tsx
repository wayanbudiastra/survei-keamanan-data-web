import { CircleCheck, TriangleAlert, OctagonAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import type { RiskLevel } from "@/lib/scoring";

// Status palette (fixed, never themed) - good/warning/critical.
// Selalu dipasangkan dengan icon + label, tidak pernah warna saja.
const STYLES: Record<RiskLevel, { icon: typeof CircleCheck; className: string; label: string }> = {
  Low: {
    icon: CircleCheck,
    className: "bg-[#0ca30c]/10 text-[#0ca30c] dark:text-[#0ca30c] border-[#0ca30c]/30",
    label: "Rendah",
  },
  Medium: {
    icon: TriangleAlert,
    className: "bg-[#fab219]/15 text-[#9a6b00] dark:text-[#fab219] border-[#fab219]/40",
    label: "Sedang",
  },
  High: {
    icon: OctagonAlert,
    className: "bg-[#d03b3b]/10 text-[#d03b3b] dark:text-[#e66767] border-[#d03b3b]/30",
    label: "Tinggi",
  },
};

export function RiskBadge({ level }: { level: RiskLevel }) {
  const { icon: Icon, className, label } = STYLES[level];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium",
        className
      )}
    >
      <Icon className="size-3.5" />
      {label}
    </span>
  );
}
