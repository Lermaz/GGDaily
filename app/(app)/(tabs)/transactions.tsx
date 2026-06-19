import { router } from 'expo-router';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EmptyState } from '@/components/finance/empty-state';
import { ScreenHeader } from '@/components/finance/screen-header';
import { TransactionFiltersPanel } from '@/components/finance/transaction-filters';
import { TransactionRow } from '@/components/finance/transaction-row';
import { useTransactionFilters } from '@/hooks/use-transaction-filters';
import { useTransactions } from '@/hooks/use-transactions';
import { useAppTranslation } from '@/hooks/use-translation';
import { theme } from '@/lib/theme';

export default function TransactionsScreen() {
  const { t } = useAppTranslation();
  const { filters, updateFilters, clearFilters, hasActiveFilters } = useTransactionFilters();
  const { transactions, isLoading, error } = useTransactions(filters);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScreenHeader title={t('transactions.title')} />
      <TransactionFiltersPanel
        filters={filters}
        onChange={updateFilters}
        onClear={clearFilters}
        hasActiveFilters={hasActiveFilters}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {!isLoading && transactions.length > 0 ? (
        <Text style={styles.count}>{t('transactions.resultsCount', { count: transactions.length })}</Text>
      ) : null}

      {isLoading ? (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : (
        <FlatList
          data={transactions}
          keyExtractor={(item) => item.id}
          contentContainerStyle={transactions.length === 0 ? styles.emptyList : undefined}
          ListEmptyComponent={
            <EmptyState
              title={
                hasActiveFilters
                  ? t('transactions.noResultsTitle')
                  : t('transactions.noTransactionsTitle')
              }
              message={
                hasActiveFilters
                  ? t('transactions.noResultsMessage')
                  : t('transactions.noTransactionsMessage')
              }
            />
          }
          renderItem={({ item }) => (
            <TransactionRow
              transaction={item}
              onPress={() => router.push(`/transaction/${item.id}`)}
            />
          )}
        />
      )}

      <Pressable
        style={styles.fab}
        accessibilityRole="button"
        accessibilityLabel={t('transactions.add')}
        onPress={() => router.push('/transaction/new')}
      >
        <Text style={styles.fabText}>+</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  error: {
    color: theme.colors.error,
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.sm,
  },
  count: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.sm,
    color: theme.colors.textSecondary,
    fontSize: theme.typography.caption,
  },
  emptyList: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  fab: {
    position: 'absolute',
    right: theme.spacing.lg,
    bottom: theme.spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
  fabText: {
    color: theme.colors.white,
    fontSize: 28,
    lineHeight: 30,
    fontWeight: '600',
  },
});
