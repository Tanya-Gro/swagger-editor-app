import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.email('Неверный формат почты'),
  password: z.string().trim().nonempty('Необходимо ввести пароль'),
});
