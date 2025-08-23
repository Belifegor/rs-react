import { z } from 'zod';

export const passwordRules = z
  .string()
  .min(8, 'Minimum 8 chars')
  .regex(/[0-9]/, 'At least one digit')
  .regex(/[a-z]/, 'At least one lowercase')
  .regex(/[A-Z]/, 'At least one uppercase')
  .regex(/[^A-Za-z0-9]/, 'At least one special');
