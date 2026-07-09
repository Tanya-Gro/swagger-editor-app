import type { User } from '@supabase/supabase-js';

export type EditorFormat = 'JSON' | 'YAML' | 'unknown';

export type ValidationErrorsLogin = {
  email?: string;
  password?: string;
};

export type UserDataLogin = {
  email: string;
  password: string;
};

export type ValidationResultLogin = {
  data: UserDataLogin | null;
  errors: ValidationErrorsLogin | null;
};

export type TranslationFn = (key: string, values?: Record<string, string | number | Date>) => string;

export type UserDataRegistration = {
  email: string;
  username: string;
  password: string;
  repeatPassword: string;
};

export type ValidationErrorsRegistration = {
  email?: string;
  username?: string;
  password?: string;
  repeatPassword?: string;
};

export type RegistrationResult = {
  data: User | null;
  errors: ValidationErrorsRegistration | null;
  databaseError: string | null;
};
