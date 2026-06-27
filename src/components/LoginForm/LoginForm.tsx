'use client';

import { type SubmitEvent, useState } from 'react';
import styles from './LoginForm.module.css';
import classNames from 'classnames/bind';
import { browserClient } from '@/database/browser-client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { type ValidationErrors } from '@/utils/validation/login/types';
import { validateLoginForm } from '@/utils/validation/login/validate-form';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { PasswordField } from '@/components/LoginForm/PasswordField/PasswordField';
import { useTranslations } from 'next-intl';

const cx = classNames.bind(styles);

const supabase = browserClient();

export function LoginForm() {
  const router = useRouter();
  const tValidation = useTranslations('LOGIN_PAGE.validation');

  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  async function handleLogin(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationResult = validateLoginForm(new FormData(event.currentTarget), tValidation);

    if (!validationResult.success) {
      setValidationErrors(validationResult.errors);
      return;
    }

    setValidationErrors({});

    const { email, password } = validationResult.data;

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error(error);
        return;
      }

      console.info(data);

      router.push('/');
      router.refresh();
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className={cx('container')}>
      <h1 className={cx('title')}>Вход</h1>
      <form onSubmit={(event) => void handleLogin(event)}>
        <TextField
          label="Почта"
          id="email"
          name="email"
          variant="outlined"
          fullWidth
          error={Boolean(validationErrors.email)}
          helperText={validationErrors.email ?? 'Почта в формате name@example.com'}
          margin="normal"
          autoComplete="email"
        />

        <PasswordField label="Пароль" id="password" name="password" error={validationErrors.password} />

        <Button variant="contained" fullWidth type="submit" className={cx('button')}>
          Войти
        </Button>
      </form>
      <div className={cx('footer')}>
        <p>Нет аккаунта?</p>
        <Link href="/registration" className={cx('link')}>
          Регистрация
        </Link>
      </div>
    </div>
  );
}
