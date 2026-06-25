import { LoginSchema } from './schema';
import { type LoginValidationResult } from './types';
import { z } from 'zod';

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
