# Performance baseline

## Collection

Vercel Speed Insights is rendered once in the shared locale layout and only when `VERCEL_ENV=production`. Local development, automated tests and preview deployments do not send measurements, which keeps the production baseline free from synthetic navigation.

The integration does not send form fields, names, email addresses, phone numbers or message content. Avoid adding personal or sensitive values to URLs because route information is part of performance segmentation.

## Initial targets

Use the 75th percentile as the decision point:

| Metric | Initial target |
| --- | --- |
| LCP | <= 2.5 s |
| INP | <= 200 ms |
| CLS | <= 0.1 |

FCP and TTFB are diagnostic metrics, not standalone approval gates.

## Baseline record

Do not treat the first events as a representative baseline. Record results only after there is enough traffic to compare route and device segments without drawing conclusions from isolated visits.

For each snapshot, add:

- collection period and production deployment SHA;
- sample size;
- mobile and desktop distribution;
- `/pt`, `/en` and project-page results;
- p75 LCP, INP and CLS;
- FCP and TTFB observations;
- known limitations such as low traffic or ad blockers;
- conclusion: improved, regressed or inconclusive.

## Snapshot — 2026-07-20

- **Period**: Last 7 days (2026-07-13 to 2026-07-20), production deployment SHA `7d82296` (`main`, PR #71).
- **Sample size**: ~25 visits on the `/[lang]` route group over the period — small. Per the rule above, this is **not** a representative baseline yet; it's an early, encouraging signal only.
- **Device distribution**: Desktop has data; **Mobile shows "No data available"** for the same period. Confirmed this is a volume gap, not a broken integration — `@vercel/speed-insights` is installed at `2.0.0`, matching the latest published version, and the environment gate (`VERCEL_ENV=production`) is verified working since Desktop is reporting.
- **Route/locale split**: Speed Insights groups `/pt` and `/en` together under the `/[lang]` dynamic route pattern — there is no per-locale split available in the dashboard's route view today. Noting this as a known limitation of the current view, not something to build around.
- **Desktop, p75** (production, `/[lang]`):
  | Metric | Value | Target | Result |
  | --- | --- | --- | --- |
  | Real Experience Score | 96 ("Great") | > 90 | ✅ |
  | LCP | 1.47 s | ≤ 2.5 s | ✅ |
  | INP | 48 ms | ≤ 200 ms | ✅ |
  | CLS | 0 | ≤ 0.1 | ✅ |
  | FCP (diagnostic) | 2.47 s | — | — |
  | FID (diagnostic) | 1 ms | — | — |
  | TTFB (diagnostic) | 0.41 s | — | — |
- **Mobile, p75**: no data for this period — inconclusive, not approved.
- **Known limitations**: sample size is far below what's needed for a confident comparison; mobile is entirely unmeasured so far; no per-locale breakdown available.
- **Conclusion**: **Inconclusive as a formal baseline** — but every desktop metric that does have data clears its target with margin, and there's no current signal of a performance problem to fix before #46. Re-check this dashboard after #46/#47 ship real traffic (or after enough time passes) before drawing any before/after comparison — a mobile sample is required before that comparison can be trusted.

## Visual-change comparison

Before approving #46, #47 or #48:

1. capture the current production period;
2. deploy the visual change behind a controlled rollout when appropriate;
3. compare the same route and device segments;
4. inspect JavaScript growth, hydration, canvas work and continuous animation loops;
5. simplify or pause the visual experience when the data indicates a meaningful regression.

Lighthouse or other laboratory measurements complement this RUM baseline; they are not equivalent datasets.

## Investigation checklist

- LCP: identify the element, image/font loading and render-blocking work;
- INP: inspect long tasks, hydration, event handlers and animation work;
- CLS: inspect late content, font swaps and unsized media;
- compare the affected deployment with the previous production SHA;
- check whether the result is route-specific or device-specific;
- mark low-volume comparisons as inconclusive.

## Verification in Vercel

After the production deployment:

1. enable Speed Insights for the Vercel project if the dashboard requests it;
2. visit the production site and navigate through both locales and a project page;
3. verify that measurements appear in the Speed Insights dashboard;
4. confirm that preview and local sessions do not contribute events;
5. attach the first representative baseline to issue #56.
