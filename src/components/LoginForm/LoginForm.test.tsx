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

const loginMessages = messages.LOGIN_PAGE;
const validationMessages = loginMessages.validation;
const password = messages.PASSWORD;

const validEmail = 'test@example.com';
const invalidEmail = 'invalid-email';
const validPassword = 'password123!';
const validPasswordWithDoubleSpecialChar = 'password123!!';

function renderLoginForm() {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <LoginForm />
    </NextIntlClientProvider>,
  );
}

describe('LoginForm', () => {
  beforeEach(() => {
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

    expect(screen.getByRole('heading', { name: loginMessages.title })).toBeInTheDocument();
    expect(screen.getByLabelText(loginMessages.emailLabel)).toBeInTheDocument();
    expect(screen.getByLabelText(loginMessages.passwordLabel)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: loginMessages.actionButtonText })).toBeInTheDocument();
    expect(screen.getByText(loginMessages.hintText)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: loginMessages.linkText })).toBeInTheDocument();
  });

  it('toggles password visibility', async () => {
    const user = userEvent.setup();

    renderLoginForm();

    const passwordInput = screen.getByLabelText(loginMessages.passwordLabel);

    expect(passwordInput).toHaveAttribute('type', 'password');

    await user.click(screen.getByRole('button', { name: password.showPasswordButtonLabel }));

    expect(passwordInput).toHaveAttribute('type', 'text');

    await user.click(screen.getByRole('button', { name: password.hidePasswordButtonLabel }));

    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('logs in and redirects to home page', async () => {
    const user = userEvent.setup();

    renderLoginForm();

    await user.type(screen.getByLabelText(loginMessages.emailLabel), validEmail);
    await user.type(screen.getByLabelText(loginMessages.passwordLabel), validPasswordWithDoubleSpecialChar);
    await user.click(screen.getByRole('button', { name: loginMessages.actionButtonText }));

    await waitFor(() => {
      expect(mocks.signInWithPassword).toHaveBeenCalledWith({
        email: validEmail,
        password: validPasswordWithDoubleSpecialChar,
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

    await user.type(screen.getByLabelText(loginMessages.emailLabel), validEmail);
    await user.type(screen.getByLabelText(loginMessages.passwordLabel), validPassword);
    await user.click(screen.getByRole('button', { name: loginMessages.actionButtonText }));

    await waitFor(() => {
      expect(mocks.signInWithPassword).toHaveBeenCalledWith({
        email: validEmail,
        password: validPassword,
      });
    });

    expect(mocks.push).not.toHaveBeenCalled();
    expect(mocks.refresh).not.toHaveBeenCalled();
  });

  it('shows validation errors when submitting empty form', async () => {
    const user = userEvent.setup();

    renderLoginForm();

    await user.click(screen.getByRole('button', { name: loginMessages.actionButtonText }));

    expect(await screen.findByText(validationMessages.invalidEmailFormat)).toBeInTheDocument();
    expect(await screen.findByText(validationMessages.passwordMinLength)).toBeInTheDocument();
    expect(mocks.signInWithPassword).not.toHaveBeenCalled();
    expect(mocks.push).not.toHaveBeenCalled();
    expect(mocks.refresh).not.toHaveBeenCalled();
  });

  it('shows validation error for invalid email', async () => {
    const user = userEvent.setup();

    renderLoginForm();

    await user.type(screen.getByLabelText(loginMessages.emailLabel), invalidEmail);
    await user.type(screen.getByLabelText(loginMessages.passwordLabel), validPassword);
    await user.click(screen.getByRole('button', { name: loginMessages.actionButtonText }));

    expect(await screen.findByText(validationMessages.invalidEmailFormat)).toBeInTheDocument();
    expect(mocks.signInWithPassword).not.toHaveBeenCalled();
    expect(mocks.push).not.toHaveBeenCalled();
    expect(mocks.refresh).not.toHaveBeenCalled();
  });

  it('clears validation errors after successful validation', async () => {
    const user = userEvent.setup();

    renderLoginForm();

    await user.click(screen.getByRole('button', { name: loginMessages.actionButtonText }));

    expect(await screen.findByText(validationMessages.invalidEmailFormat)).toBeInTheDocument();
    expect(await screen.findByText(validationMessages.passwordMinLength)).toBeInTheDocument();

    await user.type(screen.getByLabelText(loginMessages.emailLabel), validEmail);
    await user.type(screen.getByLabelText(loginMessages.passwordLabel), validPassword);
    await user.click(screen.getByRole('button', { name: loginMessages.actionButtonText }));

    await waitFor(() => {
      expect(mocks.signInWithPassword).toHaveBeenCalledWith({
        email: validEmail,
        password: validPassword,
      });
    });

    expect(screen.queryByText(validationMessages.invalidEmailFormat)).not.toBeInTheDocument();
    expect(screen.queryByText(validationMessages.passwordMinLength)).not.toBeInTheDocument();
  });
});
