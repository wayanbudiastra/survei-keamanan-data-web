// Klien HTTP ke survey-api-server (VPS) - lihat PRD.md di project
// survey-api-server untuk kontrak API lengkap.
//
// PENTING: modul ini HANYA boleh diimpor dari Server Components / Route
// Handlers (server-side). SURVEY_API_KEY tidak pernah dikirim ke browser -
// jangan pernah impor file ini dari komponen client ("use client").

import type { AwarenessLevel, RiskLevel } from "@/lib/scoring";

const API_URL = process.env.SURVEY_API_URL;
const API_KEY = process.env.SURVEY_API_KEY;

export class ApiError extends Error {
  status: number;
  body: unknown;
  constructor(status: number, message: string, body?: unknown) {
    super(message);
    this.status = status;
    this.body = body;
  }
}

/**
 * Helper untuk route handler Next.js: jalankan pemanggilan api-client, dan
 * jika gagal karena ApiError, teruskan status + body error yang sama persis
 * dari survey-api-server ke browser (proxy transparan).
 */
export async function proxyApiCall<T>(fn: () => Promise<T>) {
  try {
    const data = await fn();
    return { data, error: null as null };
  } catch (err) {
    if (err instanceof ApiError) {
      return { data: null, error: { status: err.status, body: err.body ?? { error: err.message } } };
    }
    throw err;
  }
}

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  if (!API_URL || !API_KEY) {
    throw new Error(
      "SURVEY_API_URL / SURVEY_API_KEY belum di-set. Lihat .env.local dan README.md."
    );
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "x-api-key": API_KEY,
      ...options.headers,
    },
    cache: "no-store",
  });

  const isJson = res.headers.get("content-type")?.includes("application/json");
  const body = isJson ? await res.json().catch(() => null) : null;

  if (!res.ok) {
    const message =
      body && typeof body === "object" && "error" in body
        ? typeof body.error === "string"
          ? body.error
          : JSON.stringify(body.error)
        : `API request failed: ${res.status}`;
    throw new ApiError(res.status, message, body);
  }

  return body as T;
}

// ---------------------------------------------------------------------------
// Types (mengikuti kontrak response API server)
// ---------------------------------------------------------------------------

export type AdminUser = {
  id: string;
  email: string;
  name: string | null;
  role: string;
  department: string | null;
};

export type Department = { id: string; name: string; active: boolean; createdAt: string };

export type Survey = {
  id: string;
  title: string;
  description: string | null;
  status: string;
  anonymousMode: boolean;
  startDate: string;
  endDate: string;
  targetDepartments: string[];
  createdAt: string;
  totalRespondents?: number;
  completedRespondents?: number;
};

export type Respondent = {
  id: string;
  surveyId: string;
  email: string | null;
  name: string | null;
  department: string | null;
  jobTitle: string | null;
  experience: string | null;
  trainingDone: boolean;
  completed: boolean;
  completedAt: string | null;
  createdAt: string;
};

export type ActionItem = {
  id: string;
  surveyId: string | null;
  title: string;
  priority: "HIGH" | "MEDIUM" | "LOW";
  targetDept: string | null;
  owner: string;
  targetDate: string;
  status: "open" | "in_progress" | "completed";
  completedAt: string | null;
  notes: string | null;
  createdBy: string;
  createdAt: string;
  survey?: { title: string } | null;
};

export type AuditLog = {
  id: string;
  action: string;
  userId: string | null;
  entityType: string;
  entityId: string | null;
  details: string | null;
  ipAddress: string | null;
  createdAt: string;
  user: { name: string | null; email: string } | null;
};

export type Paginated<T> = { items: T[]; totalItems: number; page: number; pageSize: number };

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------

export async function verifyCredentials(email: string, password: string): Promise<AdminUser | null> {
  try {
    return await apiFetch<AdminUser>("/api/auth/verify", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) return null;
    throw err;
  }
}

// ---------------------------------------------------------------------------
// Departments
// ---------------------------------------------------------------------------

