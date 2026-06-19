import { z } from 'zod';

export const categoryFormSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(50, 'Name is too long'),
  kind: z.enum(['income', 'expense']),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid color'),
  monthlyLimit: z
    .string()
    .optional()
    .refine((value) => !value || (!Number.isNaN(Number(value)) && Number(value) > 0), {
      message: 'Limit must be greater than 0',
    }),
});

export const transactionFormSchema = z.object({
  amount: z
    .string()
    .trim()
    .min(1, 'Amount is required')
    .refine((value) => !Number.isNaN(Number(value)) && Number(value) > 0, {
      message: 'Enter a valid amount greater than 0',
    }),
  description: z.string().trim().max(200, 'Description is too long'),
  categoryId: z.string().uuid('Select a category'),
  occurredOn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date'),
});

export type CategoryFormData = z.infer<typeof categoryFormSchema>;
export type TransactionFormData = z.infer<typeof transactionFormSchema>;
