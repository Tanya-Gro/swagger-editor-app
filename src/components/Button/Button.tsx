import type { ButtonHTMLAttributes, ReactNode } from 'react';
import styles from './Button.module.css';

type ButtonVariant = 'primary' | 'secondary';

type ButtonProperties = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: ButtonVariant;
};

export function Button({ children, className, type = 'button', variant = 'primary', ...properties }: ButtonProperties) {
  const buttonClassName = [styles.button, styles[variant], className].filter(Boolean).join(' ');

  return (
    <button className={buttonClassName} type={type} {...properties}>
      {children}
    </button>
  );
}
