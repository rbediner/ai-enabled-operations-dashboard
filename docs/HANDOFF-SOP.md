# Canopy Dashboard Handoff SOP

This project lives inside a Google Drive synced folder, so the handoff process needs to account for sync drift before any new edits begin.

## Purpose

Use this SOP when:

- another Codex machine needs to continue the prototype
- the same machine is reopening the project after Drive sync activity
- screenshots or assets were added outside the current session

## Current Publishing Status

| Layer | Location | Status |
|---|---|---|
| Local preview | `npm run dev` → `http://localhost:5173/` | Ready |
| Production build preview | `npm run build && npm run preview` | Ready |
| Public repo | [rbediner/canopy-exec-dash-prt](https://github.com/rbediner/canopy-exec-dash-prt) | Live |
| GitHub Pages | [rbediner.github.io/canopy-exec-dash-prt](https://rbediner.github.io/canopy-exec-dash-prt) | Live — HTTP 200 confirmed |

GitHub Pages is deployed via the Actions workflow at `.github/workflows/deploy-pages.yml`. Deployment wiring and repo metadata cleanup are complete.

## Known Follow-up

~~Node 20 deprecation warning~~ — resolved. Workflow updated to Node 22 (`node-version: 22` in `.github/workflows/deploy-pages.yml`).

## Source of Truth

1. Product source of truth: the Google Doc PRD
   `https://docs.google.com/document/d/14-eyti0nHkSi2bvVVovCS7WaUSIfHoT5f6SuoPC-eZg/edit?tab=t.0`
2. Layout source of truth: `design/wireframe-prototype.html`
3. Implementation workspace:
   `/Users/roman-bediner/Library/CloudStorage/GoogleDrive-rbediner@gmail.com/My Drive/AI/Projects/Canopy Management`

If a local scratch file conflicts with the PRD, the PRD wins.

## Google Drive Sync-Drift SOP

Before editing on any machine:

1. Wait for Google Drive desktop sync to finish.
2. Confirm the expected folders exist: `src`, `public`, `design`, `scripts`, `screenshots`, and `docs`. There should be no `dist/` or `assets/` folder — both are excluded.
3. Check whether recently changed files have different timestamps than expected, especially `src`, `README.md`, and anything in `screenshots`.
4. Open the app once with `npm run dev` before making structural edits. This catches partial sync states fast.

If sync drift is suspected:

1. Stop editing.
2. Let Drive finish syncing on both machines.
3. Compare the current local file tree against the last known handoff note.
4. Re-open the PRD and confirm the dashboard values and box mapping still match the intended build.
5. Only resume edits after the workspace is visually and structurally consistent again.

## Cross-Machine Pickup SOP

When a new Codex machine takes over:

1. Read `docs/handoff/latest.md` — this is the canonical current-state summary, updated after every pass.
2. Read this SOP.
3. Read `README.md`.
4. Read the PRD.
5. Open `design/wireframe-prototype.html`.
6. Run:

```bash
npm install
npm run dev
```

7. Open the local preview URL, usually `http://localhost:5173/`.
8. Confirm the screen still matches the fixed box map:
   `T1-T6`, `D1-D4`, `C1-C3`, `M1-M3`, `H1-H4`, `O1-O3`, `R1-R4`, `B1-B11`.

## Current Implementation Layout

See `docs/handoff/latest.md` → **Repo Structure** section for the full file tree.

Key paths:
- `src/App.jsx` — overall 16:9 operating screen composition
- `src/data/dashboardData.js` — hardcoded PRD values and labels
- `src/components/` — purpose-built dashboard components
- `src/styles.css` — complete V2.7 design system
- `public/canopy-logo.svg` — single source of truth for the logo (do not add a second copy)
- `design/wireframe-prototype.html` — layout reference
- `design/exec-dashboard-prd.gdoc` — PRD shortcut
- `scripts/capture-dashboard-screenshots.mjs` — Puppeteer screenshot script
- `screenshots/` — captured dashboard states for review

## Safe Editing Rules

1. Preserve the wireframe hierarchy and tile mapping exactly.
2. Keep the PRD metric story intact:
   demand solid, some stall, forecast under, margin below target but improving, capacity strained, AI rising but not magical.
3. Do not silently replace PRD numbers with cleaner or greener values.
4. If a second machine has already edited the workspace, reconcile before making broad CSS or component changes.

## Handoff Checklist

Before ending a session:

1. **Overwrite `docs/handoff/latest.md`** with the current session state — what changed, what improved, what still needs refinement, and the exact execution tasks for next session. This is mandatory after every pass.
2. Run `npm run screenshot` — captures all 3 dashboard states into `screenshots/`.
3. Run `npm run build` to verify the build is clean (output goes to `dist/`, which is gitignored).
4. Note any assumptions or substitutions in `README.md`.
5. Update this SOP if the pickup sequence changes.
6. Leave the workspace in a state where a new machine can run `npm install` and `npm run dev` without extra context.
