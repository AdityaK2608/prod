export type SyllabusTopic = {
  id: string;
  topicNumber: number;
  title: string;
  status: "not_started" | "in_progress" | "completed";
  confidence: number | null;
  estimatedMinutes: number | null;
  difficulty: "easy" | "medium" | "hard" | null;
};

export type SyllabusUnit = {
  id: string;
  unitNumber: number;
  title: string;
  topics: SyllabusTopic[];
};

export type TopicContent = {
  id: string;
  topicId: string;
  lessonMarkdown: string;
  learningObjectives: string[];
  keyTerms: Array<{ term: string; meaning: string }>;
  estimatedMinutes: number;
  difficulty: "easy" | "medium" | "hard";
};

export type TopicDetail = {
  topic: SyllabusTopic;
  content: TopicContent | null;
  unit: { unitNumber: number; title: string };
};
