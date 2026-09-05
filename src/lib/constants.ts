// Definisi pertanyaan survey & pilihan form.
// Sumber: setup_awal.md - PAKET 2 (01_Kuesioner_Awareness_Security)

export const DEPARTMENTS = [
  "Medis",
  "Keperawatan",
  "Administrasi",
  "IT",
  "Laboratorium",
  "Radiologi",
  "Lainnya",
] as const;

export const EXPERIENCE_OPTIONS = [
  { value: "<1yr", label: "< 1 tahun" },
  { value: "1-3yr", label: "1 - 3 tahun" },
  { value: "3-5yr", label: "3 - 5 tahun" },
  { value: ">5yr", label: "> 5 tahun" },
] as const;

export type AwarenessQuestion = {
  id: string;
  text: string;
};

export type BehaviorQuestion = {
  id: string;
  text: string;
};

// Bagian 2 - Awareness Assessment (skala 1-5: 1=Sangat Tidak Setuju, 5=Sangat Setuju)
export const AWARENESS_QUESTIONS: AwarenessQuestion[] = [
  { id: "awareness_1", text: "Saya memahami pentingnya kerahasiaan data pasien" },
  { id: "awareness_2", text: "Saya tahu password saya sendiri dan tidak membagikannya ke orang lain" },
  { id: "awareness_3", text: "Saya memahami risiko phishing dan social engineering" },
  { id: "awareness_4", text: "Saya tahu bagaimana cara melaporkan insiden keamanan data" },
  { id: "awareness_5", text: "Saya memahami Undang-Undang Perlindungan Data Pribadi (UU 27/2022)" },
  { id: "awareness_6", text: "Lock screen adalah praktik wajib saat meninggalkan workstation" },
  { id: "awareness_7", text: "Data pasien hanya boleh diakses sesuai kebutuhan pekerjaan" },
  { id: "awareness_8", text: "Saya aktif melindungi keamanan data dalam pekerjaan sehari-hari" },
  { id: "awareness_9", text: "Saya akan melaporkan jika melihat pelanggaran keamanan data" },
];

export const AWARENESS_SCALE = [
  { value: "1", label: "Sangat Tidak Setuju" },
  { value: "2", label: "Tidak Setuju" },
  { value: "3", label: "Netral" },
  { value: "4", label: "Setuju" },
  { value: "5", label: "Sangat Setuju" },
] as const;

// Bagian 3 - Behavior Risk Assessment (Yes/No)
export const BEHAVIOR_QUESTIONS: BehaviorQuestion[] = [
  { id: "behavior_1", text: "Apakah Anda pernah meninggalkan komputer terbuka saat meninggalkan tempat kerja?" },
  { id: "behavior_2", text: "Apakah Anda berbagi password dengan rekan kerja?" },
  { id: "behavior_3", text: "Apakah Anda menggunakan public WiFi untuk akses data pasien?" },
  { id: "behavior_4", text: "Apakah Anda pernah share screenshot data pasien via email/chat?" },
  { id: "behavior_5", text: "Apakah Anda menghafal password atau menulisnya di post-it?" },
  { id: "behavior_6", text: "Apakah Anda pernah download data dalam jumlah besar tanpa alasan jelas?" },
  { id: "behavior_7", text: "Apakah Anda mengakses data pasien yang tidak terkait pekerjaan Anda?" },
  { id: "behavior_8", text: "Apakah Anda pernah menerima email mencurigakan dan membuka link/attachment-nya?" },
];

// Bagian 4 - Risk Identification & Improvements (open-ended)
export const RISK_TEXT_QUESTION_ID = "risk_text";
export const SUGGESTION_TEXT_QUESTION_ID = "suggestion_text";

export const TOTAL_QUESTIONS = AWARENESS_QUESTIONS.length + BEHAVIOR_QUESTIONS.length;
