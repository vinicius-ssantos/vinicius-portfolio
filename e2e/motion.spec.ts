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

  test("starts child motion on entry and pauses continuous motion offscreen", async ({ page }) => {
    await page.goto("/en");

    const experience = page.locator("#experience");
    const experienceMotion = experience.locator('[data-motion="list"]').first();
    const checkmark = experience.locator(".check-pop").first();

    await expect(checkmark).toHaveCSS("animation-name", "none");
    await experienceMotion.scrollIntoViewIfNeeded();
    await expect(experienceMotion).toHaveAttribute("data-motion-entered", "true");
    await expect(checkmark).toHaveCSS("animation-name", "check-pop");

    const hero = page.locator("section:has(h1)");
    const pulseDot = hero.locator(".animate-pulse-flow").first();

    // Scrolling to #experience above moved the Hero offscreen.
    await expect(hero).toHaveAttribute("data-motion-in-viewport", "false");
    await expect(pulseDot).toHaveCSS("animation-play-state", "paused");

    await hero.scrollIntoViewIfNeeded();
    await expect(hero).toHaveAttribute("data-motion-in-viewport", "true");
    await expect(pulseDot).toHaveCSS("animation-play-state", "running");

    await experience.scrollIntoViewIfNeeded();
    await expect(hero).toHaveAttribute("data-motion-in-viewport", "false");
    await expect(pulseDot).toHaveCSS("animation-play-state", "paused");
  });

  test("renders final static states when reduced motion is requested", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/en");

    const heading = page.locator('[data-motion="heading"]').first();
    const card = page.locator(".card-lift").first();
    const heroWord = page.locator(".hero-word").first();
    const checkmark = page.locator(".check-pop").first();
    const pulseDot = page.locator(".animate-pulse-flow").first();

    await expect(heading).toHaveCSS("opacity", "1");
    await expect(heading).toHaveCSS("transform", "none");
    await expect(heading).toHaveCSS("transition-property", "none");
    await expect(card).toHaveCSS("transition-property", "none");
    await expect(heroWord).toHaveCSS("animation-name", "none");
    await expect(heroWord).toHaveCSS("opacity", "1");
    await expect(checkmark).toHaveCSS("animation-name", "none");
    await expect(checkmark).toHaveCSS("opacity", "1");
    await expect(pulseDot).toHaveCSS("animation-name", "none");
  });
});
