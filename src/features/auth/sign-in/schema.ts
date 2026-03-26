import { z } from 'zod';

import { getEmailSchema, getPasswordSchema } from '@/schemas/common';

export const signInSchema = z.object({
  email: getEmailSchema(),
  password: getPasswordSchema(),
});

export type SignInSchemaType = z.infer<typeof signInSchema>;
