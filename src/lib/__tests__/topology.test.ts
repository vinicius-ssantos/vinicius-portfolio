import { describe, expect, it } from "vitest";
import type { Architecture } from "@/content";
import { layerArchitecture, toScene } from "@/lib/topology";

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

describe("toScene", () => {
  it("derives one point per node, carrying the same labels the 2.5D view shows", () => {
    const { points } = toScene(linearArchitecture);

    expect(points).toHaveLength(linearArchitecture.nodes.length);
    for (const node of linearArchitecture.nodes) {
      const point = points.find((p) => p.id === node.id);
      expect(point?.label).toBe(node.label);
      expect(point?.detail).toBe(node.detail);
    }
  });

  it("orders the request path along X in graph-depth order, matching the 2.5D reading order", () => {
    const { points } = toScene(linearArchitecture);
    const xOf = (id: string) => points.find((p) => p.id === id)!.position[0];

    expect(xOf("cf")).toBeLessThan(xOf("vps"));
    expect(xOf("vps")).toBeLessThan(xOf("traefik"));
  });

  it("centers the chain around the origin so the camera needs no per-graph tuning", () => {
    const { points } = toScene(linearArchitecture);
    const chainX = points.filter((p) => p.connected).map((p) => p.position[0]);

    expect(Math.min(...chainX)).toBeCloseTo(-Math.max(...chainX));
  });

  it("detaches unconnected nodes instead of implying an edge that does not exist", () => {
    const { points, edges } = toScene(linearArchitecture);
    const devBox = points.find((p) => p.id === "a")!;

    expect(devBox.connected).toBe(false);
    // Sits on its own plane below the request path, so it never reads as a
    // branch off it. Asserting "below the chain" rather than an exact
    // coordinate keeps this about the intent, not the tuning.
    const chainY = points.filter((p) => p.connected).map((p) => p.position[1]);
    expect(devBox.position[1]).toBeLessThan(Math.min(...chainY));
    expect(edges.some((e) => e.from === "a" || e.to === "a")).toBe(false);
  });

  it("fans a multi-node layer out on Z rather than stacking it at one point", () => {
    const branching: Architecture = {
      nodes: [
        { id: "root", group: "edge", label: "Root", detail: "" },
        { id: "left", group: "vps", label: "Left", detail: "" },
        { id: "right", group: "vps", label: "Right", detail: "" },
      ],
      edges: [
        { from: "root", to: "left" },
        { from: "root", to: "right" },
      ],
    };

    const { points } = toScene(branching);
    const left = points.find((p) => p.id === "left")!;
    const right = points.find((p) => p.id === "right")!;

    expect(left.position[0]).toBeCloseTo(right.position[0]);
    expect(left.position[2]).not.toBeCloseTo(right.position[2]);
  });

  it("resolves each edge to the positions of the nodes it names", () => {
    const { points, edges } = toScene(linearArchitecture);
    const positionOf = (id: string) => points.find((p) => p.id === id)!.position;

    expect(edges).toHaveLength(2);
    const first = edges[0]!;
    expect(first.fromPosition).toEqual(positionOf(first.from));
    expect(first.toPosition).toEqual(positionOf(first.to));
  });

  it("drops an edge naming a node that does not exist rather than anchoring it at the origin", () => {
    const malformed: Architecture = {
      nodes: [{ id: "a", group: "edge", label: "A", detail: "" }],
      edges: [{ from: "a", to: "ghost" }],
    };

    expect(toScene(malformed).edges).toEqual([]);
  });
});
