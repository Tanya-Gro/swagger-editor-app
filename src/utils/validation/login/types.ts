export type ValidationErrors = {
  email?: string;
  password?: string;
};

export type UserData = {
  email: string;
  password: string;
};

export type LoginValidationResult = {
  data: UserData | null;
  errors: ValidationErrors | null;
};

export type TranslationFn = (key: string, values?: Record<string, string | number | Date>) => string;
