# Canopy Dashboard — Handoff SOP

This project lives in a Google Drive synced folder and is version-controlled with Git.
Follow this SOP whenever picking up work from another machine or another agent.

---

## Branch Model

| Branch | Purpose |
|---|---|
| `staging` | Active development. All changes committed here first. |
| `prod` | Deploy branch. GitHub Pages deploys from here. Fast-forward only from `staging`. |

**Rule: Never commit directly to `prod`. Always develop on `staging`, verify, then promote.**

---

## Cross-Machine Pickup SOP

When a new machine or agent takes over:

1. Read `docs/handoff/latest.md` — current state, what changed, what to do next
2. Read this SOP
3. Read `README.md`
4. Wait for Google Drive to finish syncing before editing
5. Run:

```bash
git checkout staging
git pull origin staging
npm install
npm run dev
```

6. Open `http://localhost:5173/` and confirm the dashboard loads correctly
7. Confirm the box map is intact: `T1-T6`, `D1-D4`, `C1-C3`, `M1-M3`, `H1-H4`, `O1-O3`, `R1-R4`, `B1-B11`
8. Check local branch matches the head commit in `docs/handoff/latest.md` before making any changes

---

## Release Workflow (staging → prod)

1. Develop and commit on `staging`
2. Run `npm run screenshot` — verify all 3 states look correct
3. Share staging preview via Cloudflare tunnel for approval:
   ```bash
   cloudflared tunnel --url http://localhost:5173
   ```
4. Once visually approved, promote to `prod` (fast-forward only):
   ```bash
   git checkout prod
   git merge --ff-only staging
   git push origin prod
   git checkout staging
   ```
5. GitHub Actions deploys to GitHub Pages automatically on push to `prod`
6. Overwrite `docs/handoff/latest.md` with the current session state

**Do not promote a commit to `prod` that has not been visually verified on staging.**

---

## Handoff Checklist (end of every session)

1. **Overwrite `docs/handoff/latest.md`** — what changed, what still needs work, what to do next. Mandatory after every session.
2. Run `npm run screenshot` — all 3 states + verification strip must be captured
3. Run `npm run test:unit` and `npm run test:qa` — both must pass
4. Commit everything to `staging`
5. If approved for release: promote to `prod` using the workflow above
6. Leave `staging` as the active branch with a clean working tree

---

## Google Drive Sync-Drift SOP

Before editing on any machine:

1. Wait for Google Drive desktop sync to finish
2. Confirm expected folders exist: `src`, `public`, `design`, `scripts`, `screenshots`, `docs`, `tests`
3. There should be no `dist/` or `assets/` folder — both are excluded
4. Run `git status` to confirm your working tree is clean and on `staging`
5. Open the app with `npm run dev` before making structural edits — catches partial sync states fast

If sync drift is suspected:
1. Stop editing
2. Let Drive finish syncing on both machines
3. Run `git log --oneline -5` and compare against `docs/handoff/latest.md` head commit
4. Only resume after the workspace is consistent

---

## Current Publishing Status

| Layer | Location | Status |
|---|---|---|
| Local preview | `npm run dev` → `http://localhost:5173/` | Ready |
| Stakeholder preview | `cloudflared tunnel --url http://localhost:5173` | On demand |
| Production build | `npm run build && npm run preview` | Ready |
| GitHub Pages (prod) | Deploys from `prod` branch via GitHub Actions | Pending remote setup |

### Remote Setup (one-time, not yet done)
To connect to GitHub and enable GitHub Pages deployment:
1. Create a new repo at github.com (e.g. `rbediner/canopy-exec-dashboard`)
2. Add remote: `git remote add origin git@github.com:rbediner/canopy-exec-dashboard.git`
3. Push both branches: `git push -u origin staging && git push origin prod`
4. In GitHub repo settings: enable Pages, set source to `prod` branch, root `/`
5. Add a GitHub Actions workflow at `.github/workflows/deploy-pages.yml` to build and deploy on push to `prod`
6. Once live, retire `canopy-exec-dash-prt/` — it is no longer needed

---

## Current Implementation Layout

See `docs/handoff/latest.md` → **Repo Structure** section for the full file tree.

Key paths:
- `src/App.jsx` — overall 16:9 screen composition
- `src/data/dashboardData.js` — all metric values and labels
- `src/components/` — purpose-built dashboard components
- `src/styles.css` — complete V2.7 design system
- `public/canopy-logo.svg` — single source of truth for the logo
- `design/wireframe-prototype.html` — layout reference
- `design/exec-dashboard-prd.gdoc` — PRD shortcut
- `scripts/capture-dashboard-screenshots.mjs` — Puppeteer screenshot + verification strip script
- `scripts/verify-dashboard.mjs` — dashboard QA verification script
- `tests/dashboardData.test.mjs` — unit tests for dashboard data
- `screenshots/` — captured dashboard states for review

---

## Safe Editing Rules

1. Preserve the wireframe hierarchy and tile mapping exactly
2. Keep the PRD metric story intact: demand solid, some stall, forecast under, margin below target but improving, capacity strained, AI rising but not magical
3. Do not substitute PRD numbers with cleaner or greener values
4. If a second machine has already committed to `staging`, pull before making changes
5. If a local file conflicts with the PRD, the PRD wins

---

## Source of Truth

1. **Product:** Google Doc PRD — `https://docs.google.com/document/d/14-eyti0nHkSi2bvVVovCS7WaUSIfHoT5f6SuoPC-eZg/edit`
2. **Layout:** `design/wireframe-prototype.html`
3. **Current state:** `docs/handoff/latest.md`

If any source conflicts with another, priority is: PRD > handoff doc > code.
