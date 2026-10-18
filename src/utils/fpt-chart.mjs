/**
 * @typedef {{target_session: string, issued_at: string, expires_at: string, direction: 'up' | 'not_up'}} Forecast
 * @typedef {{correct: number, incorrect: number, pending: number, unscorable: number}} Performance
 * @typedef {{date: string, close: number}} PricePoint
 * @typedef {{source_session: string, updated_at: string, last_close: number, change: number, change_percent: number, forecast: Forecast | null, performance: Performance, history: PricePoint[]}} ChartSummary
 */

/** @param {unknown} value @returns {ChartSummary} */
export function parseChartSummary(value) {
  const date = (/** @type {unknown} */ input) => typeof input === 'string'
    && /^\d{4}-\d{2}-\d{2}$/.test(input)
    && Number.isFinite(Date.parse(input))
    && new Date(input).toISOString().slice(0, 10) === input;
  const instant = (/** @type {unknown} */ input) => typeof input === 'string'
    && /(?:Z|[+-]\d{2}:\d{2})$/.test(input) && Number.isFinite(Date.parse(input));
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Invalid FPT summary');
  const summary = /** @type {ChartSummary} */ (value);
  const keys = ['source_session', 'updated_at', 'last_close', 'change', 'change_percent', 'forecast', 'performance', 'history'];
  if (Object.keys(summary).length !== keys.length || Object.keys(summary).some((key) => !keys.includes(key))
    || !date(summary.source_session) || !instant(summary.updated_at)
    || ![summary.last_close, summary.change, summary.change_percent].every((number) => typeof number === 'number' && Number.isFinite(number))
    || summary.last_close <= 0) throw new Error('Invalid FPT summary');
  const forecast = summary.forecast;
  if (forecast !== null && (!forecast || typeof forecast !== 'object' || Array.isArray(forecast)
    || Object.keys(forecast).length !== 4
    || Object.keys(forecast).some((key) => !['target_session', 'issued_at', 'expires_at', 'direction'].includes(key))
    || !date(forecast.target_session) || forecast.target_session <= summary.source_session
    || !instant(forecast.issued_at) || !instant(forecast.expires_at)
    || Date.parse(forecast.issued_at) >= Date.parse(forecast.expires_at)
    || !['up', 'not_up'].includes(forecast.direction))) throw new Error('Invalid FPT forecast');
  const performance = summary.performance;
  const counts = ['correct', 'incorrect', 'pending', 'unscorable'];
  if (!performance || typeof performance !== 'object' || Array.isArray(performance)
    || Object.keys(performance).length !== counts.length
    || Object.keys(performance).some((key) => !counts.includes(key))
    || Object.values(performance).some((count) => !Number.isSafeInteger(count) || count < 0)) {
    throw new Error('Invalid FPT performance counts');
  }
  const history = summary.history;
  if (!Array.isArray(history) || history.length !== 60
    || history.some((point, index) => !point || typeof point !== 'object' || Array.isArray(point)
      || Object.keys(point).length !== 2 || Object.keys(point).some((key) => !['date', 'close'].includes(key))
      || !date(point.date) || typeof point.close !== 'number' || !Number.isFinite(point.close) || point.close <= 0
      || (index > 0 && point.date <= history[index - 1].date))
    || history[59].date !== summary.source_session || history[59].close !== summary.last_close) {
    throw new Error('Invalid FPT history: expected only the latest 60 date/close points');
  }
  return summary;
}

/** @param {{issued_at: string, expires_at: string} | null} forecast @param {number} [now] */
export function isForecastCurrent(forecast, now = Date.now()) {
  return Boolean(forecast && Date.parse(forecast.issued_at) <= now && now < Date.parse(forecast.expires_at));
}

/** Keep zooming and dragging inside the published window. @param {number} start @param {number} count */
export function chartWindow(start, count) {
  count = Math.max(5, Math.min(60, Math.round(count)));
  start = Math.max(0, Math.min(60 - count, Math.round(start)));
  return { start, end: start + count };
}

/** @param {ChartSummary} summary @param {number} width @param {{start: number, end: number}} range */
export function chartGeometry(summary, width, range) {
  const height = 300;
  const left = 58, right = width - (width < 500 ? 88 : 116), top = 30, bottom = height - 32;
  const points = summary.history.slice(range.start, range.end);
  const values = points.map((point) => point.close);
  const low = Math.min(...values), high = Math.max(...values);
  const span = Math.max(high - low, high * .02);
  const min = low - span * .18, max = high + span * .2;
  const x = (/** @type {number} */ index) => left + index / (points.length - 1) * (right - left);
  const y = (/** @type {number} */ close) => bottom - (close - min) / (max - min) * (bottom - top);
  const line = points.map((point, index) => `${index ? 'L' : 'M'}${x(index)},${y(point.close)}`).join(' ');
  const ticks = width < 500 ? 3 : 5;
  return {
    width, height, left, right, top, bottom, points,
    line, area: `${line} L${right},${bottom} L${left},${bottom} Z`,
    color: summary.change > 0 ? '#16834a' : summary.change < 0 ? '#d33c43' : '#75777d',
    coordinates: points.map((point, index) => ({ x: x(index), y: y(point.close) })),
    prices: Array.from({ length: 4 }, (_, index) => {
      const value = min + (max - min) * index / 3;
      return { value, y: y(value) };
    }),
    dates: Array.from({ length: ticks }, (_, index) => {
      const i = Math.round(index / (ticks - 1) * (points.length - 1));
      return { date: points[i].date, x: x(i) };
    }),
  };
}
