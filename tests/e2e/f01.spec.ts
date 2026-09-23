import { expect, test } from "@playwright/test";

test("beginner prompt helper offers plain language, Tagalog and a student study guide", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#ai-journey-title")).toBeVisible();
  await expect(page.getByText("Build a prompt to try with ChatGPT", { exact: true })).toBeVisible();
  await expect(page.locator(".ai-journey .journey-focus h3")).toHaveText("What is AI?");
  await page.getByLabel("What do you want to understand?").fill("fractions");
  await page.getByRole("button", { name: "Tagalog", exact: true }).click();
  await expect(page.getByText(/Explain it in natural, clear Tagalog/)).toBeVisible();
  await page.getByRole("button", { name: "Explain like I’m 5" }).click();
  await expect(page.getByText(/Explain it like I’m 5, using a familiar analogy/)).toBeVisible();
  await page.getByRole("button", { name: "Copy prompt" }).click();
  await expect(page.getByText(/Prompt copied|Copy is unavailable here/)).toBeVisible();
  await expect(page.getByText("AI for Students: learn the idea, not just the answer", { exact: true })).toBeVisible();
  await expect(page.getByText(/Compare important claims with your course notes or textbook/)).toBeVisible();
});

test("Journey is the second learning menu item on desktop and mobile", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#ai-journey-title")).toBeVisible();
  const desktopNav = page.getByRole("navigation", { name: "Main navigation" });
  const desktopTargets = await desktopNav.locator(".nav-link").evaluateAll((links) => links.slice(0, 2).map((link) => link.getAttribute("href")));
  expect(desktopTargets).toEqual(["#today", "#ai-understanding-journey"]);
  await desktopNav.getByRole("link", { name: "What is AI?" }).click();
  await expect(page).toHaveURL(/#ai-understanding-journey$/);
  await expect(page.locator("#ai-understanding-journey")).toBeVisible();

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(page.locator("#ai-journey-title")).toBeVisible();
  const mobileNav = page.getByRole("navigation", { name: "Mobile navigation" });
  const mobileTargets = await mobileNav.locator(".nav-link").evaluateAll((links) => links.slice(0, 2).map((link) => link.getAttribute("href")));
  expect(mobileTargets).toEqual(["#today", "#ai-understanding-journey"]);
  await mobileNav.getByRole("link", { name: "What is AI?", exact: true }).click();
  await expect(page).toHaveURL(/#ai-understanding-journey$/);
});

test("What is AI? journey advances by topic, awards milestones and persists progress", async ({ page }) => {
  await page.goto("/");
  const journey = page.locator(".ai-journey");
  await expect(journey.locator("#ai-journey-title")).toBeVisible();
  await expect(journey.locator(".journey-focus h3")).toHaveText("What is AI?");
  await expect(journey.getByText(/ChatGPT is one AI chat tool/)).toBeVisible();
  await expect(journey.locator(".difficulty-pill").first()).toHaveText("Easy");
  await expect(journey.getByText("0 of 27 topics")).toBeVisible();

  await journey.getByRole("button", { name: /AI Understand/ }).click();
  await expect(journey.locator(".journey-focus h3")).toHaveText("From Google search to ChatGPT");
  await expect(journey.locator(".difficulty-pill").first()).toHaveText("Hard");
  await expect(journey.getByText("1 of 27 topics")).toBeVisible();
  await expect(journey.getByText("10 XP")).toBeVisible();
  await expect(journey.getByRole("button", { name: /Open full Google vs ChatGPT practice/ })).toBeVisible();

  await journey.getByRole("button", { name: /AI Understand/ }).click();
  await expect(journey.locator(".journey-focus h3")).toHaveText("Use search and ChatGPT together");
  await expect(journey.locator(".difficulty-pill").first()).toHaveText("Advanced");
  await journey.getByRole("button", { name: /AI Understand/ }).click();
  await expect(journey.locator(".journey-focus h3")).toHaveText("Say what you want");
  await expect(journey.locator(".badge-chip strong").getByText("1")).toBeVisible();
  await expect(journey.getByText("30 XP")).toBeVisible();

  await page.reload();
  const resumedJourney = page.locator(".ai-journey");
  await expect(resumedJourney.locator(".journey-focus h3")).toHaveText("Say what you want");
  await expect(resumedJourney.getByText("3 of 27 topics")).toBeVisible();
  await expect(resumedJourney.locator(".badge-chip strong").getByText("1")).toBeVisible();
});


test("learner completes F01, saves private evidence, and resumes after reload", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const response = await page.request.get("/api/lessons/foundation-001");
  expect(response.ok()).toBeTruthy();
  const publicLesson = JSON.stringify(await response.json());
  expect(publicLesson).not.toContain("correctChoiceId");
  expect(publicLesson).not.toContain("reviewerGuide");
  expect(publicLesson).not.toContain("The candidate spends only $5");

  await page.goto("/");
  await expect(page.getByRole("heading", { name: "New to AI? Start with what you already know." })).toBeVisible();
  await expect(page.getByText(/Start with a simple explanation of AI, then see how ChatGPT differs from Google Search/)).toBeVisible();
  await expect(page.getByRole("heading", { name: "From Google search to ChatGPT" })).toBeVisible();
  await page.getByRole("button", { name: /Open full Google vs ChatGPT practice/ }).click();
  await expect(page.getByRole("heading", { name: "Your first useful question for ChatGPT" })).toBeVisible();
  await page.getByRole("button", { name: /Save and continue/ }).click();
  await expect(page.getByRole("heading", { name: "The four parts, in this example" })).toBeVisible();
  await expect(page.getByText(/In a conversation, relevant earlier messages can also provide context/)).toBeVisible();
  await page.getByRole("button", { name: /Save and continue/ }).click();
  await expect(page.getByRole("heading", { name: "Try a familiar task with ChatGPT" })).toBeVisible();

  const draftSaved = page.waitForResponse((response) => response.url().includes("/api/attempts/") && response.request().method() === "PATCH" && response.ok());
  await page.getByLabel("1. Your prompt").fill("Plan a quiet afternoon with the facts, budget and buffer in a table.");
  await page.getByLabel("2. Your corrected plan").fill("Leave 3:30 to 4:00 unallocated and spend $5.");
  await page.getByLabel("3. One source-based check").fill("S5 sets the $12 limit and requires a 30-minute buffer.");
  await page.getByLabel("4. What information is still unknown?").fill("Weather and accessibility are not stated.");
  await draftSaved;
  await page.reload();
  await expect(page.getByLabel("1. Your prompt")).toHaveValue(/Plan a quiet afternoon/);
  await page.getByRole("button", { name: /Continue to check/ }).click();

  await page.getByRole("radio", { name: /Google finds pages to check/ }).check();
  await page.getByRole("radio", { name: /Mark them as unverified/ }).check();
  await page.getByRole("radio", { name: /It assigns every minute/ }).check();
  for (const dimension of ["task fit", "verification", "privacy", "reflection"]) {
    await page.getByRole("group", { name: "Self-rating for " + dimension }).getByRole("button", { name: "2" }).click();
  }
  await page.getByRole("button", { name: "Check my understanding" }).click();
  await expect(page.getByText(/Provisional proficiency/)).toBeVisible();

  await page.getByRole("button", { name: "Save and continue" }).click();
  await page.getByLabel("What did you correct?").fill("I left a buffer and marked weather and access as unknown.");
  await page.getByRole("button", { name: "Save and finish" }).click();
  await expect(page.getByRole("heading", { name: "Good work. You finished your lesson." })).toBeVisible();
  await expect(page.getByText(/self-assessed practice/)).toBeVisible();
  await page.reload();
  await expect(page.getByRole("heading", { name: "Good work. You finished your lesson." })).toBeVisible();

  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto("/");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBeTruthy();
});
