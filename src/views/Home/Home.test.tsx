import { render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { describe, expect, it, vi } from 'vitest';
import messages from '@messages/en.json';
import { Home } from './Home';

vi.mock('@/components/Viewer/Viewer', () => ({
  Viewer: () => <h1>Swagger UI</h1>,
}));

function renderHome(): void {
  render(
    <NextIntlClientProvider locale="en" messages={messages} timeZone="UTC">
      <Home />
    </NextIntlClientProvider>,
  );
}

describe('Home', () => {
  it('renders editor and viewer panel', () => {
    renderHome();

    expect(
      screen.getByRole('heading', {
        name: /swagger editor/i,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('heading', {
        name: /swagger ui/i,
      }),
    ).toBeInTheDocument();
  });
});
