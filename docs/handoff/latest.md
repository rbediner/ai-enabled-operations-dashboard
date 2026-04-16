# Canopy Dashboard Handoff
**Session date:** 2026-04-16

## What Changed
- Fixed flip back-face text overflow: shortened four overly long back-face strings (D4, R2, R4, B7) and tightened back-face typography (16px value, 9px status) with ellipsis clamping so no back-face content can overflow tile bounds.
- Added passive-wall-mode auto-cycle for the center lens tabs (Margin → Revenue → AI → Margin) at a 30-second interval. Manual tab clicks still work and now pause auto-cycle for 90 seconds before it resumes. Auto-cycle is suppressed while presentation mode is active.

## Current Branch / Head
- Branch: `staging` (fix commit pushed)
- Branch: `prod` (fast-forwarded from staging and pushed)
- See latest commit hashes via `git log --oneline -3` on each branch.

## Cloudflare Preview Path
- Local app: `http://127.0.0.1:5173/`
- Stakeholder tunnel: run `npm run dev` + `npm run tunnel` to regenerate a `https://...trycloudflare.com` URL on demand.

## Production Release Status
- `prod` has been fast-forwarded from the verified `staging` commit and pushed.
- GitHub Actions Pages workflow deploys from `prod` on push.

## Exact Next Step
- Release complete. Confirm the GitHub Pages deploy succeeded for the new `prod` head in the source repo Actions tab.
