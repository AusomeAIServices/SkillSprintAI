import { expect, test } from "@playwright/test";

test("Gen AI Introduction teaches four source-linked modules with offline practice", async ({ page }) => {
  await page.goto("/");
  const nav = page.getByRole("navigation", { name: "Main navigation" });
  await expect(nav.locator(".nav-link").nth(1)).toContainText("What is AI?");
  await nav.getByRole("link", { name: "Gen AI Introduction" }).click();
  await expect(page).toHaveURL(/\/gen-ai-introduction$/);
  await expect(page.getByRole("heading", { name: "Gen AI Introduction", exact: true })).toBeVisible();
  await expect(page.locator(".gen-intro-nav-item")).toHaveCount(4);
  let apiRequests = 0;
  page.on("request", (request) => { if (request.url().includes("/api/")) apiRequests += 1; });

  await page.getByLabel(/A chat tool drafts a new two-sentence invitation/).check();
  await page.getByRole("button", { name: "Check my choice" }).click();
  await expect(page.getByText(/Yes\. The tool creates a new draft/)).toBeVisible();
  await page.getByLabel("What would you check or change next time?").fill("I would verify a consequential fact with a trusted source.");
  await page.getByRole("button", { name: "Record practice" }).click();
  await expect(page.getByText("1 of 4 modules practised on this device")).toBeVisible();
  await page.getByRole("button", { name: /Next: GenAIChat Experience Journey/ }).click();

  await page.getByLabel("Your prompt · turn 1").fill("A different prompt cannot receive a scripted answer");
  await page.getByRole("button", { name: "Show scripted reply" }).click();
  await expect(page.getByText(/scripted reply only for the sample prompt/)).toBeVisible();
  await expect(page.locator(".gen-chat-reply")).toHaveCount(0);
  await page.getByRole("button", { name: "Restore sample" }).click();
  for (let turn = 0; turn < 3; turn += 1) {
    await page.getByRole("button", { name: "Show scripted reply" }).click();
    await expect(page.locator(".gen-chat-reply")).toBeVisible();
    if (turn < 2) await page.getByRole("button", { name: "Continue the conversation" }).click();
  }
  await page.getByLabel("What would you check or change next time?").fill("I would add only relevant details and verify the current event time.");
  await page.getByRole("button", { name: "Record practice" }).click();
  await expect(page.getByText("2 of 4 modules practised on this device")).toBeVisible();
  await page.getByRole("button", { name: /Next: Prompt Engineering for Regular People/ }).click();

  await page.getByRole("button", { name: "Review my prompt" }).click();
  await expect(page.getByText(/Add a clear goal/)).toBeVisible();
  await page.getByLabel("What would you check or change next time?").fill("I would check a draft before sending it to anyone.");
  await page.getByRole("button", { name: "Record practice" }).click();
  await expect(page.getByRole("status").last()).toContainText("Try the short activity");
  await page.getByRole("button", { name: "Use fictional example" }).click();
  await page.getByRole("button", { name: "Review my prompt" }).click();
  await expect(page.getByText(/All four parts are present/)).toBeVisible();
  await page.getByLabel("What would you check or change next time?").fill("I would check the draft's details and revise its tone for neighbors.");
  await page.getByRole("button", { name: "Record practice" }).click();
  await page.getByRole("button", { name: /Next: Context Engineering for AI Peeps/ }).click();

  await page.getByLabel(/Monday project note/).check();
  await page.getByLabel(/Wednesday project note/).check();
  await page.getByRole("button", { name: "Check context bundle" }).click();
  await expect(page.getByText(/Keep both dated notes/)).toBeVisible();
  await page.getByLabel("What would you check or change next time?").fill("I would keep both conflicting source notes and exclude unrelated records.");
  await page.getByRole("button", { name: "Record practice" }).click();
  await expect(page.getByText("4 of 4 modules practised on this device")).toBeVisible();
  await expect(page.getByRole("link", { name: /Effective context engineering for AI agents/ })).toHaveAttribute("href", "https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents");
  expect(apiRequests).toBe(0);
  await page.reload();
  await expect(page.getByText("4 of 4 modules practised on this device")).toBeVisible();
  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.setViewportSize({ width: 320, height: 700 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});
