import { z } from 'zod';

import { getEmailSchema, getPasswordSchema } from '@/schemas/common';

export const signUpSchema = z.object({
  email: getEmailSchema(),
  password: getPasswordSchema(),
});

export type SignUpSchemaType = z.infer<typeof signUpSchema>;
