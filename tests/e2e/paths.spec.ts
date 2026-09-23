import { expect, test } from "@playwright/test";

test("all seven learning paths open and a practice draft persists", async ({ page }) => {
  await page.goto("/");
  const cards = page.locator(".path-card");
  await expect(cards).toHaveCount(7);
  for (const slug of ["everyday-ai", "ai-for-students", "ai-at-work", "professional-practice", "lead-with-ai", "build-with-codex", "build-ai-systems"]) {
    await page.goto(`/paths/${slug}`);
    await expect(page.locator(".course-header h1")).toBeVisible();
    await expect(page.locator(".course-unit")).toHaveCount({ "everyday-ai": 8, "ai-for-students": 8, "ai-at-work": 12, "professional-practice": 16, "lead-with-ai": 12, "build-with-codex": 24, "build-ai-systems": 32 }[slug]);
  }
  await page.goto("/paths/ai-for-students");
  await page.getByLabel("Your result or plan").fill("I would ask for one example of a new idea, then explain it in my own words using the supplied notes.");
  await page.getByLabel("What did you change or what would you verify next?").fill("I would check the explanation against my teacher-approved notes.");
  await page.getByLabel(/I reviewed all three checks/).check();
  await page.getByRole("button", { name: "Record practice" }).click();
  await expect(page.getByText("1/8")).toBeVisible();
  await page.reload();
  await expect(page.getByLabel("Your result or plan")).toHaveValue(/teacher-approved|supplied notes/);
  await expect(page.getByText("1/8")).toBeVisible();
  await page.getByRole("button", { name: /Next: S02/ }).click();
  await expect(page.locator(".course-lesson-head h2")).toHaveText("Unpack a hard concept");
});
