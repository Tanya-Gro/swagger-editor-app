import { createLoginSchema } from '@/utils/login/schema';
import { type ValidationResultLogin, type TranslationFn } from '@/types';
import { z } from 'zod';

export const validateLoginForm = (formData: FormData, t: TranslationFn): ValidationResultLogin => {
  const formValues = Object.fromEntries(formData);
  const result = createLoginSchema(t).safeParse(formValues);

  if (!result.success) {
    const fieldErrors = z.treeifyError(result.error).properties;

    return {
      data: null,
      errors: {
        email: fieldErrors?.email?.errors[0],
        password: fieldErrors?.password?.errors[0],
      },
    };
  }

  return {
    data: result.data,
    errors: null,
  };
};
