/**
 * @typedef {{target_session: string, issued_at: string, expires_at: string, direction: 'up' | 'not_up'}} Forecast
 * @typedef {{correct: number, incorrect: number, pending: number, unscorable: number}} Performance
 * @typedef {{date: string, close: number}} PricePoint
 * @typedef {{date: string, status: 'correct' | 'incorrect' | 'pending'}} PredictionOutcome
 * @typedef {{source_session: string, updated_at: string, last_close: number, change: number, change_percent: number, forecast: Forecast | null, performance: Performance, history: PricePoint[], outcomes?: PredictionOutcome[]}} ChartSummary
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
  if (keys.some((key) => !Object.hasOwn(summary, key)) || Object.keys(summary).some((key) => ![...keys, 'outcomes'].includes(key))
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
  if (Object.hasOwn(summary, 'outcomes')) {
    const outcomes = summary.outcomes;
    if (!Array.isArray(outcomes) || outcomes.length > 61
      || outcomes.some((outcome, index) => !outcome || typeof outcome !== 'object' || Array.isArray(outcome)
        || Object.keys(outcome).length !== 2 || Object.keys(outcome).some((key) => !['date', 'status'].includes(key))
        || !date(outcome.date) || !['correct', 'incorrect', 'pending'].includes(outcome.status)
        || (index > 0 && outcome.date <= outcomes[index - 1].date)
        || (!history.some((point) => point.date === outcome.date)
          && !(outcome.status === 'pending' && outcome.date > summary.source_session)))
      || outcomes.filter((outcome) => outcome.date > summary.source_session).length > 1
      || ['correct', 'incorrect', 'pending'].some((status) => outcomes.filter((outcome) => outcome.status === status).length > performance[status])) {
      throw new Error('Invalid FPT outcomes: only dates and statuses in the chart window');
    }
  }
  return summary;
}

/** Older pipeline releases contain only the active forecast, without per-session outcomes. @param {ChartSummary} summary @returns {PredictionOutcome[]} */
export function predictionOutcomes(summary) {
  return summary.outcomes ?? (summary.forecast ? [{ date: summary.forecast.target_session, status: 'pending' }] : []);
}

/** @param {PredictionOutcome['status']} status */
export function outcomeColor(status) {
  return status === 'correct' ? '#16834a' : status === 'incorrect' ? '#d33c43' : 'var(--color-ink-muted)';
}

/** @param {PredictionOutcome['status']} status */
export function outcomeLabel(status) {
  return status === 'correct' ? 'Prediction: Correct' : status === 'incorrect' ? 'Prediction: Incorrect' : 'Pending result';
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

/** @param {ChartSummary} summary @param {number} width @param {{start: number, end: number}} range @param {boolean} [current] */
export function chartGeometry(summary, width, range, current = false) {
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
  const coordinates = points.map((point, index) => ({ x: x(index), y: y(point.close) }));
  const endX = width - 16;
  // The separate forecast panel has no price scale; its slope denotes direction only.
  const endY = Math.max(top + 28, Math.min(bottom - 20,
    coordinates.at(-1).y + (summary.forecast?.direction === 'up' ? -40 : 40)));
  const markers = predictionOutcomes(summary).flatMap((outcome) => {
    const index = points.findIndex((point) => point.date === outcome.date);
    if (index >= 0) return [{ ...outcome, ...coordinates[index], rail: false }];
    if (range.end !== 60 || outcome.date <= summary.source_session) return [];
    return [{ ...outcome, x: endX,
      y: current && summary.forecast?.target_session === outcome.date ? endY : (top + bottom) / 2, rail: true }];
  });
  return {
    width, height, left, right, top, bottom, points, markers, endX, endY,
    line, area: `${line} L${right},${bottom} L${left},${bottom} Z`,
    color: summary.change > 0 ? '#16834a' : summary.change < 0 ? '#d33c43' : '#75777d',
    coordinates,
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
