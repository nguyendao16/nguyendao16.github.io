import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();

function read(relativePath) {
  return readFileSync(join(root, relativePath), 'utf8');
}

describe('editable content model', () => {
  it('centralizes editable data in typed data modules', () => {
    const files = [
      'src/data/profile.ts',
      'src/data/projects.ts',
      'src/data/socials.ts',
      'src/data/site.ts',
    ];

    for (const file of files) {
      assert.equal(existsSync(join(root, file)), true, `${file} should exist`);
      assert.match(read(file), /export type /, `${file} should export explicit types`);
      assert.doesNotMatch(read(file), /\bany\b/, `${file} should not use any`);
    }
  });

  it('documents the editable content workflow', () => {
    assert.equal(existsSync(join(root, 'CONTENT_GUIDE.md')), true);

    const guide = read('CONTENT_GUIDE.md');

    assert.match(guide, /name\/bio/i);
    assert.match(guide, /projects/i);
    assert.match(guide, /blog post/i);
    assert.match(guide, /images/i);
    assert.match(guide, /resume\.pdf/i);
    assert.match(guide, /test locally/i);
    assert.match(guide, /GitHub Pages/i);
  });
});
