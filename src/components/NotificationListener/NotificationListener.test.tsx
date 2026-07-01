import { render } from '@testing-library/react';
import { SnackbarProvider } from 'notistack';
import { describe, expect, it, vi } from 'vitest';
import { GlobalNotificationListener } from './NotificationListener';

const enqueueSnackbar = vi.fn();

vi.mock('notistack', async () => {
  const actual = await vi.importActual<typeof import('notistack')>('notistack');

  return {
    ...actual,
    useSnackbar: () => ({
      enqueueSnackbar,
    }),
  };
});

describe('NotificationListener', () => {
  it('shows snackbar after event', () => {
    render(
      <SnackbarProvider>
        <GlobalNotificationListener />
      </SnackbarProvider>,
    );

    globalThis.dispatchEvent(
      new CustomEvent('app:toast', {
        detail: {
          message: 'Validation failed',
          variant: 'error',
        },
      }),
    );

    expect(enqueueSnackbar).toHaveBeenCalledWith(
      'Validation failed',
      expect.objectContaining({
        variant: 'error',
        autoHideDuration: 5000,
      }),
    );
  });

  it('uses shorter timeout for success', () => {
    render(
      <SnackbarProvider>
        <GlobalNotificationListener />
      </SnackbarProvider>,
    );

    globalThis.dispatchEvent(
      new CustomEvent('app:toast', {
        detail: {
          message: 'Saved',
          variant: 'success',
        },
      }),
    );

    expect(enqueueSnackbar).toHaveBeenCalledWith(
      'Saved',
      expect.objectContaining({
        autoHideDuration: 3000,
      }),
    );
  });
});
