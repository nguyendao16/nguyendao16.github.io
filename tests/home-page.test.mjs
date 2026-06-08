import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();

function read(relativePath) {
  return readFileSync(join(root, relativePath), 'utf8');
}

describe('Home page foundation', () => {
  it('uses the stitched home sections and reusable components', () => {
    const home = read('src/pages/index.astro');

    assert.match(home, /Hero/);
    assert.match(home, /ProjectCard/);
    assert.match(home, /BlogCard/);
    assert.match(home, /SkillBadge/);
    assert.match(home, /Section/);
    assert.match(home, /Button/);
    assert.match(home, /Featured projects/);
    assert.match(home, /Latest blog posts/);
    assert.match(home, /Skills|Technology/);
    assert.match(home, /Contact/);
  });

  it('has sample data files for profile and projects', () => {
    const profile = read('src/data/profile.ts');
    const projects = read('src/data/projects.ts');

    assert.match(profile, /export const profile/);
    assert.match(profile, /intro|headline|bio/);
    assert.match(projects, /export const projects/);
    assert.match(projects, /featured/);
  });
});
