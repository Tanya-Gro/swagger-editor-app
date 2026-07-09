import { z, type ZodType } from 'zod';
import { type TranslationFn, type UserDataRegistration } from '@/types';

const MIN_USERNAME_LENGTH = 3;
const MIN_PASSWORD_LENGTH = 8;

export const createRegistrationSchema = (t: TranslationFn): ZodType<UserDataRegistration> => {
  return z
    .object({
      email: z.email({ error: t('invalidEmailFormat') }),
      username: z.string().min(MIN_USERNAME_LENGTH, { error: t('usernameMinLength') }),
      password: z
        .string()
        .min(MIN_PASSWORD_LENGTH, { error: t('passwordMinLength') })
        .regex(/[a-zA-Z]/, { error: t('passwordLetter') })
        .regex(/[0-9]/, { error: t('passwordDigit') })
        .regex(/[.,?!@#$%^&*()_\-+=]/, { error: t('passwordSpecialChar') }),
      repeatPassword: z.string().min(MIN_PASSWORD_LENGTH, { error: t('passwordMinLength') }),
    })
    .superRefine(({ password, repeatPassword }, ctx) => {
      if (password !== repeatPassword) {
        ctx.addIssue({
          code: 'custom',
          message: t('repeatPassword'),
          path: ['repeatPassword'],
        });
      }
    });
};
