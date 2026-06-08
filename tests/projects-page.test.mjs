import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();

function read(relativePath) {
  return readFileSync(join(root, relativePath), 'utf8');
}

describe('Projects page foundation', () => {
  it('uses the stitched project page structure and shared components', () => {
    const page = read('src/pages/projects.astro');

    assert.match(page, /ProjectCard/);
    assert.match(page, /Section/);
    assert.match(page, /Button/);
    assert.match(page, /Featured projects|Projects/);
    assert.match(page, /metrics|results/i);
  });

  it('defines the full project data contract', () => {
    const projects = read('src/data/projects.ts');
    const tag = read('src/components/Tag.astro');
    const card = read('src/components/ProjectCard.astro');

    assert.match(projects, /problemStatement/);
    assert.match(projects, /techStack/);
    assert.match(projects, /metrics/);
    assert.match(projects, /githubUrl/);
    assert.match(projects, /demoUrl/);
    assert.match(projects, /tags/);
    assert.match(tag, /rounded-pill/);
    assert.match(card, /problemStatement/);
    assert.match(card, /techStack/);
    assert.match(card, /metrics/);
    assert.match(card, /githubUrl/);
    assert.match(card, /demoUrl/);
  });
});
