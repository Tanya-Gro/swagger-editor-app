import { render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { describe, expect, it } from 'vitest';
import messages from '@messages/en.json';
import { Home } from './Home';

function renderHome(): void {
  render(
    <NextIntlClientProvider locale="en" messages={messages} timeZone="UTC">
      <Home />
    </NextIntlClientProvider>,
  );
}

const editor = messages.EDITOR;

describe('Home', () => {
  it('renders editor and viewer panel', () => {
    renderHome();

    expect(
      screen.getByRole('heading', {
        name: editor.title,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('heading', {
        name: /swagger ui/i,
      }),
    ).toBeInTheDocument();
  });
});
