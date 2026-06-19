import type { TFunction } from 'i18next';
import { z } from 'zod';

export function getLoginSchema(t: TFunction) {
  return z.object({
    email: z.string().min(1, t('validation.required')).email(t('validation.email')),
    password: z.string().min(8, t('validation.passwordMin')),
  });
}

export function getRegisterSchema(t: TFunction) {
  return z
    .object({
      email: z.string().min(1, t('validation.required')).email(t('validation.email')),
      password: z.string().min(8, t('validation.passwordMin')),
      confirmPassword: z.string().min(1, t('validation.required')),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t('validation.passwordMatch'),
      path: ['confirmPassword'],
    });
}

export function getForgotPasswordSchema(t: TFunction) {
  return z.object({
    email: z.string().min(1, t('validation.required')).email(t('validation.email')),
  });
}

export function getCategoryFormSchema(t: TFunction) {
  return z.object({
    name: z.string().trim().min(1, t('validation.nameRequired')).max(50, t('validation.nameTooLong')),
    kind: z.enum(['income', 'expense']),
    color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, t('validation.invalidColor')),
    monthlyLimit: z
      .string()
      .optional()
      .refine((value) => !value || (!Number.isNaN(Number(value)) && Number(value) > 0), {
        message: t('validation.limitPositive'),
      }),
  });
}

export function getTransactionFormSchema(t: TFunction) {
  return z.object({
    amount: z
      .string()
      .trim()
      .min(1, t('validation.required'))
      .refine((value) => !Number.isNaN(Number(value)) && Number(value) > 0, {
        message: t('validation.amountPositive'),
      }),
    description: z.string().trim().max(200, t('validation.descriptionTooLong')),
    categoryId: z.string().uuid(t('validation.selectCategory')),
    occurredOn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, t('validation.invalidDate')),
  });
}
