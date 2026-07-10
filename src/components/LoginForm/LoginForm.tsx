'use client';

import { type SubmitEvent, useState } from 'react';
import styles from './LoginForm.module.css';
import classNames from 'classnames/bind';
import { browserClient } from '@/database/browser-client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { type ValidationErrorsLogin } from '@/types';
import { validateForm } from '@/utils/forms/validate-form';
import { createLoginSchema } from '@/utils/forms/login-schema';

import { Button, TextField } from '@mui/material';
import { PasswordField } from '@/components/PasswordField/PasswordField';
import { useTranslations } from 'next-intl';

const cx = classNames.bind(styles);

const supabase = browserClient();

export function LoginForm() {
  const router = useRouter();

  const t = useTranslations('LOGIN_PAGE');
  const tValidation = useTranslations('FORM_VALIDATION');

  const [validationErrors, setValidationErrors] = useState<ValidationErrorsLogin>({});
  const [isLoading, setLoading] = useState<boolean>(false);

  async function handleLogin(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const { data: validatedData, errors } = validateForm(
      new FormData(event.currentTarget),
      createLoginSchema(tValidation),
    );

    if (!validatedData) {
      setValidationErrors(errors ?? {});
      return;
    }

    setValidationErrors({});

    try {
      setLoading(true);

      const { data, error } = await supabase.auth.signInWithPassword({
        email: validatedData.email,
        password: validatedData.password,
      });

      if (error) {
        setLoading(false);
        console.error(error);
        return;
      }

      console.info(data);

      router.push('/');
      router.refresh();
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  }

  return (
    <div className={cx('container')}>
      <h1 className={cx('title')}>{t('title')}</h1>
      <form onSubmit={(event) => void handleLogin(event)}>
        <TextField
          label={t('emailLabel')}
          id="email"
          name="email"
          variant="outlined"
          fullWidth
          error={Boolean(validationErrors.email)}
          helperText={validationErrors.email ?? t('emailHelperText')}
          margin="normal"
          autoComplete="email"
        />

        <PasswordField
          label={t('passwordLabel')}
          name="password"
          helperText={t('passwordHelperText')}
          error={validationErrors.password}
          autocomplete="current-password"
        />

        <Button variant="contained" fullWidth type="submit" className={cx('button')} loading={isLoading}>
          {t('actionButtonText')}
        </Button>
      </form>
      <div className={cx('footer')}>
        <p>{t('hintText')}</p>
        <Link href="/registration" className={cx('link')}>
          {t('linkText')}
        </Link>
      </div>
    </div>
  );
}
