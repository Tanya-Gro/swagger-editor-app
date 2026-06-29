import { z } from 'zod';
import { type TranslationFn, type UserData } from './types';

const MIN_LENGTH = 8;

export const createLoginSchema = (t: TranslationFn): z.ZodType<UserData> => {
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
