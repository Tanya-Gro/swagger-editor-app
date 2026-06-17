import { createBrowserClient } from '@supabase/ssr';
import { type SupabaseClient } from '@supabase/supabase-js';
import { type Database } from './database.types';
import { supabaseUrl, supabaseKey } from './enviroment-variables';

export function browserClient(): SupabaseClient<Database> {
  return createBrowserClient(supabaseUrl, supabaseKey);
}
