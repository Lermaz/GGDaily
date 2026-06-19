import { StyleSheet, Text, View } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';

import type { WeeklyTotals } from '@/hooks/use-monthly-report';
import { theme } from '@/lib/theme';

interface WeeklyBarChartProps {
  data: WeeklyTotals[];
  title: string;
  incomeLabel: string;
  expenseLabel: string;
}

export function WeeklyBarChart({ data, title, incomeLabel, expenseLabel }: WeeklyBarChartProps) {
  if (data.length === 0) {
    return null;
  }

  const barData = data.flatMap((week) => [
    { value: week.income, label: week.label, spacing: 2, frontColor: theme.colors.income },
    { value: week.expense, frontColor: theme.colors.expense },
  ]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <BarChart
        data={barData}
        barWidth={22}
        spacing={16}
        roundedTop
        roundedBottom
        hideRules
        xAxisThickness={0}
        yAxisThickness={0}
        yAxisTextStyle={styles.axis}
        xAxisLabelTextStyle={styles.axis}
        noOfSections={4}
        maxValue={Math.max(...data.flatMap((week) => [week.income, week.expense]), 1) * 1.2}
      />
      <View style={styles.legend}>
        <LegendItem color={theme.colors.income} label={incomeLabel} />
        <LegendItem color={theme.colors.expense} label={expenseLabel} />
      </View>
    </View>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={styles.legendText}>{label}</Text>
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
  },
  title: {
    fontSize: theme.typography.subtitle,
    fontWeight: '700',
    color: theme.colors.text,
  },
  axis: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.caption,
  },
  legend: {
    flexDirection: 'row',
    gap: theme.spacing.lg,
  },
  legendItem: {
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
