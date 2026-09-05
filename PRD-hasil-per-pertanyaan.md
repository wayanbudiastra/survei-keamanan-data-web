PRD - Hasil Survey per Pertanyaan (Distribusi Persentase)
================================================================================

Status   : Draft - siap dikembangkan
Terkait  : survey-api-server (backend sudah selesai & live di endpoint di
           bawah), survey-security-awernes (Next.js admin dashboard - scope
           PRD ini)
Dibuat   : 2026-08-28


RINGKASAN
================================================================================

Dashboard admin saat ini (`/admin/dashboard`) hanya menampilkan RATA-RATA
skor per pertanyaan awareness (`AwarenessBarChart`, skala 1-5) dan daftar
"Top Risk Areas" berbasis persentase "Ya" tertinggi untuk behavior. Admin
TIDAK bisa melihat sebaran jawaban yang sebenarnya per pertanyaan - misalnya
untuk `awareness_1`, berapa persen responden yang menjawab 1, 2, 3, 4, atau 5.
Rata-rata 3.5 bisa menyembunyikan populasi yang sangat terpolarisasi (banyak
yang menjawab 1 dan 5) vs yang seragam di tengah (banyak menjawab 3-4) -
dua kondisi ini butuh tindak lanjut yang beda, tapi terlihat sama di skor
rata-rata saja.

Fitur ini menambahkan halaman/tampilan baru yang menunjukkan, untuk SETIAP
pertanyaan (awareness maupun behavior), persentase tiap pilihan jawaban -
bukan cuma agregatnya.


LATAR BELAKANG & MASALAH
================================================================================

- Tim MRMIK/manajemen RS perlu tahu pola jawaban riil per pertanyaan untuk
  menentukan materi training yang tepat sasaran (mis. kalau 40% menjawab 1-2
  di pertanyaan tentang UU PDP, itu beda penanganan dengan yang tersebar rata).
- Endpoint backend untuk data ini SUDAH ADA dan sudah diuji:
  `GET /api/analytics/:surveyId/questions` (lihat survey-api-server/PRD.md
  bagian ANALYTICS untuk kontrak lengkap). PRD ini fokus HANYA pada
  konsumsi endpoint tersebut di sisi frontend (Next.js admin app).
- Client function pemanggil endpoint sudah tersedia di
  `src/lib/api-client.ts`: `getQuestionResults(surveyId)`, mengembalikan
  type `QuestionResultDistribution`.


TUJUAN (GOALS)
================================================================================

1. Admin bisa melihat, per pertanyaan awareness (skala 1-5), persentase
   responden yang memilih tiap nilai 1-5 - dalam bentuk visual (chart),
   bukan tabel angka mentah.
2. Admin bisa melihat, per pertanyaan behavior (Yes/No), persentase Yes vs
   No per pertanyaan - dalam bentuk visual.
3. Data bisa difilter per survey (pakai survey selector yang sudah ada,
   pola sama seperti di `/admin/dashboard`).
4. Tetap konsisten dengan design system yang sudah ada (shadcn/ui components,
   Recharts, warna & pola chart mengikuti `AwarenessBarChart` yang sudah ada).
5. Menangani kondisi survey belum punya respondent (empty state), dan survey
   tidak ditemukan (404) dengan baik.


NON-GOALS (DI LUAR SCOPE)
================================================================================

- TIDAK mengubah/menghapus chart rata-rata yang sudah ada di
  `/admin/dashboard` (AwarenessBarChart, Top Risk Areas, dst) - fitur ini
  MELENGKAPI, bukan menggantikan.
- TIDAK membuat filter breakdown per departemen untuk halaman ini (heatmap
  per departemen sudah ada terpisah di dashboard existing). Bisa jadi
  enhancement lanjutan, di luar scope PRD ini.
- TIDAK mencakup pertanyaan bertipe `text` (free-text seperti saran/risiko) -
  endpoint backend juga tidak menghitung persentase untuk tipe ini (tidak
  relevan secara statistik untuk jawaban bebas).
- TIDAK membuat endpoint/backend baru - backend sudah selesai, PRD ini murni
  sisi konsumsi/UI.
- TIDAK termasuk export PDF/Excel dari chart ini (ikuti mekanisme export
  yang sudah ada di project kalau sudah ada, atau jadi PRD terpisah).


