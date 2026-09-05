"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Item = { questionId: string; text: string; avgScore: number };

// Sequential blue, satu hue - skor 1-5, mark lebih gelap = mendekati target.
const BAR_COLOR = "#2a78d6";
const TARGET_COLOR = "#94a3b8";

function CustomTooltip({ active, payload }: { active?: boolean; payload?: { payload: Item }[] }) {
  if (!active || !payload?.length) return null;
  const item = payload[0].payload;
  return (
    <div className="rounded-md border bg-popover px-3 py-2 text-xs shadow-md max-w-[240px]">
      <p className="font-medium text-popover-foreground mb-1">{item.text}</p>
      <p className="text-muted-foreground">
        Skor rata-rata: <span className="font-semibold text-foreground">{item.avgScore.toFixed(2)}</span> / 5
      </p>
    </div>
  );
}

export function AwarenessBarChart({ data }: { data: Item[] }) {
  const chartData = data.map((d, i) => ({ ...d, label: `Q${i + 1}` }));

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={chartData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border" />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 11 }}
          tickLine={false}
          axisLine={{ className: "stroke-border" }}
        />
        <YAxis
          domain={[0, 5]}
          tick={{ fontSize: 11 }}
          tickLine={false}
          axisLine={false}
          width={28}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "var(--muted)" }} />
        <Bar dataKey="avgScore" radius={[4, 4, 0, 0]} maxBarSize={36}>
          {chartData.map((entry) => (
            <Cell key={entry.questionId} fill={entry.avgScore >= 4 ? BAR_COLOR : TARGET_COLOR} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
