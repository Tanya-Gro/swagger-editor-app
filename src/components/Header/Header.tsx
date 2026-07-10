import { serverClient } from '@/database/server-client';
import { HeaderView } from '@/views/Header/Header';
import { logoutAction } from './logout-action';

export async function Header() {
  const supabase = await serverClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    throw error;
  }

  return <HeaderView isAuthenticated={user !== null} logoutAction={logoutAction} />;
}
