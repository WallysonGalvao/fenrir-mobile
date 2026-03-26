import { z } from 'zod';

import i18n from '@/i18n';
import { passwordRegex } from '@/utils/regex';

export const getEmailSchema = () => z.email(i18n.t('auth.emailInvalid'));

export const getPasswordSchema = () =>
  z
    .string({ error: i18n.t('auth.passwordRequired') })
    .min(6, i18n.t('auth.passwordMinLength'))
    .regex(passwordRegex, i18n.t('auth.passwordMinLength'));

export const getConfirmPasswordSchema = () =>
  z.string({ error: i18n.t('auth.confirmPasswordRequired') });
