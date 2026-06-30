export type EditorFormat = 'JSON' | 'YAML';

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
