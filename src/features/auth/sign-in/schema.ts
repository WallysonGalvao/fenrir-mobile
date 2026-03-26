import { z } from 'zod';

import i18n from '@/i18n';
import { getEmailSchema } from '@/schemas/common';

export const signInSchema = z.object({
  email: getEmailSchema(),
  password: z
    .string({ error: i18n.t('auth.passwordRequired') })
    .min(1, i18n.t('auth.passwordRequired')),
});

export type SignInSchemaType = z.infer<typeof signInSchema>;
