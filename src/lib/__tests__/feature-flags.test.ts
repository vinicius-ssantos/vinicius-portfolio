import { describe, expect, it } from "vitest";
import { isTopology3DEnabled } from "@/lib/feature-flags";

describe("isTopology3DEnabled", () => {
  it("stays off unless explicitly enabled", () => {
    expect(isTopology3DEnabled(undefined)).toBe(false);
    expect(isTopology3DEnabled("")).toBe(false);
    expect(isTopology3DEnabled("false")).toBe(false);
  });

  it("fails closed on values that look truthy but aren't the opt-in", () => {
    // A flag that shipped an unreviewed 3D bundle because someone wrote "1"
    // or "TRUE" would defeat the point of gating the spike at all.
    expect(isTopology3DEnabled("1")).toBe(false);
    expect(isTopology3DEnabled("TRUE")).toBe(false);
    expect(isTopology3DEnabled("yes")).toBe(false);
    expect(isTopology3DEnabled(" true ")).toBe(false);
  });

  it("enables the spike only for an exact opt-in", () => {
    expect(isTopology3DEnabled("true")).toBe(true);
  });
});
