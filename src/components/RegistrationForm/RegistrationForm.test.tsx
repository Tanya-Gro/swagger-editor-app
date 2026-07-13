import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NextIntlClientProvider } from 'next-intl';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import messages from '@messages/en.json';
import { RegistrationForm } from './RegistrationForm';

type SignUpCredentials = {
  email: string;
  password: string;
};

type SignUpSuccess = {
  data: {
    user: {
      id: string;
    };
    session: {
      access_token: string;
    };
  };
  error: null;
};

type SignUpFailure = {
  data: {
    user: null;
    session: null;
  };
  error: {
    code?: string;
    message: string;
  };
};

type SignUpResult = SignUpSuccess | SignUpFailure;

const mocks = vi.hoisted(() => ({
  push: vi.fn(),
  refresh: vi.fn(),
  signUp: vi.fn<(credentials: SignUpCredentials) => Promise<SignUpResult>>(),
  toastSuccess: vi.fn(),
  toastError: vi.fn(),
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
      signUp: mocks.signUp,
    },
  }),
}));

vi.mock('@/utils/toast/toast', () => ({
  toast: {
    success: mocks.toastSuccess,
    error: mocks.toastError,
  },
}));

const registrationMessages = messages.REGISTRATION_PAGE;
const validationMessages = messages.FORM_VALIDATION;
const databaseMessages = messages.DATABASE;

const validEmail = 'test@example.com';
const invalidEmail = 'invalid-email';
const validPassword = 'password123!';
const differentRepeatPassword = 'password123?';

function renderRegistrationForm() {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <RegistrationForm />
    </NextIntlClientProvider>,
  );
}

