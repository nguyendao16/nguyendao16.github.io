import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();

describe('Design system foundation', () => {
  it('defines the Stitch-derived Tailwind tokens', () => {
    const tailwind = readFileSync(join(root, 'tailwind.config.mjs'), 'utf8');

    assert.match(tailwind, /container-lowest/);
    assert.match(tailwind, /container-low/);
    assert.match(tailwind, /container-high/);
    assert.match(tailwind, /container-highest/);
    assert.match(tailwind, /fontSize/);
    assert.match(tailwind, /fontWeight/);
    assert.match(tailwind, /spacing/);
    assert.match(tailwind, /maxWidth/);
    assert.match(tailwind, /borderRadius/);
    assert.match(tailwind, /boxShadow/);
  });

  it('defines global design tokens and reusable utility classes', () => {
    const css = readFileSync(join(root, 'src/styles/global.css'), 'utf8');

    assert.match(css, /--color-surface-container-lowest/);
    assert.match(css, /--color-surface-container-highest/);
    assert.match(css, /--color-ink-muted/);
    assert.match(css, /--radius-card/);
    assert.match(css, /--shadow-soft/);
    assert.match(css, /--container-page/);
    assert.match(css, /--container-prose/);
    assert.match(css, /\.btn-primary/);
    assert.match(css, /\.btn-secondary/);
    assert.match(css, /\.card/);
    assert.match(css, /\.link/);
    assert.match(css, /\.surface-page/);
    assert.match(css, /\.surface-panel/);
  });
});
