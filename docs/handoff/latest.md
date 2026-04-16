# Canopy Dashboard — Current State Handoff
**Last updated:** 2026-04-16 — Session: Git environment setup (staging/prod branches, release workflow, docs updated)
**Current version:** V2.7 — Semantic Clarity + Hero Utilization + Executive Meaning

> **This is the single source of truth for project state.**
> It is overwritten at the end of every session. Read this first. Always.
> See `docs/HANDOFF-SOP.md` for pickup checklist and sync-drift procedures.

---

## The Story (Non-Negotiable)

| Region | Story |
|---|---|
| **Left** | Are we generating and converting demand? |
| **Center** | What is the core truth of the business right now? |
| **Right** | Can we deliver profitably, and where is risk building? |
| **Bottom** | What targets matter, and what should happen now? |

Do not change this story. All visual and semantic decisions serve it.

---

## Current Visual State (V2.7)

### State System
4-tier semantic weight hierarchy drives every tile:

| State | Effect |
|---|---|
| **Stable** | Recedes — dark bg, dim labels, soft edge |
| **Watch** | Present — standard bg, visible accent |
| **Pressure** | Heavier — elevated bg, bright edge |
| **Critical** | Demands eye — red bg + border, full accent strength |

State affects: background tint, border weight, edge bar opacity, label color, value color.

### Hero: Four-Answer Context Block
Below `18.2%`, the hero answers four explicit operating questions:

| Line | Question answered |
|---|---|
| **Target 24.0%** | Where are we going? |
| **Gap −5.8 pts** | How far off are we? (amber) |
| **Trend +1.4 pts MoM** | Are we improving? (green) |
| **Pressure: Capacity** | What is suppressing performance? (yellow) |

### Top-Right Badges
| Badge | Question answered |
|---|---|
| Demand / Stable | Is pipeline generating? |
| Margin Gap / 5.8 pts | How far off margin target? |
| Client / Watch | Is client satisfaction at risk? |
| Cash Conv / 91% | Is revenue converting to cash? |

### Type Ramp
| Role | Size |
|---|---|
| Hero | 120px |
| Truth (stack) | 60px |
| Signal (rail) | 30px |
| Control (bottom) | 32px |
| Labels | 11px uppercase |
| Support/context | 13px |
| Micro | 10px |

### Surface Treatment (Liquid Glass)
- Screen frame: 4-stop `158deg` gradient (`#192030 → #131b27 → #0f1620 → #0d1319`)
- Hero: radial gradient, center-lit with hard vignette edges
- Tile base: `#1d2430` stable, `#212837` watch
- Icon tiles: `opacity: 0.70` — recede below data tiles
- Focus Now floor: gradient fade (transparent → orange → transparent)

---

## What Still Needs Work

1. **Hero context block at small viewports** — not tested below 1440px. Verify at 1280×800.
2. **R4 Client Health** — `Service risk` (yellow pressure) visually similar to R2. Could bump toward near-critical.
3. **T2 mode label `Margin Review`** — hardcoded. Should switch to `Revenue Review` / `AI Review` when M2/M3 tabs are active. V3 task: wire `activeTab` into `TopStatusBar` props.
4. **Hero context block font weight** — `--text-ghost` labels may be too light on physical 1080p displays. If so: bump to `rgba(238,241,246,0.36)`.
5. **Focus Now line break** — if directive text changes to something longer than `Margin + Capacity`, add `overflow: hidden; text-overflow: ellipsis` to `.focus-now-tile__value`.

---

## V3 Readiness

Visual language is stable. Semantic layer is complete. Story is intact.

**V3 priorities (in order):**
1. Wire `activeTab` into `TopStatusBar` so mode label switches with the tab
2. Live data integration — replace `dashboardData.js` static values with API/socket feed
3. Tile click-through → detail drawer (hero, R1, C1, B6 are priority entries)
4. Target adjustment (H2/H4) writes back to state and updates hero gap live
5. B6 Focus Now expandable actions panel

---

## Branch Model

| Branch | Purpose |
|---|---|
| `staging` | Active development — all changes go here first |
| `prod` | Deploy branch — GitHub Pages deploys from here, fast-forward only from `staging` |

**Always work on `staging`.** Never commit directly to `prod`.

Current active branch: `staging`

---

## What Agents Should Do Next

1. Read this file and `docs/HANDOFF-SOP.md` before touching anything
2. Confirm you are on `staging` branch: `git checkout staging`
3. Do not restart or redesign the visual system — V2.7 is stable
4. If continuing visual polish: address "What Still Needs Work" items in order
5. If starting V3: begin with T2 mode label wiring (simplest, highest meaning value)
6. After every session: run `npm run screenshot` — all 4 outputs must be captured (3 states + verification strip)
7. Commit changes to `staging`, update this file, then promote to `prod` if approved

---

## Repo Structure

All files live in named folders. Do not place files at the project root unless required by a tool (Vite, npm).

