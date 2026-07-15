# Motion language

Motion in this portfolio explains hierarchy, state, or technical flow. It is not decorative by
default.

## Principles

- Keep movement short, restrained, and predictable.
- Prefer opacity and transform to layout-changing properties.
- Use the same timing for equivalent interactions.
- Select motion by semantic intent instead of component-specific timing values.
- Start entrance motion only when the related content reaches the viewport.
- Pause continuous animation when its section is not visible.
- Never hide information exclusively inside animation.
- Treat `prefers-reduced-motion: reduce` as a first-class static experience.

## Tokens

CSS tokens live in `src/app/styles/tokens.css`. JavaScript durations that participate in runtime
behavior live in `src/lib/motion.ts` and are guarded by a unit test against CSS drift.

| Family             | Intended use                                        |
| ------------------ | --------------------------------------------------- |
| `instant` / `fast` | press, arrow nudge, small control feedback          |
| `standard`         | navigation underline, card hover, page fade         |
| `enter`            | ordinary content entrance and confirmation feedback |
| `expressive`       | Hero identity and architecture-focused reveals      |
| `data`             | bars, charts, heatmaps, and visualized measurements |
| `count`            | numeric counters                                    |
| `flow`             | directional architecture pulses                     |
| `ambient`          | rare, low-priority continuous status motion         |

Distances, scales, angles, delays, stagger intervals, and easing curves follow the same naming
model. Components should not add an arbitrary duration or easing when an equivalent token exists.

## Semantic reveal patterns

`RevealOnScroll` exposes patterns rather than raw animation parameters:

- `content`: default section content;
- `heading`: short horizontal reveal for section hierarchy;
- `list`: staggered cards or related items;
- `data`: restrained scale/fade for measurable information;
- `diagram`: slower reveal reserved for architecture and system flow.

Use `motion="..."` only to describe intent. The component exposes `data-motion-entered` for its
one-time entrance state and `data-motion-in-viewport` for current visibility.

## Viewport lifecycle

`useViewportMotion` coordinates entrance state, current visibility, delayed work, and static
fallbacks. Equivalent option sets reuse one native `IntersectionObserver` through
`src/lib/viewport-observer.ts`. Counters intentionally use a separate one-shot option set because
they require a higher visibility threshold and no offscreen pause state.

- Entrance animations execute once and remain in their final state after leaving the viewport.
- Delayed entrances are cancelled if the element leaves before the delay completes.
- Timers, observers, and counter animation frames are cancelled during cleanup.
- Checkmarks and language bars begin only after their reveal container enters.
- Architecture flow arrows and the Hero badge pause while their container is offscreen.
- The contribution heatmap uses one container reveal rather than hundreds of cell animations.
- Missing `IntersectionObserver`, disabled scripting, and reduced motion keep content available in
  its final static state.

## Interaction vocabulary

- Hero: one expressive entrance; CTAs remain immediately understandable.
- Headings: fast hierarchy cue, never a dramatic entrance.
- Cards and lists: small stagger and at most 2 px of hover elevation.
- Data: measured, slower transition without bounce.
- Architecture: directional pulse that follows the represented request path.
- Navigation and buttons: fast feedback with no layout shift.
- Error feedback: one finite movement; never an infinite shake.

## Reduced motion

The reduced-motion stylesheet:

- renders reveal content, Hero words, language bars, and checkmarks in their final state;
- removes continuous pulses, badge glow, page transitions, and smooth scrolling;
- removes hover/press transforms and transition timing;
- makes counters resolve directly to their final value;
- keeps content, focus, navigation, and component state fully available.

Automated coverage exists in the viewport lifecycle unit tests, `src/lib/__tests__/motion.test.ts`,
`e2e/motion.spec.ts`, and the existing Hero E2E test.

## Adding motion

1. Identify whether movement communicates hierarchy, state, data, or flow.
2. Reuse a semantic reveal pattern or an existing interaction class.
3. Use shared tokens for duration, easing, distance, and stagger.
4. Connect child or continuous motion to the nearest viewport-aware container.
5. Define static no-script and reduced-motion results in the same change.
6. Add proportional automated coverage when behavior changes.
7. Avoid a new animation library unless native CSS and the current observer abstraction cannot meet
   a measured requirement.
