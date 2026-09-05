================================================================================

PAKET LENGKAP: SECURITY AWARENESS SURVEY SYSTEM

Format: RAW TEXT (No Formatting)

Date: August 15, 2024

Version: 1.0

================================================================================



OVERVIEW

================================================================================

Paket komprehensif untuk implementasi sistem survey keamanan data awareness

berbasis web dengan tech stack modern:

\- Frontend: Next.js 14, TypeScript, Tailwind CSS, Shadcn/ui

\- Backend: Next.js API Routes, NextAuth.js v5, Prisma ORM v5

\- Database: PostgreSQL (Supabase)

\- Deployment: Vercel (Auto CI/CD)



Compliance: KARS MRMIK 2.1.3 + UU27/2022 (Perlindungan Data Pribadi)





DOKUMEN-DOKUMEN YANG SUDAH DIBUAT

================================================================================



PAKET 1: KARS COMPLIANCE (MRMIK 2.1)

\----------------------------------------

File 1: KARS\_MRMIK\_2.1\_Bukti\_Compliance.docx (13 KB)

\- Paket bukti compliance lengkap untuk assessor KARS

\- Sections:

&#x20; \* Daftar dokumen bukti (8 items)

&#x20; \* Contoh kebijakan keamanan data

&#x20; \* SOP enkripsi data (at-rest, in-transit, backup)

&#x20; \* Bukti pelatihan staff (95 orang + tracking)

&#x20; \* Log audit sample dengan sample entry

&#x20; \* Bukti backup \& disaster recovery (RTO 4h, RPO 6h)

&#x20; \* Incident report \& resolution tracking (3 sample incidents)

&#x20; \* Compliance checklist (10 poin - semua terpenuhi)

\- Use Case: Ditunjukkan langsung ke assessor KARS



File 2: KARS\_MRMIK\_2.1\_Kebijakan\_Keamanan\_Data.docx (12 KB)

\- Template kebijakan siap tandatangan direktur

\- Sections:

&#x20; \* Dasar hukum (5 regulasi: UU27/2022, UU36/2009, KARS 3.1, ISO 27001)

&#x20; \* Maksud \& tujuan

&#x20; \* Ruang lingkup (data pasien, karyawan, operasional)

&#x20; \* 3 Prinsip CIA:

&#x20;   - Confidentiality: RBAC, Encryption AES-256, TLS 1.3

&#x20;   - Integrity: Audit trail, checksum, version control

&#x20;   - Availability: Backup, redundancy, 99.9% uptime

&#x20; \* Tanggung jawab per role (direktur, head of IT, staff)

&#x20; \* Monitoring \& enforcement prosedur

&#x20; \* Keberlakuan \& review policy

\- Use Case: Direktur tanda tangan sebagai SK keamanan data resmi





PAKET 2: SURVEY KONSEP \& DESIGN (MRMIK 2.1.3)

\----------------------------------------

File 3: 01\_Kuesioner\_Awareness\_Security.docx (11 KB)

\- Survey form siap print \& distribute ke 100+ staff

\- 4 Bagian:

&#x20; Bagian 1 - Informasi Responden:

&#x20; - Nama (optional)

&#x20; - Departemen/Unit

&#x20; - Jabatan

&#x20; - Pengalaman kerja (<1yr, 1-3yr, 3-5yr, >5yr)

&#x20; - Pernah pelatihan keamanan data? (Ya/Tidak)



&#x20; Bagian 2 - Awareness Assessment (9 pertanyaan, skala 1-5):

&#x20; 1. Memahami pentingnya kerahasiaan data pasien

&#x20; 2. Tahu password sendiri dan tidak dibagikan

&#x20; 3. Memahami risiko phishing dan social engineering

&#x20; 4. Tahu bagaimana melaporkan insiden keamanan data

&#x20; 5. Memahami UU Perlindungan Data Pribadi (UU27/2022)

&#x20; 6. Lock screen adalah praktik wajib saat meninggalkan workstation

&#x20; 7. Data pasien hanya boleh diakses sesuai kebutuhan pekerjaan

&#x20; 8. Aktif melindungi keamanan data dalam pekerjaan sehari-hari

&#x20; 9. Akan melaporkan jika melihat pelanggaran keamanan data



&#x20; Bagian 3 - Behavior Risk Assessment (8 pertanyaan, Yes/No):

&#x20; 1. Apakah Anda pernah meninggalkan komputer terbuka saat meninggalkan tempat kerja?

&#x20; 2. Apakah Anda berbagi password dengan rekan kerja?

&#x20; 3. Apakah Anda menggunakan public WiFi untuk akses data pasien?

