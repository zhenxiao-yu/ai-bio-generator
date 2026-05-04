import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.route("**/api/generate", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        data: [
          { bio: "LinkedIn professional bio." },
          { bio: "LinkedIn leadership bio." },
          { bio: "LinkedIn expertise bio." },
          { bio: "LinkedIn network bio." },
        ],
      }),
    })
  );
});

test("selecting LinkedIn updates character limit display", async ({ page }) => {
  await page.goto("/");

  // Click the LinkedIn platform button
  await page.getByRole("button", { name: /linkedin/i }).click();

  // Generate bios
  await page.getByPlaceholder(/share your previous bio/i).fill(
    "Senior product manager with 10 years of experience driving innovation."
  );
  await page.getByRole("button", { name: /generate/i }).click();

  // Wait for bios
  await expect(page.getByRole("list", { name: /generated bios/i })).toBeVisible({ timeout: 5000 });

  // Character counter should show 220 limit
  await expect(page.locator("text=/\\/220/").first()).toBeVisible();
});

test("selecting Twitter shows 160 character limit", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /twitter/i }).click();

  await page.getByPlaceholder(/share your previous bio/i).fill(
    "Developer building cool stuff every day on the web."
  );
  await page.getByRole("button", { name: /generate/i }).click();

  await expect(page.getByRole("list", { name: /generated bios/i })).toBeVisible({ timeout: 5000 });
  await expect(page.locator("text=/\\/160/").first()).toBeVisible();
});
