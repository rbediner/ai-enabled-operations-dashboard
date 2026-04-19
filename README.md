# AI-Enabled Operations Dashboard

React/Vite prototype of a wall-mounted executive operations dashboard. Designed to run full-time on a 16:9 TV, with a fixed 1920×1080 canvas that scales uniformly to any viewport.

Free to fork, rebrand, and deploy. Swap the tile values in `src/data/dashboardData.js` to match your own business.

---

## If you are an agent picking this up

Read these three files first, in order:

1. `docs/handoff/latest.md` — current project state, what changed, what to do next
2. `docs/HANDOFF-SOP.md` — pickup checklist, branch model, release workflow, safe editing rules
3. `docs/PRD.md` — as-built product spec (tile map, live behavior, acceptance criteria)

Do not touch code until you have read all three.

### Hard rule for ALL agents: NEVER delete Google Doc (`.gdoc`) files

Files ending in `.gdoc` (e.g. any `design/*.gdoc`) are Google Drive shortcut files that point to canonical source-of-truth documents (PRDs, design briefs). They are tiny pointers, not the real content — if deleted, the link to the authoritative doc is lost and `git` cannot meaningfully recover it.

- Never run `rm`, `git rm`, or overwrite any path ending in `.gdoc`.
- Never rename or move a `.gdoc` file without explicit user approval.
- When cleaning untracked files (`git clean`, etc.), exclude `*.gdoc`.
- If a `.gdoc` file appears in the way of a restructure, stop and ask the user.

This rule applies to every agent and every session. No exceptions.

---

## Branch Model

| Branch | Purpose |
|---|---|
| `staging` | Active development branch. Use this for local work and Cloudflare-based stakeholder review. |
| `prod` | Release branch. Only promoted commits from `staging` land here. GitHub Pages deploys this branch as the eventual live site. |

**Always work on `staging`. Never commit directly to `prod`.**

---

## Release Workflow

1. Make changes on `staging`
2. Run `npm run screenshot` and visually verify all 3 states
3. Start the local dev server and share a Cloudflare tunnel for stakeholder review:

```bash
npm run dev
npm run tunnel
```

4. Once approved, promote the exact tested commit to `prod`:

```bash
git checkout prod
git merge --ff-only staging
git push origin prod
git checkout staging
```

5. GitHub Actions will deploy `prod` to GitHub Pages automatically.

---

## Quick Start

```bash
git checkout staging
npm install
npm run dev
```

Open `http://localhost:5173/`

## Stakeholder Preview

Run the local dev server and share a Cloudflare tunnel:

```bash
npm run dev
npm run tunnel
```

When `cloudflared` starts, copy the generated `https://...trycloudflare.com` URL and use that exact link for staging review.

## Capture All Dashboard States (run every session)

```bash
npm run screenshot
```

Requires dev server running. Saves to `screenshots/`:

| File | State |
|---|---|
| `dashboard-home.png` | M1 Margin — canonical |
| `dashboard-state-revenue.png` | M2 Revenue tab |
| `dashboard-state-ai.png` | M3 AI tab |
| `dashboard-verification-strip.png` | Side-by-side review strip |

## Tests

```bash
npm run test:unit   # unit tests for dashboardData
npm run test:qa     # dashboard verification script
```

## Production Build

```bash
npm run build       # outputs to dist/ (gitignored)
npm run preview     # serve the build locally
```

---

## Current Dashboard Capabilities

- Fixed 1920×1080 (16:9) frame, uniformly scaled via a JS-computed `--dash-scale` CSS variable so the whole dashboard grows/shrinks together and stays centered in any viewport
- Fullscreen toggle lives in the top status bar (4th column, next to the status badges); uses the browser Fullscreen API and letterboxes on non-16:9 displays
- Center lens tabs (Margin / Revenue / AI) auto-cycle every 30s in passive wall mode; manual tab clicks pause auto-cycle for 90s; auto-cycle is suppressed while B11 presentation mode is active
- Legibility pass: larger tab pills with rounded interactive treatment, bumped status-badge and hero typography, rail/control-tile back faces reduced to a single wrapped phrase with a 3-line clamp so no text overflows

## Notes

- Layout and box mapping follow `design/wireframe-prototype.html` exactly
- Canonical tile values live in `src/data/dashboardData.js` — swap them for your own business
- Cloudflare tunnel (`npm run tunnel`) is the easiest way to share a live preview
- **Never delete, move, rename, or overwrite any `.gdoc` file** — see the agent rule at the top of this README
