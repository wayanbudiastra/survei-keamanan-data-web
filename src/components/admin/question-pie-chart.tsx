"use client";

// Pie chart untuk distribusi jawaban satu pertanyaan - alternatif tampilan
// ketiga selain QuestionDistributionBar (100%-stacked) dan QuestionBarChart
// (bar klasik). Legend + tooltip selalu tampil (warna tidak pernah jadi
// satu-satunya penanda identitas - lihat skill dataviz).

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

type DistributionEntry<T> = { value: T; count: number; percentage: number };
type ChartDatum = { label: string; count: number; percentage: number; fill: string };

function CustomTooltip({ active, payload }: { active?: boolean; payload?: { payload: ChartDatum }[] }) {
  if (!active || !payload?.length) return null;
  const item = payload[0].payload;
  return (
    <div className="rounded-md border bg-popover px-3 py-2 text-xs shadow-md">
      <p className="font-medium text-popover-foreground">{item.label}</p>
      <p className="text-muted-foreground">
        <span className="font-semibold text-foreground">{item.count}</span> responden (
        {item.percentage.toFixed(1)}%)
      </p>
    </div>
  );
}

export function QuestionPieChart<T extends string | number>({
  distribution,
  colorForValue,
  labelForValue,
}: {
  distribution: DistributionEntry<T>[];
  colorForValue: (value: T) => string;
  labelForValue: (value: T) => string;
}) {
  const total = distribution.reduce((acc, d) => acc + d.count, 0);

  if (total === 0) {
    return (
      <div className="flex h-8 items-center justify-center rounded-md bg-muted text-xs text-muted-foreground">
        Belum ada jawaban
      </div>
    );
  }

  const chartData: ChartDatum[] = distribution
    .filter((d) => d.count > 0)
    .map((d) => ({
      label: labelForValue(d.value),
      count: d.count,
      percentage: d.percentage,
      fill: colorForValue(d.value),
    }));

  return (
    <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-center">
      <div className="h-[170px] w-full shrink-0 sm:w-[170px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="label"
              innerRadius={38}
              outerRadius={72}
              paddingAngle={2}
              stroke="var(--card)"
              strokeWidth={2}
            >
              {chartData.map((entry) => (
                <Cell key={entry.label} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex w-full flex-1 flex-col gap-1.5">
        {chartData.map((entry) => (
          <div key={entry.label} className="flex items-center gap-2 text-xs">
            <span className="size-2.5 shrink-0 rounded-full" style={{ backgroundColor: entry.fill }} />
            <span className="flex-1 truncate text-muted-foreground" title={entry.label}>
              {entry.label}
            </span>
            <span className="shrink-0 font-medium tabular-nums">
              {entry.count} ({entry.percentage.toFixed(1)}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
