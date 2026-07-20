import { expect, test } from "@playwright/test";

test.describe("Architecture Diagram (case study)", () => {
  test("renders nodes from data and reveals the same detail via hover, keyboard, and tap", async ({
    page,
  }) => {
    await page.goto("/en#case-study");
    const diagram = page.locator("#case-study");
    await diagram.scrollIntoViewIfNeeded();

    const cloudflareNode = diagram.getByRole("button", { name: "Cloudflare" });
    await expect(cloudflareNode).toBeVisible();
    const detail = page.locator(`#${await cloudflareNode.getAttribute("aria-describedby")}`);

    await expect(detail).toHaveText("Hover, focus, or tap a node for details");

    await cloudflareNode.hover();
    await expect(detail).toContainText("DNS, TLS, Access and Tunnel");

    await page.mouse.move(0, 0);
    await expect(detail).toHaveText("Hover, focus, or tap a node for details");

    await cloudflareNode.focus();
    await expect(detail).toContainText("DNS, TLS, Access and Tunnel");

    // A tap/click both activates and focuses the button — same reveal path as keyboard.
    const traefikNode = diagram.getByRole("button", { name: "Traefik ingress" });
    await traefikNode.click();
    await expect(detail).toContainText("Routes every request to the right service");
  });

  test("has no horizontal overflow and needs no horizontal pan on a narrow viewport", async ({
    page,
  }) => {
    await page.goto("/en#case-study");
    await page.locator("#case-study").scrollIntoViewIfNeeded();

    const hasHorizontalOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    );
    expect(hasHorizontalOverflow).toBe(false);
  });

  test("the request-path flow plays once on entry and stays visible with reduced motion", async ({
    page,
  }) => {
    await page.goto("/en");
    // Both a mobile (ArrowDown) and desktop (ArrowRight) arrow share this
    // class per breakpoint; only the one actually rendered for this
    // viewport runs its animation, so scope to the visible one.
    const arrow = page.locator(".arch-flow-once:visible").first();

    await expect(arrow).toHaveCSS("opacity", "0");
    await page.locator("#case-study").scrollIntoViewIfNeeded();
    await expect(arrow).toHaveCSS("opacity", "1");
  });

  test("renders with a static, fully visible state under prefers-reduced-motion", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/en#case-study");
    await page.locator("#case-study").scrollIntoViewIfNeeded();

    const arrow = page.locator(".arch-flow-once:visible").first();
    await expect(arrow).toHaveCSS("animation-name", "none");
    await expect(arrow).toHaveCSS("opacity", "1");
  });
});

test.describe("Architecture Diagram (project detail)", () => {
  test("shows a detailed variant that starts with a node already described", async ({ page }) => {
    await page.goto("/en/projects/personal-platform-infra");
    const heading = page.getByRole("heading", { name: "System topology" });
    await heading.scrollIntoViewIfNeeded();

    const firstNode = page.getByRole("button", { name: "Cloudflare" });
    const detail = page.locator(`#${await firstNode.getAttribute("aria-describedby")}`);
    await expect(detail).toContainText("DNS, TLS, Access and Tunnel");
  });
});
