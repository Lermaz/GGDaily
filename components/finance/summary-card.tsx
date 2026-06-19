import { StyleSheet, Text, View } from 'react-native';

import { formatCurrency } from '@/lib/finance/types';
import { theme } from '@/lib/theme';

interface SummaryCardProps {
  label: string;
  amount: number;
  variant?: 'balance' | 'income' | 'expense';
}

export function SummaryCard({ label, amount, variant = 'balance' }: SummaryCardProps) {
  const color =
    variant === 'income'
      ? theme.colors.income
      : variant === 'expense'
        ? theme.colors.expense
        : amount >= 0
          ? theme.colors.income
          : theme.colors.expense;

  return (
    <View style={styles.card}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.amount, { color }]} accessibilityRole="text">
        {formatCurrency(Math.abs(amount))}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: theme.spacing.xs,
  },
  label: {
    fontSize: theme.typography.caption,
    color: theme.colors.textSecondary,
    fontWeight: '600',
  },
  amount: {
    fontSize: 22,
    fontWeight: '700',
  },
});
