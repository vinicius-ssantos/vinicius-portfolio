"use client";

import { useState } from "react";
import { RotateCcw } from "lucide-react";
import type { Architecture } from "@/content";
import { ArchitectureDiagram } from "@/components/sections/architecture-diagram";
import { TopologyShowcase } from "./topology-showcase";

/**
 * #48 Phase B — the Architecture Explorer surface.
 *
 * Selection lives here and is shared by both views. The important structural
 * decision: the canvas does **not** get its own controls. #48 requires that
 * hover, keyboard and touch offer equivalent access and that nothing is
 * reachable only inside WebGL — so the accessible HTML nodes from #47 are the
 * control surface, and the canvas mirrors their state. Clicking a node in the
 * canvas is an enhancement layered on top, reporting into the same state.
 *
 * That also avoids two parallel sets of controls drifting apart, the same
 * reason the layout is derived from one graph rather than authored twice.
 */
export function TopologyExplorer({
  architectureLabel,
  architecture,
  labels,
  experimentLabel,
  restoreLabel,
}: {
  architectureLabel: string;
  architecture: Architecture;
  labels: { local: string; edge: string; vps: string; hint: string };
  experimentLabel: string;
  restoreLabel: string;
}) {
  const [activeId, setActiveId] = useState<string | null>(null);

  return (
    <div>
      <TopologyShowcase
        architecture={architecture}
        label={experimentLabel}
        activeId={activeId}
        onSelect={setActiveId}
      />

      {/* "O usuário pode restaurar a visão geral" — a real button rather than
          an implicit gesture, and only present when there's something to
          restore, so it never reads as a control with no effect. */}
      {activeId !== null && (
        <div className="mb-3 flex justify-end">
          <button
            type="button"
            onClick={() => setActiveId(null)}
            className="inline-flex items-center gap-1.5 rounded-md border border-border/60 bg-card/50 px-2.5 py-1.5 font-mono text-[11px] text-foreground/90 transition-colors hover:border-primary/40 hover:bg-secondary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <RotateCcw aria-hidden className="h-3 w-3" />
            {restoreLabel}
          </button>
        </div>
      )}

      <ArchitectureDiagram
        architectureLabel={architectureLabel}
        architecture={architecture}
        labels={labels}
        size="lg"
        activeId={activeId}
        onActiveChange={setActiveId}
      />
    </div>
  );
}
