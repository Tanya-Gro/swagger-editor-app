'use client';

import { type SubmitEvent, useState } from 'react';
import styles from './LoginForm.module.css';
import classNames from 'classnames/bind';
import { browserClient } from '@/database/browser-client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const cx = classNames.bind(styles);

const supabase = browserClient();

export function LoginForm() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState<boolean>(false);

  async function handleLogin(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      const formData = new FormData(event.currentTarget);

      const email = formData.get('email');
      const password = formData.get('password');

      if (typeof email !== 'string' || typeof password !== 'string') {
        return;
      }

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
          helperText="Почта в формате name@example.com"
          margin="normal"
          autoComplete="email"
        />

        <TextField
          label="Пароль"
          id="password"
          name="password"
          type={showPassword ? 'text' : 'password'}
          variant="outlined"
          fullWidth
          margin="normal"
          helperText={'Ваш пароль'}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    onClick={() => setShowPassword((prev) => !prev)}
                    onMouseDown={(event) => event.preventDefault()}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
          autoComplete="current-password"
        />

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
