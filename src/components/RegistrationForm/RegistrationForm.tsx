'use client';

import { PasswordField } from './PasswordField/PasswordField';
import Link from 'next/link';
import styles from './Registration.module.css';
import classNames from 'classnames/bind';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

const cx = classNames.bind(styles);

export function RegistrationForm() {
  return (
    <div className={cx('container')}>
      <h1 className={cx('title')}>Регистрация</h1>
      <form>
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
          label="Имя пользователя"
          id="username"
          name="username"
          variant="outlined"
          fullWidth
          helperText="Придумайте своё имя пользователя"
          margin="normal"
        />
        <PasswordField label="Придумайте пароль" id="password" name="password" />
        <PasswordField label="Повторите пароль" id="repeat-password" name="repeat-password" />
        <Button variant="contained" fullWidth type="submit" className={cx('button')}>
          Зарегестрироваться
        </Button>
      </form>
      <div className={cx('footer')}>
        <p>Уже есть аккаунт?</p>
        <Link href="/login" className={cx('link')}>
          Войти
        </Link>
      </div>
    </div>
  );
}
