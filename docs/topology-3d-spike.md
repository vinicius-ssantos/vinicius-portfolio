# Backend System Pulse 3D — spike log (#48)

Running record of the Three.js spike. Each phase appends its findings; the
Phase D decision at the end is what determines whether any of this ships.

**Status: Phases A–C complete. Not shipped; Phase D (the adoption decision) waits on #56.** The prototype is gated behind
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
- HTML labels at alternating heights — several captions run long
  (`namespaces: mcp / bff / vos / monitoring`) and collide at a uniform
  offset. Real DOM text projected from the camera each frame, not textures;
- guided camera: a small cursor-driven drift, eased, never a free orbit.

### drei was removed, for an engine conflict rather than for size

The first pass used `@react-three/drei` for its `<Html>` label helper. CI then
failed with `EBADENGINE`: drei depends on `camera-controls`, which requires
**Node >= 22**, while this project's baseline is Node 20 (`.nvmrc`, the CI
workflow, and `engines`). Every other dependency in the tree accepts Node 20;
`camera-controls` was the sole exception.

Labels were the only thing drei provided, so `LabelProjector` now projects
world positions to screen space directly and writes `style.transform` on
plain DOM spans — about 20 lines, no dependency, and the captions stay real
selectable text.

Worth recording honestly: removing drei was **not** a meaningful bundle win
(~7 KiB decoded). three.js itself is essentially all of the cost. The reason
to drop it was the Node baseline conflict.

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

Measured on `/en/projects/personal-platform-infra`, production build, via
resource timing so both the compressed download and the parse cost are
visible. Same page, same method, both builds:

| Build | Wire (compressed) | Decoded (parsed) |
| --- | --- | --- |
| Flag off | 299.8 KiB | 936.7 KiB |
| Flag on | 529.3 KiB | 1803.3 KiB |
| **Delta** | **+229.5 KiB** | **+866.6 KiB** |

Both columns matter and they say different things: ~230 KiB is what a visitor
actually downloads, while ~867 KiB is what the main thread has to parse and
compile. It is one lazily-loaded chunk, essentially all of it three.js.

With the flag off that chunk is emitted to disk but never fetched, which is
the behaviour #48 requires ("o bundle 3D não deve entrar no carregamento
inicial"). An e2e test asserts this and fails if the default ever flips.

> **Measurement note.** Two earlier readings of these numbers were wrong
> because the page was sampled before all chunks had settled, which produced
> both an inflated flag-on figure and an implausibly low flag-off one. The
> table above is from runs with a 4 s settle and was cross-checked between
> configurations. Worth stating plainly so nobody re-derives a decision from
> the discarded figures.

## Phase B — interaction and content

### The canvas has no controls of its own, deliberately

#48 requires that hover, keyboard and touch offer equivalent access, and that
nothing is reachable only inside WebGL. The straightforward reading — make
canvas objects selectable — fails that immediately: three.js meshes are not
DOM nodes, so they cannot be focused, labelled or announced.

So selection lives in HTML. The accessible nodes built for #47 became the
control surface, and the canvas mirrors their state:

- `ArchitectureDiagram` gained an optional controlled mode (`activeId` +
  `onActiveChange`). Omit both and it behaves exactly as before, which is how
  the home page still uses it.
- `TopologyExplorer` owns the selection and hands it to both views.
- Clicking a node *in the canvas* reports into that same state — an
  enhancement on top of the buttons, never the only route.

This also means one set of controls rather than two that could drift apart —
the same reasoning behind deriving layout from one graph instead of authoring
coordinates twice.

Selecting is idempotent rather than a toggle. A plain click fires
`pointerover` and `focus` first, both of which already select, so a toggle
undid itself mid-gesture. Clearing is the dedicated restore control's job,
which is what #48 asks for anyway.

### What selection does

- the chosen node brightens and scales; everything else dims, so it reads as
  chosen rather than merely lit;
- connections touching it highlight in accent; unrelated ones recede;
- the camera eases its aim toward the node and dollies partway in — enough to
  read as a move, not so far that context is lost;