&#x20; 4. Apakah Anda pernah share screenshot data pasien via email/chat?

&#x20; 5. Apakah Anda menghafal password atau tulis di post-it?

&#x20; 6. Apakah Anda pernah download data dalam jumlah besar tanpa alasan jelas?

&#x20; 7. Apakah Anda mengakses data pasien yang tidak terkait pekerjaan Anda?

&#x20; 8. Apakah Anda pernah menerima email mencurigakan dan membuka link/attachment?



&#x20; Bagian 4 - Risk Identification \& Improvements:

&#x20; - Open-ended text area untuk identifikasi risiko yang diketahui/dialami

&#x20; - Open-ended text area untuk saran perbaikan keamanan data



\- Use Case: Cetak \& distribute ke staff atau share link



File 4: 02\_Laporan\_Hasil\_Survey.docx (11 KB)

\- Template laporan komprehensif dengan sample data 108 responden

\- Sections:

&#x20; Informasi Survey:

&#x20; - Periode: 1-30 Agustus 2024

&#x20; - Total Responden: 127 staff (sampling 80%)

&#x20; - Response Rate: 85% (108 dari 127 kembali)

&#x20; - Departemen: Medis, Keperawatan, Administrasi, IT, Lab, Radiologi



&#x20; I. HASIL AWARENESS ASSESSMENT

&#x20; - Tabel per-pertanyaan dengan skor rata-rata (1-5):

&#x20;   \* Memahami kerahasiaan data: 4.8 (Excellent)

&#x20;   \* Password tidak dibagikan: 4.5 (Good)

&#x20;   \* Memahami phishing: 3.7 (Fair)

&#x20;   \* Tahu cara melaporkan insiden: 3.2 (Fair)

&#x20;   \* Memahami UU27/2022: 2.8 (Poor) - WEAK AREA

&#x20;   \* Lock screen wajib: 4.6 (Excellent)

&#x20;   \* Data access need-basis: 4.3 (Good)

&#x20;   \* Aktif proteksi data: 4.1 (Good)

&#x20;   \* Will report violations: 4.4 (Good)

&#x20; - Overall Awareness Score: 4.04/5 (GOOD)

&#x20; - Key Findings:

&#x20;   \* Staff memiliki kesadaran baik

&#x20;   \* Gap terbesar: Pemahaman UU27/2022 (2.8/5)

&#x20;   \* Perlu: Pelatihan regulasi lebih mendalam



&#x20; II. HASIL BEHAVIOR RISK ASSESSMENT

&#x20; - Tabel % staff dengan behavior risk (Yes answers):

&#x20;   \* Meninggalkan komputer terbuka: 8% (Low)

&#x20;   \* Berbagi password: 12% (Low)

&#x20;   \* Public WiFi untuk data pasien: 15% (Medium)

&#x20;   \* Share screenshot data pasien: 22% (Medium) - HIGH RISK

&#x20;   \* Tulis/hafal password: 5% (Low)

&#x20;   \* Download data besar tanpa alasan: 3% (Low)

&#x20;   \* Akses data tidak relevan pekerjaan: 2% (Low)

&#x20;   \* Buka link email mencurigakan: 18% (Medium)

&#x20; - Average Behavior Risk: 10.6% (Overall RENDAH)

&#x20; - Key Findings:

&#x20;   \* Overall behavior risk RENDAH

&#x20;   \* Top 3 Risk Areas:

&#x20;     1. Share screenshot data pasien (22%) - Perlu SOP stricter

&#x20;     2. Membuka email mencurigakan (18%) - Perlu security training \& email filtering

&#x20;     3. Public WiFi untuk data pasien (15%) - Perlu mandatory VPN



&#x20; III. REKOMENDASI \& ACTION PLAN

&#x20; - 5 Action Items dengan Timeline:

&#x20;   1. Awareness Gap: UU27/2022 training (Sept 2024, Head MRMIK)

&#x20;   2. Incident Reporting procedure distribution (Sept 2024, Head IT)

&#x20;   3. Share Screenshot policy enforcement (Sept 2024, Head MRMIK)

&#x20;   4. Phishing awareness training \& email filter (Oct 2024, Head IT)

&#x20;   5. Mandatory VPN untuk remote access (Oct 2024, Head IT)



&#x20; IV. FOLLOW-UP SURVEY PLAN

&#x20; - Periode: November 2024

&#x20; - Target: Minimum 10% improvement di setiap area

&#x20; - Success Criteria:

&#x20;   \* Awareness score >= 4.5

&#x20;   \* Behavior risk <= 8%



