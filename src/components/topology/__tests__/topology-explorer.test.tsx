/** @vitest-environment jsdom */

import { act, cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Architecture } from "@/content";
import { TopologyExplorer } from "../topology-explorer";
import { resetViewportObserverPoolsForTests } from "@/lib/viewport-observer";

// jsdom has no WebGL, so the canvas half never mounts here — which is the
// point: these assertions cover the surface that has to work without it.
// Selection, labelling and restore all live in HTML precisely so they don't
// depend on the canvas being there.
const architecture: Architecture = {
  nodes: [
    { id: "dev", group: "local", label: "Dev box", detail: "Where it starts." },
    { id: "cf", group: "edge", label: "Cloudflare", detail: "Edge termination." },
    { id: "vps", group: "vps", label: "VPS", detail: "Runs the workload." },
  ],
  edges: [{ from: "cf", to: "vps" }],
};

const labels = { local: "Local", edge: "Edge", vps: "VPS", hint: "Select a node" };

function renderExplorer() {
  return render(
    <TopologyExplorer
      architectureLabel="test topology"
      architecture={architecture}
      labels={labels}
      experimentLabel="3D prototype"
      restoreLabel="Restore overview"
    />,
  );
}

beforeEach(() => {
  vi.stubGlobal(
    "matchMedia",
    vi.fn().mockImplementation((media: string) => ({
      matches: false,
      media,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  );
});

afterEach(() => {
  cleanup();
  resetViewportObserverPoolsForTests();
  vi.unstubAllGlobals();
});

describe("TopologyExplorer", () => {
  it("exposes every node as a real button, so the canvas is never the only way in", () => {
    renderExplorer();

    for (const node of architecture.nodes) {
      expect(screen.getByRole("button", { name: node.label })).toBeInTheDocument();
    }
  });

  it("reports selected state to assistive tech, not just visually", async () => {
    const user = userEvent.setup();
    renderExplorer();

    const cloudflare = screen.getByRole("button", { name: "Cloudflare" });
    expect(cloudflare).toHaveAttribute("aria-pressed", "false");

    await user.click(cloudflare);
    expect(cloudflare).toHaveAttribute("aria-pressed", "true");
  });

  it("selects by keyboard focus alone, with no pointer involved", () => {
    renderExplorer();

    const vps = screen.getByRole("button", { name: "VPS" });
    const detail = screen.getByText("Select a node");

    act(() => vps.focus());

    expect(vps).toHaveAttribute("aria-pressed", "true");
    expect(detail.textContent).toContain("Runs the workload.");
  });

  it("offers restore only once there is a selection to restore", async () => {
    const user = userEvent.setup();
    renderExplorer();

    expect(screen.queryByRole("button", { name: /restore overview/i })).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Cloudflare" }));
    const restore = screen.getByRole("button", { name: /restore overview/i });

    await user.click(restore);

    expect(screen.queryByRole("button", { name: /restore overview/i })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cloudflare" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });

  it("keeps selection stable when the same node is clicked twice", async () => {
    // Selecting is deliberately idempotent, not a toggle: a plain click also
    // fires pointerover and focus, which already select, so toggling would
    // undo itself mid-gesture. Restore is the way out.
    const user = userEvent.setup();
    renderExplorer();

    const cloudflare = screen.getByRole("button", { name: "Cloudflare" });
    await user.click(cloudflare);
    await user.click(cloudflare);

    expect(cloudflare).toHaveAttribute("aria-pressed", "true");
  });

  it("keeps every node's description in HTML, including unconnected ones", () => {
    renderExplorer();

    const detail = screen.getByText("Select a node");
    for (const node of architecture.nodes) {
      act(() => screen.getByRole("button", { name: node.label }).focus());
      expect(detail.textContent).toContain(node.detail);
    }
  });
});
