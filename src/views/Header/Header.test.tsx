import { render, screen, within } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { describe, expect, it, vi } from 'vitest';
import messages from '@messages/ru.json';
import { HeaderView } from './Header';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ refresh: vi.fn() }),
}));

const logoutAction = vi.fn<() => Promise<void>>();

function renderHeader(isAuthenticated: boolean): void {
  render(
    <NextIntlClientProvider locale="ru" messages={messages} timeZone="UTC">
      <HeaderView isAuthenticated={isAuthenticated} logoutAction={logoutAction} />
    </NextIntlClientProvider>,
  );
}

describe('HeaderView', () => {
  it('renders the header', () => {
    renderHeader(false);

    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  it('contains the logo', () => {
    renderHeader(false);

    const header = screen.getByRole('banner');

    expect(within(header).getByTestId('header-logo')).toBeInTheDocument();
    expect(within(header).getByText('Swagger UI')).toBeInTheDocument();
    expect(within(header).getByText('Документация API')).toBeInTheDocument();
  });

  it('renders unique navigation links', () => {
    renderHeader(false);

    const navigation = screen.getByRole('navigation', { name: 'Основная навигация' });

    expect(within(navigation).getAllByRole('link')).toHaveLength(2);
    expect(within(navigation).getByRole('link', { name: 'О проекте' })).toHaveAttribute('href', '/about');
    expect(within(navigation).getByRole('link', { name: 'Редактор' })).toHaveAttribute('href', '/');
  });

  it('login button has link to login page', () => {
    renderHeader(false);

    const loginLinks = screen.getAllByRole('link', {
      name: /войти/i,
    });

    expect(loginLinks).toHaveLength(2);

    loginLinks.forEach((link) => {
      expect(link).toHaveAttribute('href', '/login');
    });
  });

  it('renders sign-in controls for an unauthenticated user', () => {
    renderHeader(false);

    expect(screen.getAllByRole('link', { name: /войти/i })).toHaveLength(2);
    expect(screen.queryByRole('button', { name: /выйти/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /история/i })).not.toBeInTheDocument();
  });

  it('renders sign-out controls and history for an authenticated user', () => {
    renderHeader(true);

    expect(screen.getAllByRole('button', { name: /выйти/i })).toHaveLength(2);
    expect(screen.getByRole('link', { name: /история/i })).toHaveAttribute('href', '/history');
    expect(screen.queryByRole('link', { name: /войти/i })).not.toBeInTheDocument();
  });
});
