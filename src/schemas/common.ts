import { z } from 'zod';

import i18n from '@/i18n';

export const getEmailSchema = () => z.email(i18n.t('auth.emailInvalid'));

export const getPasswordSchema = () =>
  z
    .string({ error: i18n.t('auth.passwordRequired') })
    .min(8, i18n.t('auth.passwordMinLength'))
    .refine((v) => /[A-Z]/.test(v), i18n.t('auth.passwordUppercase'))
    .refine((v) => /[a-z]/.test(v), i18n.t('auth.passwordLowercase'))
    .refine((v) => /[0-9]/.test(v), i18n.t('auth.passwordNumber'))
    .refine((v) => /[#?!@$%^&*-]/.test(v), i18n.t('auth.passwordSpecial'));

export const getConfirmPasswordSchema = () =>
  z.string({ error: i18n.t('auth.confirmPasswordRequired') });
