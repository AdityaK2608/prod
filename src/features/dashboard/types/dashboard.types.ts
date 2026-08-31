export type DashboardUser = {
  name: string;
  email: string;
};

export type DashboardExam = {
  name: string;
  code: string;
  paper: string;
  classLevel: string | null;
  subject: string;
  questions: number | null;
  marks: number | null;
  durationMinutes: number | null;
  targetExamDate: string | null;
};

export type DashboardSyllabus = {
  units: number;
  topics: number;
};

export type DashboardData = {
  user: DashboardUser;
  exam: DashboardExam | null;
  syllabus: DashboardSyllabus;
};
