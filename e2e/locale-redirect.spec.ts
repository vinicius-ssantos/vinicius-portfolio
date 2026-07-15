import { test, expect } from "@playwright/test";

test.describe("locale redirect", () => {
  test("/ redirects to a locale route", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/(pt|en)$/);
  });

  test("Portuguese Accept-Language redirects to /pt", async ({ browser }) => {
    const context = await browser.newContext({
      locale: "pt-BR",
      extraHTTPHeaders: { "accept-language": "pt-BR,pt;q=0.9" },
    });
    const page = await context.newPage();
    await page.goto("/");
    await expect(page).toHaveURL(/\/pt$/);
    await context.close();
  });

  test("English Accept-Language redirects to /en", async ({ browser }) => {
    const context = await browser.newContext({
      locale: "en-US",
      extraHTTPHeaders: { "accept-language": "en-US,en;q=0.9" },
    });
    const page = await context.newPage();
    await page.goto("/");
    await expect(page).toHaveURL(/\/en$/);
    await context.close();
  });
});
