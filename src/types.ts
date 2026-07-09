export type EditorFormat = 'JSON' | 'YAML' | 'unknown';

export type ValidationErrorsLogin = {
  email?: string;
  password?: string;
};

export type ValidationErrorsRegistration = {
  email?: string;
  password?: string;
  repeatPassword?: string;
};

export type UserDataLogin = {
  email: string;
  password: string;
};

export type UserDataRegistration = {
  email: string;
  password: string;
  repeatPassword: string;
};

export type TranslationFn = (key: string, values?: Record<string, string | number | Date>) => string;
