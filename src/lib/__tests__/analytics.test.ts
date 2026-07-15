import { describe, it, expect, vi, afterEach } from "vitest";

const trackMock = vi.fn();

vi.mock("@vercel/analytics", () => ({
  track: trackMock,
}));

describe("trackEvent", () => {
  afterEach(() => {
    trackMock.mockClear();
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it("does not call track() outside production (dev/test)", async () => {
    vi.stubEnv("NODE_ENV", "test");
    const { trackEvent } = await import("../analytics");

    trackEvent("contact_form_success");

    expect(trackMock).not.toHaveBeenCalled();
  });

  it("calls track() with the event name and properties in production", async () => {
    vi.stubEnv("NODE_ENV", "production");
    const { trackEvent } = await import("../analytics");

    trackEvent("project_repo_open", { slug: "personal-platform-infra" });

    expect(trackMock).toHaveBeenCalledWith("project_repo_open", {
      slug: "personal-platform-infra",
    });
  });

  it("never receives PII-shaped properties for contact_form_success", async () => {
    vi.stubEnv("NODE_ENV", "production");
    const { trackEvent } = await import("../analytics");

    trackEvent("contact_form_success");

    expect(trackMock).toHaveBeenCalledWith("contact_form_success", undefined);
  });
});
