import { StyleSheet, Text, View } from 'react-native';

import { useAppTranslation } from '@/hooks/use-translation';
import { formatCurrency } from '@/lib/finance/types';
import type { CategoryBudget } from '@/lib/finance/budget';
import { theme } from '@/lib/theme';

interface BudgetProgressBarProps {
  budget: CategoryBudget;
}

export function BudgetProgressBar({ budget }: BudgetProgressBarProps) {
  const { t } = useAppTranslation();
  const progress = Math.min(budget.percent / 100, 1);
  const barColor =
    budget.status === 'exceeded'
      ? theme.colors.expense
      : budget.status === 'warning'
        ? '#EAB308'
        : theme.colors.income;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.name}>{budget.category.name}</Text>
        <Text style={styles.amount}>
          {t('categories.spent', {
            spent: formatCurrency(budget.spent),
            limit: formatCurrency(budget.limit),
          })}
        </Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${progress * 100}%`, backgroundColor: barColor }]} />
      </View>
      <Text style={styles.percent}>{budget.percent}%</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: theme.spacing.xs,
    paddingVertical: theme.spacing.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: theme.spacing.sm,
  },
  name: {
    flex: 1,
    fontSize: theme.typography.body,
    fontWeight: '600',
    color: theme.colors.text,
  },
  amount: {
    fontSize: theme.typography.caption,
    color: theme.colors.textSecondary,
  },
  track: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E2E8F0',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 4,
  },
  percent: {
    fontSize: theme.typography.caption,
    color: theme.colors.textSecondary,
  },
});
