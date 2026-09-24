import { describe, expect, it } from "vitest";
import { chatJourney, contextCards, genAiIntroModules } from "@/modules/learning/gen-ai-intro";

describe("Gen AI Introduction content", () => {
  it("has four ordered, source-linked 15-minute modules", () => {
    expect(genAiIntroModules.map((item) => item.id)).toEqual(["basics", "chat", "prompt", "context"]);
    for (const item of genAiIntroModules) {
      expect(item.lessons).toHaveLength(3);
      expect(item.lessons.every((paragraph) => paragraph.length > 50)).toBe(true);
      expect(item.sources.length).toBeGreaterThanOrEqual(2);
      expect(item.sources.every((source) => source.url.startsWith("https://") && source.title && source.supports)).toBe(true);
    }
  });
  it("provides a three-turn offline chat and a conflict-aware context exercise", () => {
    expect(chatJourney).toHaveLength(3);
    expect(chatJourney.every((turn) => turn.prompt.length > 15 && turn.response.length > 60 && turn.lesson.length > 30)).toBe(true);
    expect(contextCards.filter((card) => card.relevant).map((card) => card.id)).toEqual(["monday", "wednesday"]);
    expect(contextCards.filter((card) => !card.relevant).map((card) => card.id)).toEqual(["private", "injection"]);
  });
});
