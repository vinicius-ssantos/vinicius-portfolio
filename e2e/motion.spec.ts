import { expect, test } from "@playwright/test";

test.describe("motion language", () => {
  test("assigns semantic patterns to headings, lists, and diagrams", async ({ page }) => {
    await page.goto("/en");

    await expect(page.locator('[data-motion="heading"]').first()).toBeVisible();
    await expect(page.locator('[data-motion="list"]').first()).toHaveClass(/reveal-stagger/);
    await expect(page.locator('[data-motion="diagram"]').first()).toHaveClass(/reveal/);
  });

  test("renders final static states when reduced motion is requested", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/en");

    const heading = page.locator('[data-motion="heading"]').first();
    const card = page.locator(".card-lift").first();
    const checkmark = page.locator(".check-pop").first();
    const languageBar = page.locator(".lang-bar-segment").first();

    await expect(heading).toHaveCSS("opacity", "1");
    await expect(heading).toHaveCSS("transform", "none");
    await expect(heading).toHaveCSS("transition-property", "none");
    await expect(card).toHaveCSS("transition-property", "none");
    await expect(checkmark).toHaveCSS("animation-name", "none");
    await expect(checkmark).toHaveCSS("opacity", "1");

    if ((await languageBar.count()) > 0) {
      await expect(languageBar).toHaveCSS("animation-name", "none");
    }
  });
});
