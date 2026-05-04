import { test, expect } from "@playwright/test";

test("Stop button appears during generation and cancels it", async ({ page }) => {
  // Delay response so we can interact with the Stop button
  await page.route("**/api/generate", async (route) => {
    await new Promise((r) => setTimeout(r, 3000));
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ data: [{ bio: "Bio 1" }, { bio: "Bio 2" }, { bio: "Bio 3" }, { bio: "Bio 4" }] }),
    });
  });

  await page.goto("/");
  await page.getByPlaceholder(/share your previous bio/i).fill(
    "Academic researcher publishing work in machine learning and data science."
  );
  await page.getByRole("button", { name: /generate/i }).click();

  // Stop button should appear
  const stopButton = page.getByRole("button", { name: /stop/i });
  await expect(stopButton).toBeVisible({ timeout: 2000 });

  // Click stop
  await stopButton.click();

  // Loading should end and Stop button should disappear
  await expect(stopButton).not.toBeVisible({ timeout: 2000 });
  // No bios should have loaded
  await expect(page.getByRole("list", { name: /generated bios/i })).not.toBeVisible();
});
