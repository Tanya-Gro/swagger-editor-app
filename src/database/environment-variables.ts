const getVariable = (value: string | undefined, name: string): string => {
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
};

export const supabaseUrl = getVariable(process.env.NEXT_PUBLIC_SUPABASE_URL, 'NEXT_PUBLIC_SUPABASE_URL');

export const supabaseKey = getVariable(
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY',
);
