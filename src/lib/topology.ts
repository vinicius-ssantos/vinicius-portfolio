/**
 * Shared topology layout — the single source both the 2.5D diagram (#47) and
 * the 3D spike (#48) derive their geometry from.
 *
 * Issue #48 sketches a `TopologyNode` carrying an explicit
 * `position: [number, number, number]`. This deliberately does not do that.
 * The 2.5D diagram already derives every position from the graph, and #47's
 * scope required avoiding duplicated hardcoded layout; storing coordinates
 * for the 3D view would recreate exactly the "duas arquiteturas divergentes"
 * that #48's own single-source-of-data requirement exists to prevent — every
 * content edit would then need a matching coordinate edit, and the two views
 * would drift the first time someone forgot. Instead both views consume the
 * same `Architecture` and the same layering below; 3D coordinates are a pure
 * function of the graph.
 */
import type { Architecture, ArchitectureNode } from "@/content";

export type LayeredNode = ArchitectureNode & { layer: number };

/**
 * Nodes that appear in at least one edge are layered by longest path from a
 * root (a standard DAG "layer by depth" layout) so the request path reads
 * in order without any node needing stored coordinates. Nodes with no edges
 * at all are returned separately — e.g. a local dev environment, which is
 * real but genuinely not part of the deployed request path.
 */
export function layerArchitecture(architecture: Architecture): {
  chain: LayeredNode[][];
  sideCluster: ArchitectureNode[];
} {
  const { nodes, edges } = architecture;
  const connectedIds = new Set<string>();
  for (const edge of edges) {
    connectedIds.add(edge.from);
    connectedIds.add(edge.to);
  }

  const layerCache = new Map<string, number>();
  const visiting = new Set<string>();
  function layerOf(id: string): number {
    const cached = layerCache.get(id);
    if (cached !== undefined) return cached;
    if (visiting.has(id)) return 0; // defensive: break a cycle in malformed content instead of recursing forever
    visiting.add(id);
    const incoming = edges.filter((e) => e.to === id);
    const layer = incoming.length === 0 ? 0 : 1 + Math.max(...incoming.map((e) => layerOf(e.from)));
    visiting.delete(id);
    layerCache.set(id, layer);
    return layer;
  }

  const chainNodes = nodes.filter((n) => connectedIds.has(n.id));
  const sideCluster = nodes.filter((n) => !connectedIds.has(n.id));

  const layerCount = chainNodes.reduce((max, n) => Math.max(max, layerOf(n.id)), -1) + 1;
  const chain: LayeredNode[][] = Array.from({ length: layerCount }, () => []);
  for (const node of chainNodes) {
    chain[layerOf(node.id)]!.push({ ...node, layer: layerOf(node.id) });
  }

  return { chain, sideCluster };
}

export type ScenePoint = {
  id: string;
  label: string;
  detail: string;
  /** Derived from the graph, never authored in content. */
  position: [number, number, number];
  /** False for nodes with no edges — rendered as a detached cluster. */
  connected: boolean;
  /**
   * Position in reading order (graph depth for the path, index within the
   * cluster otherwise). Renderers use it to stagger labels so neighbouring
   * captions don't collide.
   */
  depth: number;
};

export type SceneEdge = {
  from: string;
  to: string;
  fromPosition: [number, number, number];
  toPosition: [number, number, number];
};

export type Scene = {
  points: ScenePoint[];
  edges: SceneEdge[];
};

const LAYER_SPACING = 3.1;
const WITHIN_LAYER_SPACING = 1.6;
/**
 * Drops the unconnected cluster onto a lower shelf, left of the path's start.
 * A separate plane reads as "related but not on this route" far better than
 * offsetting it along the path's own axes, where it would look like a branch.
 */
const SIDE_CLUSTER_OFFSET: [number, number, number] = [-3.1, -1.9, 0];
/**
 * Wider than the path's own spacing: these labels ("k3d (k8s validation)")
 * run long, and the shelf has no arrows between nodes to absorb the gap.
 */
const SIDE_CLUSTER_SPACING = 3.4;

/** Centers `count` items around 0 and returns the offset for `index`. */
function centered(index: number, count: number, spacing: number): number {
  return (index - (count - 1) / 2) * spacing;
}

/**
 * Projects an `Architecture` into 3-space. Connected nodes march along X in
 * graph-depth order (so the request path reads left to right, matching the
 * 2.5D view) and fan out on Z when a layer holds more than one node.
 * Unconnected nodes form a detached cluster offset on Z, visually separate
 * from the path without implying an edge that doesn't exist.
 */
export function toScene(architecture: Architecture): Scene {
  const { chain, sideCluster } = layerArchitecture(architecture);

  const points: ScenePoint[] = [];

  chain.forEach((layerNodes, layerIndex) => {
    layerNodes.forEach((node, indexInLayer) => {
      points.push({
        id: node.id,
        label: node.label,
        detail: node.detail,
        position: [
          centered(layerIndex, chain.length, LAYER_SPACING),
          0,
          centered(indexInLayer, layerNodes.length, WITHIN_LAYER_SPACING),
        ],
        connected: true,
        depth: layerIndex,
      });
    });
  });

  sideCluster.forEach((node, index) => {
    points.push({
      id: node.id,
      label: node.label,
      detail: node.detail,
      position: [
        SIDE_CLUSTER_OFFSET[0] + centered(index, sideCluster.length, SIDE_CLUSTER_SPACING),
        SIDE_CLUSTER_OFFSET[1],
        SIDE_CLUSTER_OFFSET[2],
      ],
      connected: false,
      depth: index,
    });
  });

  const positionById = new Map(points.map((p) => [p.id, p.position]));
  const edges: SceneEdge[] = architecture.edges.flatMap((edge) => {
    const fromPosition = positionById.get(edge.from);
    const toPosition = positionById.get(edge.to);
    // An edge naming a node that doesn't exist is malformed content; drop it
    // rather than rendering a line anchored at the origin.
    if (!fromPosition || !toPosition) return [];
    return [{ from: edge.from, to: edge.to, fromPosition, toPosition }];
  });

  return { points, edges };
}
