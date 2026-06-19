import { router, Stack, useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { TransactionForm } from '@/components/finance/transaction-form';
import { useTransactions } from '@/hooks/use-transactions';
import { useAppTranslation } from '@/hooks/use-translation';
import { theme } from '@/lib/theme';
import type { CategoryKind } from '@/types/database';

export default function EditTransactionScreen() {
  const { t } = useAppTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getTransaction, updateTransaction, deleteTransaction, isLoading } = useTransactions();
  const transaction = getTransaction(id);

  if (isLoading && !transaction) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (!transaction) {
    return null;
  }

  return (
    <>
      <Stack.Screen options={{ title: t('transactions.edit') }} />
      <TransactionForm
        submitLabel={t('transactions.update')}
        initialValues={{
          amount: String(transaction.amount),
          description: transaction.description,
          categoryId: transaction.category_id,
          occurredOn: transaction.occurred_on,
          kind: (transaction.category?.kind ?? 'expense') as CategoryKind,
        }}
        onSubmit={async (values) => {
          const result = await updateTransaction(id, values);
          if (!result.error) {
            router.back();
          }
          return result;
        }}
        onDelete={async () => {
          const result = await deleteTransaction(id);
          if (!result.error) {
            router.back();
          }
          return result;
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.background,
  },
});
