import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Header } from './Header';

describe('Header', () => {
  it('renders the header', () => {
    render(<Header />);

    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  it('contains the logo', () => {
    render(<Header />);

    const header = screen.getByRole('banner');

    expect(within(header).getByTestId('header-logo')).toBeInTheDocument();
    expect(within(header).getByText('Swagger UI')).toBeInTheDocument();
    expect(within(header).getByText('API Documentation')).toBeInTheDocument();
  });

  it('renders unique navigation links', () => {
    render(<Header />);

    const navigation = screen.getByRole('navigation', { name: 'Основная навигация' });

    expect(within(navigation).getAllByRole('link')).toHaveLength(2);
    expect(within(navigation).getByRole('link', { name: 'О проекте' })).toHaveAttribute('href', '/about');
    expect(within(navigation).getByRole('link', { name: 'Редактор' })).toHaveAttribute('href', '/editor');
  });

  it('login button has link to login page', () => {
    render(<Header />);

    const loginLinks = screen.getAllByRole('link', {
      name: /войти/i,
    });

    expect(loginLinks).toHaveLength(2);

    loginLinks.forEach((link) => {
      expect(link).toHaveAttribute('href', '/login');
    });
  });
});
