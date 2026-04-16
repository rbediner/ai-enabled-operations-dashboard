# Canopy Dashboard — Git Workflow Alignment Handoff
**Session date:** 2026-04-16  
**Session type:** Repo cleanup + branch/deploy model alignment

---

## What Changed

### 1. Main project is now the source-of-truth git repo
The project root is the real repo now, with both branches pushed upstream:

- Source repo: `https://github.com/rbediner/canopy-exec-dashboard`
- Branches: `staging` and `prod`
- Local `origin` now points at the source repo
- `staging` tracks `origin/staging`
- `prod` tracks `origin/prod`

### 2. The preview deployment is now documented as a separate publish target, not a nested codebase
The preview repo/page already exists and is the intended stakeholder-review target:

- Preview repo: `https://github.com/rbediner/canopy-exec-dash-prt`
- Preview page: `https://rbediner.github.io/canopy-exec-dash-prt/`

The old local folder `canopy-exec-dash-prt/` was only a temporary bootstrap path and should no longer be part of normal project work.

### 3. GitHub Actions workflows were added to match the agreed branch model
- `.github/workflows/deploy-preview.yml`
  - runs on pushes to `staging`
  - builds the app
  - publishes `dist/` to the preview repo
  - requires repo secret `PREVIEW_PUBLISH_TOKEN`
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
│       ├── deploy-pages.yml
│       └── deploy-preview.yml
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

The nested `canopy-exec-dash-prt/` folder should be deleted from disk after any needed artifact recovery. It is not part of the intended long-term repo structure.

---

## Verification Completed

- Confirmed the main repo is a valid git repo
- Confirmed `staging` and `prod` both exist and are pushed upstream
- Confirmed preview repo/page are live
- Confirmed the source repo exists upstream
- Confirmed docs previously pointed at an outdated Cloudflare-only preview model and were brought back into sync

---

## Files Changed This Pass

- `.gitignore`
- `.github/workflows/deploy-preview.yml`
- `.github/workflows/deploy-pages.yml`
- `README.md`
- `docs/HANDOFF-SOP.md`
- `docs/handoff/latest.md`

---

## Remaining Issues

1. `PREVIEW_PUBLISH_TOKEN` still needs to be added as a secret to `rbediner/canopy-exec-dashboard` before the staging preview workflow can publish automatically.
2. GitHub Pages still needs to be enabled in `rbediner/canopy-exec-dashboard` with build source set to `GitHub Actions`.
3. The local nested folder `canopy-exec-dash-prt/` should be removed from disk once everyone is comfortable that it is no longer needed.
4. There are unrelated uncommitted dashboard implementation changes currently on `staging`; do not overwrite or discard them accidentally.

---

## Next Session Guidance

Do not continue using a nested repo inside the project folder.

From here forward:
1. Work only in the main repo at the project root.
2. Make all changes on `staging`.
3. Push `staging` to publish the stakeholder preview once the preview token secret exists.
4. Promote approved commits to `prod` with `git merge --ff-only staging`.
5. Use the preview repo/page for review and the source repo Pages deployment for the live branch.
