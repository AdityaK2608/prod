export type SessionUser = {
  id: string;
  email?: string;
  user_metadata?: { name?: string };
};

export type AppExam = {
  variantId: string;
  examName: string;
  code: string;
  paper: string;
  classLevel: string | null;
  subject: string;
  questions: number | null;
  marks: number | null;
  durationMinutes: number | null;
  targetExamDate: string | null;
};
