import { Pressable, StyleSheet, Text, View } from 'react-native';

import { formatDisplayDate, formatSignedAmount } from '@/lib/finance/types';
import { theme } from '@/lib/theme';
import type { CategoryKind, TransactionWithCategory } from '@/types/database';

interface TransactionRowProps {
  transaction: TransactionWithCategory;
  onPress?: () => void;
}

export function TransactionRow({ transaction, onPress }: TransactionRowProps) {
  const kind = (transaction.category?.kind ?? 'expense') as CategoryKind;
  const amountColor = kind === 'income' ? theme.colors.income : theme.colors.expense;

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole="button"
      style={({ pressed }) => [styles.row, pressed && onPress && styles.pressed]}
    >
      <View style={styles.left}>
        <View style={styles.titleRow}>
          <View
            style={[styles.dot, { backgroundColor: transaction.category?.color ?? theme.colors.border }]}
          />
          <Text style={styles.description} numberOfLines={1}>
            {transaction.description || transaction.category?.name || 'Transaction'}
          </Text>
        </View>
        <Text style={styles.meta}>
          {transaction.category?.name} · {formatDisplayDate(transaction.occurred_on)}
        </Text>
      </View>
      <Text style={[styles.amount, { color: amountColor }]}>
        {formatSignedAmount(transaction.amount, kind)}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    gap: theme.spacing.md,
  },
  pressed: {
    backgroundColor: '#F1F5F9',
  },
  left: {
    flex: 1,
    gap: theme.spacing.xs,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  description: {
    flex: 1,
    fontSize: theme.typography.body,
    fontWeight: '600',
    color: theme.colors.text,
  },
  meta: {
    fontSize: theme.typography.caption,
    color: theme.colors.textSecondary,
  },
  amount: {
    fontSize: theme.typography.body,
    fontWeight: '700',
  },
});
