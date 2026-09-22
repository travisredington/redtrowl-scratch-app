# Results visualization component

This repo is a Vite + React 19 + TypeScript app (`redtrowl-scratch-app`). This file
scopes one task: build a **presentational** component that renders survey results —
Big Five personality scores crossed with political-compass-style scores and an
optional sexual-identity field, for a set of respondents. Match this app's existing
conventions exactly (see below) rather than introducing new patterns.

A working, dependency-free HTML prototype of every chart in this spec was built and
visually verified (light + dark mode, narrow container) before this component
existed. If `reference/prototype.html` exists in this repo, treat it as the
functional and visual spec to port to React/TypeScript, not as throwaway scratch
work — re-derive the SVG/layout logic in TypeScript rather than embedding the
prototype's raw JS. If that file is missing, ask before inventing chart layouts from
scratch; don't guess at pixel-level SVG geometry this spec doesn't otherwise pin down.

## Conventions in this repo — follow these, don't introduce alternatives

- One folder per component under `src/components/ui/<kebab-name>/`, containing
  `<kebab-name>.tsx` + `<kebab-name>.css` (+ `<kebab-name>.test.tsx` where a test
  exists). `function ComponentName() { ... }` with a `<ComponentName>Props`
  interface, default export at the bottom of the file, no named exports.
- Composition happens by importing sibling folders (see how `header.tsx` imports
  `PageTitle` and `MainNav` from `../page-title/...` and `../main-nav/...`).
- Plain CSS with custom properties for theming — no Tailwind, no CSS modules, no
  styled-components. Dark mode via `@media (prefers-color-scheme: dark)` inside
  `src/index.css`, the single existing home for theme tokens.
- State is local component state via hooks (`useState`, `useEffect`, `useRef`) — no
  Redux/Zustand/Context store anywhere in this app; don't add one for this.
- No charting library in `package.json` (no d3, no recharts) — keep it that way.
  Hand-roll the SVG and scale math, matching the prototype's dependency-free
  approach.
- Tests: vitest + `@testing-library/react`, co-located `.test.tsx`, `describe`/`it`,
  `cleanup()` in `afterEach` — mirror `header.test.tsx`.
- This app has no `src/lib/` yet. Add one for the non-visual TypeScript helpers
  below (types, scale math, color interpolation) since they aren't components and
  don't want a `.css` sibling — a peer of `components/` and `pages/`, not nested
  under `components/ui/`.

## File layout to create

```
src/
  lib/
    results-viz/
      types.ts
      scales.ts             # linear scale helpers, domain/range math
      color.ts               # sequential ramp interpolation (seq-low → seq-high)
      beeswarm.ts             # dodge/collision layout, see "View 1" below
      group-by-identity.ts    # groups PersonResult[] by `identity`, drops undefined

  components/ui/
    results-visualization/
      results-visualization.tsx   # top-level: owns control state, empty state
      results-visualization.css
      results-visualization.test.tsx

    chart-tooltip/
      chart-tooltip.tsx           # shared hover tooltip, used by every chart below
      chart-tooltip.css

    one-variable-panels/
      one-variable-panels.tsx     # 7 small multiples, picks bar vs beeswarm by N
      one-variable-panels.css
      bar-strip.tsx                 # small-N path (exact prototype port)
      beeswarm-strip.tsx            # large-N path
      one-variable-panels.test.tsx

    two-trait-scatter/
      two-trait-scatter.tsx       # X/Y trait dropdowns + scatter
      two-trait-scatter.css

    compass-scatter/
      compass-scatter.tsx         # econ/soc scatter, color-by control, ring control
      compass-scatter.css
      color-legend.tsx              # gradient legend for the color-by ramp

    group-average-panels/
      group-average-panels.tsx    # same 7-panel layout, one bar per identity value
      group-average-panels.css

    parallel-coordinates/
      parallel-coordinates.tsx    # 7-axis lines, highlight control, density scaling
      parallel-coordinates.css

    results-data-table/
      results-data-table.tsx      # accessible table, paginated, behind <details>
      results-data-table.css
```

`bar-strip.tsx` and `beeswarm-strip.tsx` are private to `one-variable-panels/`, not
independently reusable — that's why they live inside that folder instead of getting
their own top-level `ui/` entry. Everything else gets its own top-level folder per
the repo's normal pattern.

## Data contract

The component is presentational — it receives respondent data as a prop; it does
not fetch, parse Google Forms exports, or compute scores itself.

