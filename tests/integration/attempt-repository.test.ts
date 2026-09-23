import { beforeAll, describe, expect, it, vi } from "vitest";
import { randomUUID } from "node:crypto";
import { tmpdir } from "node:os";
import { join } from "node:path";
import type { Attempt, StepId } from "@/modules/learning/types";

let repo: typeof import("@/server/attempt-repository");
let database: typeof import("@/server/sqlite");

beforeAll(async () => {
  const env = process.env as Record<string, string | undefined>;
  env.NODE_ENV = "development";
  env.SKILLSPRINT_LOCAL_DEMO = "true";
  env.SKILLSPRINT_DB_PATH = join(tmpdir(), "skillsprint-test-" + randomUUID() + ".sqlite");
  repo = await import("@/server/attempt-repository");
  database = await import("@/server/sqlite");
});

describe("local learning repository", () => {
  it("persists a draft, calculates scores on the server and writes completion once", () => {
    const legacyAttempt = repo.createCurrentAttempt();
    database.database().prepare("UPDATE attempts SET lesson_version=? WHERE id=?").run("1.0.0", legacyAttempt.id);
    expect(repo.getCurrentAttempt()).toBeNull();

    let attempt = repo.createCurrentAttempt();
    expect(attempt.lessonVersion).toBe("1.3.0");
    expect(repo.getAttempt(randomUUID())).toBeNull();

    const draftPatch = {
      prompt: "Plan with a time range, budget and buffer.",
      correctedPlan: "Leave 3:30–4:00 free and spend $5.",
      sourceCheck: "S5 gives the budget and buffer.",
      unknowns: "Weather and access are not stated.",
      reflection: "",
      rubric: { "task-fit": 2, verification: 2, privacy: 2, reflection: 2 },
      quizAnswers: { Q1: "b", Q2: "c", Q3: "a" },
    };
    for (const step of ["learn", "apply", "check"] as StepId[]) {
      const result = repo.updateAttempt({ id: attempt.id, expectedRowVersion: attempt.rowVersion, currentStep: step, draftPatch });
      expect(result.kind).toBe("ok");
      if (result.kind === "ok") attempt = result.attempt;
    }

    const stale = repo.updateAttempt({ id: attempt.id, expectedRowVersion: 1, draftPatch: { prompt: "stale overwrite" } });
    expect(stale.kind).toBe("conflict");
    if (stale.kind === "conflict") expect(stale.attempt.draft.prompt).toBe(draftPatch.prompt);

    const assessment = repo.submitAssessment({ id: attempt.id, answers: draftPatch.quizAnswers, rubric: draftPatch.rubric });
    expect(assessment.kind).toBe("ok");
    if (assessment.kind !== "ok") return;
    expect(assessment.attempt.assessment?.scorePercent).toBe(100);
    expect(assessment.attempt.proficiency).toBe(true);
    expect(repo.updateAttempt({ id: attempt.id, expectedRowVersion: assessment.attempt.rowVersion, draftPatch: { rubric: { ...draftPatch.rubric, verification: 0 } } }).kind).toBe("assessment_locked");

    const incomplete = repo.completeAttempt(attempt.id);
    expect(incomplete.kind).toBe("incomplete");
    const finish = repo.updateAttempt({ id: attempt.id, expectedRowVersion: assessment.attempt.rowVersion, currentStep: "reflect", draftPatch: { reflection: "I checked every claim against supplied facts." } });
    expect(finish.kind).toBe("ok");
    const complete = repo.completeAttempt(attempt.id);
    expect(complete.kind).toBe("ok");
    if (complete.kind !== "ok") return;
    expect(complete.artifact?.visibility).toBe("private");
    expect(complete.artifact?.assessorType).toBe("self");
    expect(repo.getReviews()).toHaveLength(1);

    const repeated = repo.completeAttempt(attempt.id);
    expect(repeated.kind).toBe("ok");
    expect(repo.getReviews()).toHaveLength(1);
    expect(database.database().prepare("SELECT COUNT(*) AS count FROM artifacts").get()).toEqual({ count: 1 });
  });

  it("reopens the persistent SQLite file and returns the saved artifact", async () => {
    const completed = repo.getCurrentAttempt() as Attempt;
    expect(completed.completedAt).not.toBeNull();
    const artifact = repo.getArtifact(completed.id);
    expect(artifact?.content.reflection).toContain("checked every claim");
    database.database().close();
    Reflect.deleteProperty(globalThis, "skillSprintDb");
    vi.resetModules();
    repo = await import("@/server/attempt-repository");
    database = await import("@/server/sqlite");
    expect(repo.getAttempt(completed.id)?.completedAt).toBe(completed.completedAt);
    expect(repo.getArtifact(completed.id)?.id).toBe(artifact?.id);
  });
});
