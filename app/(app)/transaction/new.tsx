import { router, Stack } from 'expo-router';
import { useMemo } from 'react';

import { TransactionForm } from '@/components/finance/transaction-form';
import { useCategories } from '@/hooks/use-categories';
import { useTransactions } from '@/hooks/use-transactions';
import { toDateString } from '@/lib/finance/types';
import type { CategoryKind } from '@/types/database';

export default function NewTransactionScreen() {
  const { categories } = useCategories();
  const { createTransaction } = useTransactions();

  const defaultCategoryId = useMemo(
    () => categories.find((category) => category.kind === 'expense')?.id ?? '',
    [categories],
  );

  return (
    <>
      <Stack.Screen options={{ title: 'Add transaction' }} />
      <TransactionForm
        submitLabel="Save transaction"
        initialValues={{
          amount: '',
          description: '',
          categoryId: defaultCategoryId,
          occurredOn: toDateString(new Date()),
          kind: 'expense' as CategoryKind,
        }}
        onSubmit={async (values) => {
          const result = await createTransaction(values);
          if (!result.error) {
            router.back();
          }
          return result;
        }}
      />
    </>
  );
}
