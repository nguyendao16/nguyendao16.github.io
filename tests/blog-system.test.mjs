import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();

function read(relativePath) {
  return readFileSync(join(root, relativePath), 'utf8');
}

describe('Technical blog system', () => {
  it('enables MDX with math support', () => {
    const astroConfig = read('astro.config.mjs');

    assert.match(astroConfig, /remark-math/);
    assert.match(astroConfig, /rehype-katex/);
    assert.match(astroConfig, /@astrojs\/mdx/);
  });

  it('defines the blog content schema and layout', () => {
    const contentConfig = read('src/content/config.ts');

    assert.match(contentConfig, /date/);
    assert.match(contentConfig, /updatedDate/);
    assert.match(contentConfig, /tags/);
    assert.match(contentConfig, /coverImage/);
    assert.match(contentConfig, /draft/);
    assert.match(contentConfig, /seoTitle|seoDescription/);

    assert.equal(existsSync(join(root, 'src/layouts/BlogPostLayout.astro')), true);
    assert.equal(existsSync(join(root, 'src/pages/blog/[slug].astro')), true);
  });

  it('uses collection data in the blog index and detail routes', () => {
    const index = read('src/pages/blog/index.astro');
    const detail = read('src/pages/blog/[slug].astro');
    const layout = read('src/layouts/BlogPostLayout.astro');

    assert.match(index, /getCollection/);
    assert.match(index, /BlogCard/);
    assert.match(detail, /BlogPostLayout/);
    assert.match(detail, /getCollection/);
    assert.match(detail, /headings/);
    assert.match(layout, /reading time|readingTime/i);
    assert.match(layout, /table of contents|toc|headings/i);
    assert.match(layout, /previous|next/i);
    assert.match(layout, /SEO|meta/i);
  });

  it('contains the requested sample MDX post', () => {
    const sample = read('src/content/blog/knn-cosine-vs-euclidean.mdx');

    assert.match(sample, /title:/);
    assert.match(sample, /description:/);
    assert.match(sample, /date:/);
    assert.match(sample, /tags:/);
    assert.match(sample, /coverImage:/);
    assert.match(sample, /```python/i);
    assert.match(sample, /\$\$/);
    assert.match(sample, /<iframe/i);
    assert.match(sample, /!\[/);
  });
});
