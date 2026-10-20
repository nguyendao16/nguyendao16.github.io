import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { test } from 'node:test';
import { chartGeometry, chartWindow, isForecastCurrent, isForecastVisible, outcomeColor, predictionOutcomes, parseChartSummary } from '../src/utils/fpt-chart.mjs';

const summary = {
  source_session: '2026-10-16', updated_at: '2026-10-16T10:00:00Z',
  last_close: 58200, change: 200, change_percent: 200 / 58000 * 100,
  forecast: { target_session: '2026-10-19', issued_at: '2026-10-16T10:00:00Z',
    expires_at: '2026-10-19T08:00:00Z', direction: 'not_up' },
  performance: { correct: 0, incorrect: 0, pending: 1, unscorable: 0 },
  history: Array.from({ length: 60 }, (_, index) => ({
    date: new Date(Date.parse('2026-08-18') + index * 86400000).toISOString().slice(0, 10),
    close: index === 59 ? 58200 : 58000 + index * 10,
  })),
};

test('only accepts the approved result contract, without extra model or dataset fields', () => {
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

test('public history is exactly 60 ordered unique date/close points ending at the source close', () => {
  const invalid = [undefined, null, [], summary.history.slice(1), [...summary.history, summary.history[59]],
    summary.history.map((point, i) => i === 20 ? { ...point, volume: 100 } : point),
    summary.history.map((point, i) => i === 20 ? { ...point, close: NaN } : point),
    summary.history.map((point, i) => i === 20 ? { ...point, close: '58000' } : point),
    summary.history.map((point, i) => i === 20 ? { ...point, close: 0 } : point),
    summary.history.map((point, i) => i === 20 ? { ...point, date: '2026-02-30' } : point),
    summary.history.map((point, i) => i === 20 ? { ...point, date: summary.history[19].date } : point),
    summary.history.map((point, i) => i === 59 ? { ...point, close: 58201 } : point),
    summary.history.map((point, i) => i === 59 ? { ...point, date: '2026-10-17' } : point),
    [...summary.history].reverse()];
  for (const history of invalid) assert.throws(() => parseChartSummary({ ...summary, history }));
  assert.deepEqual(parseChartSummary(JSON.parse(readFileSync(new URL('../public/fpt/summary.json', import.meta.url), 'utf8'))).history.length, 60);
  assert.deepEqual(readdirSync(new URL('../public/fpt/', import.meta.url)), ['summary.json']);
});

test('zoom and pan stay within the published 60 sessions, with at least five visible points', () => {
  assert.deepEqual(chartWindow(-100, 20), { start: 0, end: 20 });
  assert.deepEqual(chartWindow(100, 20), { start: 40, end: 60 });
  assert.deepEqual(chartWindow(0, 1000), { start: 0, end: 60 });
  assert.deepEqual(chartWindow(60, 0), { start: 55, end: 60 });
  assert.deepEqual(chartWindow(12.6, 10.3), { start: 13, end: 23 });
});

test('geometry uses raw closes and the last session color even when panned, with no forecast price', () => {
  for (const width of [342, 900]) {
    for (const [change, color] of [[200, '#16834a'], [-200, '#d33c43'], [0, '#75777d']]) {
      const geometry = chartGeometry({ ...summary, change }, width, chartWindow(0, 15));
      assert.equal(geometry.color, color);
      assert.deepEqual(geometry.points, summary.history.slice(0, 15));
      assert.equal(geometry.coordinates.length, 15);
      assert.ok(geometry.coordinates.every((point) => point.x >= geometry.left && point.x <= geometry.right
        && point.y >= geometry.top && point.y <= geometry.bottom));
      assert.ok(!geometry.line.includes('NaN'));
      assert.deepEqual(chartGeometry({ ...summary, change, forecast: null }, width, chartWindow(0, 15)).line, geometry.line);
    }
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

test('outcomes contain only ordered dates and statuses within the chart window and one pending target', () => {
  const outcomes = [{ date: summary.history[57].date, status: 'correct' },
    { date: summary.history[58].date, status: 'incorrect' },
    { date: summary.history[59].date, status: 'pending' },
    { date: summary.forecast.target_session, status: 'pending' }];
  const result = { ...summary, performance: { correct: 1, incorrect: 1, pending: 2, unscorable: 0 } };
  assert.deepEqual(parseChartSummary({ ...result, outcomes }).outcomes, outcomes);
  assert.deepEqual(predictionOutcomes(summary), [{ date: summary.forecast.target_session, status: 'pending' }]);
  assert.deepEqual(predictionOutcomes({ ...summary, forecast: null }), []);
  assert.deepEqual(predictionOutcomes({ ...summary, outcomes: [] }), []);
  assert.throws(() => parseChartSummary({ ...summary, outcomes }));
  for (const invalid of [null, undefined, {}, [null], [{ date: '2026-02-30', status: 'pending' }],
    [{ date: summary.source_session, status: 'unscorable' }],
    [{ date: summary.source_session, status: 'correct', probability: .6 }],
    [{ date: '1900-01-01', status: 'correct' }],
    [{ date: summary.forecast.target_session, status: 'incorrect' }],
    [...outcomes].reverse(), [outcomes[0], outcomes[0]],
    [...outcomes, { date: '2026-10-20', status: 'pending' }]]) {
    assert.throws(() => parseChartSummary({ ...result, outcomes: invalid }));
  }
});

test('result markers track actual closes through zoom/pan; pending remains after expiry without a price', () => {
  const outcomes = [{ date: summary.history[10].date, status: 'correct' },
    { date: summary.history[50].date, status: 'incorrect' },
    { date: summary.forecast.target_session, status: 'pending' }];
  const result = { ...summary, outcomes };
  for (const width of [342, 900]) {
    const geometry = chartGeometry(result, width, chartWindow(0, 60), true);
    const [correct, incorrect, pending] = geometry.markers;
    assert.deepEqual({ x: correct.x, y: correct.y }, geometry.coordinates[10]);
    assert.deepEqual({ x: incorrect.x, y: incorrect.y }, geometry.coordinates[50]);
    assert.equal(pending.rail, true);
    assert.equal(pending.x, geometry.endX);
    assert.equal(pending.y, geometry.endY);
    const expired = chartGeometry({ ...result, forecast: null }, width, chartWindow(0, 60));
    assert.equal(expired.markers.at(-1).status, 'pending');
    assert.equal(expired.markers.at(-1).rail, true);
    assert.equal(expired.markers.at(-1).x, (expired.right + expired.endX) / 2);
    assert.equal(expired.markers.at(-1).y, expired.top + 24);
    assert.equal('close' in pending, false);
    const panned = chartGeometry(result, width, chartWindow(0, 15));
    assert.deepEqual(panned.markers.map((marker) => marker.status), ['correct']);
    const recent = chartGeometry(result, width, chartWindow(45, 15));
    assert.deepEqual(recent.markers.map((marker) => marker.status), ['incorrect', 'pending']);
  }
  assert.equal(outcomeColor('correct'), '#16834a');
  assert.equal(outcomeColor('incorrect'), '#d33c43');
  assert.equal(outcomeColor('pending'), 'var(--color-ink-muted)');
});

test('forecast is valid across the weekend and expires exactly at target session close', () => {
  assert.equal(isForecastCurrent(summary.forecast, Date.parse('2026-10-18T12:00:00Z')), true);
  assert.equal(isForecastCurrent(summary.forecast, Date.parse('2026-10-19T07:59:59.999Z')), true);
  assert.equal(isForecastCurrent(summary.forecast, Date.parse('2026-10-19T08:00:00Z')), false);
  assert.equal(isForecastCurrent(summary.forecast, Date.parse('2026-10-16T09:59:59Z')), false);
  assert.equal(isForecastCurrent(null), false);
});

test('pending without a drawable forecast stays directly below its date label, outside the price plot', () => {
  const result = { ...summary, forecast: null, outcomes: [{ date: summary.forecast.target_session, status: 'pending' }] };
  for (const width of [342, 1024]) {
    const geometry = chartGeometry(result, width, chartWindow(0, 60), false);
    const pending = geometry.markers.find((marker) => marker.rail);
    assert.ok(pending);
    assert.equal(pending.x, (geometry.right + geometry.endX) / 2, 'Pending dot must align with its date label');
    assert.ok(pending.y > 29 && pending.y <= geometry.top + 30, 'Pending without a close belongs below the date, not halfway down the price plot');
  }
});

test('issued direction remains visible after close while pending, until a result replaces it', () => {
  const result = { ...summary, outcomes: [{ date: summary.forecast.target_session, status: 'pending' }] };
  const closed = Date.parse(summary.forecast.expires_at);
  assert.equal(isForecastVisible(result, closed - 1), true);
  assert.equal(isForecastCurrent(result.forecast, closed), false);
  assert.equal(isForecastVisible(result, closed), true);
  assert.equal(isForecastVisible(result, closed + 86400000), true);
  assert.equal(isForecastVisible({ ...result, outcomes: [] }, closed), false);
  assert.equal(isForecastVisible({ ...result, forecast: null }, closed), false);
  assert.equal(isForecastVisible(result, Date.parse(result.forecast.issued_at) - 1), false);
  assert.equal(isForecastVisible(summary, closed), true);
});

test('home places the chart before latest posts and keeps the model workflow note in English', () => {
  const home = readFileSync(new URL('../src/pages/index.astro', import.meta.url), 'utf8');
  const component = readFileSync(new URL('../src/components/FptChart.astro', import.meta.url), 'utf8');
  assert.ok(home.indexOf('<FptChart />') < home.indexOf('title={site.pages.home.latestPostsTitle}'));
  assert.ok(component.includes('The model uses continuous integration and deployment through GitHub Actions, training on Kaggle, and personally collected data.'));
});
