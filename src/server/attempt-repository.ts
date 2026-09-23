import { createHash, randomUUID } from "node:crypto";
import { lesson } from "@/modules/learning/lesson";
import { hasProvisionalProficiency, scoreAssessment, type QuizAnswers, type RubricScores } from "@/modules/learning/assessment";
import { emptyDraft, STEP_IDS, type Attempt, type LearnerDraft, type PrivateArtifact, type StepId } from "@/modules/learning/types";
import { LOCAL_DEMO_USER_ID } from "./demo-guard";
import { database } from "./sqlite";

type DbRow = {
  id: string; lesson_id: string; lesson_version: string; current_step: StepId;
  visited_steps_json: string; draft_json: string; assessment_json: string | null;
  completed_at: string | null; proficiency: number; row_version: number; updated_at: string;
};

function mapAttempt(row: DbRow): Attempt {
  return {
    id: row.id, lessonId: lesson.id, lessonVersion: row.lesson_version,
    currentStep: row.current_step, visitedSteps: JSON.parse(row.visited_steps_json) as StepId[],
    draft: JSON.parse(row.draft_json) as LearnerDraft,
    assessment: row.assessment_json ? JSON.parse(row.assessment_json) : null,
    completedAt: row.completed_at, proficiency: row.proficiency === 1,
    rowVersion: row.row_version, updatedAt: row.updated_at,
  };
}

export function getCurrentAttempt(): Attempt | null {
  const row = database().prepare(`SELECT * FROM attempts WHERE user_id = ? AND lesson_id = ? ORDER BY updated_at DESC LIMIT 1`)
    .get(LOCAL_DEMO_USER_ID, lesson.id) as DbRow | undefined;
  return row ? mapAttempt(row) : null;
}

export function createCurrentAttempt(): Attempt {
  const active = getCurrentAttempt();
  if (active) return active;
  const now = new Date().toISOString();
  const id = randomUUID();
  const contentHash = createHash("sha256").update(JSON.stringify(lesson)).digest("hex");
  database().prepare(`INSERT INTO attempts
    (id,user_id,lesson_id,lesson_version,lesson_hash,state,current_step,visited_steps_json,draft_json,created_at,updated_at)
    VALUES (?,?,?,?,?,'in_progress','recall',?,?,?,?)`).run(
      id, LOCAL_DEMO_USER_ID, lesson.id, lesson.version, contentHash,
      JSON.stringify(["recall"]), JSON.stringify(emptyDraft()), now, now,
    );
  return getAttempt(id)!;
}

export function getAttempt(id: string): Attempt | null {
  const row = database().prepare("SELECT * FROM attempts WHERE id = ? AND user_id = ?").get(id, LOCAL_DEMO_USER_ID) as DbRow | undefined;
  return row ? mapAttempt(row) : null;
}

export function updateAttempt(input: {
  id: string; expectedRowVersion: number; currentStep?: StepId; draftPatch?: Partial<LearnerDraft>;
}) {
  const db = database();
  const current = getAttempt(input.id);
  if (!current) return { kind: "missing" as const };
  if (current.rowVersion !== input.expectedRowVersion) return { kind: "conflict" as const, attempt: current };
  if (current.completedAt) return { kind: "completed" as const, attempt: current };
  if (current.assessment && (input.draftPatch?.rubric || input.draftPatch?.quizAnswers)) return { kind: "assessment_locked" as const, attempt: current };
  const nextStep = input.currentStep ?? current.currentStep;
  if (!STEP_IDS.includes(nextStep)) return { kind: "invalid" as const };
  const visitedSteps = [...new Set([...current.visitedSteps, nextStep])];
  const draft = { ...current.draft, ...(input.draftPatch ?? {}) };
  const now = new Date().toISOString();
  const result = db.prepare(`UPDATE attempts SET current_step=?,visited_steps_json=?,draft_json=?,updated_at=?,row_version=row_version+1
    WHERE id=? AND user_id=? AND row_version=? AND state='in_progress'`).run(
      nextStep, JSON.stringify(visitedSteps), JSON.stringify(draft), now,
      input.id, LOCAL_DEMO_USER_ID, input.expectedRowVersion,
    );
  if (Number(result.changes) !== 1) return { kind: "conflict" as const, attempt: getAttempt(input.id)! };
  return { kind: "ok" as const, attempt: getAttempt(input.id)! };
}

