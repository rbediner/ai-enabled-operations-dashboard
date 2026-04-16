# Canopy Dashboard — Cloudflare Review Workflow Handoff
**Session date:** 2026-04-16  
**Session type:** Repo cleanup + Cloudflare review workflow alignment

---

## What Changed

### 1. Main project is now the source-of-truth git repo
The project root is the real repo now, with both branches pushed upstream:

- Source repo: `https://github.com/rbediner/canopy-exec-dashboard`
- Branches: `staging` and `prod`
- Local `origin` now points at the source repo
- `staging` tracks `origin/staging`
- `prod` tracks `origin/prod`

### 2. Stakeholder review now uses Cloudflare tunnel
Review the `staging` branch from your local machine with:

```bash
npm run dev
cloudflared tunnel --url http://localhost:5173
```

This removes the need for a separate preview deployment target.

### 3. GitHub Actions now only handle production Pages deployment
- `.github/workflows/deploy-pages.yml`
  - runs on pushes to `prod`
  - builds the app
  - deploys to GitHub Pages from the source repo

### 4. Project docs were rewritten to match the real workflow
Updated:
- `README.md`
- `docs/HANDOFF-SOP.md`
- this file

---

## Repo Structure

```text
Canopy Management/
├── .github/
│   └── workflows/
│       └── deploy-pages.yml
├── design/
├── docs/
│   ├── HANDOFF-SOP.md
│   └── handoff/latest.md
├── public/
├── scripts/
├── screenshots/
├── src/
├── tests/
├── README.md
├── index.html
├── package.json
└── vite.config.js
```

The old nested preview folder has been removed from disk. It is not part of the long-term repo structure.

---

## Verification Completed

- Confirmed the main repo is a valid git repo
- Confirmed `staging` and `prod` both exist and are pushed upstream
- Confirmed the source repo exists upstream
- Confirmed docs and workflows now match the Cloudflare review model

---

## Files Changed This Pass

- `.gitignore`
- `.github/workflows/deploy-pages.yml`
- `README.md`
- `docs/HANDOFF-SOP.md`
- `docs/handoff/latest.md`

---

## Remaining Issues

1. The old nested preview folder has been removed from disk; do not recreate it.
2. There are unrelated uncommitted dashboard implementation changes currently on `staging`; do not overwrite or discard them accidentally.

---

## Next Session Guidance

Do not continue using a nested repo inside the project folder.

From here forward:
1. Work only in the main repo at the project root.
2. Make all changes on `staging`.
3. Use Cloudflare tunnel for stakeholder preview while running `npm run dev`.
4. Promote approved commits to `prod` with `git merge --ff-only staging`.
5. Use the source repo Pages deployment for the live branch.
