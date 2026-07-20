"use client";

import { useId, useState, type CSSProperties } from "react";
import { ArrowDown, ArrowRight } from "lucide-react";
import type { Architecture, ArchitectureNode, ArchitectureNodeGroup } from "@/content";
import { useViewportMotion } from "@/hooks/use-viewport-motion";

// Backend System Pulse's sibling for the case study (#47). Same rules:
// SVG/CSS only, node positions are derived from data rather than hardcoded,
// and it stays understandable with the animation off. Unlike #46's ambient
// Hero pulse, the request-path flow here plays once on first viewport entry
// (see `.arch-flow-once` in animations.css) — a short beat, not a loop.
type Labels = {
  local: string;
  edge: string;
  vps: string;
  hint: string;
};

type LayeredNode = ArchitectureNode & { layer: number };

/**
 * Nodes that appear in at least one edge are layered by longest path from a
 * root (a standard DAG "layer by depth" layout) so the request path reads
 * left-to-right / top-to-bottom without any node needing stored coordinates.
 * Nodes with no edges at all render as a separate side cluster, grouped by
 * `group` — e.g. the local dev environment, which is real but disconnected
 * from the deployed request path.
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

export function ArchitectureDiagram({
  architectureLabel,
  architecture,
  labels,
  size = "sm",
}: {
  architectureLabel: string;
  architecture: Architecture;
  labels: Labels;
  size?: "sm" | "lg";
}) {
  const detailId = useId();
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const { ref, hasEntered } = useViewportMotion<HTMLDivElement>();

  const { chain, sideCluster } = layerArchitecture(architecture);

  // The detailed (dossier) variant shows a node by default so the panel
  // isn't empty before any interaction; the compact (home) variant starts
  // with the neutral hint instead, to keep the card quiet at a glance.
  const fallbackId = size === "lg" ? (chain[0]?.[0]?.id ?? null) : null;
  const activeId = hoveredId ?? focusedId ?? fallbackId;
  const activeNode = architecture.nodes.find((n) => n.id === activeId) ?? null;

  const groupLabel: Record<ArchitectureNodeGroup, string> = {
    local: labels.local,
    edge: labels.edge,
    vps: labels.vps,
  };

  const nodeTextSize = size === "lg" ? "text-xs" : "text-[11px]";

  function nodeButton(node: ArchitectureNode) {
    const isActive = node.id === activeId;
    return (
      <button
        key={node.id}
        type="button"
        aria-describedby={detailId}
        onMouseEnter={() => setHoveredId(node.id)}
        onMouseLeave={() => setHoveredId((current) => (current === node.id ? null : current))}
        onFocus={() => setFocusedId(node.id)}
        onBlur={() => setFocusedId((current) => (current === node.id ? null : current))}
        className={[
          "rounded-md border px-2.5 py-1.5 text-left font-mono transition-colors",
          nodeTextSize,
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          isActive
            ? "border-primary/60 bg-secondary/50 text-foreground"
            : "border-border/60 bg-card/50 text-foreground/90 hover:border-primary/40 hover:bg-secondary/30",
        ].join(" ")}
      >
        {node.label}
      </button>
    );
  }

  return (
    <div
      ref={ref}
      data-motion-entered={hasEntered ? "true" : "false"}
      className="overflow-hidden rounded-lg border border-border/60 bg-background/50"
    >
      <div className="border-b border-border/60 bg-secondary/30 px-4 py-2 font-mono text-xs text-muted-foreground">
        {architectureLabel}
      </div>

      <div className="flex flex-col gap-6 p-4 md:flex-row md:items-start">
        {sideCluster.length > 0 && (
          <div className="flex flex-col gap-2 md:w-44 md:flex-shrink-0">
            <GroupHeader label={groupLabel[sideCluster[0]!.group]} />
            <div className="flex flex-col gap-1.5">{sideCluster.map(nodeButton)}</div>
          </div>
        )}

        <div className="flex flex-1 flex-col gap-2 md:flex-row md:flex-wrap md:items-center">
          {chain.map((layerNodes, layerIndex) => (
            <div
              key={layerIndex}
              className="flex flex-col items-stretch gap-2 md:flex-row md:items-center"
            >
              {layerIndex > 0 && (
                <span className="flex items-center justify-center self-center">
                  <ArrowDown
                    aria-hidden
                    className="arch-flow-once h-3.5 w-3.5 text-primary md:hidden"
                    style={{ "--flow-index": layerIndex } as CSSProperties}
                  />
                  <ArrowRight
                    aria-hidden
                    className="arch-flow-once hidden h-3.5 w-3.5 text-primary md:block"
                    style={{ "--flow-index": layerIndex } as CSSProperties}
                  />
                </span>
              )}
              <div className="flex flex-col gap-1.5">{layerNodes.map(nodeButton)}</div>
            </div>
          ))}
        </div>
      </div>

      <div
        id={detailId}
        aria-live="polite"
        className="min-h-11 border-t border-border/60 bg-secondary/20 px-4 py-3 font-mono text-xs text-muted-foreground"
      >
        {activeNode ? (
          <>
            <span className="text-primary">{activeNode.label}</span>
            {" — "}
            {activeNode.detail}
          </>
        ) : (
          labels.hint
        )}
      </div>
    </div>
  );
}

function GroupHeader({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-primary">
      <span className="inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
      {label}
    </div>
  );
}
