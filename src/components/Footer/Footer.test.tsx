import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Footer } from './Footer';

describe('Footer', () => {
  it('renders the project information', () => {
    render(<Footer />);

    const footer = screen.getByRole('contentinfo');
    const schoolLink = within(footer).getByRole('link', { name: 'RS School 2026' });

    expect(within(footer).getByRole('link', { name: 'О проекте' })).toHaveAttribute('href', '/about');
    expect(schoolLink).toHaveAttribute('href', 'https://rs.school/');
    expect(schoolLink).toHaveAttribute('target', '_blank');
    expect(schoolLink).toHaveAttribute('rel', 'noopener noreferrer');
    expect(within(footer).getByText('Made with ♥ by ATOM Team')).toBeInTheDocument();
  });
});
