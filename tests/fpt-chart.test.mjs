import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { isForecastCurrent, parseChartSummary } from '../src/utils/fpt-chart.mjs';

const summary = {
  source_session: '2026-10-16', updated_at: '2026-10-16T10:00:00Z',
  last_close: 58200, change: 200, change_percent: 200 / 58000 * 100,
  forecast: { target_session: '2026-10-19', issued_at: '2026-10-16T10:00:00Z',
    expires_at: '2026-10-19T08:00:00Z', direction: 'not_up' },
  performance: { correct: 0, incorrect: 0, pending: 1, unscorable: 0 },
};

test('only accepts the public result contract, with no history or model fields', () => {
  assert.deepEqual(parseChartSummary(summary), summary);
  assert.equal(parseChartSummary({ ...summary, forecast: null }).forecast, null);
  for (const invalid of [null, [], { ...summary, prices: [58200] }, { ...summary, last_close: NaN },
    { ...summary, source_session: '2026-02-30' }, { ...summary, updated_at: '2026-10-16T10:00:00' },
    { ...summary, forecast: { ...summary.forecast, direction: 'down' } },
    { ...summary, forecast: { ...summary.forecast, target_session: summary.source_session } },
    { ...summary, forecast: { ...summary.forecast, probability: .49 } },
    { ...summary, forecast: { ...summary.forecast, expires_at: summary.forecast.issued_at } }]) {
    assert.throws(() => parseChartSummary(invalid));
  }
});

test('performance contains only four nonnegative whole-number totals', () => {
  assert.deepEqual(parseChartSummary({ ...summary,
    performance: { correct: 12, incorrect: 8, pending: 1, unscorable: 2 },
  }).performance, { correct: 12, incorrect: 8, pending: 1, unscorable: 2 });
  for (const performance of [null, [], undefined, { ...summary.performance, correct: -1 },
    { ...summary.performance, incorrect: .5 }, { ...summary.performance, pending: '1' },
    { ...summary.performance, unscorable: NaN }, { ...summary.performance, correct: Number.MAX_SAFE_INTEGER + 1 },
    { ...summary.performance, predictions: [] }]) {
    assert.throws(() => parseChartSummary({ ...summary, performance }));
  }
});

test('forecast is valid across the weekend and expires exactly at target session close', () => {
  assert.equal(isForecastCurrent(summary.forecast, Date.parse('2026-10-18T12:00:00Z')), true);
  assert.equal(isForecastCurrent(summary.forecast, Date.parse('2026-10-19T07:59:59.999Z')), true);
  assert.equal(isForecastCurrent(summary.forecast, Date.parse('2026-10-19T08:00:00Z')), false);
  assert.equal(isForecastCurrent(summary.forecast, Date.parse('2026-10-16T09:59:59Z')), false);
  assert.equal(isForecastCurrent(null), false);
});

test('home places the chart before latest posts and keeps the exact requested note', () => {
  const home = readFileSync(new URL('../src/pages/index.astro', import.meta.url), 'utf8');
  const component = readFileSync(new URL('../src/components/FptChart.astro', import.meta.url), 'utf8');
  assert.ok(home.indexOf('<FptChart />') < home.indexOf('title={site.pages.home.latestPostsTitle}'));
  assert.ok(component.includes('Model được CI/CD liên tục bằng Github Action, train trên Kaggle, dữ liệu thu thập cá nhân'));
});
