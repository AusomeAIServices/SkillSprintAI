import { describe, expect, it } from "vitest";
import { hasProvisionalProficiency, scoreAssessment } from "@/modules/learning/assessment";

const allCorrect = { Q1: "b", Q2: "c", Q3: "a" };
const passingRubric = { "task-fit": 2, verification: 2, privacy: 1, reflection: 1 };

describe("F01 deterministic assessment", () => {
  it("keeps the answer key out of the learner lesson projection", async () => {
    const { toLearnerLesson } = await import("@/modules/learning/lesson");
    const json = JSON.stringify(toLearnerLesson());
    expect(json).not.toContain("correctChoiceId");
    expect(json).not.toContain("reviewerGuide");
    expect(json).toContain("It will be sunny");
    expect(json).not.toContain("The candidate spends only $5");
  });

  it("requires all three F01 answers to meet the 80% threshold", () => {
    const twoCorrect = scoreAssessment({ Q1: "b", Q2: "c", Q3: "b" }, "2026-09-23T00:00:00.000Z");
    const threeCorrect = scoreAssessment(allCorrect, "2026-09-23T00:00:00.000Z");
    expect(twoCorrect.scorePercent).toBe(66);
    expect(hasProvisionalProficiency(twoCorrect, passingRubric)).toBe(false);
    expect(threeCorrect.scorePercent).toBe(100);
    expect(hasProvisionalProficiency(threeCorrect, passingRubric)).toBe(true);
    expect(hasProvisionalProficiency({ ...threeCorrect, scorePercent: 79 }, passingRubric)).toBe(false);
    expect(hasProvisionalProficiency({ ...threeCorrect, scorePercent: 80 }, passingRubric)).toBe(true);
  });

  it("enforces total rubric threshold and nonzero verification and privacy", () => {
    const allCorrectResult = scoreAssessment(allCorrect);
    expect(hasProvisionalProficiency(allCorrectResult, { ...passingRubric, "task-fit": 1 })).toBe(false);
    expect(hasProvisionalProficiency(allCorrectResult, { ...passingRubric, verification: 0, "task-fit": 2 })).toBe(false);
    expect(hasProvisionalProficiency(allCorrectResult, { ...passingRubric, privacy: 0, "task-fit": 2 })).toBe(false);
    expect(hasProvisionalProficiency(allCorrectResult, { ...passingRubric, "reflection": 0, "task-fit": 2 })).toBe(false);
  });
});