export function listDepartments(params: { q?: string; page?: number; pageSize?: number } = {}) {
  const search = new URLSearchParams();
  if (params.q) search.set("q", params.q);
  if (params.page) search.set("page", String(params.page));
  if (params.pageSize) search.set("pageSize", String(params.pageSize));
  return apiFetch<Paginated<Department>>(`/api/departments?${search.toString()}`);
}

export function listActiveDepartments() {
  return apiFetch<{ name: string }[]>("/api/departments/active");
}

export function createDepartment(data: { name: string }) {
  return apiFetch<Department>("/api/departments", { method: "POST", body: JSON.stringify(data) });
}

export function updateDepartment(id: string, data: { name?: string; active?: boolean }) {
  return apiFetch<Department>(`/api/departments/${id}`, { method: "PATCH", body: JSON.stringify(data) });
}

export function deleteDepartment(id: string) {
  return apiFetch<{ success: true }>(`/api/departments/${id}`, { method: "DELETE" });
}

// ---------------------------------------------------------------------------
// Surveys
// ---------------------------------------------------------------------------

export function listSurveys() {
  return apiFetch<Survey[]>("/api/surveys");
}

export function createSurvey(data: {
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  targetDepartments: string[];
  anonymousMode: boolean;
  createdBy: string;
}) {
  return apiFetch<Survey>("/api/surveys", { method: "POST", body: JSON.stringify(data) });
}

export function getSurvey(id: string) {
  return apiFetch<Survey & { _count: { respondents: number; responses: number } }>(`/api/surveys/${id}`);
}

export function updateSurvey(
  id: string,
  data: Partial<{
    title: string;
    description: string;
    status: string;
    startDate: string;
    endDate: string;
    targetDepartments: string[];
    anonymousMode: boolean;
  }> & { actorUserId: string }
) {
  return apiFetch<Survey>(`/api/surveys/${id}`, { method: "PATCH", body: JSON.stringify(data) });
}

export function deleteSurvey(id: string, actorUserId: string) {
  return apiFetch<{ success: true }>(`/api/surveys/${id}`, {
    method: "DELETE",
    body: JSON.stringify({ actorUserId }),
  });
}

export type PublicSurveyData = {
  survey: {
    id: string;
    title: string;
    description: string | null;
    status: string;
    endDate: string;
    anonymousMode: boolean;
  };
  departments: string[];
  experienceOptions: { value: string; label: string }[];
  awarenessQuestions: { id: string; text: string }[];
  behaviorQuestions: { id: string; text: string }[];
};

export function getPublicSurvey(id: string) {
  return apiFetch<PublicSurveyData>(`/api/surveys/${id}/public`);
}

export function listSurveyRespondents(surveyId: string, params: { page?: number; pageSize?: number } = {}) {
  const search = new URLSearchParams();
  if (params.page) search.set("page", String(params.page));
  if (params.pageSize) search.set("pageSize", String(params.pageSize));
  return apiFetch<Paginated<Respondent>>(`/api/surveys/${surveyId}/respondents?${search.toString()}`);
}

export type EditableQuestion = { questionId: string; text: string; active: boolean };
export type SurveyQuestionsForEdit = { awareness: EditableQuestion[]; behavior: EditableQuestion[] };

// Edit teks & status aktif pertanyaan survey (per-survey - lihat
// survey-api-server/PRD.md bagian SurveyQuestion). questionId/questionType
// tetap (immutable) - hanya text dan active yang bisa diubah. Pertanyaan yang
// dinonaktifkan (active=false) tidak lagi muncul di form publik, tapi
// jawaban historisnya tetap tersimpan & tetap dihitung di analytics.
export function getSurveyQuestionsForEdit(surveyId: string) {
  return apiFetch<SurveyQuestionsForEdit>(`/api/surveys/${surveyId}/questions`);
}

export function updateSurveyQuestions(
  surveyId: string,
  questions: EditableQuestion[],
  actorUserId: string
) {
  return apiFetch<SurveyQuestionsForEdit>(`/api/surveys/${surveyId}/questions`, {
    method: "PUT",
    body: JSON.stringify({ questions, actorUserId }),
  });
}

// ---------------------------------------------------------------------------
// Responses
// ---------------------------------------------------------------------------

