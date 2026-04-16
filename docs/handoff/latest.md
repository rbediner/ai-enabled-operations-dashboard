# Canopy Dashboard Handoff
**Session date:** 2026-04-16

## What Changed
- Implemented the staged live interaction layer for approved tiles only.
- Added manual and sparse auto-flip behavior for eligible secondary tiles only: `D1`, `D2`, `D4`, `R2`, `R3`, `R4`, `B7`, `B8`, `B9`.
- Added the tiny static top-right flip affordance on eligible tiles only.
- Added presentation mode on `B11` to suppress flip behavior and non-essential micro-motion.
- Tightened cadence handling so one visible update happens per 4-second slot, with override throttling in the live model.
- Updated targeted unit and browser verification for flip eligibility, cadence isolation, and presentation mode.

## Current Branch / Head
- Branch: `staging`
- Implementation commit: `91be2f5` (`Implement live tile flips and presentation mode`)

## Cloudflare Preview Path
- Local app: `http://127.0.0.1:5173/`
- Active review tunnel: `https://david-museums-archives-device.trycloudflare.com`

## Exact Next Step
- Review the staging tunnel URL above and approve or request changes before any `staging` to `prod` promotion.
