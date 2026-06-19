import { useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EmptyState } from '@/components/finance/empty-state';
import { ExpensePieChart } from '@/components/finance/expense-pie-chart';
import { MonthPicker } from '@/components/finance/month-picker';
import { ScreenHeader } from '@/components/finance/screen-header';
import { SummaryCard } from '@/components/finance/summary-card';
import { WeeklyBarChart } from '@/components/finance/weekly-bar-chart';
import { getCurrentMonthKey, shiftMonthKey, useMonthlyReport } from '@/hooks/use-monthly-report';
import { useAppTranslation } from '@/hooks/use-translation';
import { theme } from '@/lib/theme';

export default function ReportsScreen() {
  const { t } = useAppTranslation();
  const [monthKey, setMonthKey] = useState(getCurrentMonthKey());
  const { totalIncome, totalExpenses, expensesByCategory, weeklyTotals, hasData, isLoading, error } =
    useMonthlyReport(monthKey);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScreenHeader title={t('reports.title')} />

      {isLoading ? (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          {error ? <Text style={styles.error}>{error}</Text> : null}

          <MonthPicker
            monthKey={monthKey}
            onPrevious={() => setMonthKey((current) => shiftMonthKey(current, -1))}
            onNext={() => setMonthKey((current) => shiftMonthKey(current, 1))}
          />

          {!hasData ? (
            <EmptyState
              title={t('reports.noDataTitle')}
              message={t('reports.noDataMessage')}
            />
          ) : (
            <>
              <View style={styles.statsRow}>
                <SummaryCard label={t('reports.totalIncome')} amount={totalIncome} variant="income" />
                <SummaryCard
                  label={t('reports.totalExpenses')}
                  amount={totalExpenses}
                  variant="expense"
                />
              </View>

              <ExpensePieChart data={expensesByCategory} title={t('reports.monthlySpending')} />
              <WeeklyBarChart
                data={weeklyTotals}
                title={t('reports.weeklyTrends')}
                incomeLabel={t('transactions.income')}
                expenseLabel={t('transactions.expense')}
              />
            </>
          )}
        </ScrollView>
      )}
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
  content: {
    padding: theme.spacing.lg,
    gap: theme.spacing.lg,
    paddingBottom: theme.spacing.xxl,
  },
  error: {
    color: theme.colors.error,
    fontSize: theme.typography.caption,
  },
  statsRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
});
