import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import RootLayout from './layout';

describe('RootLayout', () => {
  it('renders children', () => {
    const markup = renderToStaticMarkup(
      <RootLayout>
        <span>Page content</span>
      </RootLayout>,
    );

    expect(markup).toContain('Page content');
  });
});
