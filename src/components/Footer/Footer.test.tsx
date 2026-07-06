import { render, screen, within } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { describe, expect, it } from 'vitest';
import englishMessages from '../../../messages/en.json';
import russianMessages from '../../../messages/ru.json';
import { Footer } from './Footer';

describe('Footer', () => {
  it('renders the English project information', () => {
    render(
      <NextIntlClientProvider locale="en" messages={englishMessages} timeZone="UTC">
        <Footer />
      </NextIntlClientProvider>,
    );

    const footer = screen.getByRole('contentinfo');
    const schoolLink = within(footer).getByRole('link', { name: 'RS School 2026' });

    expect(within(footer).getByRole('link', { name: englishMessages.FOOTER.about })).toHaveAttribute('href', '/about');
    expect(schoolLink).toHaveAttribute('href', 'https://rs.school/');
    expect(schoolLink).toHaveAttribute('target', '_blank');
    expect(schoolLink).toHaveAttribute('rel', 'noopener noreferrer');
    expect(within(footer).getByText(englishMessages.FOOTER.madeBy)).toBeInTheDocument();
  });

  it('renders the Russian project information', () => {
    render(
      <NextIntlClientProvider locale="ru" messages={russianMessages} timeZone="UTC">
        <Footer />
      </NextIntlClientProvider>,
    );

    const footer = screen.getByRole('contentinfo');

    expect(within(footer).getByRole('link', { name: russianMessages.FOOTER.about })).toHaveAttribute('href', '/about');
    expect(within(footer).getByText(russianMessages.FOOTER.madeBy)).toBeInTheDocument();
  });
});
