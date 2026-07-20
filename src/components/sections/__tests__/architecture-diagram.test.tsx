/** @vitest-environment jsdom */

import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Architecture } from "@/content";
import { ArchitectureDiagram, layerArchitecture } from "../architecture-diagram";
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

describe("layerArchitecture", () => {
  it("layers a linear chain by longest path and clusters unconnected nodes separately", () => {
    const { chain, sideCluster } = layerArchitecture(linearArchitecture);

    expect(sideCluster.map((n) => n.id)).toEqual(["a"]);
    expect(chain.map((layer) => layer.map((n) => n.id))).toEqual([["cf"], ["vps"], ["traefik"]]);
  });

  it("places a node at the longest path from any root, not the shortest", () => {
    // b->d is a shortcut; d's true depth is determined by the longer a->b->c->d path.
    const architecture: Architecture = {
      nodes: [
        { id: "a", group: "edge", label: "A", detail: "" },
        { id: "b", group: "edge", label: "B", detail: "" },
        { id: "c", group: "edge", label: "C", detail: "" },
        { id: "d", group: "edge", label: "D", detail: "" },
      ],
      edges: [
        { from: "a", to: "b" },
        { from: "b", to: "c" },
        { from: "c", to: "d" },
        { from: "b", to: "d" },
      ],
    };

    const { chain } = layerArchitecture(architecture);
    expect(chain.map((layer) => layer.map((n) => n.id))).toEqual([["a"], ["b"], ["c"], ["d"]]);
  });

  it("does not infinite-loop on a cyclic edge list", () => {
    const cyclic: Architecture = {
      nodes: [
        { id: "a", group: "edge", label: "A", detail: "" },
        { id: "b", group: "edge", label: "B", detail: "" },
      ],
      edges: [
        { from: "a", to: "b" },
        { from: "b", to: "a" },
      ],
    };

    expect(() => layerArchitecture(cyclic)).not.toThrow();
  });

  it("puts every node in the side cluster when there are no edges", () => {
    const disconnected: Architecture = {
      nodes: [
        { id: "a", group: "local", label: "A", detail: "" },
        { id: "b", group: "local", label: "B", detail: "" },
      ],
      edges: [],
    };

    const { chain, sideCluster } = layerArchitecture(disconnected);
    expect(chain).toEqual([]);
    expect(sideCluster.map((n) => n.id)).toEqual(["a", "b"]);
  });
});

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
