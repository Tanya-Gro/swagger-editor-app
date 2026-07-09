'use server';

import { serverClient } from '@/database/server-client';
import { getTranslations } from 'next-intl/server';
import { createRegistrationSchema } from '@/utils/registration/schema';
import { z } from 'zod';
import { type RegistrationResult } from '@/types';

export async function registrationAction(
  _prevState: RegistrationResult,
  formData: FormData,
): Promise<RegistrationResult> {
  const t = await getTranslations('FORM_VALIDATION');

  const formValues = Object.fromEntries(formData);
  const result = createRegistrationSchema(t).safeParse(formValues);

  if (!result.success) {
    const fieldErrors = z.treeifyError(result.error).properties;
    return {
      data: null,
      errors: {
        email: fieldErrors?.email?.errors[0],
        username: fieldErrors?.username?.errors[0],
        password: fieldErrors?.password?.errors[0],
        repeatPassword: fieldErrors?.repeatPassword?.errors[0],
      },
      databaseError: null,
    };
  }

  const supabase = await serverClient();

  const { data, error } = await supabase.auth.signUp({
    email: result.data.email,
    password: result.data.password,
  });

  if (error) {
    return {
      data: null,
      errors: null,
      databaseError: error.code ?? 'unknown_auth_error',
    };
  }

  return {
    data: data.user,
    errors: null,
    databaseError: null,
  };
}
