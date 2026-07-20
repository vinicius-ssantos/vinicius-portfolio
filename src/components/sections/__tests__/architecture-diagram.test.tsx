/** @vitest-environment jsdom */

import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Architecture } from "@/content";
import { ArchitectureDiagram } from "../architecture-diagram";
import { resetViewportObserverPoolsForTests } from "@/lib/viewport-observer";

const labels = { local: "Local", edge: "Edge", vps: "VPS", hint: "Select a node" };

const linearArchitecture: Architecture = {
  nodes: [
    { id: "a", group: "local", label: "Dev box", detail: "Where it starts." },
    { id: "cf", group: "edge", label: "Cloudflare", detail: "Edge termination." },
    { id: "vps", group: "vps", label: "VPS", detail: "Runs the workload." },
    { id: "traefik", group: "vps", label: "Traefik", detail: "Routes requests." },
  ],
  edges: [
    { from: "cf", to: "vps" },
    { from: "vps", to: "traefik" },
  ],
};

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

describe("ArchitectureDiagram", () => {
  it("renders every node label from data", () => {
    render(
      <ArchitectureDiagram
        architectureLabel="test topology"
        architecture={linearArchitecture}
        labels={labels}
      />,
    );

    for (const node of linearArchitecture.nodes) {
      expect(screen.getByRole("button", { name: node.label })).toBeInTheDocument();
    }
  });

  it("shows the neutral hint until a node is hovered, focused, or tapped — then reveals the same detail either way", () => {
    render(
      <ArchitectureDiagram
        architectureLabel="test topology"
        architecture={linearArchitecture}
        labels={labels}
      />,
    );

    // The panel is a single live element whose text changes; capture it once
    // by its stable id rather than re-querying by (changing) text content.
    const detailPanel = screen.getByText("Select a node");
    expect(detailPanel.textContent).toBe("Select a node");

    const traefikButton = screen.getByRole("button", { name: "Traefik" });

    fireEvent.mouseEnter(traefikButton);
    expect(detailPanel.textContent).toContain("Routes requests.");

    fireEvent.mouseLeave(traefikButton);
    expect(detailPanel.textContent).toBe("Select a node");

    act(() => traefikButton.focus());
    expect(detailPanel.textContent).toContain("Routes requests.");

    act(() => traefikButton.blur());
    expect(detailPanel.textContent).toBe("Select a node");
  });

  it("every node is reachable and describable via keyboard alone", () => {
    render(
      <ArchitectureDiagram
        architectureLabel="test topology"
        architecture={linearArchitecture}
        labels={labels}
      />,
    );

    const detailPanel = screen.getByText("Select a node");
    for (const node of linearArchitecture.nodes) {
      const button = screen.getByRole("button", { name: node.label });
      expect(button).toHaveAttribute("aria-describedby", detailPanel.id);
      act(() => button.focus());
      expect(detailPanel.textContent).toContain(node.detail);
      act(() => button.blur());
    }
  });

  it("the detailed (lg) variant defaults to the chain's first node instead of the neutral hint", () => {
    render(
      <ArchitectureDiagram
        architectureLabel="test topology"
        architecture={linearArchitecture}
        labels={labels}
        size="lg"
      />,
    );

    expect(screen.queryByText("Select a node")).not.toBeInTheDocument();
    expect(screen.getByText(/Edge termination\./)).toBeInTheDocument();
  });
});