```ts
// src/lib/results-viz/types.ts
export interface PersonResult {
  id: string;            // stable key, e.g. a row id or generated uuid
  name: string;           // display name/nickname; "Anonymous" if none given
  O: number;               // Openness, 0–100
  C: number;               // Conscientiousness, 0–100
  E: number;               // Extraversion, 0–100
  A: number;               // Agreeableness, 0–100
  N: number;               // Neuroticism, 0–100
  econ: number;            // Economic axis, −10 (Left) to +10 (Right)
  soc: number;             // Social axis, −10 (Libertarian) to +10 (Authoritarian)
  identity?: string;       // optional, free-form; absent/undefined means skipped
}

export interface ResultsVisualizationProps {
  data: PersonResult[];
}

export type TraitKey = 'O' | 'C' | 'E' | 'A' | 'N';
export type AxisKey = TraitKey | 'econ' | 'soc';
```

Treat `data` as the single source of truth — no local mock data baked into the
component. `data.length === 0` renders a plain empty-state message in place of the
charts, not a broken chart; guard once at the top of `results-visualization.tsx`
and return early.

## Required views

Six views, each its own subcomponent per the file layout above:

1. **One-variable-at-a-time** — seven small-multiple panels (O, C, E, A, N, Econ,
   Soc). `one-variable-panels.tsx` picks a render path by `data.length`:
   - **Bar mode** (`data.length <= BAR_MODE_MAX_N`, start this constant at **40**
     and tune once real data volumes are known) — `bar-strip.tsx`, an exact port of
     the prototype: one labeled bar per respondent, trait panels 0-anchored, Econ/
     Soc **diverging** bars anchored at zero (never plain 0-anchored — those two
     axes are bipolar), rounded ends, hairline gridlines, always-on value label.
   - **Beeswarm mode** (`data.length > BAR_MODE_MAX_N`) — `beeswarm-strip.tsx`:
     one dot per respondent along the value axis instead of a labeled bar (same
     0–100 / diverging −10..+10 domains, same pos/neg coloring on Econ/Soc). No
     always-on labels — hover-only tooltip via `chart-tooltip.tsx` showing name +
     exact value. Overlay a thin median/IQR tick as a quiet summary layer without
     hiding individual points. `beeswarm.ts`: sort by value, then for each point
     walk outward from offset 0 in alternating steps (`0, +step, -step, +2·step,
     -2·step, …`) until the candidate position clears a minimum pixel distance from
     every already-placed point at a similar value; cap total swarm thickness to a
     few dot-diameters. This is the one place this component deliberately diverges
     from the original bar-only prototype — it's a scaling fix for large
     respondent counts, not a style change, so don't "simplify" it back to bars
     unconditionally.
2. **Two-trait scatter** — X/Y dropdowns over the five Big Five traits, one point
   per respondent, labeled. Point labels go hover-only once there are enough points
   to risk overlap (tune to point density, not raw N — scatter crowding depends on
   spread, not count).
3. **Political compass scatter** — Economic (X) vs. Social (Y), fixed −10..+10
   domain, quadrant crosshair at zero with the four quadrant labels (Authoritarian
   Left/Right, Libertarian Left/Right). A "color by" control selects which Big Five
   trait drives point color (sequential single-hue ramp via `color.ts`, light = low,
   dark = high) plus a gradient legend (`color-legend.tsx`). A second control draws
   a ring around whichever identity group is selected, independent of fill color.
4. **Group averages by identity** — same seven-panel layout as (1), but each bar is
   the mean for everyone sharing an `identity` value. Unaffected by respondent
   count scaling — it's always one bar per distinct identity value, however many
   people feed each average. Show group size on hover/tooltip. Respondents with no
   `identity` are excluded, not lumped into a fake group.
