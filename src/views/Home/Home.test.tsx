import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Home } from './Home';

describe('Home', () => {
  it('renders editor and viewer panel', () => {
    render(<Home />);

    expect(
      screen.getByRole('heading', {
        name: /swagger editor/i,
      }),
    ).toBeInTheDocument();

    expect(screen.getByText(/viewer placeholder/i)).toBeInTheDocument();
  });
});
