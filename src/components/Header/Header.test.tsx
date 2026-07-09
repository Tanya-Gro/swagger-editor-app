import { render, screen, within } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { describe, expect, it, vi } from 'vitest';
import messages from '@messages/ru.json';
import { Header } from './Header';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ refresh: vi.fn() }),
}));

function renderHeader(): void {
  render(
    <NextIntlClientProvider locale="ru" messages={messages} timeZone="UTC">
      <Header />
    </NextIntlClientProvider>,
  );
}

describe('Header', () => {
  it('renders the header', () => {
    renderHeader();

    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  it('contains the logo', () => {
    renderHeader();

    const header = screen.getByRole('banner');

    expect(within(header).getByTestId('header-logo')).toBeInTheDocument();
    expect(within(header).getByText('Swagger UI')).toBeInTheDocument();
    expect(within(header).getByText('Документация API')).toBeInTheDocument();
  });

  it('renders unique navigation links', () => {
    renderHeader();

    const navigation = screen.getByRole('navigation', { name: 'Навигация для десктопа' });

    expect(within(navigation).getAllByRole('link')).toHaveLength(2);
    expect(within(navigation).getByRole('link', { name: 'О проекте' })).toHaveAttribute('href', '/about');
    expect(within(navigation).getByRole('link', { name: 'Редактор' })).toHaveAttribute('href', '/');
  });

  it('renders navigation links in the mobile menu', () => {
    renderHeader();

    const mobileNavigation = screen.getByRole('navigation', { name: 'Навигация для мобильного меню' });

    expect(within(mobileNavigation).getByRole('link', { name: 'О проекте' })).toHaveAttribute('href', '/about');
    expect(within(mobileNavigation).getByRole('link', { name: 'Редактор' })).toHaveAttribute('href', '/');
  });

  it('login button has link to login page', () => {
    renderHeader();

    const loginLinks = screen.getAllByRole('link', {
      name: /войти/i,
    });

    expect(loginLinks).toHaveLength(2);

    loginLinks.forEach((link) => {
      expect(link).toHaveAttribute('href', '/login');
    });
  });
});
