export type ValidationErrors = {
  email?: string;
  password?: string;
};

export type LoginValidationResult =
  | {
      data: {
        email: string;
        password: string;
      };
      errors: null;
    }
  | {
      data: null;
      errors: ValidationErrors;
    };

export type TranslationFn = (key: string, values?: Record<string, string | number | Date>) => string;

export type LoginFormData = {
  email: string;
  password: string;
};
