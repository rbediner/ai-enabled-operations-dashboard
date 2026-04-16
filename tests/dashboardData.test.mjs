import test from 'node:test';
import assert from 'node:assert/strict';

import { centerViews, rightRailMetrics, statusCards } from '../src/data/dashboardData.js';

test('top status cards stay numeric-first', () => {
  assert.deepEqual(
    statusCards.map(({ label, value }) => ({ label, value })),
    [
      { label: 'Pipeline Cov', value: '2.8x' },
      { label: 'Margin Gap', value: '-5.8 pts' },
      { label: 'Client Friction', value: '18 pts' },
      { label: 'Cash Conv', value: '91%' },
    ],
  );
});

test('each center tab has a complete quantified hero state', () => {
  for (const [tabId, view] of Object.entries(centerViews)) {
    assert.ok(view.modeLabel, `${tabId} is missing a mode label`);
    assert.ok(view.hero.label, `${tabId} is missing a hero label`);
    assert.ok(view.hero.valueDisplay, `${tabId} is missing a hero value`);
    assert.ok(view.hero.targetDisplay, `${tabId} is missing a hero target`);
    assert.ok(view.hero.gapDisplay, `${tabId} is missing a hero gap`);
    assert.ok(view.hero.trendDisplay, `${tabId} is missing a hero trend`);
    assert.match(view.hero.driverDisplay, /[-+0-9$%]/, `${tabId} driver must be quantified`);
    assert.ok(view.controls.display.label, `${tabId} is missing a control label`);
    assert.ok(view.controls.display.value, `${tabId} is missing a control value`);
  }
});

test('client friction outranks generic cycle-time drift on the right rail', () => {
  const cycleTime = rightRailMetrics.find((item) => item.id === 'R2');
  const clientRisk = rightRailMetrics.find((item) => item.id === 'R4');

  assert.equal(cycleTime?.state, 'yellow');
  assert.equal(clientRisk?.state, 'red');
  assert.equal(clientRisk?.label, 'Client Friction');
});
