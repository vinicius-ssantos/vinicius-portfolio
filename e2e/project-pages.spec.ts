import { test, expect } from "@playwright/test";

const PROJECT_SLUGS = [
  "accountshield-orchestrator",
  "sentinel-ledger",
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

  test("AccountShield responds with 200 and localized content in Portuguese", async ({
    page,
  }) => {
    const res = await page.goto("/pt/projects/accountshield-orchestrator");
    expect(res?.status()).toBe(200);
    await expect(
      page.getByRole("heading", { level: 1, name: "AccountShield Orchestrator" }),
    ).toBeVisible();
    await expect(
      page.getByText(/não deve ser usado como mecanismo principal de proteção para contas reais/i),
    ).toBeVisible();
  });

  for (const locale of ["en", "pt"] as const) {
    test(`an unknown slug returns the localized 404 page in ${locale}`, async ({ page }) => {
      const res = await page.goto(`/${locale}/projects/does-not-exist`);
      expect(res?.status()).toBe(404);
      await expect(page.locator("html")).toHaveAttribute("lang", locale);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    });
  }

  test("home links to every visible project's detail page", async ({ page }) => {
    await page.goto("/en");
    for (const slug of PROJECT_SLUGS) {
      await expect(page.locator(`a[href="/en/projects/${slug}"]`).first()).toBeVisible();
    }
  });
});
