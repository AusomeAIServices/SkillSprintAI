import { afterEach, describe, expect, it } from "vitest";
import { demoModeEnabled } from "@/server/demo-guard";

const env = process.env as Record<string, string | undefined>;
const originalNodeEnv = env.NODE_ENV;
const originalDemoFlag = env.SKILLSPRINT_LOCAL_DEMO;

afterEach(() => {
  if (originalNodeEnv === undefined) delete env.NODE_ENV; else env.NODE_ENV = originalNodeEnv;
  if (originalDemoFlag === undefined) delete env.SKILLSPRINT_LOCAL_DEMO; else env.SKILLSPRINT_LOCAL_DEMO = originalDemoFlag;
});

describe("local demo boundary", () => {
  it("requires development mode and an explicit flag", () => {
    env.NODE_ENV = "development";
    delete env.SKILLSPRINT_LOCAL_DEMO;
    expect(demoModeEnabled()).toBe(false);
    env.SKILLSPRINT_LOCAL_DEMO = "true";
    expect(demoModeEnabled()).toBe(true);
  });
  it("fails closed outside development", () => {
    env.NODE_ENV = "production";
    env.SKILLSPRINT_LOCAL_DEMO = "true";
    expect(demoModeEnabled()).toBe(false);
  });
});
