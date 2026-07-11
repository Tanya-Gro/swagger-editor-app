'use server';

import { serverClient } from '@/database/server-client';
import { redirect } from 'next/navigation';

export async function logoutAction(): Promise<never> {
  const supabase = await serverClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error('Cannot logout:', error);
  }

  redirect('/');
}
