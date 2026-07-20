import { expect, test } from "@playwright/test";

// The #48 spike ships behind NEXT_PUBLIC_ENABLE_3D_TOPOLOGY, which CI leaves
// unset. These assertions are the guard that an unreviewed WebGL prototype —
// and its ~870 KiB of JavaScript — can never reach the public site by
// accident: if someone flips the default, this suite fails.
test.describe("3D topology spike (flag off)", () => {
  test("does not render the experimental canvas on the project dossier", async ({ page }) => {
    await page.goto("/en/projects/personal-platform-infra");

    await expect(page.locator('[data-topology-3d="true"]')).toHaveCount(0);
    await expect(page.locator("canvas")).toHaveCount(0);
  });

  test("leaves the accessible topology as the whole experience", async ({ page }) => {
    await page.goto("/en/projects/personal-platform-infra");

    const heading = page.getByRole("heading", { name: "System topology" });
    await heading.scrollIntoViewIfNeeded();
    await expect(heading).toBeVisible();

    // Still the interactive HTML diagram from #47 — nodes are real buttons.
    const node = page.getByRole("button", { name: "Cloudflare" });
    await expect(node).toBeVisible();
    const detail = page.locator(`#${await node.getAttribute("aria-describedby")}`);
    await node.focus();
    await expect(detail).toContainText("DNS, TLS, Access and Tunnel");
  });

  test("never requests the three.js chunk", async ({ page }) => {
    const scriptUrls: string[] = [];
    page.on("response", (response) => {
      if (response.url().endsWith(".js")) scriptUrls.push(response.url());
    });

    await page.goto("/en/projects/personal-platform-infra", { waitUntil: "networkidle" });
    await page.getByRole("heading", { name: "System topology" }).scrollIntoViewIfNeeded();

    // The bundler emits the lazy chunk to disk regardless; what matters is
    // that nothing on this page ever fetches it.
    const bodies = await Promise.all(
      scriptUrls.map(async (url) => {
        const response = await page.request.get(url);
        return response.text();
      }),
    );
    expect(bodies.some((body) => body.includes("THREE.WebGLRenderer"))).toBe(false);
  });
});
