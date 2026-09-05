# Security Awareness Survey System

Sistem survey kesadaran & perilaku keamanan data pasien berbasis web, sesuai
`setup_awal.md` (PRD & Technical Implementation Guide) untuk compliance
**KARS MRMIK 2.1.3** dan **UU 27/2022 (Perlindungan Data Pribadi)**.

Status implementasi saat ini: **MVP inti** — lihat [Scope MVP](#scope-mvp-vs-full-prd)
di bawah untuk apa yang sudah jadi vs. yang masih stub/TODO.

## Arsitektur

Sejak diintegrasikan dengan `survey-api-server`, aplikasi ini **TIDAK LAGI**
punya koneksi database langsung. Semua akses data lewat HTTP ke API server
terpisah yang di-deploy di VPS.

```
Browser -> Next.js App (Vercel, project ini) -> survey-api-server (VPS) -> PostgreSQL
```

Detail lengkap arsitektur, kontrak API, dan panduan deploy API server ada di
**`../survey-api-server/PRD.md`** (project sibling, di luar folder ini).
`src/lib/api-client.ts` adalah satu-satunya titik komunikasi ke API server -
Server Components & Route Handlers memanggil fungsi-fungsi di file itu,
TIDAK PERNAH melakukan query database sendiri.

## Tech Stack

- Framework: Next.js (App Router) + TypeScript
- Styling: Tailwind CSS v4 + shadcn/ui
- Auth: NextAuth.js v5 (Credentials, JWT session, 30 menit inactivity timeout).
  Verifikasi kredensial diproxy ke `survey-api-server` (`POST /api/auth/verify`),
  TIDAK ada bcrypt/database langsung di project ini.
- Data layer: HTTP client tipis (`lib/api-client.ts`) ke `survey-api-server`
  (lihat project sibling `survey-api-server/`)
- Charts: Recharts
- Validasi: Zod (client-side saja; validasi otoritatif ada di API server)

> Catatan versi: `create-next-app`/npm menginstal versi **stable terbaru** dari
> tiap package (Next.js 16, dst), bukan versi persis yang disebut di
> `setup_awal.md` (Next.js 14). Arsitektur & konsepnya tetap sama.

## Menjalankan di Lokal

Project ini butuh `survey-api-server` berjalan (lokal atau sudah di-deploy)
sebelum bisa dipakai - **tidak ada mode standalone tanpa API server**.

```bash
# 1. Jalankan survey-api-server dulu (di terminal terpisah)
cd ../survey-api-server
# ikuti README.md project tersebut bagian "Local Development" (SQLite cepat)
# atau "Setup VPS dari Nol" (PostgreSQL, kalau mau uji end-to-end penuh)
npm run dev   # default listen di :4000 (atau port sesuai .env)

# 2. Isi .env.local project ini (lihat contoh di bawah)

# 3. Jalankan Next.js app
npm install
npm run dev
```

Buka http://localhost:3000

**Login admin (dari seed di survey-api-server):**
- Email: `admin@rs-demo.id`
- Password: `Admin123!`

Ganti password ini sebelum dipakai di production (belum ada fitur ganti
password di UI — update langsung di database VPS atau re-seed dengan
kredensial baru lewat `survey-api-server/prisma/seed.ts`).

## Struktur Folder

```
src/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── survey/[id]/                # Form survey publik (anonymous, R1-R6)
│   │   ├── page.tsx
│   │   └── success/page.tsx
│   ├── admin/
│   │   ├── login/page.tsx
│   │   └── (dashboard)/            # Dilindungi middleware + layout auth check
│   │       ├── dashboard/page.tsx  # A6: Overview, chart, heatmap
│   │       ├── surveys/            # A2-A4: CRUD survey, link/QR
│   │       ├── departments/        # CRUD departemen/unit, search + paging
│   │       ├── action-items/       # A11: Action tracker
│   │       └── audit-logs/         # A12: Superadmin only
│   └── api/                        # Proxy tipis ke survey-api-server (BFF)
│       ├── auth/[...nextauth]/
│       ├── surveys/, surveys/[id]/, surveys/[id]/public/
│       ├── departments/, departments/[id]/
│       ├── responses/
│       ├── analytics/[id]/
│       ├── action-items/, action-items/[id]/
│       └── audit-logs/
├── components/
│   ├── ui/                         # shadcn/ui primitives
│   ├── survey/survey-form.tsx      # Multi-step form responden
│   └── admin/                      # Dashboard widgets
├── lib/
│   ├── auth.ts / auth.config.ts    # NextAuth (config displit edge vs Node.js)
│   ├── api-client.ts               # SATU-SATUNYA klien ke survey-api-server
│   ├── constants.ts                # Konstanta UI murni (skala 1-5, dst)
│   ├── scoring.ts                  # Tipe AwarenessLevel/RiskLevel (untuk UI)
│   ├── validations.ts              # Zod schemas (client-side)
│   └── api-auth.ts                 # requireAdmin/requireSuperadmin guard (session)
├── middleware.ts                   # Guard /admin/*
```

## Scope MVP vs Full PRD

Sudah diimplementasikan:
- Form survey responden 4 bagian (info, awareness 9 soal, behavior 8 soal, risk/saran) - anonymous, mobile responsive
- Mode anonim per survey (hanya isi unit/departemen tugas, tanpa nama/email/jabatan) - bisa di-toggle admin kapan saja
- Auto-scoring (awareness rata-rata 1-5, behavior risk %) - dihitung di `survey-api-server`
- Admin auth (NextAuth Credentials + role admin/superadmin) & 30 menit session timeout
- Survey campaign CRUD (draft/active/closed), link publik + QR code
- CRUD Departemen/Unit + pencarian + paging (10/halaman)
- Dashboard analytics: top metrics, chart awareness per pertanyaan, department heatmap, top risk areas
- Action Item Tracker (create/update status)
- Audit log (create/update/delete/login) untuk superadmin - dicatat di `survey-api-server`

Belum diimplementasikan (stub/TODO, sesuai kesepakatan MVP):
- **Export PDF laporan** (A9) - endpoint belum dibuat, perlu Puppeteer/html2pdf
- **Export Excel raw data** (A10) - dependency `xlsx` sudah terpasang, endpoint belum ditulis
- **Bulk upload respondent CSV & email reminder** (A3/A5) - perlu provider email (Resend/SMTP)
- **Unique link per respondent** - saat ini satu link publik per survey

## Environment Variables

| Variable | Keterangan |
|---|---|
| `SURVEY_API_URL` | Base URL `survey-api-server`, mis. `https://api.survey.namadomain.id` (lokal: `http://localhost:4000`) |
| `SURVEY_API_KEY` | HARUS SAMA PERSIS dengan `SURVEY_API_KEY` di `.env` project `survey-api-server` |
| `NEXTAUTH_SECRET` | Generate dengan `openssl rand -base64 32` — **wajib diganti di production** |
| `NEXTAUTH_URL` | URL production, mis. `https://yourdomain.com` |

`SURVEY_API_URL`/`SURVEY_API_KEY` HANYA boleh dipakai di server-side code
(Server Components, Route Handlers, `lib/api-client.ts`) - JANGAN pernah
diberi prefix `NEXT_PUBLIC_` atau diekspos ke komponen client.

## Deployment (Vercel)

1. Deploy `survey-api-server` ke VPS terlebih dahulu (lihat README + PRD.md
   di project tersebut) - catat URL publik HTTPS-nya.
2. Set environment variables di atas di Vercel dashboard (SURVEY_API_URL
   mengarah ke domain VPS, SURVEY_API_KEY sama persis dengan yang di VPS).
3. Deploy seperti biasa (`git push` ke branch yang terhubung Vercel).
4. Uji admin login, submit survey publik, dashboard analytics, CRUD
   department & action item - pastikan semua memanggil API server dengan
   benar (cek log `survey-api-server` di VPS untuk konfirmasi request masuk).

## Referensi

- Detail lengkap requirement, skema, dan rencana pengembangan penuh (11
  minggu, 7 fase) ada di [`setup_awal.md`](./setup_awal.md).
- Arsitektur pemisahan API server, kontrak API lengkap, dan panduan deploy
  VPS ada di `../survey-api-server/PRD.md` dan `../survey-api-server/README.md`.
