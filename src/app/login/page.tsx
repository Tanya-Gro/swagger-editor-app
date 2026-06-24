import { LoginForm } from '@/components/LoginForm/LoginForm';
import { serverClient } from '@/database/server-client';
import { redirect } from 'next/navigation';

export default async function LoginPage() {
  const supabase = await serverClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect('/');
  }

  return <LoginForm />;
}
