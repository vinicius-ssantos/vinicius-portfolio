import { expect, test } from "@playwright/test";

test.describe("motion language", () => {
  test("assigns semantic patterns to headings, lists, and diagrams", async ({ page }) => {
    await page.goto("/en");

    const heading = page.locator('[data-motion="heading"]').first();
    const list = page.locator('[data-motion="list"]').first();
    const diagram = page.locator('[data-motion="diagram"]').first();

    await heading.scrollIntoViewIfNeeded();
    await expect(heading).toHaveClass(/reveal/);
    await expect(list).toHaveClass(/reveal-stagger/);
    await expect(diagram).toHaveClass(/reveal/);
  });

  test("renders final static states when reduced motion is requested", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/en");

    const heading = page.locator('[data-motion="heading"]').first();
    const card = page.locator(".card-lift").first();
    const heroWord = page.locator(".hero-word").first();

    await expect(heading).toHaveCSS("opacity", "1");
    await expect(heading).toHaveCSS("transform", "none");
    await expect(heading).toHaveCSS("transition-property", "none");
    await expect(card).toHaveCSS("transition-property", "none");
    await expect(heroWord).toHaveCSS("animation-name", "none");
    await expect(heroWord).toHaveCSS("opacity", "1");
  });
});