describe('RegistrationForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mocks.signUp.mockResolvedValue({
      data: {
        user: {
          id: 'user-id',
        },
        session: {
          access_token: 'access-token',
        },
      },
      error: null,
    });
  });

  it('renders registration form', () => {
    renderRegistrationForm();

    expect(screen.getByRole('heading', { name: registrationMessages.title })).toBeInTheDocument();
    expect(screen.getByLabelText(registrationMessages.emailLabel)).toBeInTheDocument();
    expect(screen.getByLabelText(registrationMessages.passwordLabel)).toBeInTheDocument();
    expect(screen.getByLabelText(registrationMessages.repeatPasswordLabel)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: registrationMessages.actionButtonText })).toBeInTheDocument();
    expect(screen.getByText(registrationMessages.infoText)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: registrationMessages.actionLinkText })).toBeInTheDocument();
  });

  it('registers user and redirects to home page', async () => {
    const user = userEvent.setup();

    renderRegistrationForm();

    await user.type(screen.getByLabelText(registrationMessages.emailLabel), validEmail);
    await user.type(screen.getByLabelText(registrationMessages.passwordLabel), validPassword);
    await user.type(screen.getByLabelText(registrationMessages.repeatPasswordLabel), validPassword);
    await user.click(screen.getByRole('button', { name: registrationMessages.actionButtonText }));

    await waitFor(() => {
      expect(mocks.signUp).toHaveBeenCalledWith({
        email: validEmail,
        password: validPassword,
      });
    });

    expect(mocks.toastSuccess).toHaveBeenCalledWith(databaseMessages.successful_registration);
    expect(mocks.push).toHaveBeenCalledWith('/');
    expect(mocks.refresh).toHaveBeenCalledTimes(1);
  });

  it('does not redirect when Supabase returns error', async () => {
    const user = userEvent.setup();

    mocks.signUp.mockResolvedValue({
      data: {
        user: null,
        session: null,
      },
      error: {
        code: 'user_already_exists',
        message: 'User already registered',
      },
    });

    renderRegistrationForm();

    await user.type(screen.getByLabelText(registrationMessages.emailLabel), validEmail);
    await user.type(screen.getByLabelText(registrationMessages.passwordLabel), validPassword);
    await user.type(screen.getByLabelText(registrationMessages.repeatPasswordLabel), validPassword);
    await user.click(screen.getByRole('button', { name: registrationMessages.actionButtonText }));

    await waitFor(() => {
      expect(mocks.signUp).toHaveBeenCalledWith({
        email: validEmail,
        password: validPassword,
      });
    });

    expect(mocks.toastError).toHaveBeenCalledWith(databaseMessages.user_already_exists);
    expect(mocks.push).not.toHaveBeenCalled();
    expect(mocks.refresh).not.toHaveBeenCalled();
  });

  it('uses unknown_error fallback when Supabase error code is missing', async () => {
    const user = userEvent.setup();

    mocks.signUp.mockResolvedValue({
      data: {
        user: null,
        session: null,
      },
      error: {
        message: 'Something went wrong',
      },
    });

    renderRegistrationForm();

    await user.type(screen.getByLabelText(registrationMessages.emailLabel), validEmail);
    await user.type(screen.getByLabelText(registrationMessages.passwordLabel), validPassword);
    await user.type(screen.getByLabelText(registrationMessages.repeatPasswordLabel), validPassword);
    await user.click(screen.getByRole('button', { name: registrationMessages.actionButtonText }));

    await waitFor(() => {
      expect(mocks.signUp).toHaveBeenCalled();
    });

    expect(mocks.toastError).toHaveBeenCalledWith(databaseMessages.unknown_error);
    expect(mocks.push).not.toHaveBeenCalled();
    expect(mocks.refresh).not.toHaveBeenCalled();
  });

  it('shows validation errors when submitting empty form', async () => {
    const user = userEvent.setup();

    renderRegistrationForm();

    await user.click(screen.getByRole('button', { name: registrationMessages.actionButtonText }));

    expect(await screen.findByText(validationMessages.invalidEmailFormat)).toBeInTheDocument();

    expect(await screen.findByText(validationMessages.invalidEmailFormat)).toBeInTheDocument();
    const passwordErrors = await screen.findAllByText(validationMessages.passwordMinLength);
    expect(passwordErrors).toHaveLength(2);

    expect(mocks.signUp).not.toHaveBeenCalled();
    expect(mocks.push).not.toHaveBeenCalled();
    expect(mocks.refresh).not.toHaveBeenCalled();
  });

  it('shows validation error for invalid email', async () => {
    const user = userEvent.setup();

    renderRegistrationForm();

    await user.type(screen.getByLabelText(registrationMessages.emailLabel), invalidEmail);
    await user.type(screen.getByLabelText(registrationMessages.passwordLabel), validPassword);
    await user.type(screen.getByLabelText(registrationMessages.repeatPasswordLabel), validPassword);
    await user.click(screen.getByRole('button', { name: registrationMessages.actionButtonText }));

    expect(await screen.findByText(validationMessages.invalidEmailFormat)).toBeInTheDocument();
    expect(mocks.signUp).not.toHaveBeenCalled();
    expect(mocks.push).not.toHaveBeenCalled();
    expect(mocks.refresh).not.toHaveBeenCalled();
  });

  it('shows validation error when passwords do not match', async () => {
    const user = userEvent.setup();

    renderRegistrationForm();

    await user.type(screen.getByLabelText(registrationMessages.emailLabel), validEmail);
    await user.type(screen.getByLabelText(registrationMessages.passwordLabel), validPassword);
    await user.type(screen.getByLabelText(registrationMessages.repeatPasswordLabel), differentRepeatPassword);
    await user.click(screen.getByRole('button', { name: registrationMessages.actionButtonText }));

    expect(await screen.findByText(validationMessages.repeatPassword)).toBeInTheDocument();
    expect(mocks.signUp).not.toHaveBeenCalled();
    expect(mocks.push).not.toHaveBeenCalled();
    expect(mocks.refresh).not.toHaveBeenCalled();
  });

  it('clears validation errors after successful validation', async () => {
    const user = userEvent.setup();

    renderRegistrationForm();

    await user.click(screen.getByRole('button', { name: registrationMessages.actionButtonText }));

    expect(await screen.findByText(validationMessages.invalidEmailFormat)).toBeInTheDocument();

    expect(await screen.findByText(validationMessages.invalidEmailFormat)).toBeInTheDocument();
    const passwordErrors = await screen.findAllByText(validationMessages.passwordMinLength);
    expect(passwordErrors).toHaveLength(2);

    await user.type(screen.getByLabelText(registrationMessages.emailLabel), validEmail);
    await user.type(screen.getByLabelText(registrationMessages.passwordLabel), validPassword);
    await user.type(screen.getByLabelText(registrationMessages.repeatPasswordLabel), validPassword);
    await user.click(screen.getByRole('button', { name: registrationMessages.actionButtonText }));

    await waitFor(() => {
      expect(mocks.signUp).toHaveBeenCalledWith({
        email: validEmail,
        password: validPassword,
      });
    });

    expect(screen.queryByText(validationMessages.invalidEmailFormat)).not.toBeInTheDocument();
    expect(screen.queryByText(validationMessages.passwordMinLength)).not.toBeInTheDocument();
  });
});
