import { test, expect } from "@playwright/test";

const PROJECT_SLUGS = [
  "accountshield-orchestrator",
  "sentinel-ledger",
  "flagforge",
  "personal-platform-infra",
  "springcloud",
  "api-rest-aplicativo-cars",
];

test.describe("project detail pages", () => {
  for (const slug of PROJECT_SLUGS) {
    test(`/en/projects/${slug} renders the project name and a repo link`, async ({ page }) => {
      const res = await page.goto(`/en/projects/${slug}`);
      expect(res?.status()).toBe(200);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      await expect(page.getByRole("link", { name: /open repository/i }).first()).toHaveAttribute(
        "href",
        /github\.com/,
      );
    });
  }

  test("FlagForge responds with 200 and localized M0 limits in Portuguese", async ({ page }) => {
    const res = await page.goto("/pt/projects/flagforge");
    expect(res?.status()).toBe(200);
    await expect(page.getByRole("heading", { level: 1, name: "FlagForge" })).toBeVisible();
    await expect(page.getByText(/ainda não permite criar, publicar ou avaliar/i)).toBeVisible();
  });

  test("Sentinel exposes lifecycle metadata and verifiable evidence", async ({ page }) => {
    await page.goto("/en/projects/sentinel-ledger");

    await expect(page.getByText("Active implementation", { exact: true })).toBeVisible();
    await expect(page.getByText("Started: 2026-07-14", { exact: true })).toBeVisible();
    await expect(page.getByText("Editorial update: 2026-07-23", { exact: true })).toBeVisible();

    const evidenceHeading = page.getByRole("heading", { name: "Verifiable evidence" });
    await expect(evidenceHeading).toBeVisible();
    const evidenceSection = evidenceHeading.locator("xpath=../..");
    await expect(
      evidenceSection.getByRole("link", { name: "Documented architecture" }),
    ).toBeVisible();
    await expect(evidenceSection.getByRole("link", { name: "CI pipeline" })).toBeVisible();
    await expect(evidenceSection.getByRole("link", { name: "Reproducible runbook" })).toBeVisible();
    await expect(evidenceSection.getByRole("link", { name: "Tests and strategy" })).toBeVisible();
  });

  for (const locale of ["en", "pt"] as const) {
    test(`an unknown slug returns the localized 404 page in ${locale}`, async ({ page }) => {
      const res = await page.goto(`/${locale}/projects/does-not-exist`);
      expect(res?.status()).toBe(404);
      await expect(page.locator("html")).toHaveAttribute("lang", locale);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    });
  }

  test("home separates primary projects from earlier work", async ({ page }) => {
    await page.goto("/en");

    const primaryHeading = page.getByRole("heading", { level: 3, name: "Primary projects" });
    const previousHeading = page.getByRole("heading", { level: 3, name: "Earlier projects" });
    await expect(primaryHeading).toBeVisible();
    await expect(previousHeading).toBeVisible();

    const primaryGroup = primaryHeading.locator("xpath=../..");
    const previousGroup = previousHeading.locator("xpath=../..");

    for (const slug of PROJECT_SLUGS.slice(0, 4)) {
      await expect(primaryGroup.locator(`a[href="/en/projects/${slug}"]`).first()).toBeVisible();
      await expect(previousGroup.locator(`a[href="/en/projects/${slug}"]`)).toHaveCount(0);
    }

    for (const slug of PROJECT_SLUGS.slice(4)) {
      await expect(previousGroup.locator(`a[href="/en/projects/${slug}"]`).first()).toBeVisible();
      await expect(primaryGroup.locator(`a[href="/en/projects/${slug}"]`)).toHaveCount(0);
    }

    await expect(page.getByText("Primary case", { exact: true })).toHaveCount(1);
  });

  test("home links to every visible project's detail page", async ({ page }) => {
    await page.goto("/en");
    for (const slug of PROJECT_SLUGS) {
      await expect(page.locator(`a[href="/en/projects/${slug}"]`).first()).toBeVisible();
    }
  });
});
