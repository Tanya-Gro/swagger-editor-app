'use client';
import { type SubmitEvent, useState } from 'react';
import styles from './LoginForm.module.css';
import classNames from 'classnames/bind';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const cx = classNames.bind(styles);

function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
  event.preventDefault();
}

export function LoginForm() {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  return (
    <div className={cx('container')}>
      <h1 className={cx('title')}>Вход</h1>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Имейл"
          id="email"
          name="email"
          variant="outlined"
          fullWidth
          helperText="Имейл в формате name@example.com"
          margin="normal"
        ></TextField>

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
        ></TextField>

        <Button variant="contained" fullWidth type="submit" className={cx('button')}>
          Войти
        </Button>
      </form>
      <div className={cx('footer')}>
        <p>Нет аккаунта?</p>
        <Button variant="text">Регистрация</Button>
      </div>
    </div>
  );
}