\- Use Case: Present ke direktur \& stakeholder, submit ke KARS



File 5: 03\_Monitoring\_Framework.docx (12 KB)

\- Panduan continuous monitoring \& compliance KARS MRMIK 2.1.3

\- Sections:

&#x20; I. OBJECTIVE

&#x20; - Memastikan rumah sakit secara konsisten memantau kepatuhan keamanan data



&#x20; II. MONITORING STRATEGY (4 PILAR)



&#x20; PILAR 1: TECHNICAL MONITORING

&#x20; Monitoring Points:

&#x20; - Audit Trail Logging (Daily): % akses tercatat, size log normal

&#x20; - Failed Login Attempts (Daily): Alert jika > 5 attempts/hour

&#x20; - Data Export Activity (Daily): Flag unusual bulk exports

&#x20; - Database Integrity (Weekly): Checksum verification PASS

&#x20; - Backup Completion (Weekly): 100% backup success rate

&#x20; - System Uptime (Weekly): >= 99.9% uptime

&#x20; - Security Patch Status (Monthly): Critical patches applied < 30 hari

&#x20; - Penetration Testing (Quarterly): Vulnerability score < critical

&#x20; PIC: IT Department



&#x20; PILAR 2: BEHAVIORAL MONITORING

&#x20; Monitoring Points:

&#x20; - Unauthorized Access Attempts (Daily): Zero tolerance policy

&#x20; - Staff Compliance Audit (Monthly): Random sample 10% staff

&#x20; - Awareness Level Survey (Quarterly): Score >= 4.0/5

&#x20; - Training Completion Rate (Quarterly): 100% of new staff trained

&#x20; - Incident Report Rate (Monthly): 0 unreported incidents

&#x20; PIC: MRMIK Department



&#x20; PILAR 3: PROCESS MONITORING

&#x20; Monitoring Points:

&#x20; - Policy Review \& Update (Annually): Updated annually or as needed

&#x20; - SOP Compliance Check (Quarterly): All procedures documented \& current

&#x20; - Incident Response Testing (Annually): Drill executed, report reviewed

&#x20; - Vendor/Third Party Assessment (Annually): Security audit passed

&#x20; PIC: Head MRMIK + IT



&#x20; PILAR 4: COMPLIANCE MONITORING

&#x20; Monitoring Points:

&#x20; - KARS Compliance Assessment (Annually): 100% compliance dengan MRMIK 2.1

&#x20; - Legal/Regulatory Updates (Quarterly): No compliance gap

&#x20; - Data Breach Handling (As needed): Notified within 72 hours per UU27/2022

&#x20; PIC: Head MRMIK + Legal



&#x20; III. CORRECTIVE ACTION PROCESS (7 STEPS)

&#x20; Step 1: DETECTION (Immediate)

&#x20; - Monitoring system atau staff report insiden



&#x20; Step 2: ESCALATION (< 2 jam)

&#x20; - Report ke Head MRMIK \& Head IT



&#x20; Step 3: INVESTIGATION (< 24 jam)

&#x20; - 5 Whys analysis, impact assessment



&#x20; Step 4: CONTAINMENT (Immediate)

&#x20; - Isolate system/user jika perlu



&#x20; Step 5: CORRECTIVE ACTION (< 1 minggu)

&#x20; - Implement fix, retrain staff jika perlu



&#x20; Step 6: DOCUMENTATION (< 2 minggu)

&#x20; - Create incident report \& store in archive



&#x20; Step 7: FOLLOW-UP (1 bulan)

&#x20; - Verify corrective action effective



&#x20; IV. ESCALATION MATRIX

&#x20; Critical (Immediate):

&#x20; - Data breach, ransomware, hacker access, system down > 4 jam

&#x20; - Escalate immediately to Direktur + legal team



&#x20; High (< 24 jam):

&#x20; - Unauthorized access, data corruption, backup failure, policy violation

&#x20; - Inform Direktur within 24 jam



&#x20; Medium (Monthly report):

&#x20; - Minor policy violation, slow system, weak password practice

&#x20; - Report in monthly monitoring report



&#x20; Low (Quarterly):

&#x20; - Awareness improvement needed, documentation gap

&#x20; - Include in quarterly review



&#x20; V. MONTHLY MONITORING REPORT TEMPLATE

&#x20; Sections:

&#x20; - Executive Summary (overview status, incidents, corrective actions)

&#x20; - Technical Metrics (uptime, backup status, security patches, audit trail size)

&#x20; - Incident Summary (list incidents, resolution status, lessons learned)

&#x20; - Staff Compliance (training completion, violations, corrective actions)

