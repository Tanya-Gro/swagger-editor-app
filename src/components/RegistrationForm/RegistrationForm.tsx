'use client';

import { PasswordField } from '@/components/PasswordField/PasswordField';
import Link from 'next/link';
import styles from './Registration.module.css';
import classNames from 'classnames/bind';
import { useTranslations } from 'next-intl';
import { registrationAction } from '@/app/registration/register-action';
import { useActionState } from 'react';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

const cx = classNames.bind(styles);

export function RegistrationForm() {
  const t = useTranslations('REGISTRATION_PAGE');

  const [state, formAction, isPending] = useActionState(registrationAction, {
    data: null,
    errors: null,
    databaseError: null,
  });

  if (state.data) {
    console.info(state.data);
  }

  if (state.databaseError) {
    console.error(state.databaseError);
  }

  return (
    <div className={cx('container')}>
      <h1 className={cx('title')}>{t('title')}</h1>
      <form action={formAction}>
        <TextField
          label={t('emailLabel')}
          id="email"
          name="email"
          variant="outlined"
          fullWidth
          error={Boolean(state.errors?.email)}
          helperText={state.errors?.email ?? t('emailHelperText')}
          margin="normal"
          autoComplete="email"
        />
        <TextField
          label={t('usernameLabel')}
          id="username"
          name="username"
          variant="outlined"
          fullWidth
          error={Boolean(state.errors?.username)}
          helperText={state.errors?.username ?? t('usernameHelperText')}
          margin="normal"
        />
        <PasswordField
          label={t('passwordLabel')}
          name="password"
          helperText={t('passwordHelperText')}
          error={state.errors?.password}
        />
        <PasswordField
          label={t('repeatPasswordLabel')}
          name="repeatPassword"
          helperText={t('repeatPasswordHelperText')}
          error={state.errors?.repeatPassword}
        />
        <Button variant="contained" fullWidth type="submit" className={cx('button')} loading={isPending}>
          {t('actionButtonText')}
        </Button>
      </form>
      <div className={cx('footer')}>
        <p>{t('infoText')}</p>
        <Link href="/login" className={cx('link')}>
          {t('actionLinkText')}
        </Link>
      </div>
    </div>
  );
}