```
canopy-exec-dash-prt/              ← OLD deploy folder — gitignored, pending deletion
                                      This was the previous GitHub Pages deploy target.
                                      It is replaced by the prod branch + GitHub Actions.
                                      Do not edit anything in here. Delete once prod branch
                                      is wired to GitHub Pages and confirmed live.
design/
  exec-dashboard-prd.gdoc          ← Google Doc PRD shortcut (source of truth for all values)
  wireframe-prototype.html         ← layout reference for the box map
  wireframe-reference-image.jpeg   ← visual reference used when building the wireframe
docs/
  HANDOFF-SOP.md                   ← pickup checklist, sync-drift SOP, safe editing rules
  handoff/
    latest.md                      ← THIS FILE — overwrite after every session
scripts/
  capture-dashboard-screenshots.mjs   ← Puppeteer: captures 3 states + verification strip
                                         Run via: npm run screenshot
  verify-dashboard.mjs                ← QA verification script (npm run test:qa)
screenshots/
  canopy-dashboard-home.png           ← M1 Margin (canonical)
  canopy-dashboard-state-revenue.png  ← M2 Revenue tab
  canopy-dashboard-state-ai.png       ← M3 AI tab
src/
  components/
    BottomControlStrip.jsx
    CenterViewTabs.jsx
    FocusNowTile.jsx
    HeroMarginDial.jsx
    LeftRail.jsx
    LeftStack.jsx
    RightRail.jsx
    RightStack.jsx
    TopStatusBar.jsx
  data/
    dashboardData.js               ← all metric values, context, status fields
  App.jsx                          ← overall 16:9 screen composition
  main.jsx
  styles.css                       ← complete V2.7 design system
public/
  canopy-logo.svg                  ← single source of truth for the logo
tests/
  dashboardData.test.mjs           ← unit tests for dashboard data (npm run test:unit)
node_modules/                      ← do not edit
dist/                              ← gitignored, auto-generated by npm run build — not committed
```

**Root-level only (tool requirements):** `index.html`, `vite.config.js`, `package.json`, `package-lock.json`, `README.md`, `.gitignore`

---

## Key Files

| File | Role |
|---|---|
| `src/styles.css` | Complete V2.7 design system — all state classes, type ramp, component styles |
| `src/data/dashboardData.js` | All metric values + context/status fields + `hero.driver` prop |
| `src/components/HeroMarginDial.jsx` | Center truth anchor — four-answer context block |
| `src/components/TopStatusBar.jsx` | T1-T6 badges + freshness strip + mode label |
| `src/components/LeftRail.jsx` | D1-D4 signal strip |
| `src/components/RightRail.jsx` | R1-R4 signal strip |
| `src/components/LeftStack.jsx` | C1-C3 truth tiles |
| `src/components/RightStack.jsx` | O1-O3 truth tiles |
| `src/components/BottomControlStrip.jsx` | B1-B11 action row |
| `src/components/FocusNowTile.jsx` | B6 directive tile |

**Removed (do not re-add):** `MetricTile.jsx`, `StatusPill.jsx`, `TrendIndicator.jsx` — replaced by purpose-built components.

---

## Preview & Tunnel

### Start dev server
```bash
cd "/Users/roman-bediner/Library/CloudStorage/GoogleDrive-rbediner@gmail.com/My Drive/AI/Projects/Canopy Management"
npm install
npm run dev
```
**Local:** `http://localhost:5173/`

### Public tunnel (for ChatGPT / Codex / remote review)
```bash
cloudflared tunnel --url http://localhost:5173
```
Prints `https://*.trycloudflare.com` within ~5 seconds. `vite.config.js` has `allowedHosts: true` — do not remove.

### Capture all dashboard states (run every session)
```bash
npm run screenshot
```

| Output | State |
|---|---|
| `screenshots/canopy-dashboard-home.png` | M1 Margin — canonical |
| `screenshots/canopy-dashboard-state-revenue.png` | M2 Revenue tab |
| `screenshots/canopy-dashboard-state-ai.png` | M3 AI tab |

When new interactions are added in V3: add a block to `scripts/capture-dashboard-screenshots.mjs` in the marked section at the bottom of the file.

**Note:** `dist/` is excluded via `.gitignore` and is not committed. Run `npm run build` to regenerate it.

---

## Publishing Status

| Layer | Location | Status |
|---|---|---|
| Local preview | `npm run dev` → `http://localhost:5173/` | Ready |
| Stakeholder preview | `cloudflared tunnel --url http://localhost:5173` | On demand |
| Production build | `npm run build && npm run preview` | Ready |
| GitHub remote | Not yet created | **Pending** — see setup steps below |
| GitHub Pages | Deploys from `prod` branch via GitHub Actions | **Pending remote setup** |

### One-Time Remote Setup (not yet done)
```bash
# 1. Create repo at github.com (e.g. rbediner/canopy-exec-dashboard)
# 2. Add remote and push both branches
git remote add origin git@github.com:rbediner/canopy-exec-dashboard.git
git push -u origin staging
git push origin prod

# 3. In GitHub repo settings: enable Pages → source: prod branch, root /
# 4. Add .github/workflows/deploy-pages.yml to build + deploy on push to prod
# 5. Confirm GitHub Pages is live, then delete canopy-exec-dash-prt/ folder
```

---

## Version History (brief)

| Version | What changed |
|---|---|
| **V2** | State system (4-tier), type ramp, truth tile 4-line layout, rail as signal strip, center hero, bottom row as action strip |
| **V2.7** | Four-answer hero context block, badge semantic rewording, status/context lines sharpened throughout, liquid glass surface treatment, T2 mode label |
| **2026-04-16 (pass 1)** | Repo restructure: loose root files moved to `design/`, `assets/` removed (duplicate), `screenshot.mjs` renamed to `capture-dashboard-screenshots.mjs`, `next-session.md` merged into this file |
| **2026-04-16 (pass 2)** | `dist/` deleted; `.gitignore` added; `npm run screenshot`, `test:unit`, `test:qa` scripts added; verification strip added to screenshot script |
| **2026-04-16 (pass 3)** | Git repo initialized; `staging` and `prod` branches created; `canopy-exec-dash-prt/` gitignored (pending deletion after remote setup); initial commit on `staging` |

---

## PRD Reference
`https://docs.google.com/document/d/14-eyti0nHkSi2bvVVovCS7WaUSIfHoT5f6SuoPC-eZg/edit`

If a local file conflicts with the PRD, the PRD wins.