&#x20; - KPI Dashboard (visual scorecard of all metrics vs target)

&#x20; - Recommendation (improvement needed, follow-up actions)



&#x20; VI. DOCUMENTATION \& ARCHIVAL

&#x20; - Daily logs: /logs/daily/ → archived monthly

&#x20; - Incident reports: /incidents/ → signed by investigator \& Head MRMIK

&#x20; - Monthly reports: /reports/monthly/ → signed by Direktur

&#x20; - Survey results: /surveys/ → analysis \& action plan documented

&#x20; - Training records: /training/records/ → proof of attendance

&#x20; - Retention: Minimum 5 tahun per regulatory requirement



\- Use Case: Panduan implementasi monitoring berkelanjutan post-survey



File 6: 04\_Survey\_Scoring\_Template.xlsx (35 KB)

\- Excel workbook dengan 5 sheets auto-calculation

\- Sheet 1: Survey Data Entry

&#x20; Columns:

&#x20; - ID, Nama, Departemen, Pengalaman (thn), Pelatihan

&#x20; - Q1-Q9 (Awareness: 1-5 scale)

&#x20; - Q1-Q8 (Behavior: Yes/No)

&#x20; - Auto-calculated: Awareness\_Score, Risk\_Behavior, Assessment\_Level

&#x20; - Sample data: 3 responden template

&#x20; - Formulas: =AVERAGE(F:M) for awareness, =COUNTIF for behavior risk



\- Sheet 2: Summary Statistics

&#x20; Overview metrics:

&#x20; - Total Responden: 108

&#x20; - Response Rate: 85%

&#x20; - Overall Awareness Score: 4.04/5 (with status ✓ GOOD)

&#x20; Per-question scoring table with target vs actual



\- Sheet 3: Risk Heat Map

&#x20; - Department-wise analysis (Medis, Keperawatan, Administrasi, IT, Lab, Radiologi)

&#x20; - Columns: Department, Avg Awareness Score, Behavior Risk %, Overall Risk Level, Action

&#x20; - Color coding: Green (LOW), Yellow (MEDIUM), Red (HIGH)

&#x20; - Interpretation guide



\- Sheet 4: Action Tracker

&#x20; - ID, Action Item, Priority (HIGH/MEDIUM/LOW)

&#x20; - Target Department, Owner, Timeline

&#x20; - Status (Planned/In Progress/Completed)

&#x20; - Sample 6 action items with tracking



\- Sheet 5: Scoring Guide

&#x20; - Instructions untuk filling questionnaire

&#x20; - Awareness Q scale definition (1=Sangat Tidak Setuju, 5=Sangat Setuju)

&#x20; - Behavior Q scoring (0=Low, 1-3=Medium, 4+=High)

&#x20; - How-to-use 6 steps



\- Use Case: Data entry \& initial analysis sebelum migrasi ke web system





PAKET 3: DEVELOPMENT (WEB SYSTEM)

\----------------------------------------

File 7: 05\_PRD\_Survey\_System.docx (17 KB)

\- Complete Product Requirements Document (12 Sections)



SECTION 1: EXECUTIVE SUMMARY

\- Overview proyek, tujuan sistem, tech stack

\- Timeline estimasi: 8-10 minggu development \& testing



SECTION 2: PROJECT OVERVIEW

\- Background: Survey manual (paper-based) sulit di-distribute \& analyze

\- Pain points: Sulit follow-up, scoring manual, tidak ada real-time analytics

\- Solution: Web-based system dengan auto-scoring, real-time dashboard, audit trail



SECTION 3: BUSINESS OBJECTIVES \& SUCCESS METRICS

\- 6 Objectives:

&#x20; 1. Reduce time to completion: 4 weeks → 2 days

&#x20; 2. Increase response rate: 85% → 90%

&#x20; 3. Eliminate manual errors: 100% accurate automated calculation

&#x20; 4. Real-time monitoring: Dashboard updates real-time, export < 1 menit

&#x20; 5. KARS compliance: Audit trail complete, all reports KARS-ready

&#x20; 6. Corrective action tracking: 100% tracked from plan → completion



SECTION 4: USER PERSONAS \& USE CASES

\- Persona 1: Staff/Responden

&#x20; Role: Medical staff, nursing, admin, IT - semua departemen

&#x20; Goal: Complete survey cepat \& mudah (5-10 menit)

&#x20; Pain Points: Survey paper complicated, tidak tahu scoring, admin ribet collect

&#x20; Needs: User-friendly, mobile-ready, progress tracking



\- Persona 2: Superadmin (Head of MRMIK/IT)

