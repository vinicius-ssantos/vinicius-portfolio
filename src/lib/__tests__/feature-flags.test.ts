import { describe, expect, it } from "vitest";
import { isTopology3DEnabled, isTopology3DProjectEnabled } from "@/lib/feature-flags";

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

  it("enables the capability only for an exact opt-in", () => {
    expect(isTopology3DEnabled("true")).toBe(true);
  });
});

describe("isTopology3DProjectEnabled", () => {
  it("enables only the selected dossier when the global flag is on", () => {
    expect(isTopology3DProjectEnabled("personal-platform-infra", "true")).toBe(true);
    expect(isTopology3DProjectEnabled("sentinel-ledger", "true")).toBe(false);
    expect(isTopology3DProjectEnabled("accountshield-orchestrator", "true")).toBe(false);
  });

  it("keeps selected dossiers off when the kill switch is off", () => {
    expect(isTopology3DProjectEnabled("personal-platform-infra", "false")).toBe(false);
    expect(isTopology3DProjectEnabled("personal-platform-infra", undefined)).toBe(false);
  });
});