5. **All-axes parallel coordinates** — seven vertical axes (O, C, E, A, N, Econ,
   Soc), each keeping its own scale/domain (label each axis's own min/max, don't
   assume a shared 0–100 range). One line per respondent, gray by default. A
   highlight control accepts a single person or "everyone with identity = X"; hover
   on any line also previews its highlight. Scaling notes: start with **no default
   highlight** on load (don't pre-select anyone); unhighlighted-line opacity should
   scale down as N grows — roughly 0.35 at N ≤ 20 down to ~0.08 at N ≥ 300, not one
   fixed opacity for every dataset size.
6. **Accessible data table** — every field in `PersonResult`, collapsed behind a
   `<details>` toggle. Paginate (25 or 50 rows per page via `useState` + `.slice()`,
   plus a "showing X–Y of N" caption) rather than rendering every row — a few
   hundred `<tr>`s isn't a performance problem, it's a usability one, so a
   virtualization library is unnecessary here.

## Design tokens

Add to `src/index.css`, as new custom properties alongside the existing
`--color-charcoal` / `--color-beige` / `--color-pomegranate` / `--color-lightpink` /
`--color-lightturquoise` raw brand vars. **Don't repurpose those raw vars for chart
marks** — they already drive buttons/links/headings elsewhere in the app. The values
below are the validated (contrast/chroma/CVD-checked) chart-safe derivations of the
same brand colors, prefixed `--viz-` to avoid colliding with the app's existing
`--text` / `--border` / `--bg` (which weren't validated for chart-contrast
requirements and serve a different purpose):

```css
:root {
  --viz-surface-1:      #e6e4cd;
  --viz-page-plane:     #d7d5c0;
  --viz-text-primary:   #2d2c2a;
  --viz-text-secondary: #6e6c63;
  --viz-text-muted:     #939184;
  --viz-gridline:       #d0ceb9;
  --viz-baseline:       #b2b09f;
  --viz-border:         rgba(45, 44, 42, 0.14);
  --viz-series-1:       #008f96;
  --viz-gray-line:      #939184;
  --viz-pos:            #008f96;  /* diverging positive pole: Right / Authoritarian */
  --viz-neg:            #e25643;  /* diverging negative pole: Left / Libertarian */
  --viz-seq-low:        #d6edef;  /* sequential ramp, low end (color-by-trait) */
  --viz-seq-high:       #005257;  /* sequential ramp, high end */
  --viz-tint-1:         #ffd1d1;  /* decorative wash only — never a second mark color */
}
```

Add the dark values into the **existing** `@media (prefers-color-scheme: dark)`
block in `index.css` — don't create a second one:

```css
@media (prefers-color-scheme: dark) {
  :root {
    --viz-surface-1:      #2d2c2a;
    --viz-page-plane:     #1d1d1b;
    --viz-text-primary:   #e6e4cd;
    --viz-text-secondary: #afad9c;
    --viz-text-muted:     #8a887c;
    --viz-gridline:       #494842;
    --viz-baseline:       #68675e;
    --viz-border:         rgba(230, 228, 205, 0.14);
    --viz-series-1:       #00a3ab;
    --viz-gray-line:      #8a887c;
    --viz-pos:            #00a3ab;
    --viz-neg:            #e25643;
    --viz-seq-low:        #145155;
    --viz-seq-high:       #9fdade;
    --viz-tint-1:         rgba(226, 86, 67, 0.18);
  }
}
```

Two things worth knowing, not just copying: `--viz-neg` sits at a contrast WARN
(2.89:1) on the light surface — legal only because every chart that uses it also
ships direct value labels/tooltips plus the table view as relief; don't drop those
relief channels from any chart using `--viz-neg`. And `--viz-tint-1` /
`#ffd1d1` sits too close in hue to `--viz-neg` to serve as a second series color
alongside it — it's for soft backgrounds (hover states, callout boxes) only, never
a second chart-mark color. If the brand palette changes later, don't hand-edit these
hexes — rederive them the same way (fix the hue, search for a lightness/chroma that
clears contrast + CVD-separation checks) rather than eyeballing a replacement.

## Build order

1. Design tokens into `index.css` (light + dark).
2. `src/lib/results-viz/` — `types.ts`, `scales.ts`, `color.ts`,
   `group-by-identity.ts`, `beeswarm.ts`.
3. `chart-tooltip/` — shared across every chart, build once.
4. `one-variable-panels/` — `bar-strip.tsx` first (exact port, verify against the
   prototype), then `beeswarm-strip.tsx`.
5. `two-trait-scatter/`.
6. `compass-scatter/` + `color-legend.tsx` + ring control.
7. `group-average-panels/`.
8. `parallel-coordinates/` + highlight control + opacity scaling.
9. `results-data-table/` + pagination.
10. `results-visualization.tsx` — wire the seven views together, empty state, own
    the control state (scatter axis selections, color-by trait, ring identity,
    parallel-coordinates highlight, table page — all `useState` in this one file,
    passed down as props; the view components stay presentational aside from their
    own local hover state).
11. Tests: at minimum one test per component covering 0 respondents, 1 respondent,
    and enough respondents to cross `BAR_MODE_MAX_N` — mirror `header.test.tsx`'s
    `render()` + `screen` pattern.

## Non-goals

- No score computation from raw Likert answers (upstream concern).
- No data persistence/fetching — this component just renders whatever `data` prop
  it's given.
- No collection of new sensitive data through this component; it only displays
  results already collected elsewhere.

## Verification checklist before calling a chart done

- [ ] Renders correctly at 0, 1, and a full respondent set — including a set large
      enough to cross `BAR_MODE_MAX_N` and confirm beeswarm mode actually engages.
- [ ] No label collisions/clipping at narrow container widths — likely embedded in
      a dashboard column, not full-page.
- [ ] Dark mode checked, not just light — `--viz-*` tokens flip correctly.
- [ ] Every chart has a working tooltip; every value is also reachable via the
      table view (not tooltip-only).
- [ ] `identity` being absent for some/all respondents doesn't break the
      group-averages view or the compass ring control.
- [ ] Beeswarm mode: hover tooltip shows exact value/name; the median/IQR tick
      doesn't visually swallow individual points just above `BAR_MODE_MAX_N`.
- [ ] Parallel coordinates: no default highlight on load; opacity is visibly lower
      at high N than at low N.
