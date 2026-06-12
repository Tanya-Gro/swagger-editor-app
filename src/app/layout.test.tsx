import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import MainLayout from './(main)/layout';
import RootLayout from './layout';

describe('RootLayout', () => {
  it('renders main content', () => {
    const markup = renderToStaticMarkup(
      <RootLayout>
        <MainLayout>
          <section data-testid="page-content" />
        </MainLayout>
      </RootLayout>,
    );

    expect(markup).toContain('<html lang="en">');
    expect(markup).toContain('<body>');
    expect(markup).toContain('<header></header>');
    expect(markup).toContain('<main id="main-content">');
    expect(markup).toContain('data-testid="page-content"');
    expect(markup).toContain('<footer></footer>');
  });
});
