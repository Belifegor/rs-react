import { z } from 'zod';
import { passwordRules } from './password';
import { imageFileSchema } from './imageFileSchema';

export const schema = z
  .object({
    name: z
      .string()
      .min(1, 'Enter name')
      .regex(/^[A-Z][A-Za-z\s'-]*$/, 'First letter must be uppercase'),
    age: z.coerce
      .number()
      .int('Integer only')
      .min(12, 'Minimum age — 12 years')
      .max(100, 'Maximum age — 100 years'),
    email: z.string().trim().toLowerCase().pipe(z.email()),
    password: passwordRules,
    confirmPassword: z.string().min(1, 'Confirm password'),
    gender: z.enum(['male', 'female', 'other'], { message: 'Select gender' }),
    acceptedTnC: z.literal(true, { message: 'You must accept T&C' }),
    country: z.string().trim().min(1, 'Select country'),
    imageFile: imageFileSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords must match',
  })
  .strip();

export type FormInput = z.input<typeof schema>;
export type FormValues = z.infer<typeof schema>;
