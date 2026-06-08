import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();

function read(relativePath) {
  return readFileSync(join(root, relativePath), 'utf8');
}

describe('Global site layout', () => {
  it('uses the shared responsive shell components', () => {
    const layout = read('src/layouts/BaseLayout.astro');
    assert.match(layout, /Navbar/);
    assert.match(layout, /Footer/);
  });

  it('defines a responsive accessible navbar', () => {
    const navbar = read('src/components/Navbar.astro');
    const navigation = read('src/data/navigation.ts');
    assert.match(navbar, /aria-label="Primary navigation"/);
    assert.match(navbar, /lg:flex/);
    assert.match(navbar, /lg:hidden/);
    assert.match(navbar, /details|summary/);
    assert.match(navigation, /Trang chủ/);
    assert.match(navigation, /Blog/);
    assert.match(navigation, /Về tôi/);
    assert.match(navigation, /Contact/);
  });

  it('defines the reusable button and footer components', () => {
    const button = read('src/components/Button.astro');
    const footer = read('src/components/Footer.astro');
    const social = read('src/components/SocialLink.astro');

    assert.match(button, /btn-primary/);
    assert.match(button, /btn-secondary/);
    assert.match(footer, /mailto:/);
    assert.match(footer, /GitHub/);
    assert.match(footer, /LinkedIn/);
    assert.match(social, /aria-label/);
  });
});
