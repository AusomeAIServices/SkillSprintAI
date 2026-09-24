import { describe, expect, it } from "vitest";
import { flattenedJourneyTopics } from "@/modules/learning/ai-journey";
import { journeyChats } from "@/modules/learning/journey-chats";

describe("offline journey chats", () => {
  it("provides three distinct prompt/reply examples for all 27 topics", () => {
    expect(Object.keys(journeyChats).sort()).toEqual(flattenedJourneyTopics.map((topic) => topic.id).sort());
    for (const topic of flattenedJourneyTopics) {
      const examples = journeyChats[topic.id];
      expect(examples).toHaveLength(3);
      expect(new Set(examples.map((example) => example.prompt)).size).toBe(3);
      for (const example of examples) {
        expect(example.label.trim().length).toBeGreaterThan(2);
        expect(example.prompt.trim().length).toBeGreaterThan(5);
        expect(example.response.trim().length).toBeGreaterThan(25);
      }
    }
  });
});
