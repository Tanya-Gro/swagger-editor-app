import { createBrowserClient } from '@supabase/ssr';
import { type SupabaseClient } from '@supabase/supabase-js';
import { type Database } from './database.types';
import { supabaseUrl, supabaseKey } from './environment-variables';

export function browserClient(): SupabaseClient<Database, 'public' | 'graphql_public'> {
  return createBrowserClient(supabaseUrl, supabaseKey);
}
