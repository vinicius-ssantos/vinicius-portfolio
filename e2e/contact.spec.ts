import { test, expect } from "@playwright/test";

test.describe("contact modal", () => {
  test("opens via the hero CTA and closes on Escape", async ({ page }) => {
    await page.goto("/en");
    await page.getByRole("button", { name: "Get in touch" }).click();

    const dialog = page.getByRole("dialog", { name: "Let's talk" });
    await expect(dialog).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(dialog).not.toBeVisible();
  });

  test("rejects submission with empty required fields (no network call)", async ({ page }) => {
    let requestFired = false;
    await page.route("**/api/contact", (route) => {
      requestFired = true;
      route.abort();
    });

    await page.goto("/en");
    await page.getByRole("button", { name: "Get in touch" }).click();
    await page.getByRole("button", { name: "Send message" }).click();

    // Native HTML5 `required` validation blocks the submit — no request.
    expect(requestFired).toBe(false);
  });

  test("submits successfully without hitting the real API", async ({ page }) => {
    // Intercept — this test must never trigger a real Resend send.
    await page.route("**/api/contact", (route) => {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ ok: true }),
      });
    });

    await page.goto("/en");
    await page.getByRole("button", { name: "Get in touch" }).click();

    const dialog = page.getByRole("dialog", { name: "Let's talk" });
    await dialog.getByPlaceholder("Your name").fill("Test User");
    await dialog.getByPlaceholder("Your email").fill("test@example.com");
    await dialog.getByPlaceholder("Message").fill("This is an end-to-end test message.");
    await dialog.getByRole("button", { name: "Send message" }).click();

    // Scoped to the modal's own inline confirmation, not the toast
    // notification (which renders the same text a second time).
    await expect(dialog.getByText("Message sent! I'll get back to you soon.")).toBeVisible();
  });
});
