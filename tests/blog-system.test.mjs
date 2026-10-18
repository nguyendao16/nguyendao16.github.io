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

  it('compiles the RNN article and renders its introductory derivatives as math', async () => {
    const { compile } = await import('@mdx-js/mdx');
    const { default: remarkMath } = await import('remark-math');
    const { default: rehypeKatex } = await import('rehype-katex');
    const article = read('src/content/blog/vanishing-exploding-gradients-rnn-proof.mdx');
    const body = article.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '');
    const options = {
      remarkPlugins: [remarkMath],
      rehypePlugins: [rehypeKatex],
    };

    const compiled = await compile(body, options);
    assert.deepEqual(compiled.messages, []);
    const introduction = await compile(body.split('## 2.')[0], options);
    assert.match(introduction.value, /katex-display/);
    assert.match(introduction.value, /children: "∂"/);
    assert.match(introduction.value, /children: "3"/);
  });
});
