# Backend System Pulse 3D — spike log (#48)

Running record of the Three.js spike. Each phase appends its findings; the
Phase D decision at the end is what determines whether any of this ships.

**Status: Phase A complete. Not shipped.** The prototype is gated behind
`NEXT_PUBLIC_ENABLE_3D_TOPOLOGY`, which is unset everywhere including
production. Enabling it is a deliberate act, not a default.

## Why it is behind a flag

#48 depends on #56 in the epic's dependency graph, and #56's own text is
explicit: the measurement "deve existir antes da adoção definitiva do
Three.js na #48 para permitir comparação antes/depois". That baseline is
still inconclusive — desktop has a small sample and mobile has none at all
(see `performance-baseline.md`). So the prototype can be built and measured,
but the adoption decision cannot be made yet.

The flag fails closed: only the exact string `"true"` enables it, so a typo,
an empty value, or `"1"` all leave it off.

## Phase A — visual prototype

### Data model: one source, no stored coordinates

#48 sketches a `TopologyNode` carrying an explicit
`position: [number, number, number]`. The implementation deliberately does
not do that.

The 2.5D diagram from #47 already derives every position from the graph, and
#47's scope required avoiding duplicated hardcoded layout. Authoring
coordinates for the 3D view would mean every content edit needs a matching
coordinate edit in a second place — which is exactly the "duas arquiteturas
divergentes" that #48's own single-source requirement exists to prevent.

Instead `src/lib/topology.ts` holds the shared layering, and both views
consume the same `Architecture` content type:

- `layerArchitecture()` — DAG layering by longest path from a root. Was
  previously private to the 2.5D component; extracted so both views share it.
- `toScene()` — projects that layering into 3-space. Pure function of the
  graph; no content file knows a coordinate exists.

Nodes with no edges (the local dev environment, which genuinely isn't on the
deployed request path) land on a separate lower shelf rather than being
offset along the path's own axes, where they would read as a branch off it.

### What the scene does

Seven nodes from the real `personal-platform-infra` content, matching #48's
5–7 node budget for a prototype:

- perspective floor grid — without it the nodes read as flat circles no
  matter how the camera is angled, because nothing establishes a ground plane;
- curved tube connections, with emerald pulses travelling them, staggered so
  the path reads as traffic rather than a synchronized blink;
- HTML labels (via drei's `Html`) with alternating heights — several captions
  run long (`namespaces: mcp / bff / vos / monitoring`) and collide at a
  uniform offset;
- guided camera: a small cursor-driven drift, eased, never a free orbit.

### Runtime behaviour

| Condition | Result |
| --- | --- |
| Offscreen or tab hidden | `frameloop="demand"` — the rAF loop is dropped, not just rendering invisible frames |
| `prefers-reduced-motion: reduce` | Static frame, pulses parked mid-connection so the path still reads as carrying traffic |
| Viewport below `lg` (1024px) | 3D never mounts; the 2.5D diagram is the whole experience, per #48's fallback table |
| WebGL unavailable or throwing | Same as above — probed before the canvas mounts |
| Flag off | Nothing renders and the chunk is never requested |

Mobile is a hard exclusion rather than a degraded render: at 390px the scene
is genuinely unreadable — labels clip and overlap — and #48's fallback table
already routes mobile to the 2.5D topology.

### Bundle cost — the headline number

Measured as real bytes transferred over the network on
`/en/projects/personal-platform-infra`, production build, same page both times:

| Build | JS transferred | Delta |
| --- | --- | --- |
| Flag off | 937.0 KiB | — |
| Flag on | 1810.2 KiB | **+873.2 KiB** |

The entire delta is one lazily-loaded chunk (three + @react-three/fiber +
drei). With the flag off that chunk is emitted to disk but never fetched,
which is the behaviour #48 requires ("o bundle 3D não deve entrar no
carregamento inicial"). An e2e test asserts this and fails if the default
ever flips.

**This roughly doubles the page's JavaScript.** That is the single most
important input to the Phase D decision, and it is a large number for a
decorative enhancement on a portfolio whose current desktop LCP is 1.47 s.
Phase C should attempt to cut it (drei is imported only for `Html`, and a
hand-rolled label overlay would remove that dependency entirely) before the
number is treated as final.

### Not yet done

- Node selection, camera focus transitions and the detail panel (Phase B).
- FPS and CPU/GPU measurement on a mid-range mobile device (Phase C) — note
  this is partly moot given mobile is excluded, but the desktop numbers still
  need collecting.
- Keyboard navigation into the canvas. Currently the canvas is `aria-hidden`
  and the accessible 2.5D diagram renders alongside it, so no information
  lives only inside WebGL — but that also means the 3D view is presently
  decorative rather than the primary interface.

### Open question for Phase D

The visual result is legible and on-brand, but the honest read after Phase A
is that ~873 KiB buys a nicer rendering of information the 2.5D diagram
already conveys accessibly, on desktop only. The bar #56 sets — "não aprovar
Three.js apenas porque o desktop permanece rápido" — should be applied
strictly here.
