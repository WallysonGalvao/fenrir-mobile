import { z } from 'zod';

import { getEmailSchema } from '@/schemas/common';

export const resetPasswordSchema = z.object({
  email: getEmailSchema(),
});

export type ResetPasswordSchemaType = z.infer<typeof resetPasswordSchema>;
