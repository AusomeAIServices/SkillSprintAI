import { defineConfig } from "@playwright/test";
import { randomUUID } from "node:crypto";

const testPort = process.env.PLAYWRIGHT_TEST_PORT || "3100";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  reporter: "list",
  use: { baseURL: "http://localhost:" + testPort, trace: "retain-on-failure" },
  projects: [{ name: "chromium", use: { browserName: "chromium", viewport: { width: 1280, height: 900 } } }],
  webServer: {
    command: "npm run dev -- --port " + testPort,
    url: "http://localhost:" + testPort,
    reuseExistingServer: !process.env.CI,
    env: { SKILLSPRINT_LOCAL_DEMO: "true", SKILLSPRINT_DB_PATH: ".data/e2e-" + randomUUID() + ".sqlite" },
  },
});
