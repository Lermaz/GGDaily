import { router } from 'expo-router';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AuthButton } from '@/components/auth/auth-button';
import { EmptyState } from '@/components/finance/empty-state';
import { ScreenHeader } from '@/components/finance/screen-header';
import { SummaryCard } from '@/components/finance/summary-card';
import { TransactionRow } from '@/components/finance/transaction-row';
import { useAuth } from '@/contexts/auth-context';
import { useDashboardSummary } from '@/hooks/use-dashboard-summary';
import { formatCurrency } from '@/lib/finance/types';
import { theme } from '@/lib/theme';

export default function DashboardScreen() {
  const { signOut } = useAuth();
  const { balance, monthlyIncome, monthlyExpenses, recentTransactions, isLoading, error } =
    useDashboardSummary();

  async function handleSignOut() {
    await signOut();
    router.replace('/');
  }

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScreenHeader title="Dashboard" rightAction={{ label: 'Sign out', onPress: handleSignOut }} />
      <ScrollView contentContainerStyle={styles.content}>
        {error ? <Text style={styles.error}>{error}</Text> : null}

        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Current balance</Text>
          <Text
            style={[
              styles.balanceAmount,
              { color: balance >= 0 ? theme.colors.income : theme.colors.expense },
            ]}
          >
            {formatCurrency(balance)}
          </Text>
        </View>

        <View style={styles.statsRow}>
          <SummaryCard label="Monthly income" amount={monthlyIncome} variant="income" />
          <SummaryCard label="Monthly expenses" amount={monthlyExpenses} variant="expense" />
        </View>

        <AuthButton label="Add transaction" onPress={() => router.push('/transaction/new')} />

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent transactions</Text>
            {recentTransactions.length > 0 ? (
              <Pressable onPress={() => router.push('/transactions')}>
                <Text style={styles.link}>See all</Text>
              </Pressable>
            ) : null}
          </View>

          {recentTransactions.length === 0 ? (
            <EmptyState
              title="No transactions yet"
              message="Add your first income or expense to start tracking your budget."
            />
          ) : (
            <View style={styles.listCard}>
              {recentTransactions.map((transaction) => (
                <TransactionRow
                  key={transaction.id}
                  transaction={transaction}
                  onPress={() => router.push(`/transaction/${transaction.id}`)}
                />
              ))}
            </View>
          )}
        </View>
      </ScrollView>
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
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing.lg,
    gap: theme.spacing.lg,
    paddingBottom: theme.spacing.xxl,
  },
  error: {
    color: theme.colors.error,
    fontSize: theme.typography.caption,
  },
  balanceCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: theme.spacing.sm,
  },
  balanceLabel: {
    fontSize: theme.typography.caption,
    color: theme.colors.textSecondary,
    fontWeight: '600',
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: '800',
  },
  statsRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  section: {
    gap: theme.spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontSize: theme.typography.subtitle,
    fontWeight: '700',
    color: theme.colors.text,
  },
  link: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
  listCard: {
    borderRadius: theme.radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
});
