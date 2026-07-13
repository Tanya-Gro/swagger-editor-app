import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { LogoutAction } from '@/types';
import { toast } from '@/utils/toast/toast';

import { Logout } from './Logout';

vi.mock('@/utils/toast/toast', () => ({
  toast: {
    error: vi.fn(),
  },
}));

const label = 'Sign out';

describe('Logout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders logout button', () => {
    const action = vi.fn<LogoutAction>().mockResolvedValue({
      error: null,
    });

    render(<Logout action={action} label={label} />);

    expect(
      screen.getByRole('button', {
        name: label,
      }),
    ).toBeInTheDocument();
  });

  it('passes className to the button', () => {
    const action = vi.fn<LogoutAction>().mockResolvedValue({
      error: null,
    });

    render(<Logout action={action} className="logout-button" label={label} />);

    expect(
      screen.getByRole('button', {
        name: label,
      }),
    ).toHaveClass('logout-button');
  });

  it('calls logout action after form submission', async () => {
    const user = userEvent.setup();

    const action = vi.fn<LogoutAction>().mockResolvedValue({
      error: null,
    });

    render(<Logout action={action} label={label} />);

    await user.click(
      screen.getByRole('button', {
        name: label,
      }),
    );

    await waitFor(() => {
      expect(action).toHaveBeenCalledTimes(1);
    });

    expect(action).toHaveBeenCalledWith(
      {
        error: null,
      },
      expect.any(FormData),
    );
  });

  it('shows an error toast when logout action returns an error', async () => {
    const user = userEvent.setup();
    const errorMessage = 'Failed to sign out';

    const action = vi.fn<LogoutAction>().mockResolvedValue({
      error: errorMessage,
    });

    render(<Logout action={action} label={label} />);

    await user.click(
      screen.getByRole('button', {
        name: label,
      }),
    );

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(errorMessage);
    });
  });

  it('does not show an error toast when logout succeeds', async () => {
    const user = userEvent.setup();

    const action = vi.fn<LogoutAction>().mockResolvedValue({
      error: null,
    });

    render(<Logout action={action} label={label} />);

    await user.click(
      screen.getByRole('button', {
        name: label,
      }),
    );

    await waitFor(() => {
      expect(action).toHaveBeenCalledTimes(1);
    });

    expect(toast.error).not.toHaveBeenCalled();
  });

  it('shows loading state while logout action is pending', async () => {
    const user = userEvent.setup();

    let resolveAction: ((state: { error: null }) => void) | undefined;

    const action = vi.fn<LogoutAction>(
      () =>
        new Promise((resolve) => {
          resolveAction = resolve;
        }),
    );

    render(<Logout action={action} label={label} />);

    const button = screen.getByRole('button', {
      name: label,
    });

    await user.click(button);

    await waitFor(() => {
      expect(button).toBeDisabled();
    });

    resolveAction?.({
      error: null,
    });

    await waitFor(() => {
      expect(button).not.toBeDisabled();
    });
  });
});
