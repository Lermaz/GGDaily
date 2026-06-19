import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useAppTranslation } from '@/hooks/use-translation';
import { formatDisplayDate, formatSignedAmount } from '@/lib/finance/types';
import { theme } from '@/lib/theme';
import type { CategoryKind, TransactionWithCategory } from '@/types/database';

interface TransactionRowProps {
  transaction: TransactionWithCategory;
  onPress?: () => void;
}

export function TransactionRow({ transaction, onPress }: TransactionRowProps) {
  const { t } = useAppTranslation();
  const kind = (transaction.category?.kind ?? 'expense') as CategoryKind;
  const amountColor = kind === 'income' ? theme.colors.income : theme.colors.expense;
  const categoryName = transaction.category?.name;
  const description = transaction.description?.trim();
  const displayDescription = description || (!categoryName ? t('transactions.untitled') : null);

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole="button"
      accessibilityLabel={
        [categoryName, displayDescription, formatDisplayDate(transaction.occurred_on), formatSignedAmount(transaction.amount, kind)]
          .filter(Boolean)
          .join(', ')
      }
      style={({ pressed }) => [styles.row, pressed && onPress && styles.pressed]}
    >
      <View style={styles.left}>
        <View style={styles.titleRow}>
          <View
            style={[styles.dot, { backgroundColor: transaction.category?.color ?? theme.colors.border }]}
          />
          <View style={styles.textColumn}>
            {categoryName ? (
              <Text style={styles.categoryName} numberOfLines={1}>
                {categoryName}
              </Text>
            ) : null}
            {displayDescription ? (
              <Text style={[styles.description, categoryName && styles.descriptionSecondary]} numberOfLines={2}>
                {displayDescription}
              </Text>
            ) : null}
            <Text style={styles.meta}>{formatDisplayDate(transaction.occurred_on)}</Text>
          </View>
        </View>
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
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing.sm,
  },
  textColumn: {
    flex: 1,
    gap: 2,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginTop: 5,
  },
  categoryName: {
    fontSize: theme.typography.body,
    fontWeight: '700',
    color: theme.colors.text,
  },
  description: {
    fontSize: theme.typography.body,
    fontWeight: '600',
    color: theme.colors.text,
  },
  descriptionSecondary: {
    fontSize: theme.typography.caption,
    fontWeight: '500',
    color: theme.colors.textSecondary,
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
