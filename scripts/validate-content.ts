import { lesson } from "../src/modules/learning/lesson";

const totalMinutes = lesson.steps.reduce((sum, step) => sum + step.minutes, 0);
if (lesson.steps.length !== 5 || totalMinutes !== lesson.durationMinutes) {
  throw new Error(`${lesson.id}: expected five steps totaling 15 minutes, got ${lesson.steps.length} totaling ${totalMinutes}`);
}
for (const question of lesson.quiz) {
  if (!question.choices.some((choice) => choice.id === question.correctChoiceId)) {
    throw new Error(`${lesson.id}/${question.id}: correct answer does not match a choice`);
  }
}
if (lesson.rubric.reduce((sum, criterion) => sum + criterion.maxScore, 0) !== 8) {
  throw new Error(`${lesson.id}: F01 rubric must total 8 points`);
}
if (lesson.status !== "draft" || lesson.practice.reviewerGuide.length === 0) {
  throw new Error(`${lesson.id}: the seed lesson must remain reviewed as draft with a reviewer guide`);
}
console.log(`${lesson.id}@${lesson.version}: valid ${totalMinutes}-minute draft; ${lesson.quiz.length} quiz items; answer set and 8-point rubric validated`);
