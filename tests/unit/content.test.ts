import { describe, expect, it } from "vitest";
import { lesson } from "@/modules/learning/lesson";

describe("F01 authored content", () => {
  it("uses the promised 1+3+6+3+2 fifteen-minute structure", () => {
    expect(lesson.steps.map((step) => step.minutes)).toEqual([1, 3, 6, 3, 2]);
    expect(lesson.steps.reduce((sum, step) => sum + step.minutes, 0)).toBe(15);
  });

  it("starts with a plain-language Google Search to ChatGPT comparison", () => {
    expect(lesson.version).toBe("1.3.0");
    expect(lesson.steps[0].text).toMatch(/If you can type a question into Google/);
    expect(lesson.steps[0].text).toMatch(/follow-up in ordinary language/);
    expect(lesson.quiz[0].question).toMatch(/Google Search and ChatGPT/);
    expect(lesson.steps[1].text).toMatch(/context \(the useful background and relevant earlier messages/);
    expect(lesson.steps[1].text).toMatch(/Tagalog \(Filipino\)/);
  });

  it("marks the fixture fictional and leaves lesson publication for human review", () => {
    expect(lesson.practice.sourceLabel).toMatch(/Fictional/i);
    expect(lesson.status).toBe("draft");
  });
});
