import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { MOTION_DURATION_MS, REDUCED_MOTION_QUERY } from "@/lib/motion";

const tokenSource = readFileSync(resolve(process.cwd(), "src/app/styles/tokens.css"), "utf8");

describe("motion tokens", () => {
  it("keeps shared duration values aligned between TypeScript and CSS", () => {
    for (const [name, milliseconds] of Object.entries(MOTION_DURATION_MS)) {
      expect(tokenSource).toContain(`--motion-duration-${name}: ${milliseconds}ms;`);
    }
  });

  it("shares the canonical reduced-motion media query", () => {
    expect(REDUCED_MOTION_QUERY).toBe("(prefers-reduced-motion: reduce)");
  });
});
