import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("accessibility", () => {
  test("home (PT) has no serious or critical violations", async ({ page }) => {
    await page.goto("/pt");
    const results = await new AxeBuilder({ page }).analyze();
    const blocking = results.violations.filter((v) =>
      ["serious", "critical"].includes(v.impact ?? ""),
    );
    expect(blocking, JSON.stringify(blocking, null, 2)).toEqual([]);
  });

  test("home (EN) has no serious or critical violations", async ({ page }) => {
    await page.goto("/en");
    const results = await new AxeBuilder({ page }).analyze();
    const blocking = results.violations.filter((v) =>
      ["serious", "critical"].includes(v.impact ?? ""),
    );
    expect(blocking, JSON.stringify(blocking, null, 2)).toEqual([]);
  });

  test("the Sentinel Ledger detail page has no serious or critical violations", async ({ page }) => {
    await page.goto("/en/projects/sentinel-ledger");
    const results = await new AxeBuilder({ page }).analyze();
    const blocking = results.violations.filter((v) =>
      ["serious", "critical"].includes(v.impact ?? ""),
    );
    expect(blocking, JSON.stringify(blocking, null, 2)).toEqual([]);
  });

  test("the open mobile menu has no serious or critical violations", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/en");
    await page.getByRole("button", { name: "Open menu" }).click();
    await expect(page.getByRole("dialog")).toBeVisible();

    const results = await new AxeBuilder({ page }).analyze();
    const blocking = results.violations.filter((v) =>
      ["serious", "critical"].includes(v.impact ?? ""),
    );
    expect(blocking, JSON.stringify(blocking, null, 2)).toEqual([]);
  });
});