KONTRAK API (REFERENSI - SUDAH LIVE DI BACKEND)
================================================================================

    GET {SURVEY_API_URL}/api/analytics/:surveyId/questions
    Header: x-api-key: <SURVEY_API_KEY>

    Response 200:
    {
      "survey": { "id": string, "title": string, "status": string },
      "awareness": [
        {
          "questionId": string,       // "awareness_1".."awareness_9"
          "text": string,
          "totalResponses": number,
          "distribution": [
            { "value": 1, "count": number, "percentage": number },
            { "value": 2, "count": number, "percentage": number },
            { "value": 3, "count": number, "percentage": number },
            { "value": 4, "count": number, "percentage": number },
            { "value": 5, "count": number, "percentage": number }
          ],
          "avgScore": number,         // 0 kalau totalResponses = 0
          "level": "Excellent"|"Good"|"Fair"|"Poor"|null
        }
        // ... total 9 pertanyaan awareness
      ],
      "behavior": [
        {
          "questionId": string,       // "behavior_1".."behavior_8"
          "text": string,
          "totalResponses": number,
          "distribution": [
            { "value": "yes", "count": number, "percentage": number },
            { "value": "no",  "count": number, "percentage": number }
          ],
          "yesPercentage": number,
          "level": "Low"|"Medium"|"High"|null
        }
        // ... total 8 pertanyaan behavior
      ]
    }

    Response 404: { "error": "Survey tidak ditemukan" }

Client function (sudah ada, siap pakai): `getQuestionResults(surveyId)` di
`src/lib/api-client.ts`, mengembalikan type `QuestionResultDistribution`.
Pemanggilan mengikuti pola `getAnalytics()` yang sudah ada (server-side only,
lewat Server Component - lihat catatan keamanan di header `api-client.ts`).


DESAIN UI/UX
================================================================================

Penempatan (rekomendasi)
--------------------------------------------------------------------------------
Halaman baru: `/admin/surveys/[id]/results`

Alasan dipisah dari `/admin/dashboard` (bukan ditambah sebagai section baru
di sana): dashboard overview sudah cukup padat (4 stat card + 2 chart + 3
card bawah); breakdown 17 pertanyaan (9 awareness + 8 behavior) butuh ruang
sendiri supaya tidak membuat dashboard overview jadi terlalu panjang untuk
di-scan cepat. Link masuk dari dua tempat:
- Survey detail page (`/admin/surveys/[id]`): tombol baru "Hasil per
  Pertanyaan" di sebelah tombol "Lihat Analytics" yang sudah ada (header page).
- Dashboard overview: link kecil "Lihat detail per pertanyaan ->" di card
  "Awareness Score per Pertanyaan".

Layout halaman
--------------------------------------------------------------------------------
1. Header: judul survey + badge status (pola sama seperti survey detail page).
2. Section "Awareness" (9 card/baris, satu per pertanyaan):
   - Teks pertanyaan lengkap (bisa panjang, jangan di-truncate di halaman ini -
     beda dengan chart ringkas di dashboard yang pakai label "Q1", "Q2").
   - Bar chart horizontal 100%-stacked: satu bar per pertanyaan, dibagi 5
     segmen (nilai 1-5), lebar segmen = persentase. Tooltip per segmen
     menampilkan: "Nilai X: N responden (Y%)".
   - Badge kecil di kanan: avgScore ("3.7 / 5") + level (Excellent/Good/
     Fair/Poor, pakai komponen `RiskBadge`-style yang sudah ada polanya,
     buat varian untuk awareness level kalau belum ada).
   - Kalau `totalResponses === 0`: tampilkan "Belum ada jawaban" (bukan bar
     kosong yang membingungkan).
3. Section "Behavior" (8 card/baris, satu per pertanyaan):
   - Teks pertanyaan lengkap.
   - Bar 100%-stacked 2 segmen (Yes/No). Yes = warna risk (merah/oranye,
     konsisten dengan `RiskBadge` level High), No = warna netral/aman.
   - Badge: yesPercentage + level (Low/Medium/High, pakai `RiskBadge` yang
     SUDAH ADA - reuse langsung, jangan bikin baru).
   - Sama, empty state kalau totalResponses 0.
4. Survey selector di header halaman (reuse `SurveySelector` yang sudah ada)
   supaya admin bisa pindah survey tanpa balik ke dashboard dulu.

