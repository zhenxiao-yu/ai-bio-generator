import { test, expect } from "@playwright/test";

const MOCK_BIOS = {
  data: [
    { bio: "Software engineer building great products." },
    { bio: "Full-stack developer passionate about clean code." },
    { bio: "Tech enthusiast crafting digital experiences." },
    { bio: "Engineer turning ideas into reality." },
  ],
};

test.beforeEach(async ({ page }) => {
  await page.route("**/api/generate", (route) =>
    route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(MOCK_BIOS) })
  );
});

test("full happy path: fill form → generate → 4 bios appear", async ({ page }) => {
  await page.goto("/");

  // Fill the content textarea
  await page.getByPlaceholder(/share your previous bio/i).fill(
    "Software engineer with 5 years of experience building web applications and APIs."
  );

  // Submit
  await page.getByRole("button", { name: /generate/i }).click();

  // All 4 bios should appear
  const bios = page.getByRole("list", { name: /generated bios/i }).getByRole("listitem");
  await expect(bios).toHaveCount(4);
  await expect(bios.first()).toContainText("Software engineer");
});

test("shows loading state while generating", async ({ page }) => {
  // Delay the response so we can catch the loading spinner
  await page.route("**/api/generate", async (route) => {
    await new Promise((r) => setTimeout(r, 500));
    await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(MOCK_BIOS) });
  });

  await page.goto("/");
  await page.getByPlaceholder(/share your previous bio/i).fill(
    "Developer building things for the web every day."
  );
  await page.getByRole("button", { name: /generate/i }).click();

  // Loading skeletons should be visible
  await expect(page.getByRole("status", { name: /generating/i })).toBeVisible();

  // Bios should eventually appear
  await expect(page.getByRole("list", { name: /generated bios/i })).toBeVisible({ timeout: 5000 });
});
