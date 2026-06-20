import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Footer } from './Footer';

describe('Footer', () => {
  it('renders the project information', () => {
    render(<Footer />);

    const footer = screen.getByRole('contentinfo');

    expect(within(footer).getByRole('link', { name: 'О проекте' })).toHaveAttribute('href', '/about');
    expect(within(footer).getByText('RS School 2024')).toBeInTheDocument();
    expect(within(footer).getByText('Made with ♥ by Team')).toBeInTheDocument();
  });
});
