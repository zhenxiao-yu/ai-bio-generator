import { test, expect } from "@playwright/test";

test("shows error toast when API returns 500", async ({ page }) => {
  await page.route("**/api/generate", (route) =>
    route.fulfill({
      status: 500,
      contentType: "application/json",
      body: JSON.stringify({ error: "Internal server error", code: "UNKNOWN" }),
    })
  );

  await page.goto("/");
  await page.getByPlaceholder(/share your previous bio/i).fill(
    "Content creator making videos about technology and design."
  );
  await page.getByRole("button", { name: /generate/i }).click();

  // Toast should appear with error message
  await expect(page.locator("[data-sonner-toast]")).toBeVisible({ timeout: 5000 });
  await expect(page.locator("[data-sonner-toast]")).toContainText(/internal server error/i);
});

test("shows rate limit error message", async ({ page }) => {
  await page.route("**/api/generate", (route) =>
    route.fulfill({
      status: 429,
      contentType: "application/json",
      body: JSON.stringify({ error: "Too many requests. Please wait before trying again.", code: "RATE_LIMIT" }),
    })
  );

  await page.goto("/");
  await page.getByPlaceholder(/share your previous bio/i).fill(
    "Freelance designer crafting beautiful digital experiences."
  );
  await page.getByRole("button", { name: /generate/i }).click();

  await expect(page.locator("[data-sonner-toast]")).toBeVisible({ timeout: 5000 });
  await expect(page.locator("[data-sonner-toast]")).toContainText(/too many requests/i);
});
