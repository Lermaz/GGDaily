import { StyleSheet, Text, View } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';

import type { CategoryExpenseSlice } from '@/hooks/use-monthly-report';
import { formatCurrency } from '@/lib/finance/types';
import { theme } from '@/lib/theme';

interface ExpensePieChartProps {
  data: CategoryExpenseSlice[];
  title: string;
}

export function ExpensePieChart({ data, title }: ExpensePieChartProps) {
  if (data.length === 0) {
    return null;
  }

  const pieData = data.map((item) => ({
    value: item.amount,
    color: item.color,
  }));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <PieChart data={pieData} donut radius={90} innerRadius={50} />
      <View style={styles.legend}>
        {data.map((item) => (
          <View key={item.name} style={styles.legendRow}>
            <View style={[styles.dot, { backgroundColor: item.color }]} />
            <Text style={styles.legendText}>
              {item.name} — {formatCurrency(item.amount)}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
    alignItems: 'center',
  },
  title: {
    alignSelf: 'flex-start',
    fontSize: theme.typography.subtitle,
    fontWeight: '700',
    color: theme.colors.text,
  },
  legend: {
    alignSelf: 'stretch',
    gap: theme.spacing.sm,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontSize: theme.typography.caption,
    color: theme.colors.textSecondary,
  },
});
