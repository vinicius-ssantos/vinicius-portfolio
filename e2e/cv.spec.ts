import { test, expect } from "@playwright/test";

test("CV download link points at a real, servable PDF", async ({ page, request }) => {
  await page.goto("/en");
  const link = page.getByRole("link", { name: /download cv/i });
  const href = await link.getAttribute("href");
  expect(href).toBeTruthy();

  const res = await request.get(href!);
  expect(res.status()).toBe(200);
  expect(res.headers()["content-type"]).toContain("pdf");
});
