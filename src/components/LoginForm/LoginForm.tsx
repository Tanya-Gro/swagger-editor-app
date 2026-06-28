'use client';

import { type SubmitEvent, useState } from 'react';
import styles from './LoginForm.module.css';
import classNames from 'classnames/bind';
import { browserClient } from '@/database/browser-client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { type ValidationErrors } from '@/utils/validation/login/types';
import { validateLoginForm } from '@/utils/validation/login/validate-form';

import { Button, TextField } from '@mui/material';
import { PasswordField } from '@/components/LoginForm/PasswordField/PasswordField';
import { useTranslations } from 'next-intl';

const cx = classNames.bind(styles);

const supabase = browserClient();

export function LoginForm() {
  const router = useRouter();

  const t = useTranslations('LOGIN_PAGE');
  const tValidation = useTranslations('LOGIN_PAGE.validation');

  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  async function handleLogin(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const { data: validatedData, errors } = validateLoginForm(new FormData(event.currentTarget), tValidation);

    if (errors) {
      setValidationErrors(errors);
      return;
    }

    setValidationErrors({});

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: validatedData.email,
        password: validatedData.password,
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
          id="password"
          name="password"
          helperText={t('passwordHelperText')}
          error={validationErrors.password}
        />

        <Button variant="contained" fullWidth type="submit" className={cx('button')}>
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
