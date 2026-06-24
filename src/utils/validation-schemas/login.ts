import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.email('Invalid email format').trim().min(1, 'Email is required'),
  password: z.string().trim().min(1, 'Password is required'),
});
