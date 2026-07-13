import { z } from 'zod';
import { type TranslationFn, type UserDataLogin } from '@/types';

const MIN_LENGTH = 8;

export const createLoginSchema = (t: TranslationFn): z.ZodType<UserDataLogin> => {
  return z.object({
    email: z.email({ error: t('invalidEmailFormat') }),
    password: z
      .string()
      .min(MIN_LENGTH, { error: t('passwordMinLength') })
      .regex(/[a-zA-Z]/, { error: t('passwordLetter') })
      .regex(/[0-9]/, { error: t('passwordDigit') })
      .regex(/[.,?!@#$%^&*()_\-+=]/, { error: t('passwordSpecialChar') }),
  });
};
