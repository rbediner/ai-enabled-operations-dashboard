# Canopy Management — Executive Operating Screen

Local React/Vite prototype for the Canopy Management wall-mounted CEO dashboard.

---

## If you are an agent picking this up

Read these two files first, in order:

1. `docs/handoff/latest.md` — current project state, what changed, what to do next, full repo structure
2. `docs/HANDOFF-SOP.md` — pickup checklist, sync-drift procedure, safe editing rules

Do not touch code until you have read both.

---

## Quick Start

```bash
npm install
npm run dev
```

Open `http://localhost:5173/`

## Production Build

```bash
npm run build
npm run preview
```

## Capture All Dashboard States (run every session)

```bash
npm run screenshot
```

Requires the dev server to be running. Saves 3 screenshots to `screenshots/`:

| File | State |
|---|---|
| `canopy-dashboard-home.png` | M1 Margin — canonical |
| `canopy-dashboard-state-revenue.png` | M2 Revenue tab |
| `canopy-dashboard-state-ai.png` | M3 AI tab |

---

## Notes

- Layout and box mapping follow `design/wireframe-prototype.html` exactly
- Metric values follow the Google Doc PRD — do not substitute cleaner or greener numbers
- This workspace lives in Google Drive — always follow the sync-drift SOP before editing from a second machine
