import { defineConfig } from "@playwright/test";
import { randomUUID } from "node:crypto";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  reporter: "list",
  use: { baseURL: "http://localhost:3000", trace: "retain-on-failure" },
  projects: [{ name: "chromium", use: { browserName: "chromium", viewport: { width: 1280, height: 900 } } }],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    env: { SKILLSPRINT_LOCAL_DEMO: "true", SKILLSPRINT_DB_PATH: ".data/e2e-" + randomUUID() + ".sqlite" },
  },
});
