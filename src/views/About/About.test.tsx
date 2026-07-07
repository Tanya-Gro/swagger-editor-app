import { render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { describe, expect, it } from 'vitest';
import messages from '@messages/en.json';
import { About } from './About';

function renderAbout(): void {
  render(
    <NextIntlClientProvider locale="en" messages={messages} timeZone="UTC">
      <About />
    </NextIntlClientProvider>,
  );
}

describe('About', () => {
  it('renders the page with key Team and RS School blocks', () => {
    renderAbout();

    expect(screen.getByRole('heading', { level: 1, name: /team/i })).toBeInTheDocument();
    expect(screen.getByText(/rs school react course/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: /about the app and technologies/i })).toBeInTheDocument();
    expect(screen.getByText('Next.js')).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /rs school react course/i })).toHaveAttribute(
      'href',
      'https://rs.school/courses/reactjs',
    );
  });
});
