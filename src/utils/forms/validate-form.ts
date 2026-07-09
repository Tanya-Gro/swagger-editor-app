import { type ZodType } from 'zod';

type ValidationErrors = Record<string, string | undefined>;

type ValidationResult<Data> = {
  data: Data | null;
  errors: ValidationErrors | null;
};

export function validateForm<Data>(formData: FormData, schema: ZodType<Data>): ValidationResult<Data> {
  const formValues = Object.fromEntries(formData);
  const result = schema.safeParse(formValues);

  if (!result.success) {
    const errors: ValidationErrors = {};

    for (const issue of result.error.issues) {
      const fieldName = issue.path[0];

      if (typeof fieldName === 'string' && errors[fieldName] === undefined) {
        errors[fieldName] = issue.message;
      }
    }

    return {
      data: null,
      errors,
    };
  }

  return {
    data: result.data,
    errors: null,
  };
}
