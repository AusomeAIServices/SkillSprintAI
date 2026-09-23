import seed from "@/../content/lessons/foundation-001.json";
import { z } from "zod";
import { STEP_IDS, type StepId } from "./types";

const lessonSchema = z.object({
  id: z.string(), version: z.string(), status: z.enum(["draft", "published", "retired"]),
  title: z.string(), durationMinutes: z.literal(15), objective: z.string(),
  steps: z.array(z.object({ id: z.enum(STEP_IDS), type: z.string(), minutes: z.number().int().positive(), title: z.string(), text: z.string(), weakExample: z.string().optional(), workedExample: z.string().optional(), privacyNote: z.string().optional() })),
  quiz: z.array(z.object({ id: z.string(), question: z.string(), choices: z.array(z.object({ id: z.string(), text: z.string() })), correctChoiceId: z.string(), explanation: z.string() })),
  rubric: z.array(z.object({ id: z.string(), maxScore: z.number(), criterion: z.string(), minimumRequired: z.number().optional() })),
  staticHints: z.array(z.string()),
  practice: z.object({ sourceLabel: z.string(), sourceFacts: z.array(z.object({ id: z.string(), text: z.string() })), candidateAnswer: z.string(), deliverable: z.string(), reviewerGuide: z.string() }),
  externalPractice: z.object({ optionalProduct: z.string(), instruction: z.string() }),
});

export const lesson = lessonSchema.parse(seed);

if (lesson.steps.reduce((sum, step) => sum + step.minutes, 0) !== lesson.durationMinutes) {
  throw new Error("Lesson steps must sum to the advertised duration");
}
for (const question of lesson.quiz) {
  if (!question.choices.some((choice) => choice.id === question.correctChoiceId)) {
    throw new Error(`Quiz answer is invalid: ${question.id}`);
  }
}

export type Lesson = typeof lesson;
export type LessonStepId = StepId;

/** Only this projection may be sent before a learner submits the assessment. */
export function toLearnerLesson() {
  return {
    id: lesson.id,
    version: lesson.version,
    title: lesson.title,
    durationMinutes: lesson.durationMinutes,
    objective: lesson.objective,
    status: lesson.status,
    steps: lesson.steps,
    externalPractice: lesson.externalPractice,
    practice: {
      sourceLabel: lesson.practice.sourceLabel,
      sourceFacts: lesson.practice.sourceFacts,
      candidateAnswer: lesson.practice.candidateAnswer,
      deliverable: lesson.practice.deliverable,
    },
    quiz: lesson.quiz.map((question) => ({
      id: question.id,
      question: question.question,
      choices: question.choices,
    })),
    rubric: lesson.rubric.map(({ id, maxScore, criterion }) => ({ id, maxScore, criterion })),
    staticHints: lesson.staticHints,
  };
}
