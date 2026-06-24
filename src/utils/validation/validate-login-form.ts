import { LoginSchema } from './login-schema';
import { z } from 'zod';

export type ValidationErrors = {
  email?: string;
  password?: string;
};

type LoginValidationResult =
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

export const validateLoginForm = (formData: FormData): LoginValidationResult => {
  const formValues = Object.fromEntries(formData);
  const result = LoginSchema.safeParse(formValues);

  if (!result.success) {
    const fieldErrors = z.treeifyError(result.error).properties;

    return {
      success: false,
      errors: {
        email: fieldErrors?.email?.errors[0],
        password: fieldErrors?.password?.errors[0],
      },
    };
  }

  return {
    success: true,
    data: result.data,
  };
};
