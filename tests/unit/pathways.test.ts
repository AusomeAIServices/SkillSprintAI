import { describe, expect, it } from "vitest";
import { learningPaths } from "@/modules/learning/pathways";
import { workedJourneys } from "@/modules/learning/worked-journeys";

describe("learning path catalog", () => {
  it("contains every planned path and 112 distinct 15-minute units", () => {
    expect(learningPaths.map((path) => path.units.length)).toEqual([8, 8, 12, 16, 12, 24, 32]);
    const ids = learningPaths.flatMap((path) => path.units.map((unit) => unit.id));
    expect(new Set(ids).size).toBe(112);
    for (const path of learningPaths) for (const unit of path.units) {
      expect(unit.minutes).toBe(15);
      expect(unit.title.trim().length).toBeGreaterThan(5);
      expect(unit.practice.trim().length).toBeGreaterThan(40);
    }
  });
  it("has a five-step worked journey for every path using a real unit ID", () => {
    for (const path of learningPaths) {
      const journey = workedJourneys[path.slug];
      expect(journey).toBeDefined();
      expect(path.units.some((unit) => unit.id === journey.unitId)).toBe(true);
      expect(journey.steps.map((step) => step.stage)).toEqual(["Recall", "Learn", "Apply", "Check", "Reflect"]);
      for (const step of journey.steps) {
        expect(step.question.length).toBeGreaterThan(20);
        expect(step.answer.length).toBeGreaterThan(50);
      }
    }
  });
});
