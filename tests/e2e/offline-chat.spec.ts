import { expect, test } from "@playwright/test";

test("all 27 topics offer three offline chats without generating a response for edited text", async ({ page }) => {
  test.setTimeout(90000);
  await page.goto("/");
  const journey = page.locator(".ai-journey");
  await expect(journey.locator(".journey-focus h3")).toHaveText("What is AI?");
  let apiRequests = 0;
  page.on("request", (request) => { if (request.url().includes("/api/")) apiRequests += 1; });
  const chat = journey.locator(".offline-chat");
  await expect(chat.getByRole("button", { name: /1\. What AI does/ })).toBeVisible();
  await chat.getByRole("button", { name: "Show simulated reply" }).click();
  await expect(chat.locator(".offline-reply")).toContainText("AI is software");
  await chat.getByRole("button", { name: /2\. A daily use/ }).click();
  await expect(chat.locator(".offline-reply")).toHaveCount(0);
  await chat.getByRole("button", { name: "Show simulated reply" }).click();
  await expect(chat.locator(".offline-reply")).toContainText("ingredients");
  await chat.getByLabel("Your prompt · sample 2").fill("A custom question with no scripted answer");
  await chat.getByRole("button", { name: "Show simulated reply" }).click();
  await expect(chat.locator(".offline-reply")).toHaveCount(0);
  await expect(chat.getByRole("status")).toContainText("scripted reply only");
  await chat.getByRole("button", { name: "Restore sample prompt" }).click();
  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.setViewportSize({ width: 1280, height: 900 });

  for (let topic = 0; topic < 27; topic += 1) {
    await expect(journey.locator(".offline-scenario")).toHaveCount(3);
    await chat.getByRole("button", { name: "Show simulated reply" }).click();
    await expect(chat.locator(".offline-reply")).toBeVisible();
    await journey.getByRole("button", { name: /AI Understand/ }).click();
  }
  await expect(journey.getByText("Journey complete!")).toBeVisible();
  expect(apiRequests).toBe(0);
});
