'use client';

import { PasswordField } from '@/components/PasswordField/PasswordField';
import Link from 'next/link';
import styles from './Registration.module.css';
import classNames from 'classnames/bind';
import { useTranslations } from 'next-intl';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

const cx = classNames.bind(styles);

export function RegistrationForm() {
  const t = useTranslations('REGISTRATION_PAGE');

  return (
    <div className={cx('container')}>
      <h1 className={cx('title')}>{t('title')}</h1>
      <form>
        <TextField
          label={t('emailLabel')}
          id="email"
          name="email"
          variant="outlined"
          fullWidth
          helperText={t('emailHelperText')}
          margin="normal"
          autoComplete="email"
        />
        <TextField
          label={t('usernameLabel')}
          id="username"
          name="username"
          variant="outlined"
          fullWidth
          helperText={t('usernameHelperText')}
          margin="normal"
        />
        <PasswordField label={t('passwordLabel')} name="password" helperText={t('passwordHelperText')} />
        <PasswordField
          label={t('repeatPasswordLabel')}
          name="repeat-password"
          helperText={t('repeatPasswordHelperText')}
        />
        <Button variant="contained" fullWidth type="submit" className={cx('button')}>
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
