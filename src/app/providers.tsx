'use client';

import { type ReactNode } from 'react';
import { SnackbarProvider } from 'notistack';
import { ThemeRegistry } from '@/theme/ThemeRegistry';
import { GlobalNotificationListener } from '@/components/NotificationListener/NotificationListener';

export default function Providers({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <ThemeRegistry>
      <SnackbarProvider maxSnack={4}>
        {children}
        <GlobalNotificationListener />
      </SnackbarProvider>
    </ThemeRegistry>
  );
}