export function submitAssessment(input: { id: string; answers: QuizAnswers; rubric: RubricScores }) {
  const db = database();
  const attempt = getAttempt(input.id);
  if (!attempt) return { kind: "missing" as const };
  if (attempt.assessment) return { kind: "ok" as const, attempt };
  if (attempt.completedAt) return { kind: "completed" as const, attempt };
  if (!lesson.quiz.every((question) => typeof input.answers[question.id] === "string" && question.choices.some((choice) => choice.id === input.answers[question.id]))) {
    return { kind: "invalid" as const };
  }
  if (!lesson.rubric.every((criterion) => Number.isInteger(input.rubric[criterion.id]) && input.rubric[criterion.id] >= 0 && input.rubric[criterion.id] <= criterion.maxScore)) {
    return { kind: "invalid" as const };
  }
  const result = scoreAssessment(input.answers);
  const proficiency = hasProvisionalProficiency(result, input.rubric);
  const draft = { ...attempt.draft, rubric: input.rubric };
  const now = new Date().toISOString();
  db.prepare(`UPDATE attempts SET assessment_json=?,proficiency=?,draft_json=?,updated_at=?,row_version=row_version+1 WHERE id=? AND user_id=? AND assessment_json IS NULL`)
    .run(JSON.stringify(result), proficiency ? 1 : 0, JSON.stringify(draft), now, input.id, LOCAL_DEMO_USER_ID);
  return { kind: "ok" as const, attempt: getAttempt(input.id)! };
}

export function completeAttempt(id: string) {
  const db = database();
  const attempt = getAttempt(id);
  if (!attempt) return { kind: "missing" as const };
  if (attempt.completedAt) return { kind: "ok" as const, attempt, artifact: getArtifact(id) };
  const allVisited = STEP_IDS.every((step) => attempt.visitedSteps.includes(step));
  const draft = attempt.draft;
  const artifactReady = [draft.prompt, draft.correctedPlan, draft.sourceCheck, draft.unknowns, draft.reflection]
    .every((value) => typeof value === "string" && value.trim().length > 0);
  if (!allVisited || !attempt.assessment || !artifactReady || Object.keys(draft.rubric).length !== lesson.rubric.length) {
    return { kind: "incomplete" as const, attempt };
  }
  const now = new Date().toISOString();
  const artifactId = randomUUID();
  const nextReviewId = randomUUID();
  const nextDay = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
  db.exec("BEGIN IMMEDIATE");
  try {
    db.prepare(`INSERT INTO artifacts (id,user_id,attempt_id,lesson_id,lesson_version,assessor_type,visibility,content_json,created_at)
      VALUES (?,?,?,?,?,'self','private',?,?)`).run(
      artifactId, LOCAL_DEMO_USER_ID, id, lesson.id, lesson.version, JSON.stringify(draft), now,
    );
    db.prepare(`UPDATE attempts SET state='completed',artifact_id=?,completed_at=?,updated_at=?,row_version=row_version+1 WHERE id=? AND user_id=? AND state='in_progress'`)
      .run(artifactId, now, now, id, LOCAL_DEMO_USER_ID);
    db.prepare(`INSERT INTO reviews (id,user_id,attempt_id,skill_id,due_at,interval_stage) VALUES (?,?,?,?,?,1)`)
      .run(nextReviewId, LOCAL_DEMO_USER_ID, id, "prompt.goal-context-constraints-output", nextDay);
    db.exec("COMMIT");
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
  return { kind: "ok" as const, attempt: getAttempt(id)!, artifact: getArtifact(id) };
}

export function getArtifact(attemptId: string): PrivateArtifact | null {
  const row = database().prepare("SELECT * FROM artifacts WHERE attempt_id=? AND user_id=?").get(attemptId, LOCAL_DEMO_USER_ID) as
    { id: string; attempt_id: string; lesson_id: string; lesson_version: string; content_json: string; created_at: string } | undefined;
  return row ? {
    id: row.id, attemptId: row.attempt_id, lessonId: row.lesson_id, lessonVersion: row.lesson_version,
    assessorType: "self", visibility: "private", content: JSON.parse(row.content_json), createdAt: row.created_at,
  } : null;
}

export function getLatestArtifact(): PrivateArtifact | null {
  const row = database().prepare("SELECT attempt_id FROM artifacts WHERE user_id=? ORDER BY created_at DESC LIMIT 1").get(LOCAL_DEMO_USER_ID) as { attempt_id: string } | undefined;
  return row ? getArtifact(row.attempt_id) : null;
}

export function getReviews() {
  return database().prepare("SELECT id,skill_id,due_at,interval_stage FROM reviews WHERE user_id=? ORDER BY due_at")
    .all(LOCAL_DEMO_USER_ID) as Array<{ id: string; skill_id: string; due_at: string; interval_stage: number }>;
}
