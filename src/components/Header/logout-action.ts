'use server';

import { serverClient } from '@/database/server-client';
import { redirect } from 'next/navigation';
import { type LogoutState } from '@/types';

export async function logoutAction(_previousState: LogoutState): Promise<LogoutState> {
  const supabase = await serverClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    return { error: error.message };
  }

  redirect('/');
}
