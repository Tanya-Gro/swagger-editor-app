import { createServerClient } from '@supabase/ssr';
import { type SupabaseClient } from '@supabase/supabase-js';
import { type Database } from './database.types';
import { cookies } from 'next/headers';
import { supabaseUrl, supabaseKey } from './environment-variables';

export async function serverClient(): Promise<SupabaseClient<Database, 'public' | 'graphql_public'>> {
  const cookieStore = await cookies();

  return createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch (error) {
          console.error('Failed to set Supabase auth cookies in serverClient:', error);
        }
      },
    },
  });
}
