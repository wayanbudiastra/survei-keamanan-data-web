// Tipe untuk level scoring - dipakai komponen UI (mis. RiskBadge) untuk
// styling. Logika kalkulasi skor sendiri (calculateAwarenessScore,
// behaviorRiskLevel, dst) sekarang berada di survey-api-server (source of
// truth tunggal) - lihat survey-api-server/src/lib/scoring.ts.

export type AwarenessLevel = "Excellent" | "Good" | "Fair" | "Poor";
export type RiskLevel = "Low" | "Medium" | "High";
