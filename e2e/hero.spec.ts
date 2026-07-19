import { test, expect } from "@playwright/test";

const FULL_NAME = "Vinicius de Oliveira Santos";
const NAME_WORDS = FULL_NAME.split(" ");

test.describe("hero name", () => {
  test("keeps the accessible name, explicit spacing, and responsive bounds", async ({ page }) => {
    await page.goto("/en");

    const heading = page.getByRole("heading", { level: 1, name: FULL_NAME, exact: true });
    await expect(heading).toBeVisible();

    const visualName = heading.locator('[aria-hidden="true"]');
    const words = visualName.locator(".hero-word");

    await expect(words).toHaveCount(NAME_WORDS.length);
    await expect(words).toHaveText(NAME_WORDS);

    const columnGap = await visualName.evaluate((element) =>
      Number.parseFloat(getComputedStyle(element).columnGap),
    );
    expect(columnGap).toBeGreaterThan(0);

    const viewportWidth = await page.evaluate(() => window.innerWidth);
    const wordBounds = await words.evaluateAll((elements) =>
      elements.map((element) => {
        const rect = element.getBoundingClientRect();
        return { left: rect.left, right: rect.right };
      }),
    );

    for (const bounds of wordBounds) {
      expect(bounds.left).toBeGreaterThanOrEqual(0);
      expect(bounds.right).toBeLessThanOrEqual(viewportWidth);
    }

    const hasHorizontalOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    );
    expect(hasHorizontalOverflow).toBe(false);
  });

  test("shows the final name layout immediately with reduced motion", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/en");

    const heading = page.getByRole("heading", { level: 1, name: FULL_NAME, exact: true });
    const words = heading.locator(".hero-word");

    await expect(words).toHaveCount(NAME_WORDS.length);
    await expect(words.first()).toHaveCSS("animation-name", "none");
    await expect(words.first()).toHaveCSS("opacity", "1");
  });
});
