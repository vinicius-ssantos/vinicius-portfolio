import { expect, test } from "@playwright/test";

test.describe("Architecture Diagram (Personal Platform Infra dossier)", () => {
  test("renders nodes from data and reveals the same detail via hover, keyboard, and tap", async ({
    page,
  }) => {
    await page.goto("/en/projects/personal-platform-infra");
    const heading = page.getByRole("heading", { name: "System topology" });
    const diagram = heading.locator("xpath=../..");
    await diagram.scrollIntoViewIfNeeded();

    const cloudflareNode = diagram.getByRole("button", { name: "Cloudflare" });
    await expect(cloudflareNode).toBeVisible();
    const detail = page.locator(`#${await cloudflareNode.getAttribute("aria-describedby")}`);

    // The detailed dossier variant starts with its first node selected.
    await expect(detail).toContainText("DNS, TLS, Access and Tunnel");

    const traefikNode = diagram.getByRole("button", { name: "Traefik ingress" });
    await traefikNode.hover();
    await expect(detail).toContainText("Routes every request to the right service");

    await page.mouse.move(0, 0);
    await expect(detail).toContainText("DNS, TLS, Access and Tunnel");

    await traefikNode.focus();
    await expect(detail).toContainText("Routes every request to the right service");

    // A tap/click focuses the same accessible button used by keyboard navigation.
    await cloudflareNode.click();
    await expect(detail).toContainText("DNS, TLS, Access and Tunnel");
  });

  test("has no horizontal overflow and needs no horizontal pan on a narrow viewport", async ({
    page,
  }) => {
    await page.goto("/en/projects/personal-platform-infra");
    await page.getByRole("heading", { name: "System topology" }).scrollIntoViewIfNeeded();

    const hasHorizontalOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    );
    expect(hasHorizontalOverflow).toBe(false);
  });

  test("the request-path flow plays once on entry and stays visible with reduced motion", async ({
    page,
  }) => {
    await page.goto("/en/projects/personal-platform-infra");
    const heading = page.getByRole("heading", { name: "System topology" });
    const diagram = heading.locator("xpath=../..");
    // Both a mobile (ArrowDown) and desktop (ArrowRight) arrow share this
    // class per breakpoint; only the one actually rendered for this
    // viewport runs its animation, so scope to the visible one.
    const arrow = diagram.locator(".arch-flow-once:visible").first();

    await expect(arrow).toHaveCSS("opacity", "0");
    await diagram.scrollIntoViewIfNeeded();
    await expect(arrow).toHaveCSS("opacity", "1");
  });

  test("renders with a static, fully visible state under prefers-reduced-motion", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/en/projects/personal-platform-infra");
    const heading = page.getByRole("heading", { name: "System topology" });
    const diagram = heading.locator("xpath=../..");
    await diagram.scrollIntoViewIfNeeded();

    const arrow = diagram.locator(".arch-flow-once:visible").first();
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
