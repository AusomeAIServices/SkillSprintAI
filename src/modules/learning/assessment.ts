import { lesson } from "./lesson";
import type { AssessmentResult } from "./types";

export type QuizAnswers = Record<string, string>;
export type RubricScores = Record<string, number>;

export function scoreAssessment(answers: QuizAnswers, submittedAt = new Date().toISOString()): AssessmentResult {
  const explanations = lesson.quiz.map((question) => ({
    questionId: question.id,
    correct: answers[question.id] === question.correctChoiceId,
    explanation: question.explanation,
  }));
  const correctCount = explanations.filter((item) => item.correct).length;
  return {
    scorePercent: Math.floor((correctCount / lesson.quiz.length) * 100),
    correctCount,
    totalQuestions: lesson.quiz.length,
    explanations,
    submittedAt,
  };
}

export function hasProvisionalProficiency(result: AssessmentResult, rubric: RubricScores): boolean {
  const validRubric = lesson.rubric.every((criterion) => {
    const score = rubric[criterion.id];
    return Number.isInteger(score) && score >= 0 && score <= criterion.maxScore &&
      (criterion.minimumRequired === undefined || score >= criterion.minimumRequired);
  });
  const total = lesson.rubric.reduce((sum, criterion) => sum + (rubric[criterion.id] ?? 0), 0);
  return validRubric && result.scorePercent >= 80 && total >= 6;
}
