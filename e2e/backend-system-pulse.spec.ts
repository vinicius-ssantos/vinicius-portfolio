import { expect, test } from "@playwright/test";

test.describe("Backend System Pulse", () => {
  test("shows exactly one variant depending on viewport, decoratively, without overflow", async ({
    page,
  }) => {
    await page.goto("/en");

    const full = page.locator('[data-diagram="full"]');
    const compact = page.locator('[data-diagram="compact"]');

    await expect(full).toHaveAttribute("aria-hidden", "true");
    await expect(compact).toHaveAttribute("aria-hidden", "true");

    const viewportWidth = page.viewportSize()?.width ?? 0;
    const isDesktop = viewportWidth >= 1024;

    await expect(full).toBeVisible({ visible: isDesktop });
    await expect(compact).toBeVisible({ visible: !isDesktop });

    const hasHorizontalOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    );
    expect(hasHorizontalOverflow).toBe(false);
  });

  test("pulses only while the hero is in view", async ({ page }) => {
    await page.goto("/en");

    const hero = page.locator("section:has(h1)");
    const pulseDot = hero.locator(".animate-pulse-flow").first();

    await expect(hero).toHaveAttribute("data-motion-in-viewport", "true");
    await expect(pulseDot).toHaveCSS("animation-play-state", "running");

    await page.locator("#experience").scrollIntoViewIfNeeded();
    await expect(hero).toHaveAttribute("data-motion-in-viewport", "false");
    await expect(pulseDot).toHaveCSS("animation-play-state", "paused");
  });

  test("renders a static, equivalent state when reduced motion is requested", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/en");

    const pulseDot = page.locator(".animate-pulse-flow").first();

    await expect(pulseDot).toHaveCSS("animation-name", "none");
  });
});
