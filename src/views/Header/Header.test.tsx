import { render, screen, within } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { describe, expect, it, vi } from 'vitest';
import messages from '@messages/ru.json';
import { HeaderView } from './Header';
import { type LogoutAction } from '@/types';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ refresh: vi.fn() }),
}));

vi.mock('next-intl/server', () => ({
  getLocale: () => Promise.resolve('ru'),

  getTranslations: (namespace: string) => {
    return (key: string) => {
      const nsMessages = (messages as Record<string, unknown>)[namespace];

      if (nsMessages && typeof nsMessages === 'object') {
        const value = (nsMessages as Record<string, unknown>)[key];

        return typeof value === 'string' ? value : key;
      }

      return key;
    };
  },
}));

vi.mock('@/components/Header/LanguageSwitcher/LanguageSwitcher', () => ({
  LanguageSwitcher: () => <div data-testid="language-switcher" />,
}));

vi.mock('@/components/Header/Burger/Burger', () => ({
  Burger: ({ isAuthenticated }: { isAuthenticated: boolean }) => (
    <div data-testid="burger-menu">
      {isAuthenticated ? <button type="button">Выйти</button> : <a href="/login">Войти</a>}
    </div>
  ),
}));

vi.mock('@/components/Logout/Logout', () => ({
  Logout: ({ label }: { label: string }) => <button type="button">{label}</button>,
}));

const logoutAction = vi.fn<LogoutAction>().mockResolvedValue({
  error: null,
});

async function renderHeader(isAuthenticated: boolean): Promise<void> {
  const HeaderJSX = await HeaderView({ isAuthenticated, logoutAction });

  render(
    <NextIntlClientProvider locale="ru" messages={messages} timeZone="UTC">
      {HeaderJSX}
    </NextIntlClientProvider>,
  );
}

describe('HeaderView', () => {
  it('renders the header', async () => {
    await renderHeader(false);

    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  it('contains the logo', async () => {
    await renderHeader(false);

    const header = screen.getByRole('banner');

    expect(within(header).getByTestId('header-logo')).toBeInTheDocument();
    expect(within(header).getByText('Swagger UI')).toBeInTheDocument();
    expect(within(header).getByText('Документация API')).toBeInTheDocument();
  });

  it('renders unique navigation links', async () => {
    await renderHeader(false);

    const navigation = screen.getByRole('navigation', { name: messages.HEADER.navigationAriaLabel });

    expect(within(navigation).getAllByRole('link')).toHaveLength(2);
    expect(within(navigation).getByRole('link', { name: 'О проекте' })).toHaveAttribute('href', '/about');
    expect(within(navigation).getByRole('link', { name: 'Редактор' })).toHaveAttribute('href', '/');
  });

  it('login button has link to login page', async () => {
    await renderHeader(false);

    const loginLinks = screen.getAllByRole('link', {
      name: /войти/i,
    });

    expect(loginLinks).toHaveLength(2);

    loginLinks.forEach((link) => {
      expect(link).toHaveAttribute('href', '/login');
    });
  });

  it('renders sign-in controls for an unauthenticated user', async () => {
    await renderHeader(false);

    expect(screen.getAllByRole('link', { name: /войти/i })).toHaveLength(2);
    expect(screen.queryByRole('button', { name: /выйти/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /история/i })).not.toBeInTheDocument();
  });

  it('renders sign-out controls and history for an authenticated user', async () => {
    await renderHeader(true);

    expect(screen.getAllByRole('button', { name: /выйти/i })).toHaveLength(2);
    expect(screen.getByRole('link', { name: /история/i })).toHaveAttribute('href', '/history');
    expect(screen.queryByRole('link', { name: /войти/i })).not.toBeInTheDocument();
  });
});
