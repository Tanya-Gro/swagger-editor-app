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