export function submitResponse(data: {
  surveyId: string;
  respondent: {
    name?: string;
    email?: string;
    department: string;
    jobTitle?: string;
    experience?: string;
    trainingDone?: boolean;
  };
  answers: { questionId: string; questionType: "awareness" | "behavior" | "text"; answer: string }[];
}) {
  return apiFetch<{ success: true; respondentId: string }>("/api/responses", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// ---------------------------------------------------------------------------
// Analytics
// ---------------------------------------------------------------------------

export type SurveyAnalytics = {
  survey: { id: string; title: string; status: string };
  summary: {
    totalRespondents: number;
    completedRespondents: number;
    responseRate: number;
    overallAwarenessScore: number;
    overallAwarenessLevel: AwarenessLevel;
    overallBehaviorRisk: number;
    overallBehaviorRiskLevel: RiskLevel;
  };
  awarenessBreakdown: {
    questionId: string;
    text: string;
    avgScore: number;
    level: AwarenessLevel | null;
    responseCount: number;
  }[];
  behaviorBreakdown: {
    questionId: string;
    text: string;
    yesPercentage: number;
    level: RiskLevel | null;
    responseCount: number;
  }[];
  departmentHeatmap: {
    department: string;
    avgAwarenessScore: number;
    behaviorRiskPercent: number;
    riskLevel: RiskLevel;
  }[];
  topRiskAreas: { questionId: string; text: string; yesPercentage: number }[];
  weakAwarenessAreas: { questionId: string; text: string; avgScore: number }[];
};

export function getAnalytics(surveyId: string) {
  return apiFetch<SurveyAnalytics>(`/api/analytics/${surveyId}`);
}

export type AnswerDistributionEntry<T> = { value: T; count: number; percentage: number };

export type QuestionResultDistribution = {
  survey: { id: string; title: string; status: string };
  awareness: {
    questionId: string;
    text: string;
    totalResponses: number;
    distribution: AnswerDistributionEntry<number>[]; // value: 1-5
    avgScore: number;
    level: AwarenessLevel | null;
  }[];
  behavior: {
    questionId: string;
    text: string;
    totalResponses: number;
    distribution: AnswerDistributionEntry<"yes" | "no">[];
    yesPercentage: number;
    level: RiskLevel | null;
  }[];
};

// Hasil survey per pertanyaan dengan persentase tiap pilihan jawaban (beda
// dengan getAnalytics yang cuma kasih rata-rata/agregat).
export function getQuestionResults(surveyId: string) {
  return apiFetch<QuestionResultDistribution>(`/api/analytics/${surveyId}/questions`);
}

// ---------------------------------------------------------------------------
// Action Items
// ---------------------------------------------------------------------------

export function listActionItems(surveyId?: string) {
  const search = surveyId ? `?surveyId=${encodeURIComponent(surveyId)}` : "";
  return apiFetch<ActionItem[]>(`/api/action-items${search}`);
}

export function createActionItem(data: {
  surveyId?: string;
  title: string;
  priority: "HIGH" | "MEDIUM" | "LOW";
  targetDept?: string;
  owner: string;
  targetDate: string;
  notes?: string;
  createdBy: string;
}) {
  return apiFetch<ActionItem>("/api/action-items", { method: "POST", body: JSON.stringify(data) });
}

export function updateActionItem(
  id: string,
  data: Partial<{
    title: string;
    priority: "HIGH" | "MEDIUM" | "LOW";
    targetDept: string;
    owner: string;
    targetDate: string;
    status: "open" | "in_progress" | "completed";
    notes: string;
  }> & { actorUserId: string }
) {
  return apiFetch<ActionItem>(`/api/action-items/${id}`, { method: "PATCH", body: JSON.stringify(data) });
}

export function deleteActionItem(id: string, actorUserId: string) {
  return apiFetch<{ success: true }>(`/api/action-items/${id}`, {
    method: "DELETE",
    body: JSON.stringify({ actorUserId }),
  });
}

// ---------------------------------------------------------------------------
// Audit Logs
// ---------------------------------------------------------------------------

export function listAuditLogs(limit = 100) {
  return apiFetch<AuditLog[]>(`/api/audit-logs?limit=${limit}`);
}
