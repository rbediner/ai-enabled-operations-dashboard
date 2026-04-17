# Canopy Dashboard Handoff
**Session date:** 2026-04-17

## Status
- **Release complete.** `staging` and `prod` are both at `3a4852b` and GitHub Pages is serving the build at `https://rbediner.github.io/canopy-exec-dashboard/`.
- Docs-only follow-up (this update) refreshes README / HANDOFF-SOP / this file. After committing, promote docs to `prod` following the standard workflow and monitor the Pages deploy to green per SOP.

## What Shipped This Session
- **Back-face overflow fix.** Rail and control-tile back faces now render a single wrapped phrase (value only, no status line) at 14px with a 3-line clamp. No more clipped text on any flipped tile.
- **Passive-mode tab auto-cycle.** Center lens tabs (Margin → Revenue → AI) auto-cycle every 30s. Manual tab clicks pause auto-cycle for 90s. Auto-cycle is suppressed while B11 presentation mode is active.
- **Legibility pass.** Larger tab pills with rounded interactive treatment, bumped status-badge label/value typography (10px/22px), bumped hero eyebrow/title/support text, and baseline bumps on rail and control-tile labels and status text.
- **Centered viewport + 16:9 aspect lock.** `.app-shell` centers a fixed 1920×1080 `.screen-frame`; frame is uniformly scaled by a JS-computed `--dash-scale` CSS variable recomputed on `resize` and `fullscreenchange`.
- **In-frame fullscreen toggle.** New 4th column in the top status bar (44px icon tile) drives `document.documentElement.requestFullscreen()` / `exitFullscreen()` and mirrors state via a `fullscreenchange` listener. Button no longer overlaps T6.
- **Release-monitoring SOP.** Added a mandatory monitor-to-green step in `docs/HANDOFF-SOP.md` Release Workflow — no release is reported complete until the Pages Action run finishes `success`.
- **`.gdoc` preservation rule.** Added a hard rule (for all agents, not just Claude) to README.md and HANDOFF-SOP.md Safe Editing Rules: never delete, move, rename, or overwrite any `.gdoc` file.

## Current Branch / Head
- `staging`: `3a4852b` (plus the docs commit from this session once pushed)
- `prod`: `3a4852b` (fast-forwarded and deployed)
- Source repo: `https://github.com/rbediner/canopy-exec-dashboard`
- Live site: `https://rbediner.github.io/canopy-exec-dashboard/`

## Cloudflare Preview Path
- Local app: `http://127.0.0.1:5173/`
- Stakeholder tunnel: run `npm run dev` + `npm run tunnel` to regenerate a `https://...trycloudflare.com` URL on demand.

## Production Release Status
- Pages deploy from the last promotion (`3a4852b`) ran green.
- On the next docs promotion, monitor with `gh run watch <run-id> --repo rbediner/canopy-exec-dashboard --exit-status` before reporting done.

## Exact Next Step
- Commit the docs refresh on `staging`, push, fast-forward `prod`, push, then monitor the Pages deploy to green per SOP.
