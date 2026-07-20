import type { ComponentType, CSSProperties, SVGProps } from "react";
import { Activity, Cloud, Database, Laptop, ShieldCheck, Waypoints, Zap } from "lucide-react";
import type { Lang } from "@/content";

// Backend System Pulse (#46) — a discreet, illustrative 2.5D topology for the
// Hero's idle space on wide screens. Client -> Edge -> Gateway -> Auth ->
// {Cache, Database} -> Observability. Decorative only: every idea here
// (architecture, auth, cache, persistence, observability) is already stated
// in profile copy, so the whole illustration stays aria-hidden.
type PulseNodeId = "client" | "edge" | "gateway" | "auth" | "cache" | "database" | "observability";

type PulseNode = {
  id: PulseNodeId;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  x: number;
  y: number;
};

const NODES: readonly PulseNode[] = [
  { id: "client", icon: Laptop, x: 20, y: 118 },
  { id: "edge", icon: Cloud, x: 74, y: 100 },
  { id: "gateway", icon: Waypoints, x: 128, y: 82 },
  { id: "auth", icon: ShieldCheck, x: 182, y: 64 },
  { id: "cache", icon: Zap, x: 236, y: 46 },
  { id: "database", icon: Database, x: 236, y: 82 },
  { id: "observability", icon: Activity, x: 290, y: 64 },
];

const EDGES: readonly [PulseNodeId, PulseNodeId][] = [
  ["client", "edge"],
  ["edge", "gateway"],
  ["gateway", "auth"],
  ["auth", "cache"],
  ["auth", "database"],
  ["cache", "observability"],
  ["database", "observability"],
];

// Compact fallback flattens the same topology onto one row for narrow
// viewports — same data, simpler projection, per issue #46's "graceful
// degradation" requirement.
const COMPACT_ORDER: readonly PulseNodeId[] = [
  "client",
  "edge",
  "gateway",
  "auth",
  "cache",
  "database",
  "observability",
];

const LABELS: Record<PulseNodeId, Record<Lang, string>> = {
  client: { pt: "Cliente", en: "Client" },
  edge: { pt: "Edge", en: "Edge" },
  gateway: { pt: "API Gateway", en: "API Gateway" },
  auth: { pt: "Auth Service", en: "Auth Service" },
  cache: { pt: "Cache/Redis", en: "Cache/Redis" },
  database: { pt: "Database/SQL", en: "Database/SQL" },
  observability: { pt: "Observabilidade", en: "Observability" },
};

function nodeById(id: PulseNodeId): PulseNode {
  const node = NODES.find((n) => n.id === id);
  if (!node) throw new Error(`Unknown Backend System Pulse node: ${id}`);
  return node;
}

export function BackendSystemPulse({
  lang,
  variant,
  className = "",
}: {
  lang: Lang;
  variant: "full" | "compact";
  className?: string;
}) {
  return (
    <div aria-hidden="true" data-diagram={variant} className={className}>
      {variant === "full" ? <FullDiagram lang={lang} /> : <CompactDiagram />}
    </div>
  );
}

function FullDiagram({ lang }: { lang: Lang }) {
  return (
    <svg
      viewBox="-14 0 358 148"
      className="h-auto w-[320px] xl:w-[380px]"
      role="presentation"
      focusable="false"
    >
      {EDGES.map(([fromId, toId]) => {
        const from = nodeById(fromId);
        const to = nodeById(toId);
        return (
          <line
            key={`${fromId}-${toId}`}
            x1={from.x}
            y1={from.y}
            x2={to.x}
            y2={to.y}
            stroke="currentColor"
            strokeWidth="1"
            className="text-border"
          />
        );
      })}

      {EDGES.map(([fromId, toId], i) => {
        const from = nodeById(fromId);
        const to = nodeById(toId);
        return (
          <circle
            key={`pulse-${fromId}-${toId}`}
            cx={(from.x + to.x) / 2}
            cy={(from.y + to.y) / 2}
            r="2.5"
            className="animate-pulse-flow fill-primary"
            style={{ "--flow-index": i } as CSSProperties}
          />
        );
      })}

      {NODES.map((node) => {
        const Icon = node.icon;
        return (
          <g key={node.id}>
            <ellipse cx={node.x} cy={node.y + 16} rx="13" ry="3.5" className="fill-foreground/10" />
            <rect
              x={node.x - 13}
              y={node.y - 13}
              width="26"
              height="26"
              rx="7"
              className="fill-card stroke-border"
              strokeWidth="1"
            />
            <Icon
              x={node.x - 7.5}
              y={node.y - 7.5}
              width="15"
              height="15"
              className="text-primary"
            />
            <text
              x={node.x}
              y={node.id === "cache" ? node.y - 18 : node.y + 27}
              textAnchor="middle"
              className="fill-muted-foreground font-mono text-[6.5px]"
            >
              {LABELS[node.id][lang]}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function CompactDiagram() {
  const step = 320 / (COMPACT_ORDER.length - 1);
  const y = 20;
  const positions = COMPACT_ORDER.map((id, i) => ({ id, x: i * step, y }));

  return (
    <svg
      viewBox="-10 0 340 40"
      className="h-auto w-full max-w-sm"
      role="presentation"
      focusable="false"
    >
      <line
        x1={positions[0]!.x}
        y1={y}
        x2={positions[positions.length - 1]!.x}
        y2={y}
        stroke="currentColor"
        strokeWidth="1"
        className="text-border"
      />
      {positions.map((pos, i) => {
        const Icon = nodeById(pos.id).icon;
        return (
          <g key={pos.id}>
            <circle
              cx={pos.x}
              cy={pos.y}
              r="9"
              className="fill-card stroke-border"
              strokeWidth="1"
            />
            <Icon x={pos.x - 5} y={pos.y - 5} width="10" height="10" className="text-primary" />
            {i < positions.length - 1 && (
              <circle
                cx={(pos.x + positions[i + 1]!.x) / 2}
                cy={y}
                r="2"
                className="animate-pulse-flow fill-primary"
                style={{ "--flow-index": i } as CSSProperties}
              />
            )}
          </g>
        );
      })}
    </svg>
  );
}
