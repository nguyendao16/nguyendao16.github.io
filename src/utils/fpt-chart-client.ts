import { chartGeometry, chartWindow, isForecastCurrent, isForecastVisible, outcomeColor, outcomeLabel, parseChartSummary, predictionOutcomes } from './fpt-chart.mjs';

export function initFptChart(chart: HTMLElement) {
  const summary = parseChartSummary(JSON.parse(chart.dataset.summary ?? 'null'));
  const svg = chart.querySelector<SVGSVGElement>('svg')!;
  const tooltip = chart.querySelector<HTMLOutputElement>('[data-fpt-tooltip]')!;
  const crosshair = chart.querySelector<SVGGElement>('[data-fpt-crosshair]')!;
  const tail = chart.querySelector<SVGGElement>('[data-fpt-tail]')!;
  const number = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 });
  const date = (value: string) => new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Ho_Chi_Minh', month: '2-digit', day: '2-digit', year: 'numeric',
  }).format(new Date(value));
  let range = chartWindow(0, 60);
  let geometry = chartGeometry(summary, 800, range);
  let selected = 59;
  let current = false;
  let forecastVisible = false;
  let timer: ReturnType<typeof setTimeout>;
  let drag: { x: number; y: number; start: number; moved: boolean } | null = null;

  const attrs = (selector: string, attributes: Record<string, string | number>) => {
    const element = chart.querySelector(selector)!;
    for (const [key, value] of Object.entries(attributes)) element.setAttribute(key, String(value));
  };
  const hideTooltip = () => {
    tooltip.hidden = true;
    crosshair.style.display = 'none';
  };
  const showTooltip = (index: number | null) => {
    let x: number;
    if (index === null) {
      const pending = geometry.markers.find((marker) => marker.rail);
      if (pending) tooltip.textContent = `${date(pending.date)} · ${outcomeLabel(pending.status)}`;
      else if (forecastVisible && range.end === 60 && summary.forecast) {
        tooltip.textContent = `${date(summary.forecast.target_session)} · ${summary.forecast.direction === 'up' ? 'Forecast: Up' : 'Forecast: No increase'} · Direction only`;
      } else return hideTooltip();
      x = geometry.right;
      crosshair.style.display = 'none';
    } else {
      selected = range.start + index;
      const point = geometry.points[index];
      const coordinate = geometry.coordinates[index];
      const marker = geometry.markers.find((item) => item.date === point.date);
      tooltip.textContent = `${date(point.date)} · ${number.format(point.close)} VND${marker ? ` · ${outcomeLabel(marker.status)}` : ''}`;
      x = coordinate.x;
      crosshair.style.display = '';
      attrs('[data-fpt-crosshair] line', { x1: x, x2: x });
      attrs('[data-fpt-crosshair] circle', { cx: x, cy: coordinate.y, fill: marker ? outcomeColor(marker.status) : geometry.color });
    }
    tooltip.hidden = false;
    tooltip.style.left = `${Math.max(0, Math.min(geometry.width - tooltip.offsetWidth, x - tooltip.offsetWidth / 2))}px`;
  };
  const render = () => {
    hideTooltip();
    selected = Math.max(range.start, Math.min(range.end - 1, selected));
    const width = Math.max(300, svg.getBoundingClientRect().width);
    geometry = chartGeometry(summary, width, range, forecastVisible);
    const { left, right, bottom, endX, endY } = geometry;
    svg.setAttribute('viewBox', `0 0 ${width} ${geometry.height}`);
    attrs('[data-fpt-line]', { d: geometry.line });
    attrs('[data-fpt-area]', { d: geometry.area });
    const last = geometry.coordinates.at(-1)!;
    attrs('[data-fpt-divider]', { x1: right, x2: right });
    attrs('[data-fpt-tail-line]', { d: `M${right},${last.y} L${endX},${endY}` });
    attrs('[data-fpt-tail-area]', { d: `M${right},${last.y} L${endX},${endY} L${endX},${bottom} L${right},${bottom} Z` });
    for (const selector of ['[data-fpt-tail-title]', '[data-fpt-tail-date]', '[data-fpt-tail-note]']) {
      attrs(selector, { x: (right + endX) / 2 });
    }
    tail.style.display = forecastVisible && range.end === 60 ? '' : 'none';
    chart.querySelector('[data-fpt-tail-title]')!.textContent = current ? 'Forecast' : 'Pending';
    const grid = chart.querySelector('[data-fpt-grid]')!;
    grid.replaceChildren();
    const node = (name: string, attributes: Record<string, string | number>, text?: string, parent: Element = grid) => {
      const element = document.createElementNS('http://www.w3.org/2000/svg', name);
      for (const [key, value] of Object.entries(attributes)) element.setAttribute(key, String(value));
      if (text) element.textContent = text;
      parent.append(element);
      return element;
    };
    node('text', { x: 0, y: 16 }, 'VND');
    geometry.prices.forEach((tick) => {
      node('line', { x1: left, x2: right, y1: tick.y, y2: tick.y, stroke: 'var(--color-surface-container-high)' });
      node('text', { x: left - 9, y: tick.y + 4, 'text-anchor': 'end' }, number.format(tick.value));
    });
    geometry.dates.forEach((tick, index) => node('text', {
      x: tick.x, y: 292, 'text-anchor': index === 0 ? 'start' : index === geometry.dates.length - 1 ? 'end' : 'middle',
    }, date(tick.date).slice(0, 5)));
    const markers = chart.querySelector('[data-fpt-markers]')!;
    markers.replaceChildren();
    geometry.markers.forEach((marker) => {
      const group = node('g', { 'data-fpt-result': marker.status, 'data-date': marker.date,
        ...(marker.rail ? { 'data-rail': '' } : {}) }, undefined, markers);
      node('circle', { cx: marker.x, cy: marker.y, r: 5, fill: outcomeColor(marker.status),
        stroke: 'var(--color-surface)', 'stroke-width': 2 }, undefined, group);
      node('title', {}, `${date(marker.date)} · ${outcomeLabel(marker.status)}`, group);
      if (marker.rail && !(forecastVisible && summary.forecast?.target_session === marker.date)) {
        const label = { x: (right + endX) / 2, 'text-anchor': 'middle', 'font-size': 11, fill: 'var(--color-ink-muted)' };
        node('text', { ...label, y: 14 }, 'Pending', group);
        node('text', { ...label, y: 29 }, date(marker.date).slice(0, 5), group);
      }
    });
  };
  const zoom = (factor: number, anchor = range.end === 60 ? 1 : .5) => {
    const count = range.end - range.start;
    const next = chartWindow(0, count * factor).end;
    range = chartWindow(range.start + (count - next) * anchor, next);
    render();
  };
  const pointer = (event: PointerEvent | WheelEvent) => {
    const box = svg.getBoundingClientRect();
    return { x: event.clientX - box.left, y: event.clientY - box.top };
  };
  const inspect = (x: number, y: number) => {
    if (x < geometry.left || y < geometry.top || y > geometry.bottom) return hideTooltip();
    if (x > geometry.right) return showTooltip(null);
    showTooltip(Math.max(0, Math.min(geometry.points.length - 1,
      Math.round((x - geometry.left) / (geometry.right - geometry.left) * (geometry.points.length - 1)))));
  };
  svg.addEventListener('pointerdown', (event) => {
    if (!event.isPrimary || event.button !== 0) return;
    const { x, y } = pointer(event);
    if (x < geometry.left || y < geometry.top || y > geometry.bottom) return;
    inspect(x, y);
    if (x > geometry.right) return;
    drag = { x, y, start: range.start, moved: false };
    svg.setPointerCapture(event.pointerId);
  });
  svg.addEventListener('pointermove', (event) => {
    const { x, y } = pointer(event);
    if (drag && Math.abs(x - drag.x) > 5 && Math.abs(x - drag.x) > Math.abs(y - drag.y)) drag.moved = true;
    if (drag?.moved) {
      const count = range.end - range.start;
      range = chartWindow(drag.start - (x - drag.x) / (geometry.right - geometry.left) * (count - 1), count);
      render();
    } else inspect(x, y);
  });
  const stopDrag = () => { drag = null; };
  svg.addEventListener('pointerup', stopDrag);
  svg.addEventListener('pointercancel', () => { stopDrag(); hideTooltip(); });
  svg.addEventListener('lostpointercapture', stopDrag);
  svg.addEventListener('pointerleave', (event) => { if (!drag && event.pointerType === 'mouse') hideTooltip(); });
  svg.addEventListener('blur', hideTooltip);
  svg.addEventListener('wheel', (event) => {
    if (!event.ctrlKey) return;
    event.preventDefault();
    const anchor = Math.max(0, Math.min(1, (pointer(event).x - geometry.left) / (geometry.right - geometry.left)));
    zoom(event.deltaY < 0 ? .8 : 1.25, anchor);
  }, { passive: false });
  svg.addEventListener('keydown', (event) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', '+', '=', '-', 'Escape'].includes(event.key)) return;
    event.preventDefault();
    if (event.key === 'Escape') return hideTooltip();
    if (['+', '=', '-'].includes(event.key)) return zoom(event.key === '-' ? 1.5 : 2 / 3);
    if (event.key === 'Home') { range = chartWindow(0, 60); selected = 59; render(); }
    else {
      const maximum = geometry.markers.some((marker) => marker.rail) ? 60 : 59;
      selected = Math.max(0, Math.min(maximum, selected + (event.key === 'ArrowLeft' ? -1 : 1)));
      if (selected === 60) return showTooltip(null);
      if (selected < range.start || selected >= range.end) {
        range = chartWindow(selected < range.start ? selected : selected - (range.end - range.start) + 1, range.end - range.start);
        render();
      }
    }
    showTooltip(selected - range.start);
  });
  const update = () => {
    clearTimeout(timer);
    current = isForecastCurrent(summary.forecast);
    forecastVisible = isForecastVisible(summary);
    const awaiting = predictionOutcomes(summary).find((outcome) => outcome.status === 'pending' && outcome.date > summary.source_session);
    chart.querySelector<HTMLElement>('[data-fpt-pending]')!.hidden = current || Boolean(awaiting);
    const waiting = chart.querySelector<HTMLElement>('[data-fpt-awaiting]')!;
    waiting.hidden = current || !awaiting;
    if (awaiting) waiting.textContent = `Awaiting result · ${date(awaiting.date)}`;
    chart.querySelectorAll<HTMLElement>('[data-fpt-forecast]').forEach((element) => { element.hidden = !current; });
    render();
    if (current && summary.forecast) timer = setTimeout(update, Math.min(Date.parse(summary.forecast.expires_at) - Date.now(), 2_147_483_647));
  };
  new ResizeObserver(render).observe(svg);
  window.addEventListener('pageshow', update);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) update(); });
  update();
}
