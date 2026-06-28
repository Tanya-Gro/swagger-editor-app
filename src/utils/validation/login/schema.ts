import { z } from 'zod';
import { type TranslationFn, type LoginFormData } from './types';

const MIN_LENGTH = 8;

const hasLetter = (value: string): boolean => /[a-zA-Z]/.test(value);
const hasDigit = (value: string): boolean => /[0-9]/.test(value);
const hasSpecialChar = (value: string): boolean => /[.,?!@#$%^&*()_\-+=]/.test(value);

export const createLoginSchema = (t: TranslationFn): z.ZodType<LoginFormData> => {
  return z.object({
    email: z.email({ error: t('invalidEmailFormat') }),
    password: z
      .string()
      .min(MIN_LENGTH, { error: t('passwordMinLenght') })
      .refine(hasLetter, { error: t('passwordLetter') })
      .refine(hasDigit, { error: t('passwordDigit') })
      .refine(hasSpecialChar, { error: t('passwordSpecialChar') }),
  });
};
