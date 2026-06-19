import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { LoginForm } from './LoginForm';

type Credentials = {
  email: string;
  password: string;
};

const mocks = vi.hoisted(() => ({
  push: vi.fn(),
  refresh: vi.fn(),
  signInWithPassword: vi.fn<(credentials: Credentials) => Promise<unknown>>(),
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

describe('LoginForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mocks.signInWithPassword.mockResolvedValue({
      data: {
        user: {
          id: 'user-id',
        },
      },
    });
  });

  it('renders login form', () => {
    render(<LoginForm />);

    expect(screen.getByRole('heading', { name: 'Вход' })).toBeInTheDocument();
    expect(screen.getByLabelText('Почта')).toBeInTheDocument();
    expect(screen.getByLabelText('Пароль')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Войти' })).toBeInTheDocument();
    expect(screen.getByText('Нет аккаунта?')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Регистрация' })).toBeInTheDocument();
  });

  it('toggles password visibility', async () => {
    const user = userEvent.setup();

    render(<LoginForm />);

    const passwordInput = screen.getByLabelText('Пароль');

    expect(passwordInput).toHaveAttribute('type', 'password');

    await user.click(screen.getByRole('button', { name: 'Show password' }));

    expect(passwordInput).toHaveAttribute('type', 'text');

    await user.click(screen.getByRole('button', { name: 'Hide password' }));

    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('logs in and redirects to home page', async () => {
    const user = userEvent.setup();

    render(<LoginForm />);

    await user.type(screen.getByLabelText('Почта'), 'test@example.com');
    await user.type(screen.getByLabelText('Пароль'), 'password123');
    await user.click(screen.getByRole('button', { name: 'Войти' }));

    await waitFor(() => {
      expect(mocks.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });

    expect(mocks.push).toHaveBeenCalledWith('/');
    expect(mocks.refresh).toHaveBeenCalledTimes(1);
  });
});
