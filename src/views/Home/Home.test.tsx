import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Home } from './Home';

describe('Home', () => {
  it('renders editor and viewer placeholders', () => {
    render(<Home />);

    expect(screen.getByText('Editor placeholder')).toBeInTheDocument();
    expect(screen.getByText('Viewer placeholder')).toBeInTheDocument();
  });
});
