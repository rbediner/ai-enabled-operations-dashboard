/**
 * Headless QA verification for the Canopy dashboard.
 *
 * This checks the live implementation rather than trusting static screenshots:
 * - top-right badges are numeric-first
 * - each tab changes the center hero and T2 mode label
 * - the hero driver is quantified
 * - no obvious overflow is detected in the inspected key surfaces
 */

import assert from 'node:assert/strict';
import puppeteer from 'puppeteer';

const URL = 'http://localhost:5173/';
const VIEWPORT = { width: 1920, height: 1080, deviceScaleFactor: 1 };

const expectedByTab = {
  Margin: {
    mode: 'Margin Review',
    heroLabel: 'Operating Margin',
    heroValue: '18.2%',
    target: '24.0%',
    gap: '-5.8 pts',
    trend: '+1.4 pts MoM',
    driver: 'Capacity deficit -9%',
  },
  Revenue: {
    mode: 'Revenue Review',
    heroLabel: 'Revenue Forecast',
    heroValue: '$612K',
    target: '$650K',
    gap: '-$38K',
    trend: '+$24K MoM',
    driver: 'Conversion gap -6 pts',
  },
  AI: {
    mode: 'AI Review',
    heroLabel: 'AI Leverage',
    heroValue: '37%',
    target: '48%',
    gap: '-11 pts',
    trend: '+5 pts QoQ',
    driver: 'Adoption delta -11 pts',
  },
};

async function settle(ms = 350) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

async function clickTab(page, label) {
  await page.evaluate((text) => {
    document.querySelectorAll('.view-tabs__tab').forEach((tab) => {
      if (tab.querySelector('.view-tabs__label')?.textContent?.trim() === text) {
        tab.click();
      }
    });
  }, label);
  await settle();
}

async function readState(page) {
  return page.evaluate(() => {
    const text = (selector) => document.querySelector(selector)?.textContent?.trim() ?? '';
    const rows = Array.from(document.querySelectorAll('.hero-dial__context-row'));
    const rowValue = (label) => {
      const row = rows.find((item) => item.querySelector('.hero-dial__ctx-label')?.textContent?.trim() === label);
      return row?.querySelector('.hero-dial__ctx-value')?.textContent?.trim() ?? '';
    };
    const overflows = Array.from(document.querySelectorAll(
      '.hero-dial__support, .hero-dial__value, .hero-dial__ctx-value, .status-badge__label, .status-badge__value'
    ))
      .filter((node) => node.scrollWidth > node.clientWidth || node.scrollHeight > node.clientHeight)
      .map((node) => node.textContent?.trim())
      .filter(Boolean);

    return {
      mode: text('.freshness-panel__mode'),
      heroLabel: text('.hero-dial__label'),
      heroValue: text('.hero-dial__value'),
      target: rowValue('Target'),
      gap: rowValue('Gap'),
      trend: rowValue('Trend'),
      driver: rowValue('Driver'),
      statusCards: Array.from(document.querySelectorAll('.status-badge')).map((card) => ({
        label: card.querySelector('.status-badge__label')?.textContent?.trim() ?? '',
        value: card.querySelector('.status-badge__value')?.textContent?.trim() ?? '',
      })),
      overflows,
    };
  });
}

const browser = await puppeteer.launch({
  headless: true,
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
});

try {
  const page = await browser.newPage();
  await page.setViewport(VIEWPORT);
  await page.goto(URL, { waitUntil: 'networkidle0' });
  await settle(800);

  const statusCards = await page.evaluate(() =>
    Array.from(document.querySelectorAll('.status-badge')).map((card) => ({
      label: card.querySelector('.status-badge__label')?.textContent?.trim() ?? '',
      value: card.querySelector('.status-badge__value')?.textContent?.trim() ?? '',
    }))
  );

  assert.deepEqual(statusCards, [
    { label: 'Pipeline Cov', value: '2.8x' },
    { label: 'Margin Gap', value: '-5.8 pts' },
    { label: 'Client Friction', value: '18 pts' },
    { label: 'Cash Conv', value: '91%' },
  ]);

  for (const [tab, expected] of Object.entries(expectedByTab)) {
    await clickTab(page, tab);
    const actual = await readState(page);

    assert.equal(actual.mode, expected.mode, `${tab}: T2 mode label mismatch`);
    assert.equal(actual.heroLabel, expected.heroLabel, `${tab}: hero title mismatch`);
    assert.equal(actual.heroValue, expected.heroValue, `${tab}: hero value mismatch`);
    assert.equal(actual.target, expected.target, `${tab}: hero target mismatch`);
    assert.equal(actual.gap, expected.gap, `${tab}: hero gap mismatch`);
    assert.equal(actual.trend, expected.trend, `${tab}: hero trend mismatch`);
    assert.equal(actual.driver, expected.driver, `${tab}: hero driver mismatch`);
    assert.match(actual.driver, /[-+0-9$%]/, `${tab}: hero driver is not quantified`);
    assert.equal(actual.overflows.length, 0, `${tab}: overflow detected in ${actual.overflows.join(', ')}`);
  }

  console.log('Dashboard QA verification passed for Margin, Revenue, and AI tabs.');
} finally {
  await browser.close();
}
