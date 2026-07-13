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

vi.mock('@/components/Header/Header', () => ({
  Header: () => <header data-testid="header" />,
}));

describe('RootLayout', () => {
  it('renders main content', async () => {
    const layout = await RootLayout({
      children: <section data-testid="page-content">Page content</section>,
    });
    const markup = renderToStaticMarkup(layout);

    expect(markup).toContain('Page content');
  });
});