Komponen baru yang perlu dibuat
--------------------------------------------------------------------------------
- `src/components/admin/question-distribution-bar.tsx`
  Chart 100%-stacked horizontal bar generik, terima props:
    `{ distribution: { value: string|number; count: number; percentage: number }[],
       colorForValue: (value: string|number) => string }`
  Dipakai untuk awareness (5 segmen) MAUPUN behavior (2 segmen) - satu
  komponen, beda cara panggil (beda `colorForValue`). Pakai Recharts
  `BarChart` dengan `layout="vertical"` + stacked bars, ATAU custom flexbox
  divs (lebih sederhana untuk stacked-percentage, tidak wajib Recharts kalau
  flexbox lebih gampang di-style & tetap accessible). Tooltip on hover wajib
  ada (pakai native `title` attribute minimal, atau custom tooltip kalau mau
  konsisten dengan `AwarenessBarChart`).
- `src/app/admin/(dashboard)/surveys/[id]/results/page.tsx`
  Server Component, fetch `getSurvey(id)` + `getQuestionResults(id)` paralel
  (`Promise.all`), render layout di atas. Ikuti pola error handling yang
  sama seperti `surveys/[id]/page.tsx` (404 -> `notFound()` kalau
  `ApiError.status === 404`).

Komponen yang di-REUSE (jangan dibuat ulang)
--------------------------------------------------------------------------------
- `RiskBadge` (behavior level) - `src/components/admin/risk-badge.tsx`
- `SurveySelector` - `src/components/admin/survey-selector.tsx`
- `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`,
  `Badge` - shadcn/ui yang sudah dipakai di seluruh dashboard.


ACCEPTANCE CRITERIA
================================================================================

[ ] Halaman `/admin/surveys/[id]/results` bisa diakses dari survey detail
    page dan dari dashboard overview.
[ ] Ke-9 pertanyaan awareness tampil dengan distribusi 5 segmen (1-5) yang
    total persentasenya 100% (atau 0% semua kalau belum ada jawaban).
[ ] Ke-8 pertanyaan behavior tampil dengan distribusi Yes/No yang totalnya
    100%.
[ ] Ganti survey via selector -> data di halaman ikut berubah (server-side
    re-fetch, bukan client-side state yang stale).
[ ] Survey dengan `totalResponses = 0` di semua pertanyaan menampilkan empty
    state yang jelas, bukan chart kosong/error.
[ ] `surveyId` yang tidak valid/tidak ada -> halaman 404 (pola `notFound()`
    Next.js), bukan crash/500.
[ ] Tidak ada regresi di `/admin/dashboard` maupun `/admin/surveys/[id]`
    yang sudah ada.
[ ] `npx tsc --noEmit` dan `npm run lint` bersih.


ESTIMASI EFFORT
================================================================================

- Komponen `question-distribution-bar.tsx`: ~2-3 jam (termasuk styling +
  tooltip + varian warna awareness vs behavior).
- Halaman `results/page.tsx` + wiring navigasi dari 2 entry point: ~2 jam.
- QA manual (cek dengan survey kosong, survey dengan data, survey tidak
  aktif/draft, ganti-ganti survey selector): ~1 jam.

Total kasar: ~1 hari kerja untuk satu developer yang sudah familiar dengan
codebase ini (pola-pola yang direuse sudah banyak, bukan membangun dari nol).


CATATAN TEKNIS
================================================================================

- `getQuestionResults` di `api-client.ts` HANYA boleh dipanggil dari Server
  Component/Route Handler (bukan Client Component) - ikuti aturan yang
  sudah didokumentasikan di header `api-client.ts` (SURVEY_API_KEY tidak
  boleh sampai ke browser).
- Kalau butuh interaktivitas client-side (mis. hover tooltip custom), pisah
  jadi Client Component yang MENERIMA data sebagai props dari Server
  Component pembungkusnya (pola sama seperti `AwarenessBarChart` yang sudah
  `"use client"` tapi datanya dikirim dari `dashboard/page.tsx` yang Server
  Component).
- Warna: ikuti palet yang sudah dipakai (`BAR_COLOR = "#2a78d6"` di
  `awareness-bar-chart.tsx`, warna risk level di `risk-badge.tsx`) - jangan
  perkenalkan palet warna baru tanpa alasan kuat, supaya dashboard tetap
  terasa satu sistem visual.
