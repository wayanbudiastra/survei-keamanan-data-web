// Bar 100%-stacked horizontal generik untuk distribusi jawaban satu
// pertanyaan (awareness 5 segmen ATAU behavior 2 segmen). Tidak perlu "use
// client" - murni presentational, tooltip pakai native `title` attribute
// per segmen (accessible, tanpa JS tambahan).

type DistributionEntry<T> = { value: T; count: number; percentage: number };

export function QuestionDistributionBar<T extends string | number>({
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

  return (
    <div className="flex h-8 w-full overflow-hidden rounded-md ring-1 ring-border">
      {distribution
        .filter((d) => d.percentage > 0)
        .map((d) => (
          <div
            key={String(d.value)}
            title={`${labelForValue(d.value)}: ${d.count} responden (${d.percentage.toFixed(1)}%)`}
            className="flex h-full items-center justify-center text-[10px] font-medium text-white transition-opacity first:rounded-l-md last:rounded-r-md hover:opacity-90"
            style={{ width: `${d.percentage}%`, backgroundColor: colorForValue(d.value) }}
          >
            {d.percentage >= 8 ? `${Math.round(d.percentage)}%` : ""}
          </div>
        ))}
    </div>
  );
}
