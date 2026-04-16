/* All values locked to PRD or derived from the locked dashboard metrics.
   Keep the story stable: left demand, center truth, right delivery risk, bottom action. */

/* T3-T6: executive HUD.
   These are numeric-first by design so the payload is immediately scannable from across the room. */
export const statusCards = [
  { id: 'T3', label: 'Pipeline Cov',    value: '2.8x',     state: 'green' },
  { id: 'T4', label: 'Margin Gap',      value: '-5.8 pts', state: 'yellow' },
  { id: 'T5', label: 'Client Friction', value: '18 pts',   state: 'red' },
  { id: 'T6', label: 'Cash Conv',       value: '91%',      state: 'yellow' },
];

/* D1-D4 — Demand signals.
   Preserve the left-side weighting: Pipeline / Stalled / Forecast stay more important than the smaller signals. */
export const leftRailMetrics = [
  { id: 'D1', label: 'New Opps',  value: '18',     status: '+4 vs prior', state: 'green' },
  { id: 'D2', label: 'Pipeline',  value: '$1.84M', status: 'Weighted',    state: 'green' },
  { id: 'D3', label: 'Stalled',   value: '$420K',  status: 'At risk',     state: 'yellow' },
  { id: 'D4', label: 'Conv Rate', value: '34%',    status: '+2 pts',      state: 'green' },
];

/* C1-C3 — Commercial quality. */
export const leftStackMetrics = [
  {
    id: 'C1',
    label: 'Forecast',
    value: '$612K',
    context: 'Target $650K',
    status: '−$38K to plan',
    state: 'yellow',
  },
  {
    id: 'C2',
    label: 'Close Rate',
    value: '41%',
    context: 'This quarter',
    status: '+3 pts QoQ',
    state: 'green',
  },
  {
    id: 'C3',
    label: 'Avg Deal',
    value: '$28K',
    context: 'Last 30 days',
    status: 'Premium mix',
    state: 'green',
  },
];

/* H1-H4 — Center truth views.
   Each tab must drive a real center-state change, including hero title, value, target, gap, trend, driver, support signal,
   and the T2 operating mode label. */
export const centerViews = {
  M1: {
    id: 'M1',
    modeLabel: 'Margin Review',
    hero: {
      id: 'H1',
      label: 'Operating Margin',
      support: 'AI gain +14% offsets some capacity drag',
      value: 18.2,
      target: 24.0,
      valueDisplay: '18.2%',
      targetDisplay: '24.0%',
      gapDisplay: '-5.8 pts',
      trendDisplay: '+1.4 pts MoM',
      driverLabel: 'Driver',
      driverDisplay: 'Capacity deficit -9%',
      state: 'yellow',
    },
    controls: {
      minus: { id: 'H2', label: 'Lower Target' },
      display: { id: 'H3', label: 'Margin Target', value: '24.0%' },
      plus: { id: 'H4', label: 'Raise Target' },
    },
  },
  M2: {
    id: 'M2',
    modeLabel: 'Revenue Review',
    hero: {
      id: 'H1',
      label: 'Revenue Forecast',
      support: 'Pipeline cover 2.8x with $420K still stalled',
      value: 612,
      target: 650,
      valueDisplay: '$612K',
      targetDisplay: '$650K',
      gapDisplay: '-$38K',
      trendDisplay: '+$24K MoM',
      driverLabel: 'Driver',
      driverDisplay: 'Conversion gap -6 pts',
      state: 'yellow',
    },
    controls: {
      minus: { id: 'H2', label: 'Lower Target' },
      display: { id: 'H3', label: 'Revenue Target', value: '$650K' },
      plus: { id: 'H4', label: 'Raise Target' },
    },
  },
  M3: {
    id: 'M3',
    modeLabel: 'AI Review',
    hero: {
      id: 'H1',
      label: 'AI Leverage',
      support: 'AGI / FTE +14% with cycle time still lagging 0.6d',
      value: 37,
      target: 48,
      valueDisplay: '37%',
      targetDisplay: '48%',
      gapDisplay: '-11 pts',
      trendDisplay: '+5 pts QoQ',
      driverLabel: 'Driver',
      driverDisplay: 'Adoption delta -11 pts',
      state: 'green',
    },
    controls: {
      minus: { id: 'H2', label: 'Lower Target' },
      display: { id: 'H3', label: 'AI Target', value: '48%' },
      plus: { id: 'H4', label: 'Raise Target' },
    },
  },
};

/* O1-O3 — Delivery health.
   AI is now framed as operating leverage, not an isolated innovation metric. */
export const rightStackMetrics = [
  {
    id: 'O1',
    label: 'Utilization',
    value: '78%',
    context: 'Efficiency band',
    status: 'On target',
    state: 'green',
  },
  {
    id: 'O2',
    label: 'AGI / FTE',
    value: '$18.6K',
    context: 'Monthly AGI',
    status: 'AI lift +14%',
    state: 'green',
  },
  {
    id: 'O3',
    label: 'Onboarding',
    value: '9.5d',
    context: 'Days to milestone',
    status: 'Client friction ↑',
    state: 'yellow',
  },
];

/* R1-R4 — Risk signals.
   R4 is intentionally elevated above R2 because customer friction now reads as a direct profitability threat. */
export const rightRailMetrics = [
  { id: 'R1', label: 'Capacity',        value: '−9%',     status: 'Overload',           state: 'red' },
  { id: 'R2', label: 'Cycle Time',      value: '4.8d',    status: 'Slipping',           state: 'yellow' },
  { id: 'R3', label: 'AI Gain',         value: '+14%',    status: 'AGI / FTE lift',     state: 'green' },
  { id: 'R4', label: 'Client Friction', value: '18 pts',  status: 'Escalating',         state: 'red' },
];

/* Bottom strip: what targets matter and what should happen now. */
export const bottomStrip = {
  nav: [
    { id: 'B1', label: 'Home', icon: 'home' },
    { id: 'B2', label: 'Back', icon: 'back' },
  ],
  left: [
    { id: 'B3', label: 'Rev Target', value: '$650K', state: 'slate' },
    { id: 'B4', label: 'Cash Conv',  value: '91%',   state: 'yellow' },
    { id: 'B5', label: 'Rocks On Tk', value: '7 / 9', state: 'yellow' },
  ],
  focus: {
    id: 'B6',
    label: 'Focus Now',
    value: 'Margin + Capacity',
    subtext: '3 priority actions',
    state: 'alert',
  },
  right: [
    { id: 'B7', label: 'AI Gain',      value: '+14%', state: 'green' },
    { id: 'B8', label: 'SLA Met',      value: '93%',  state: 'green' },
    { id: 'B9', label: 'Escalations',  value: '4',    state: 'yellow' },
  ],
  util: [
    { id: 'B10', label: 'Alerts', icon: 'alerts' },
    { id: 'B11', label: 'Present', icon: 'screen' },
  ],
};

export const lensTabs = [
  { id: 'M1', label: 'Margin',  accent: 'yellow' },
  { id: 'M2', label: 'Revenue', accent: 'cyan' },
  { id: 'M3', label: 'AI',      accent: 'green' },
];
