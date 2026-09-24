import { expect, test } from "@playwright/test";

test("learner can follow the quest map and keep a color theme across pages", async ({ page }) => {
  await page.goto("/");
  const map = page.getByRole("list", { name: "Three-wave learning journey" });
  await expect(map.getByRole("listitem")).toHaveCount(3);
  await expect(map.getByRole("listitem").first()).toContainText("Current wave");
  await expect(map.getByRole("listitem").first()).toContainText("0 of 9 topics explored");

  await page.getByRole("button", { name: /Choose color theme/ }).click();
  await page.getByRole("button", { name: "Ocean" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-skill-theme", "ocean");
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue("--brand").trim())).toBe("#075c9a");

  await page.getByRole("button", { name: /AI Understand/ }).click();
  await expect(map.getByRole("listitem").first()).toContainText("1 of 9 topics explored");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-skill-theme", "ocean");
  await expect(map.getByRole("listitem").first()).toContainText("1 of 9 topics explored");

  await page.getByRole("link", { name: "Gen AI Introduction" }).first().click();
  await expect(page.getByText("0 of 4 modules practised on this device")).toBeVisible();
  await expect(page.locator("html")).toHaveAttribute("data-skill-theme", "ocean");
  await page.getByRole("button", { name: /Choose color theme/ }).click();
  await expect(page.getByRole("button", { name: "Forest" })).toBeVisible();
  await page.getByRole("button", { name: "Forest" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-skill-theme", "forest");
  await page.goto("/paths/ai-for-students");
  await expect(page.locator("html")).toHaveAttribute("data-skill-theme", "forest");

  await page.setViewportSize({ width: 320, height: 740 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.getByRole("button", { name: /Choose color theme/ }).click();
  await expect(page.getByRole("button", { name: "Sunset" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("button", { name: "Sunset" })).toHaveCount(0);
});

test("reduced-motion preference removes card transforms", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator(".quest-stop")).toHaveCount(3);
  expect(await page.locator(".quest-stop").first().evaluate((element) => getComputedStyle(element).transform)).toBe("none");
});
