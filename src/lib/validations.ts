import { z } from "zod";

export const createDepartmentSchema = z.object({
  name: z.string().trim().min(2, "Nama departemen minimal 2 karakter").max(100),
});

export const updateDepartmentSchema = z.object({
  name: z.string().trim().min(2, "Nama departemen minimal 2 karakter").max(100).optional(),
  active: z.boolean().optional(),
});

export const createSurveySchema = z.object({
  title: z.string().min(3, "Judul minimal 3 karakter"),
  description: z.string().optional(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  targetDepartments: z.array(z.string()).default([]),
  anonymousMode: z.boolean().default(true),
});

export const updateSurveySchema = z.object({
  title: z.string().min(3).optional(),
  description: z.string().optional(),
  status: z.enum(["draft", "active", "closed"]).optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  targetDepartments: z.array(z.string()).optional(),
  anonymousMode: z.boolean().optional(),
});

// Mode anonim: hanya department yang wajib diisi (unit tugas). Field identitas
// (nama, email, jabatan) dan demografi tambahan (pengalaman, pelatihan) opsional
// karena disembunyikan dari form ketika survey.anonymousMode aktif.
const respondentInfoSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  department: z.string().min(1, "Departemen/unit tugas wajib diisi"),
  jobTitle: z.string().optional(),
  experience: z.enum(["<1yr", "1-3yr", "3-5yr", ">5yr"]).optional(),
  trainingDone: z.boolean().default(false),
});

const answerSchema = z.object({
  questionId: z.string(),
  questionType: z.enum(["awareness", "behavior", "text"]),
  answer: z.string(),
});

export const submitResponseSchema = z.object({
  surveyId: z.string(),
  respondent: respondentInfoSchema,
  answers: z.array(answerSchema).min(1, "Jawaban tidak boleh kosong"),
});

export const createActionItemSchema = z.object({
  surveyId: z.string().optional(),
  title: z.string().min(3, "Judul minimal 3 karakter"),
  priority: z.enum(["HIGH", "MEDIUM", "LOW"]),
  targetDept: z.string().optional(),
  owner: z.string().min(1, "Owner wajib diisi"),
  targetDate: z.coerce.date(),
  notes: z.string().optional(),
});

export const updateActionItemSchema = z.object({
  title: z.string().min(3).optional(),
  priority: z.enum(["HIGH", "MEDIUM", "LOW"]).optional(),
  targetDept: z.string().optional(),
  owner: z.string().optional(),
  targetDate: z.coerce.date().optional(),
  status: z.enum(["open", "in_progress", "completed"]).optional(),
  notes: z.string().optional(),
});
