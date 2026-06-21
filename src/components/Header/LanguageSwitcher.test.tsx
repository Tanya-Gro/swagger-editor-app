import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NextIntlClientProvider } from 'next-intl';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import messages from '../../../messages/en.json';
import { LanguageSwitcher } from './LanguageSwitcher';

const mocks = vi.hoisted(() => ({
  refresh: vi.fn(),
  setLocale: vi.fn(() => Promise.resolve()),
}));

vi.mock('@/i18n/actions', () => ({
  setLocale: mocks.setLocale,
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ refresh: mocks.refresh }),
}));

function renderSwitcher(): void {
  render(
    <NextIntlClientProvider locale="en" messages={messages} timeZone="UTC">
      <LanguageSwitcher />
    </NextIntlClientProvider>,
  );
}

describe('LanguageSwitcher', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the target language', () => {
    renderSwitcher();

    expect(screen.getByRole('button', { name: 'Switch to Russian' })).toHaveTextContent('RU');
  });

  it('changes the locale and refreshes server components', async () => {
    const user = userEvent.setup();
    renderSwitcher();

    await user.click(screen.getByRole('button', { name: 'Switch to Russian' }));

    await waitFor(() => {
      expect(mocks.setLocale).toHaveBeenCalledWith('ru');
      expect(mocks.refresh).toHaveBeenCalledOnce();
    });
  });
});
