'use client';
import { type SubmitEvent } from 'react';
import { TextField, Button } from '@mui/material';
import styles from './LoginForm.module.css';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
  event.preventDefault();
}

export function LoginForm() {
  return (
    <div className={cx('container')}>
      <h1 className={cx('title')}>Вход</h1>
      <form className={cx('form')} onSubmit={handleSubmit}>
        <div className={cx('field')}>
          <label htmlFor="email" className={cx('label')}>
            Имейл
          </label>
          <TextField id="email" name="email" variant="outlined" fullWidth placeholder="name@example.com"></TextField>
        </div>

        <div>
          <label htmlFor="password" className={cx('label')}>
            Пароль
          </label>
          <TextField
            id="password"
            name="password"
            variant="outlined"
            fullWidth
            placeholder="Введите ваш пароль"
          ></TextField>
        </div>

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
