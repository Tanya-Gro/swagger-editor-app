import { z } from 'zod';
import { type TranslationFn, type LoginFormData } from './types';

export const createLoginSchema = (t: TranslationFn): z.ZodType<LoginFormData> => {
  return z.object({
    email: z.email({ error: t('invalidEmailFormat') }),
    password: z
      .string()
      .trim()
      .nonempty({ error: t('invalidPassword') }),
  });
};
