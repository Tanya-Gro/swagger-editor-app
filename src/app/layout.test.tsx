import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import RootLayout from './layout';

describe('RootLayout', () => {
  it('renders main content', () => {
    const markup = renderToStaticMarkup(
      <RootLayout>
        <section data-testid="page-content" />
      </RootLayout>,
    );

    expect(markup).toContain('<html lang="en">');
    expect(markup).toContain('<body>');
    expect(markup).toMatch(/<main[^>]*id="main-content"[^>]*>/);
    expect(markup).toContain('data-testid="page-content"');
    expect(markup).toContain('<footer></footer>');
  });
});
