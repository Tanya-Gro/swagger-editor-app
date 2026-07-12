'use client';

import { browserClient } from '@/database/browser-client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { validateLoginForm } from '@/utils/login/validate-form';
import { getSchema } from '@/utils/editor/schemaService/schemaService';
import { toast } from '@/utils/toast/toast';
import { type ValidationErrorsLogin } from '@/types';
import { type SubmitEvent, useState } from 'react';

import { Button, TextField } from '@mui/material';
import { PasswordField } from '@/components/PasswordField/PasswordField';

import { useTranslations } from 'next-intl';

import styles from './LoginForm.module.css';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

const supabase = browserClient();

export function LoginForm() {
  const router = useRouter();

  const t = useTranslations('LOGIN_PAGE');
  const tValidation = useTranslations('LOGIN_PAGE.validation');

  const [validationErrors, setValidationErrors] = useState<ValidationErrorsLogin>({});
  const [isLoading, setLoading] = useState<boolean>(false);

  async function handleLogin(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const { data: validatedData, errors } = validateLoginForm(new FormData(event.currentTarget), tValidation);

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
        toast.error(error.message);
        return;
      }

      toast.success(`${t('notifications.loginSuccessful')} ${data.user.email ?? ''}`);

      router.push('/');
      router.refresh();
      await getSchema(supabase, data.user.id);
    } catch (error) {
      setLoading(false);
      toast.error(error instanceof Error ? error.message : t('notifications.loginFailed'));
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
