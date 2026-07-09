'use client';

import { PasswordField } from '@/components/PasswordField/PasswordField';
import Link from 'next/link';
import styles from './Registration.module.css';
import classNames from 'classnames/bind';
import { useTranslations } from 'next-intl';
import { type SubmitEvent, useState } from 'react';
import { validateForm } from '@/utils/forms/validate-form';
import { type ValidationErrorsRegistration } from '@/types';
import { createRegistrationSchema } from '@/utils/forms/registration-schema';
import { browserClient } from '@/database/browser-client';
import { toast } from '@/utils/toast/toast';
import { useRouter } from 'next/navigation';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

const cx = classNames.bind(styles);

const supabase = browserClient();

export function RegistrationForm() {
  const t = useTranslations('REGISTRATION_PAGE');
  const tValidation = useTranslations('FORM_VALIDATION');
  const tDatabase = useTranslations('DATABASE');

  const router = useRouter();

  const [validationErrors, setValidationErrors] = useState<ValidationErrorsRegistration>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function handleRegistration(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const { data: validatedData, errors } = validateForm(
      new FormData(event.currentTarget),
      createRegistrationSchema(tValidation),
    );

    if (!validatedData) {
      setValidationErrors(errors ?? {});
      return;
    }

    setValidationErrors({});

    try {
      setIsLoading(true);

      const { data: _registrationData, error } = await supabase.auth.signUp({
        email: validatedData.email,
        password: validatedData.password,
      });

      if (error) {
        setIsLoading(false);

        const errorCode = typeof error.code === 'string' ? error.code : 'unknown_error';

        toast.error(tDatabase(errorCode));
        return;
      }

      setIsLoading(false);
      toast.success(tDatabase('successful_registration'));

      router.push('/');
      router.refresh();
    } catch (error) {
      setIsLoading(false);
      console.error(error);
      toast.error(tDatabase('unknow_error'));
    }
  }

  return (
    <div className={cx('container')}>
      <h1 className={cx('title')}>{t('title')}</h1>
      <form onSubmit={(event) => void handleRegistration(event)}>
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
        <PasswordField
          label={t('repeatPasswordLabel')}
          name="repeatPassword"
          helperText={t('repeatPasswordHelperText')}
          error={validationErrors.repeatPassword}
        />
        <Button variant="contained" fullWidth type="submit" className={cx('button')} loading={isLoading}>
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
