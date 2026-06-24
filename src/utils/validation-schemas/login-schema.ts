import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.string().trim().nonempty('Необходимо ввести почту').pipe(z.email('Неверный формат почты')),
  password: z.string().trim().nonempty('Необходимо ввести пароль'),
});