&#x20; Role: Head of MRMIK atau Head of IT

&#x20; Goal: Monitor awareness, identify risks, track actions, generate KARS reports

&#x20; Pain Points: Manual analysis days, hard to track improvements, incomplete audit

&#x20; Needs: Real-time dashboard, auto analytics, 1-click export, compliance docs



\- Use Cases:

&#x20; UC-1: Staff mengisi survey (access via link/QR → jawab 40 pertanyaan → auto score)

&#x20; UC-2: Admin create campaign (create survey → set target depts → generate link/QR → distribute)

&#x20; UC-3: Admin view analytics (dashboard → drill-down per dept → export report → share)



SECTION 5: FUNCTIONAL REQUIREMENTS



RESPONDENT FEATURES (R1-R6):

R1: Anonymous Access - Open survey link without login

R2: Multi-page Survey Form - Sections dengan progress bar

R3: Save \& Resume - Staff bisa save \& resume later dalam session

R4: Mobile Responsive - Perfect UX di mobile/tablet/desktop

R5: Validation \& Error Handling - Client-side validation, prevent incomplete submission

R6: Success Confirmation - Confirmation message + option download receipt



SUPERADMIN FEATURES (A1-A12):

A1: Admin Authentication - Login email + password (NextAuth) atau LDAP

A2: Create Survey Campaign - Define name, target depts, deadline, instructions

A3: Manage Respondents - Upload staff list CSV, track who completed

A4: Generate Survey Link/QR - Unique links per respondent atau public link + QR

A5: Send Email Reminders - Auto send initial link + reminders (customizable)

A6: Dashboard Overview - Real-time: responses, response rate %, awareness score, risk distribution

A7: Department Heatmap - Visual grid: awareness score × behavior risk per dept (Green/Yellow/Red)

A8: Detail Analytics View - Per-question breakdown, % responses per choice

A9: Export Report PDF - Comprehensive report matching Dokumen 02 structure

A10: Export Raw Data Excel - All responses + calculated scores untuk further analysis

A11: Action Item Tracker - Create/edit/delete action items dengan priority, owner, deadline, status

A12: Audit Trail / Logs - Complete log semua admin actions untuk compliance



SECTION 6: TECHNICAL ARCHITECTURE \& STACK



Technology Stack:

\- Framework: Next.js v14.x with App Router

\- Language: TypeScript v5.x

\- Styling: Tailwind CSS + Shadcn/ui Components

\- Authentication: NextAuth.js v5.x

\- ORM: Prisma v5.x

\- Database: PostgreSQL (Supabase)

\- PDF Generation: Puppeteer / html2pdf

\- Charts/Analytics: Recharts

\- Deployment: Vercel (auto CI/CD, CDN)

\- Environment: Node.js v18+ LTS



Architecture Diagram:

Frontend (Next.js Client)

&#x20; ├─ Survey Form (Respondent)

&#x20; └─ Dashboard + Reports (Superadmin)

&#x20;             ↓ HTTP/JSON

Backend (Next.js API Routes)

&#x20; ├─ /api/survey/...

&#x20; ├─ /api/analytics/...

&#x20; ├─ /api/admin/...

&#x20; └─ /api/reports/...

&#x20;             ↓ Prisma Client

Database (PostgreSQL - Supabase)

&#x20; ├─ users, surveys, respondents

&#x20; ├─ responses, action\_items

&#x20; └─ audit\_logs



SECTION 7: DATABASE SCHEMA (Prisma Models)



Model User

\- id (String, @id @default(cuid()))

\- email (String, @unique)

\- name (String?)

\- password (String?, NextAuth handles)

\- role (String, @default("admin")) - admin, superadmin

\- department (String?)

\- createdAt (DateTime, @default(now()))

\- surveys (Survey\[])

\- actionItems (ActionItem\[])



Model Survey

\- id (String, @id)

\- title (String)

\- description (String?)

\- createdBy (String)

\- creator (User)

\- status (String, @default("draft")) - draft, active, closed

\- startDate (DateTime)

\- endDate (DateTime)

\- targetDepartments (String\[]) - JSON array

\- createdAt (DateTime)

\- respondents (Respondent\[])

\- responses (Response\[])



Model Respondent

\- id (String, @id)

\- surveyId (String)

\- survey (Survey)

\- email (String?)

\- name (String?)

\- department (String?)

\- jobTitle (String?)

\- experience (String?) - <1yr, 1-3yr, 3-5yr, >5yr

\- trainingDone (Boolean, @default(false))

\- completed (Boolean, @default(false))

\- completedAt (DateTime?)

