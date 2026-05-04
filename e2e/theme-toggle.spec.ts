import { test, expect } from "@playwright/test";

test("theme toggle applies dark class and persists across reload", async ({ page }) => {
  await page.goto("/");

  // Verify starts in light mode
  await expect(page.locator("html")).not.toHaveClass(/dark/);

  // Click theme toggle
  await page.getByRole("button", { name: /switch to dark mode/i }).click();

  // Dark class should be applied
  await expect(page.locator("html")).toHaveClass(/dark/);

  // Reload and verify dark mode persists (anti-FOUT inline script)
  await page.reload();
  await expect(page.locator("html")).toHaveClass(/dark/);
});

test("theme toggle switches back to light mode", async ({ page }) => {
  await page.goto("/");

  // Enable dark mode
  await page.getByRole("button", { name: /switch to dark mode/i }).click();
  await expect(page.locator("html")).toHaveClass(/dark/);

  // Toggle back to light
  await page.getByRole("button", { name: /switch to light mode/i }).click();
  await expect(page.locator("html")).not.toHaveClass(/dark/);
});
