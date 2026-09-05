import { CircleCheck, ThumbsUp, TriangleAlert, OctagonAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AwarenessLevel } from "@/lib/scoring";

// Varian badge untuk level awareness (Excellent/Good/Fair/Poor) - pola sama
// persis dengan RiskBadge, memakai palet warna yang sudah ada di app (status
// good/warning/critical dari risk-badge.tsx + biru brand dari awareness-bar-chart.tsx)
// supaya tidak memperkenalkan palet baru.
const STYLES: Record<AwarenessLevel, { icon: typeof CircleCheck; className: string; label: string }> = {
  Excellent: {
    icon: CircleCheck,
    className: "bg-[#0ca30c]/10 text-[#0ca30c] dark:text-[#0ca30c] border-[#0ca30c]/30",
    label: "Sangat Baik",
  },
  Good: {
    icon: ThumbsUp,
    className: "bg-[#2a78d6]/10 text-[#2a78d6] dark:text-[#3987e5] border-[#2a78d6]/30",
    label: "Baik",
  },
  Fair: {
    icon: TriangleAlert,
    className: "bg-[#fab219]/15 text-[#9a6b00] dark:text-[#fab219] border-[#fab219]/40",
    label: "Cukup",
  },
  Poor: {
    icon: OctagonAlert,
    className: "bg-[#d03b3b]/10 text-[#d03b3b] dark:text-[#e66767] border-[#d03b3b]/30",
    label: "Kurang",
  },
};

export function AwarenessLevelBadge({ level }: { level: AwarenessLevel }) {
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