\- responses (Response\[])



Model Response

\- id (String, @id)

\- surveyId (String)

\- respondentId (String)

\- questionId (String) - Reference to question definition

\- questionType (String) - 'awareness' or 'behavior'

\- answer (String) - '1'-'5' for awareness, 'yes'/'no' for behavior

\- respondent (Respondent)

\- survey (Survey)

\- createdAt (DateTime)



Model ActionItem

\- id (String, @id)

\- surveyId (String)

\- title (String)

\- priority (String) - HIGH, MEDIUM, LOW

\- owner (String)

\- targetDate (DateTime)

\- status (String, @default("open")) - open, in\_progress, completed

\- completedAt (DateTime?)

\- notes (String?)

\- createdBy (String)

\- creator (User)

\- createdAt (DateTime)



Model AuditLog

\- id (String, @id)

\- action (String) - CREATE, UPDATE, DELETE, EXPORT, LOGIN

\- userId (String?)

\- entityType (String) - Survey, Response, ActionItem, etc

\- entityId (String?)

\- details (String?) - JSON dengan old/new values

\- ipAddress (String?)

\- createdAt (DateTime)



SECTION 8: API ENDPOINTS (12 Routes)



POST /api/auth/login

\- Admin login (NextAuth)



POST /api/surveys

\- Create new survey campaign



GET /api/surveys

\- List all surveys (admin)



PATCH /api/surveys/\[id]

\- Update survey (admin)



GET /api/surveys/\[id]/public

\- Get survey form (respondent - no auth)



POST /api/responses

\- Submit survey responses



GET /api/analytics/\[surveyId]

\- Get analytics data (scores, heatmap, per-question breakdown)



GET /api/reports/\[surveyId]/pdf

\- Generate \& download PDF report



GET /api/reports/\[surveyId]/excel

\- Export responses + scores to Excel



POST /api/action-items

\- Create action item



PATCH /api/action-items/\[id]

\- Update action item status/notes



GET /api/audit-logs

\- Get audit trail (superadmin only)



SECTION 9: UI/UX SPECIFICATIONS



RESPONDENT PAGES (6 Pages):



Page 1: Introduction

\- Survey title \& purpose

\- Estimated time to complete (5-10 minutes)

\- Anonymity assurance

\- \[Start Survey] button



Page 2: Respondent Info

\- Name (optional)

\- Department (dropdown)

\- Job Title

\- Experience (radio: <1yr, 1-3yr, 3-5yr, >5yr)

\- Training done? (yes/no)



Page 3: Awareness Assessment (Q1-Q9)

\- Statement + 5-point scale radio buttons

\- Progress bar (page 2/4)

\- \[Next] button



Page 4: Behavior Risk Assessment (Q1-Q8)

\- Question + Yes/No checkbox buttons

\- Progress bar (page 3/4)

\- \[Next] button



Page 5: Risk Identification \& Improvements

\- Text area 1: "Identify risks you know or experienced" (optional)

\- Text area 2: "Suggestions to improve data security" (optional)

\- Progress bar (page 4/4)

\- \[Submit Survey] button



Page 6: Success Confirmation

\- ✓ Thank you message

\- Option download receipt (PDF)

\- \[Close] atau \[Back to Home]



ADMIN PAGES (4 Pages):



Dashboard Overview

\- Top metrics (responses, response rate %, avg awareness score, avg behavior risk %)

\- Charts (response over time, score distribution)

\- Department heatmap (color grid)

\- Recent action items

\- \[Export PDF Report] \[Export Excel] buttons



Analytics Deep Dive

\- Per-question breakdown (% responses per choice)

\- Filter by department

\- Identify weak knowledge areas

\- Export chart as image



Survey Management

\- List all surveys (table: name, status, responses, dates)

\- Create survey wizard

\- Edit/close survey

\- Bulk upload respondent list (CSV)

\- Send email reminders



Action Item Tracker

\- Table (action title, priority, owner, deadline, status)

\- Create/edit/delete action items

\- Status badges (Open/In Progress/Completed)

\- Export action plan as PDF



SECTION 10: SECURITY \& COMPLIANCE



Authentication \& Authorization

\- NextAuth.js v5 with email/password (OAuth optional)

\- Role-based access control (admin vs superadmin)

\- Survey respondents anonymous (no login required)

\- Session timeout after 30 minutes inactivity



Data Protection

\- TLS 1.3 untuk semua data in transit (HTTPS only)

\- Database encryption at rest (Supabase default)

\- Respondent data dapat di-anonymize (no personal identifiers)

\- Audit trail dari semua admin actions



