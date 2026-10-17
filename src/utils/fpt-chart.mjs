/**
 * @typedef {{target_session: string, issued_at: string, expires_at: string, direction: 'up' | 'not_up'}} Forecast
 * @typedef {{correct: number, incorrect: number, pending: number, unscorable: number}} Performance
 * @typedef {{source_session: string, updated_at: string, last_close: number, change: number, change_percent: number, forecast: Forecast | null, performance: Performance}} ChartSummary
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
  const keys = ['source_session', 'updated_at', 'last_close', 'change', 'change_percent', 'forecast', 'performance'];
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
  return summary;
}

/** @param {{issued_at: string, expires_at: string} | null} forecast @param {number} [now] */
export function isForecastCurrent(forecast, now = Date.now()) {
  return Boolean(forecast && Date.parse(forecast.issued_at) <= now && now < Date.parse(forecast.expires_at));
}
