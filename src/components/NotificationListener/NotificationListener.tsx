'use client';

import { useEffect } from 'react';
import { useSnackbar } from 'notistack';
import { type ToastEventDetail } from '@/utils/toast/toast';

const ERROR_AUTO_HIDE_DURATION = 5000;
const DEFAULT_AUTO_HIDE_DURATION = 3000;

export function GlobalNotificationListener() {
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const handleToastEvent = (event: Event) => {
      if (!isToastEvent(event)) {
        return;
      }

      const { message, variant } = event.detail;

      enqueueSnackbar(message, {
        variant,
        autoHideDuration: variant === 'error' ? ERROR_AUTO_HIDE_DURATION : DEFAULT_AUTO_HIDE_DURATION,
        preventDuplicate: true,
      });
    };

    globalThis.addEventListener('app:toast', handleToastEvent);

    return () => {
      globalThis.removeEventListener('app:toast', handleToastEvent);
    };
  }, [enqueueSnackbar]);

  return null;
}

function isToastEvent(event: Event): event is CustomEvent<ToastEventDetail> {
  return event.type === 'app:toast';
}
