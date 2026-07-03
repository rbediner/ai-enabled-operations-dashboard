# AI-Enabled Operations Dashboard

A free, open-source single-screen operations dashboard prototype for leadership review. It brings demand, delivery, financial tension, customer pressure, and AI leverage into one structured view designed to run full-time on a 16:9 display.

**[See it live →](https://romanbediner.com/resources/ai-enabled-operations-dashboard/)**

---

## Architecture

A single-page React 18 app built with Vite 5 (`@vitejs/plugin-react`, native ESM, plain JSX — no TypeScript). It has only two runtime dependencies (`react`, `react-dom`); Puppeteer is dev-only, used for screenshots and QA. It renders one fixed **1920×1080** canvas that never reflows — `App.jsx` computes a uniform `--dash-scale` CSS variable on resize/fullscreen so the whole screen scales as one unit to fit any viewport.

**Layout / composition** — `src/main.jsx` mounts `App.jsx`, which composes the five screen zones as sibling components: `TopStatusBar`, `LeftRail` + `LeftStack`, the center column (`CenterViewTabs` + `HeroMarginDial`), `RightStack` + `RightRail`, and `BottomControlStrip`. All visual styling lives in `src/styles.css`.

**Data model** — `src/data/dashboardData.js` holds the locked base business story: exported arrays/objects keyed by tile ID (`T*`, `D*`, `C*`, `O*`, `R*`, `B*`, plus `centerViews` M1/M2/M3 and `lensTabs`). This is the single source of truth for values, labels, and green/yellow/red states.

**Live model** — `src/live/dashboardLiveModel.js` is a pure module (no React) that layers ambient motion on top of the base data. It defines cadence constants, predefined `scenarioFrames`, and functions to build a simulated dashboard, schedule per-region tile refreshes, detect priority overrides, and drive tile flips. `App.jsx` holds all state and timers and calls into this model; `src/live/useAnimatedNumber.js` provides smooth numeric transitions. State flows one way: base data → simulated target dashboard → displayed dashboard → props to components.

**Build / run / deploy** — `npm run dev` (Vite dev server on :5173), `npm run build` → static `dist/`, `npm run preview` to serve it. Tests: `npm run test:unit` (Node test runner over `dashboardData`) and `npm run test:qa` (Puppeteer render check). Vite `base` is `/ai-enabled-operations-dashboard/` because the build is embedded under that path on the main site. CI (`.github/workflows/deploy-pages.yml`) builds and publishes `dist/` to GitHub Pages on push to the `prod` branch (this working branch is `staging`).

---

## Screen Layout

The dashboard is a fixed 1920×1080 canvas that scales proportionally to fit any viewport. It never reflows — it shrinks and grows as one unit.

```
┌──────────────────────────────────────────────────────────────────┐
│  Logo │ Time / Lens / LIVE │ Pipeline │ Margin │ Friction │ Cash │ ⛶ │
├──────────────┬──────────────────────────────┬────────────────────┤
│  Demand      │                              │  Delivery          │
│  (Left Rail) │     Center View              │  (Right Rail)      │
│              │     [Margin│Revenue│AI]       │                    │
│  Commercial  │                              │  Capacity          │
│  Quality     │                              │  & Risk            │
├──────────────┴──────────────────────────────┴────────────────────┤
│  Bottom Strip: targets, Focus Now, AI Gain, SLA, Escalations     │
└──────────────────────────────────────────────────────────────────┘
```

**Left** — demand generation (new opps, pipeline, stall rate, conversion) and commercial quality (forecast, close rate, avg deal size).

**Center** — the core operating truth. Switches between three views: Margin, Revenue, AI. Everything else on screen stays fixed.

**Right** — delivery and capacity (utilization, FTE vs AI ratio, onboarding) and customer risk (cycle time, AI gain, client friction, SLA).

**Bottom** — static target context (revenue target, cash conversion, rocks) and the current operating signal (Focus Now tile, AI Gain, escalations).

**Top bar** — live clock, active operating lens, and four at-a-glance health indicators (pipeline coverage, margin gap, client friction, cash conversion).

---

## What's Interactive

| Element | How it works |
|---|---|
| **Center view tabs** (Margin / Revenue / AI) | Click any tab to switch the center column to that operating lens. The hero metric, supporting context, and target delta all update. The rest of the screen is unaffected. |
| **Left rail tiles** (D1–D4) | Each tile flips on hover to show a comparison value (e.g. `+4 vs prior`, `Band 32–36%`). Stalled deals tile does not flip. |
| **Live Flip tile** | Cycles through live operating signals automatically — it is the only tile with persistent ambient animation. |
| **Focus Now tile** | Displays the current priority action signal. Static in the demo; driven by `dashboardData.js` in a real deployment. |
| **Fullscreen toggle** | Icon button in the top-right of the status bar. Enters/exits browser fullscreen. Works on desktop and most tablets. |
| **Margin Dial** | The hero dial in the center view animates between states as you switch tabs. |
| **Ambient drift** | Several numeric tiles have subtle live drift applied — small random fluctuations that keep the dashboard feeling alive without changing the narrative. |

---

## Quick Start

```bash
git clone https://github.com/rbediner/ai-enabled-operations-dashboard.git
cd ai-enabled-operations-dashboard
npm install
npm run dev
```

Open [http://localhost:5173/](http://localhost:5173/)

---

## Customizing the Data

All metric values, labels, states (green/yellow/red), and tile content live in one file:

```
src/data/dashboardData.js
```

Replace the demo values with your own operating metrics. The structure maps directly to tile IDs in the PRD (`T1–T6`, `D1–D4`, `C1–C3`, `H1–H4`, `O1–O3`, `R1–R4`, `B1–B11`). See `docs/PRD.md` for the full tile map with current values.

**What you can change in `dashboardData.js`:**
- All metric values and labels
- State colors (green / yellow / red) per tile
- Flip-face comparison values on left rail tiles
- Focus Now action signal text
- AI Gain percentage and context
- Bottom strip target values

**What requires component edits:**
- Adding or removing tiles
- Changing the number of center-view tabs
- Altering the screen layout or zone proportions
- Modifying the live drift behavior (`src/live/`)

---

## Component Map

```
src/
  App.jsx                  ← root composition, scale logic, fullscreen handler
  src/                     ← visual system stylesheet (colors, typography, tile sizing)
  components/
    TopStatusBar.jsx        ← top bar: logo, clock, 4 health indicators, fullscreen toggle
    LeftRail.jsx            ← demand tiles D1–D4 (with flip behavior)
    LeftStack.jsx           ← commercial quality tiles C1–C3
    CenterViewTabs.jsx      ← tab selector: Margin / Revenue / AI
    HeroMarginDial.jsx      ← animated center dial + target delta
    RightRail.jsx           ← delivery capacity tiles O1–O3
    RightStack.jsx          ← risk tiles R1–R4
    BottomControlStrip.jsx  ← full bottom strip B1–B11
    FocusNowTile.jsx        ← Focus Now action signal (B6)
    LiveFlipTile.jsx        ← ambient live signal tile
  data/
    dashboardData.js        ← all metric values, labels, states
  live/
    dashboardLiveModel.js   ← ambient drift model
    useAnimatedNumber.js    ← smooth number animation hook
```

---

## Build and Deploy

```bash
npm run build     # produces dist/
npm run preview   # preview the production build locally
```

Deploy `dist/` to GitHub Pages, Netlify, Vercel, or any static host.

```bash
npm run screenshot   # capture Margin / Revenue / AI center-view states
npm run test:unit    # verify dashboard data structure
npm run test:qa      # verify dashboard renders and tiles are present
```

---

## What's Included

| Path | Description |
|---|---|
| `src/` | React / Vite source |
| `design/wireframe-prototype.html` | Original structural wireframe — the canonical layout reference |
| `docs/PRD.md` | Full tile map, interaction spec, and operating story |
| `docs/HANDOFF-SOP.md` | How to maintain, extend, and hand off this project |

---

## See It in Context

Live on [romanbediner.com](https://romanbediner.com/resources/ai-enabled-operations-dashboard/) with additional operating context.

## Google Drive drift

This repository is checked out inside Google Drive and synced across machines. Google Drive creates conflict-copies (filenames ending in ` 2`, ` 3`, or ` (1)`) — including inside `.git` — which corrupt the repo. A guardrail auto-removes them:

- `scripts/clean-drive-drift.sh --fix` — remove conflict-copies then verify with `git fsck` (`--check` to only report).
- Runs automatically via git hooks (`pre-commit`, `post-merge`, `post-checkout`) and, for Claude, on session start via `.claude/settings.json`.
- Never commit a file whose name ends in ` 2`/` 3` — it is Google Drive junk, not a real file.
