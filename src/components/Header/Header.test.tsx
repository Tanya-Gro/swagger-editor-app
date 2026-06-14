import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Header } from './Header';

describe('Header', () => {
  it('renders the header', () => {
    render(<Header />);

    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  it('contains the logo and title', () => {
    render(<Header />);

    const header = screen.getByRole('banner');

    expect(within(header).getByRole('link', { name: 'Swagger UI home' })).toBeInTheDocument();
    expect(within(header).getByText('Swagger UI')).toBeInTheDocument();
    expect(within(header).getByText('API Documentation')).toBeInTheDocument();
  });
});
