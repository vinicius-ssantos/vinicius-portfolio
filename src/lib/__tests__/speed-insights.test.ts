import { describe, expect, it } from "vitest";
import { shouldEnableSpeedInsights } from "@/lib/speed-insights";

describe("shouldEnableSpeedInsights", () => {
  it("enables collection only for production Vercel deployments", () => {
    expect(shouldEnableSpeedInsights("production")).toBe(true);
    expect(shouldEnableSpeedInsights("preview")).toBe(false);
    expect(shouldEnableSpeedInsights("development")).toBe(false);
    expect(shouldEnableSpeedInsights(undefined)).toBe(false);
  });
});
