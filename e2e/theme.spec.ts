import { test, expect } from "@playwright/test";

test("theme toggle switches between light and dark", async ({ page }) => {
  await page.goto("/en");
  const html = page.locator("html");

  const initiallyDark = (await html.getAttribute("class"))?.includes("dark") ?? false;
  const toggle = page.getByRole("button", { name: /switch to (light|dark) theme/i });
  await toggle.click();

  if (initiallyDark) {
    await expect(html).not.toHaveClass(/dark/);
  } else {
    await expect(html).toHaveClass(/dark/);
  }
});
