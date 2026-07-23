import { test, expect } from "@playwright/test";

test.describe("desktop navigation", () => {
  test("language toggle preserves the current path", async ({ page }) => {
    await page.goto("/en/projects/sentinel-ledger");
    await page.getByRole("button", { name: /switch to português|mudar para português/i }).click();
    await expect(page).toHaveURL("/pt/projects/sentinel-ledger");
  });

  test("nav links jump to their section anchors", async ({ page, viewport }) => {
    // The desktop nav links are `hidden sm:inline` — this exercises the
    // desktop header, not the mobile menu (covered separately below).
    test.skip((viewport?.width ?? 0) < 640, "desktop-only nav links");

    await page.goto("/en");
    await page.getByRole("link", { name: "Experience", exact: true }).click();
    await expect(page).toHaveURL(/#experience$/);
    await expect(page.locator("#experience")).toBeInViewport();
  });

  test("scroll-spy marks the predominant section's nav link active", async ({ page, viewport }) => {
    test.skip((viewport?.width ?? 0) < 640, "desktop-only nav links");

    await page.goto("/en");
    const stackLink = page.getByRole("link", { name: "Stack", exact: true });
    const aboutLink = page.getByRole("link", { name: "About", exact: true });

    await page.locator("#stack").scrollIntoViewIfNeeded();
    await expect(stackLink).toHaveAttribute("aria-current", "location");
    await expect(stackLink).toHaveAttribute("data-active", "true");
    await expect(aboutLink).not.toHaveAttribute("aria-current", "location");

    await page.locator("#about").scrollIntoViewIfNeeded();
    await expect(aboutLink).toHaveAttribute("aria-current", "location");
    await expect(stackLink).not.toHaveAttribute("aria-current", "location");
  });

  test("loading a URL with a section hash marks the matching nav link active", async ({
    page,
    viewport,
  }) => {
    test.skip((viewport?.width ?? 0) < 640, "desktop-only nav links");

    await page.goto("/en#case-study");
    await expect(page.getByRole("link", { name: "Case study", exact: true })).toHaveAttribute(
      "aria-current",
      "location",
    );
  });
});

test.describe("mobile navigation", () => {
  // Only the viewport is overridden (not the full device preset) — a full
  // device swap includes browserName/isMobile and forces a new worker,
  // which Playwright disallows inside a describe block.
  test.use({ viewport: { width: 412, height: 915 } });

  test("menu opens, lists every section, closes on link click", async ({ page }) => {
    await page.goto("/en");

    const trigger = page.getByRole("button", { name: "Open menu" });
    await trigger.click();

    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    for (const label of ["Experience", "Stack", "Projects", "Case study", "About"]) {
      await expect(dialog.getByRole("link", { name: label })).toBeVisible();
    }

    await dialog.getByRole("link", { name: "Experience" }).click();
    await expect(dialog).not.toBeVisible();
    await expect(page).toHaveURL(/#experience$/);
  });

  test("Escape closes the menu and returns focus to the trigger", async ({ page }) => {
    await page.goto("/en");
    const trigger = page.getByRole("button", { name: "Open menu" });
    await trigger.click();
    await expect(page.getByRole("dialog")).toBeVisible();

    await page.keyboard.press("Escape");

    await expect(page.getByRole("dialog")).not.toBeVisible();
    await expect(trigger).toBeFocused();
  });
});
