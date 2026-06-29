import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { LoginForm } from './LoginForm';
import { NextIntlClientProvider } from 'next-intl';
import messages from '@messages/en.json';

type Credentials = {
  email: string;
  password: string;
};

type SignInSuccess = {
  data: {
    user: {
      id: string;
    };
  };
  error: null;
};

type SignInFailure = {
  data: {
    user: null;
    session: null;
  };
  error: Error;
};

type SignInResult = SignInSuccess | SignInFailure;

const mocks = vi.hoisted(() => ({
  push: vi.fn(),
  refresh: vi.fn(),
  signInWithPassword: vi.fn<(credentials: Credentials) => Promise<SignInResult>>(),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mocks.push,
    refresh: mocks.refresh,
  }),
}));

vi.mock('@/database/browser-client', () => ({
  browserClient: () => ({
    auth: {
      signInWithPassword: mocks.signInWithPassword,
    },
  }),
}));

function renderLoginForm() {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <LoginForm />
    </NextIntlClientProvider>,
  );
}

describe('LoginForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mocks.signInWithPassword.mockResolvedValue({
      data: {
        user: {
          id: 'user-id',
        },
      },
      error: null,
    });
  });

  it('renders login form', () => {
    renderLoginForm();

    expect(screen.getByRole('heading', { name: 'Вход' })).toBeInTheDocument();
    expect(screen.getByLabelText('Почта')).toBeInTheDocument();
    expect(screen.getByLabelText('Пароль')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /войти/i })).toBeInTheDocument();
    expect(screen.getByText('Нет аккаунта?')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Регистрация' })).toBeInTheDocument();
  });

  it('toggles password visibility', async () => {
    const user = userEvent.setup();

    renderLoginForm();

    const passwordInput = screen.getByLabelText('Пароль');

    expect(passwordInput).toHaveAttribute('type', 'password');

    await user.click(screen.getByRole('button', { name: 'Show password' }));

    expect(passwordInput).toHaveAttribute('type', 'text');

    await user.click(screen.getByRole('button', { name: 'Hide password' }));

    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('logs in and redirects to home page', async () => {
    const user = userEvent.setup();

    renderLoginForm();

    await user.type(screen.getByLabelText('Почта'), 'test@example.com');
    await user.type(screen.getByLabelText('Пароль'), 'password123!!');
    await user.click(screen.getByRole('button', { name: /войти/i }));

    await waitFor(() => {
      expect(mocks.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123!!',
      });
    });

    expect(mocks.push).toHaveBeenCalledWith('/');
    expect(mocks.refresh).toHaveBeenCalledTimes(1);
  });

  it('does not redirect when Supabase returns error', async () => {
    const user = userEvent.setup();

    mocks.signInWithPassword.mockResolvedValue({
      data: {
        user: null,
        session: null,
      },
      error: new Error('Invalid login credentials'),
    });

    renderLoginForm();

    await user.type(screen.getByLabelText('Почта'), 'test@example.com');
    await user.type(screen.getByLabelText('Пароль'), 'password123!');
    await user.click(screen.getByRole('button', { name: /войти/i }));

    await waitFor(() => {
      expect(mocks.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123!',
      });
    });

    expect(mocks.push).not.toHaveBeenCalled();
    expect(mocks.refresh).not.toHaveBeenCalled();
  });

  it('shows validation errors when submitting empty form', async () => {
    const user = userEvent.setup();

    renderLoginForm();

    await user.click(screen.getByRole('button', { name: /войти/i }));

    expect(await screen.findByText(messages.LOGIN_PAGE.validation.invalidEmailFormat)).toBeInTheDocument();
    expect(await screen.findByText(messages.LOGIN_PAGE.validation.passwordMinLength)).toBeInTheDocument();
    expect(mocks.signInWithPassword).not.toHaveBeenCalled();
    expect(mocks.push).not.toHaveBeenCalled();
    expect(mocks.refresh).not.toHaveBeenCalled();
  });

  it('shows validation error for invalid email', async () => {
    const user = userEvent.setup();

    renderLoginForm();

    await user.type(screen.getByLabelText('Почта'), 'invalid-email');
    await user.type(screen.getByLabelText('Пароль'), 'password123!');
    await user.click(screen.getByRole('button', { name: /войти/i }));

    expect(await screen.findByText(messages.LOGIN_PAGE.validation.invalidEmailFormat)).toBeInTheDocument();
    expect(mocks.signInWithPassword).not.toHaveBeenCalled();
    expect(mocks.push).not.toHaveBeenCalled();
    expect(mocks.refresh).not.toHaveBeenCalled();
  });

  it('clears validation errors after successful validation', async () => {
    const user = userEvent.setup();

    renderLoginForm();

    await user.click(screen.getByRole('button', { name: /войти/i }));

    expect(await screen.findByText(messages.LOGIN_PAGE.validation.invalidEmailFormat)).toBeInTheDocument();
    expect(await screen.findByText(messages.LOGIN_PAGE.validation.passwordMinLength)).toBeInTheDocument();

    await user.type(screen.getByLabelText('Почта'), 'test@example.com');
    await user.type(screen.getByLabelText('Пароль'), 'password123!');
    await user.click(screen.getByRole('button', { name: /войти/i }));

    await waitFor(() => {
      expect(mocks.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123!',
      });
    });

    expect(screen.queryByText(messages.LOGIN_PAGE.validation.invalidEmailFormat)).not.toBeInTheDocument();
    expect(screen.queryByText(messages.LOGIN_PAGE.validation.passwordMinLength)).not.toBeInTheDocument();
  });
});
