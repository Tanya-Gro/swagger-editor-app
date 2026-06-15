import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Header } from './Header';
import { headerMessages } from './Header.i18n';

describe('Header', () => {
  it('renders the header', () => {
    render(<Header />);

    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  it('contains the logo', () => {
    render(<Header />);

    const header = screen.getByRole('banner');

    expect(within(header).getByTestId('header-logo')).toBeInTheDocument();
    expect(within(header).getByText(headerMessages.appName)).toBeInTheDocument();
    expect(within(header).getByText(headerMessages.appSubtitle)).toBeInTheDocument();
  });
});
