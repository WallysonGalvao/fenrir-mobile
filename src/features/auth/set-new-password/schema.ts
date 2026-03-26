import { z } from 'zod';

import i18n from '@/i18n';
import { getConfirmPasswordSchema, getPasswordSchema } from '@/schemas/common';

export const setNewPasswordSchema = z
  .object({
    password: getPasswordSchema(),
    confirmPassword: getConfirmPasswordSchema(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: i18n.t('auth.passwordsDoNotMatch'),
    path: ['confirmPassword'],
  });

export type SetNewPasswordSchemaType = z.infer<typeof setNewPasswordSchema>;