- the HTML detail panel names the node and its responsibility;
- a "restore overview" button appears, and only exists while there is
  something to restore.

Under reduced motion the same poses are used but snapped rather than eased,
so selection still reframes without anything gliding across the screen.

### Content the panel does not yet show

#48 asks the panel for "responsabilidade, tecnologias, decisões e trade-offs".
It currently shows responsibility only, because that is the field the content
actually has. Per-node technologies and trade-offs would have to be authored —
inventing them from the project's overall stack list would be fabrication, and
the repo's content rules forbid that. Adding them is a content task, not a
code one.

### Not yet done

- Zoom limits and moderate rotation. Only selection-driven camera moves exist
  today; #48 permits bounded zoom/rotation, which is not built.

## Phase C — performance

### A bug worth being honest about first

Measuring found that the scene had **never actually animated**. `useViewportMotion`
grabs its ref once, in an effect whose dependencies never change — and
`TopologyShowcase`'s first render returned `null` (the server snapshot of its
viewport/WebGL gates), so when the div appeared one render later it was never
observed. `inViewport` stayed false forever, the canvas stayed in demand mode,
and every "animated" screenshot from Phases A and B was actually a frozen
demand-rendered frame that happened to catch the pulses mid-flight.

The measurement caught it as "0 rendered frames per second while animating".
Fixed by splitting the gates into an outer component so the inner one's first
render always includes the observed element. The practical lesson recorded
for the codebase: **don't conditionally return `null` on the first render of
a component that hands a ref to `useViewportMotion`** — the hook will never
see the element. The showcase now exposes `data-topology-animating` so tests
and future measurement can assert the loop state directly instead of
inferring it.

### Numbers (lab, desktop, production build, SwiftShader)

| Metric | Flag on | Flag off |
| --- | --- | --- |
| Rendered frames/s, scene in view | **60.3** | — |
| rAF calls/s, scene scrolled away | **0.0** | — |
| rAF calls/s, tab hidden | **0.0** | — |
| Long tasks during node selection | none | — |
| Long tasks, load → settle | 0–3 (max 130 ms, run-dependent) | 0 |
| Lab LCP (dossier page) | 248 ms | 276 ms |
| Lab CLS | 0 | 0 |

- LCP/CLS are statistically identical — the chunk is lazy and below the fold,
  so it never touches the critical path. The difference shown is run noise.
- The occasional long tasks on load are three.js parse/compile — the
  ~867 KiB decoded cost from Phase A materialising. It lands after lazy-load,
  not during initial paint, but it is main-thread time and would count
  against INP if the user interacts at that exact moment.
- With WebGL disabled at the browser level (`--disable-webgl`): canvas absent,
  accessible diagram fully functional, zero page errors — the fallback path
  holds under real failure, not just under the probe.
- Software rendering (SwiftShader) hits a locked 60 fps; real GPUs have more
  headroom. These are lab numbers on one desktop — they bound the best case,
  not the field.

### What Phase C did not measure

RUM. Lab numbers can't stand in for the #56 baseline — that remains the gate
for Phase D, and mobile RUM is doubly moot here since the scene never mounts
below `lg`. The remaining unknown is INP on mid-range hardware if a visitor
interacts exactly while the chunk parses.

### Open question for Phase D

The visual result is legible and on-brand. The honest read after Phase A is
that ~230 KiB downloaded and ~867 KiB parsed buys a nicer rendering of
information the 2.5D diagram already conveys accessibly, on desktop only,
below a section most visitors never scroll to.

That is not obviously disqualifying — the chunk is lazy, gated, and off the
critical path — but it is real, and the bar #56 sets ("não aprovar Three.js
apenas porque o desktop permanece rápido") should be applied strictly. The
deciding evidence is still missing: a representative RUM sample, INP in
particular, since parse/compile of ~867 KiB lands on the main thread.

The narrower option worth weighing in Phase D: keep the 3D confined to the
project dossier (as built here) rather than also adopting it in the Hero,
which would move the cost onto the highest-traffic page.
