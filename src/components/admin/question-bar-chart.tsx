// Bar chart klasik (satu bar per pilihan jawaban) untuk distribusi jawaban
// satu pertanyaan - alternatif tampilan dari QuestionDistributionBar (yang
// 100%-stacked jadi satu bar). Skala tetap 0-100% di semua baris/pertanyaan
// supaya panjang bar bisa dibandingkan apa adanya antar kartu.

type DistributionEntry<T> = { value: T; count: number; percentage: number };

export function QuestionBarChart<T extends string | number>({
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
    <div className="space-y-1.5">
      {distribution.map((d) => (
        <div key={String(d.value)} className="flex items-center gap-2.5">
          <span className="w-28 shrink-0 truncate text-xs text-muted-foreground" title={labelForValue(d.value)}>
            {labelForValue(d.value)}
          </span>
          <div className="h-5 flex-1 overflow-hidden rounded bg-muted">
            <div
              className="h-full rounded transition-[width]"
              style={{ width: `${d.percentage}%`, backgroundColor: colorForValue(d.value) }}
              title={`${d.count} responden (${d.percentage.toFixed(1)}%)`}
            />
          </div>
          <span className="w-14 shrink-0 text-right text-xs font-medium tabular-nums">
            {d.percentage.toFixed(1)}%
          </span>
        </div>
      ))}
    </div>
  );
}
