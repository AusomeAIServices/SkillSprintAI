import { describe, expect, it } from "vitest";
import { lesson } from "@/modules/learning/lesson";

describe("F01 authored content", () => {
  it("uses the promised 1+3+6+3+2 fifteen-minute structure", () => {
    expect(lesson.steps.map((step) => step.minutes)).toEqual([1, 3, 6, 3, 2]);
    expect(lesson.steps.reduce((sum, step) => sum + step.minutes, 0)).toBe(15);
  });

  it("marks the fixture fictional and leaves lesson publication for human review", () => {
    expect(lesson.practice.sourceLabel).toMatch(/Fictional/i);
    expect(lesson.status).toBe("draft");
  });
});
