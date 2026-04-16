# Canopy Management — Executive Operating Screen

Local React/Vite prototype for the Canopy Management wall-mounted CEO dashboard.

---

## If you are an agent picking this up

Read these two files first, in order:

1. `docs/handoff/latest.md` — current project state, what changed, what to do next, full repo structure
2. `docs/HANDOFF-SOP.md` — pickup checklist, branch model, release workflow, safe editing rules

Do not touch code until you have read both.

---

## Branch Model

| Branch | Purpose |
|---|---|
| `staging` | Active development. All changes go here first. |
| `prod` | Deployment branch. GitHub Pages deploys from here. Only receives promoted commits from `staging`. |

**Always work on `staging`. Never commit directly to `prod`.**

---

## Release Workflow

1. Make changes on `staging`
2. Run `npm run screenshot` and visually verify all 3 states
3. Share preview via Cloudflare tunnel for stakeholder approval (see below)
4. Once approved, promote the exact tested commit to `prod`:

```bash
git checkout prod
git merge --ff-only staging
git push origin prod
git checkout staging
```

GitHub Actions will deploy to GitHub Pages automatically on push to `prod`.

---

## Quick Start

```bash
git checkout staging
npm install
npm run dev
```

Open `http://localhost:5173/`

## Stakeholder Preview (Cloudflare Tunnel)

With dev server running:

```bash
cloudflared tunnel --url http://localhost:5173
```

Prints a public `https://*.trycloudflare.com` URL within ~5 seconds. Share this for review.

## Capture All Dashboard States (run every session)

```bash
npm run screenshot
```

Requires dev server running. Saves to `screenshots/`:

| File | State |
|---|---|
| `canopy-dashboard-home.png` | M1 Margin — canonical |
| `canopy-dashboard-state-revenue.png` | M2 Revenue tab |
| `canopy-dashboard-state-ai.png` | M3 AI tab |
| `canopy-dashboard-verification-strip.png` | Side-by-side review strip |

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

## Notes

- Layout and box mapping follow `design/wireframe-prototype.html` exactly
- Metric values follow the Google Doc PRD — do not substitute cleaner or greener numbers
- This workspace lives in Google Drive — always follow the sync-drift SOP before editing from a second machine
- `canopy-exec-dash-prt/` is the old deploy folder — it is gitignored and will be retired once GitHub Pages is wired to the `prod` branch of this repo
