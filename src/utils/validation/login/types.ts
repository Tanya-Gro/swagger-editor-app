export type ValidationErrors = {
  email?: string;
  password?: string;
};

export type LoginValidationResult =
  | {
      success: true;
      data: {
        email: string;
        password: string;
      };
    }
  | {
      success: false;
      errors: ValidationErrors;
    };

export type TranslationFn = (key: string, values?: Record<string, string | number | Date>) => string;

export type LoginFormData = {
  email: string;
  password: string;
};