Compliance

\- Compliant dengan UU27/2022 (Perlindungan Data Pribadi)

\- KARS MRMIK 2.1.3 requirements terpenuhi

\- Data retention per policy (default 5 tahun)

\- Export audit logs untuk compliance documentation



SECTION 11: DEPLOYMENT STRATEGY



Vercel Deployment

\- Connect GitHub repository ke Vercel

\- Auto CI/CD: push main → auto deploy production

\- Preview deployments untuk feature branches

\- Environment variables (DATABASE\_URL, NEXTAUTH\_SECRET, etc) di Vercel dashboard



Supabase PostgreSQL

\- Create Supabase project (PostgreSQL 14+)

\- Prisma migrations: npx prisma migrate deploy

\- Auto backups enabled

\- Connection pooling via pgBouncer



Environment Variables

\- DATABASE\_URL: Supabase PostgreSQL connection string

\- NEXTAUTH\_SECRET: OpenSSL generated secret (openssl rand -base64 32)

\- NEXTAUTH\_URL: Production URL (https://yourdomain.com)

\- NODE\_ENV: production



SECTION 12: DEVELOPMENT TIMELINE (\~11 Weeks)



Phase 1: Setup \& Architecture (1 week)

\- Deliverables: GitHub repo, Vercel project, Supabase setup, Prisma schema, environment config



Phase 2: Backend API (2 weeks)

\- Deliverables: NextAuth integration, API routes (survey/responses/analytics), scoring logic, Prisma migrations



Phase 3: Respondent UI (2 weeks)

\- Deliverables: Survey form pages (6 pages), mobile responsive, validation, submission, success page



Phase 4: Admin Dashboard (2 weeks)

\- Deliverables: Dashboard overview, analytics views, survey management, heatmap visualization



Phase 5: Reporting \& Export (1.5 weeks)

\- Deliverables: PDF report generation, Excel export, action item tracker, audit logs



Phase 6: Testing \& QA (1.5 weeks)

\- Deliverables: Unit tests, integration tests, UAT, bug fixes, security testing



Phase 7: Deployment \& Training (1 week)

\- Deliverables: Production deployment, admin training, documentation, go-live



TOTAL: \~11 weeks





File 8: 06\_Technical\_Implementation\_Guide.docx (11 KB)

\- Hands-on developer guide untuk implementasi



SECTION 1: PROJECT SETUP \& INITIALIZATION



Create Next.js Project:

npx create-next-app@latest survey-system \\

&#x20; --typescript \\

&#x20; --tailwind \\

&#x20; --eslint



Install Dependencies:

npm install prisma @prisma/client next-auth@beta

npm install recharts shadcn-ui html2canvas jspdf

npm install xlsx papaparse zod

npm install --save-dev @types/node @types/react



Initialize Prisma:

npx prisma init

\# Update .env.local dengan Supabase connection string

DATABASE\_URL="postgresql://...(Supabase)"

npx prisma migrate dev --name init



SECTION 2: PROJECT FOLDER STRUCTURE



survey-system/

├── app/

│   ├── (auth)/

│   │   └── login/page.tsx

│   ├── (respondent)/

│   │   ├── survey/\[id]/page.tsx

│   │   ├── survey/\[id]/success/page.tsx

│   │   └── components/SurveyForm.tsx

│   ├── (dashboard)/

│   │   ├── dashboard/page.tsx

│   │   ├── surveys/page.tsx

│   │   ├── analytics/\[id]/page.tsx

│   │   ├── action-items/page.tsx

│   │   └── components/

│   ├── api/

│   │   ├── auth/\[...nextauth]/route.ts

│   │   ├── surveys/route.ts (GET, POST)

│   │   ├── responses/route.ts (POST)

│   │   ├── analytics/\[id]/route.ts (GET)

│   │   └── reports/\[id]/(pdf|excel)/route.ts

├── lib/

│   ├── auth.ts (NextAuth config)

│   ├── db.ts (Prisma client)

│   ├── scoring.ts (Survey scoring logic)

│   ├── analytics.ts (Analytics calculations)

│   └── constants.ts (Survey questions)

├── prisma/

│   └── schema.prisma (Data models)

├── public/

├── .env.local

├── tsconfig.json

├── tailwind.config.ts

├── next.config.js

├── package.json

└── README.md



SECTION 3: ENVIRONMENT VARIABLES (.env.local)



DATABASE\_URL="postgresql://user:password@host:5432/db"

NEXTAUTH\_SECRET="openssl rand -base64 32"

NEXTAUTH\_URL="http://localhost:3000"  # atau https://yourdomain.com

NODE\_ENV="development"



SECTION 4: KEY IMPLEMENTATION EXAMPLES



Scoring Logic (lib/scoring.ts):



export const calculateAwarenessScore = (responses: Response\[]): number => {

&#x20; const awarenessResponses = responses.filter(

&#x20;   r => r.questionType === 'awareness'

&#x20; );

&#x20; const sum = awarenessResponses.reduce(

&#x20;   (acc, r) => acc + parseInt(r.answer), 0

&#x20; );

&#x20; return sum / awarenessResponses.length;

};



export const calculateBehaviorRisk = (responses: Response\[]): number => {

&#x20; const behaviorResponses = responses.filter(

&#x20;   r => r.questionType === 'behavior'

&#x20; );

&#x20; const riskCount = behaviorResponses.filter(

&#x20;   r => r.answer === 'yes'

&#x20; ).length;

&#x20; return (riskCount / behaviorResponses.length) \* 100;

};



API Route Example (app/api/responses/route.ts):



import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/db';



export async function POST(req: NextRequest) {

&#x20; const { surveyId, respondentId, responses } = await req.json();



&#x20; try {

&#x20;   // Save all responses in batch

&#x20;   await prisma.response.createMany({

&#x20;     data: responses.map((r: any) => ({

&#x20;       surveyId,

&#x20;       respondentId,

&#x20;       questionId: r.questionId,

&#x20;       questionType: r.type,

&#x20;       answer: r.answer,

&#x20;     })),

&#x20;   });



&#x20;   // Mark respondent as completed

&#x20;   await prisma.respondent.update({

&#x20;     where: { id: respondentId },

&#x20;     data: { completed: true, completedAt: new Date() },

&#x20;   });



&#x20;   return NextResponse.json({ success: true });

&#x20; } catch (error) {

&#x20;   return NextResponse.json({ error: 'Failed' }, { status: 500 });

&#x20; }

}



SECTION 5: DEPLOYMENT CHECKLIST



Checklist items:

\[ ] Create Supabase project \& get connection string

\[ ] Run Prisma migrations (prisma migrate deploy)

\[ ] Generate NEXTAUTH\_SECRET (openssl rand -base64 32)

\[ ] Create GitHub repository \& connect to Vercel

\[ ] Set environment variables in Vercel dashboard

\[ ] Test database connection in staging

\[ ] Test survey submission \& scoring logic

\[ ] Test PDF \& Excel export

\[ ] Create default admin user in database

\[ ] Deploy to Vercel production

\[ ] Test in production environment

\[ ] Setup monitoring \& alerting



SECTION 6: RUNNING LOCALLY



\# Install dependencies

npm install



\# Setup database

npx prisma migrate dev



\# Start development server

npm run dev



\# Open browser to http://localhost:3000





SUMMARY

================================================================================

Total Dokumentasi: 8 Files

\- 2 KARS Compliance files

\- 4 Survey Concept files (1 kuesioner + 1 laporan + 1 framework + 1 excel)

\- 2 Development files (1 PRD + 1 Technical Guide)



Total Size: \~140 KB



Tech Stack:

\- Frontend: Next.js 14, TypeScript, Tailwind CSS, Shadcn/ui

\- Backend: Next.js API Routes, NextAuth.js v5, Prisma ORM v5

\- Database: PostgreSQL (Supabase)

\- Deployment: Vercel



Development Timeline: 11 Weeks (7 Phases)

\- Phase 1-2: Setup \& Backend (3 weeks)

\- Phase 3-4: UI \& Dashboard (4 weeks)

\- Phase 5-6: Reports \& Testing (3 weeks)

\- Phase 7: Deployment (1 week)



Compliance: KARS MRMIK 2.1.3 + UU27/2022

Security: NextAuth, RBAC, TLS 1.3, audit trail, DB encryption



Ready to Download!





NEXT STEPS

================================================================================

1\. Download semua 8 dokumen dari /mnt/user-data/outputs/

2\. Review 05\_PRD\_Survey\_System.docx dengan development team

3\. Review 06\_Technical\_Implementation\_Guide.docx dengan developers

4\. Create GitHub repository

5\. Setup Vercel project

6\. Create Supabase PostgreSQL database

7\. Begin Phase 1: Setup \& Architecture

8\. Follow 11-week development timeline





CONTACT \& SUPPORT

================================================================================

Status: READY FOR DEVELOPMENT

Version: 1.0

Date: August 15, 2024

Contact: Head of MRMIK / IT Department



All documents are in RAW format (plain text) for easy integration into

any documentation or development workflow.



End of RAW Documentation

