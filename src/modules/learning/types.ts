export const STEP_IDS = ["recall", "learn", "apply", "check", "reflect"] as const;
export type StepId = (typeof STEP_IDS)[number];

export type LearnerDraft = {
  prompt: string;
  correctedPlan: string;
  sourceCheck: string;
  unknowns: string;
  reflection: string;
  rubric: Record<string, number>;
  quizAnswers: Record<string, string>;
};

export type AssessmentResult = {
  scorePercent: number;
  correctCount: number;
  totalQuestions: number;
  explanations: Array<{ questionId: string; correct: boolean; explanation: string }>;
  submittedAt: string;
};

export type Attempt = {
  id: string;
  lessonId: string;
  lessonVersion: string;
  currentStep: StepId;
  visitedSteps: StepId[];
  draft: LearnerDraft;
  assessment: AssessmentResult | null;
  completedAt: string | null;
  proficiency: boolean;
  rowVersion: number;
  updatedAt: string;
};

export type PrivateArtifact = {
  id: string;
  attemptId: string;
  lessonId: string;
  lessonVersion: string;
  assessorType: "self";
  visibility: "private";
  content: LearnerDraft;
  createdAt: string;
};

export type LearnerLesson = {
  id: string;
  version: string;
  title: string;
  durationMinutes: 15;
  objective: string;
  status: "draft" | "published" | "retired";
  steps: Array<{ id: StepId; type: string; minutes: number; title: string; text: string; weakExample?: string; workedExample?: string; privacyNote?: string }>;
  externalPractice: { optionalProduct: string; instruction: string };
  practice: { sourceLabel: string; sourceFacts: Array<{ id: string; text: string }>; candidateAnswer: string; deliverable: string };
  quiz: Array<{ id: string; question: string; choices: Array<{ id: string; text: string }> }>;
  rubric: Array<{ id: string; maxScore: number; criterion: string }>;
  staticHints: string[];
};

export function emptyDraft(): LearnerDraft {
  return { prompt: "", correctedPlan: "", sourceCheck: "", unknowns: "", reflection: "", rubric: {}, quizAnswers: {} };
}
