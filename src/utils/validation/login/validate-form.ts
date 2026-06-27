import { createLoginSchema } from './schema';
import { type LoginValidationResult, type TranslationFn } from './types';
import { z } from 'zod';

export const validateLoginForm = (formData: FormData, t: TranslationFn): LoginValidationResult => {
  const formValues = Object.fromEntries(formData);
  const result = createLoginSchema(t).safeParse(formValues);

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
