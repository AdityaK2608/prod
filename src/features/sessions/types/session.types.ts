export type StudyTopicOption = { id: string; title: string; unitNumber: number; topicNumber: number };
export type StudySession = { id: string; topicTitle: string | null; startedAt: string; endedAt: string; durationSeconds: number; notes: string | null };
