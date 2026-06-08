import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();

const requiredFiles = [
  'package.json',
  'astro.config.mjs',
  'tailwind.config.mjs',
  'tsconfig.json',
  'src/content/config.ts',
  'src/styles/global.css',
  'src/pages/index.astro',
  'src/pages/about.astro',
  'src/pages/projects.astro',
  'src/pages/blog/index.astro',
  'src/pages/blog/[slug].astro',
  'src/pages/resume.astro',
  'src/pages/contact.astro',
];

const requiredDirectories = [
  'src/components',
  'src/layouts',
  'src/pages',
  'src/content/blog',
  'src/data',
  'src/styles',
  'public/images',
  'public/resume',
];

describe('Astro project foundation', () => {
  it('contains the required Milestone 1 files and folders', () => {
    for (const directory of requiredDirectories) {
      assert.equal(existsSync(join(root, directory)), true, `${directory} should exist`);
    }

    for (const file of requiredFiles) {
      assert.equal(existsSync(join(root, file)), true, `${file} should exist`);
    }
  });

  it('configures Astro with MDX, Tailwind, and static output', () => {
    const astroConfig = readFileSync(join(root, 'astro.config.mjs'), 'utf8');

    assert.match(astroConfig, /@astrojs\/mdx/);
    assert.match(astroConfig, /@astrojs\/tailwind/);
    assert.match(astroConfig, /output:\s*['"]static['"]/);
  });

  it('defines a blog content collection', () => {
    const contentConfig = readFileSync(join(root, 'src/content/config.ts'), 'utf8');

    assert.match(contentConfig, /defineCollection/);
    assert.match(contentConfig, /blog/);
    assert.match(contentConfig, /title/);
    assert.match(contentConfig, /description/);
    assert.match(contentConfig, /pubDate/);
    assert.match(contentConfig, /tags/);
  });
});
