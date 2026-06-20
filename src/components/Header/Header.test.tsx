import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AppIntlProvider } from '@/i18n/AppIntlProvider';
import { Header } from './Header';

function renderHeader(): void {
  render(
    <AppIntlProvider>
      <Header />
    </AppIntlProvider>,
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
    expect(within(header).getByText('API Documentation')).toBeInTheDocument();
  });

  it('renders unique navigation links', () => {
    renderHeader();

    const navigation = screen.getByRole('navigation', { name: 'Main navigation' });

    expect(within(navigation).getAllByRole('link')).toHaveLength(2);
    expect(within(navigation).getByRole('link', { name: 'About' })).toHaveAttribute('href', '/about');
    expect(within(navigation).getByRole('link', { name: 'Editor' })).toHaveAttribute('href', '/editor');
  });
});
