import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import messages from '@messages/en.json';
import RootLayout from './layout';

vi.mock('next-intl/server', () => ({
  getLocale: () => Promise.resolve('en'),
  getMessages: () => Promise.resolve(messages),
  getTranslations: () => Promise.resolve((key: 'description' | 'title') => messages.METADATA[key]),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ refresh: vi.fn() }),
}));

describe('RootLayout', () => {
  it('renders main content', async () => {
    const layout = await RootLayout({
      children: <section data-testid="page-content" />,
    });
    const markup = renderToStaticMarkup(layout);

    expect(markup).toContain('<html lang="en">');
    expect(markup).toContain('<body>');
    expect(markup).toMatch(/<main[^>]*id="main-content"[^>]*>/);
    expect(markup).toContain('data-testid="page-content"');
    expect(markup).toContain('<footer></footer>');
  });
});
