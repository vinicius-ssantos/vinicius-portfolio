import { test, expect } from "@playwright/test";

test.describe("essential resources", () => {
  for (const path of [
    "/robots.txt",
    "/sitemap.xml",
    "/manifest.webmanifest",
    "/favicon.svg",
    "/apple-icon",
  ]) {
    test(`${path} resolves`, async ({ request }) => {
      const res = await request.get(path);
      expect(res.status()).toBe(200);
    });
  }

  test("sitemap only lists internal links that resolve", async ({ request }) => {
    const res = await request.get("/sitemap.xml");
    const body = await res.text();
    const locs = [...body.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
    expect(locs.length).toBeGreaterThan(0);

    for (const loc of locs) {
      const url = new URL(loc!);
      const pageRes = await request.get(url.pathname);
      expect(pageRes.status(), `${url.pathname} should resolve`).toBeLessThan(400);
    }
  });
});
