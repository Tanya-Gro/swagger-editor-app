import { type VariantType } from 'notistack';
import { type ReactNode } from 'react';

export type ToastEventDetail = {
  message: ReactNode;
  variant?: VariantType;
};

const show = ({ message, variant = 'info' }: ToastEventDetail): void => {
  if (!('window' in globalThis)) {
    return;
  }

  const event = new CustomEvent<ToastEventDetail>('app:toast', {
    detail: { message, variant },
  });
  globalThis.dispatchEvent(event);
};

export const toast = {
  show,
  success(message: ReactNode): void {
    show({ message, variant: 'success' });
  },
  error(message: ReactNode): void {
    show({ message, variant: 'error' });
  },
  warning(message: ReactNode): void {
    show({ message, variant: 'warning' });
  },
  info(message: ReactNode): void {
    show({ message });
  },
};
