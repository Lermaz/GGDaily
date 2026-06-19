import { StyleSheet, Text, View } from 'react-native';

import { useAppTranslation } from '@/hooks/use-translation';
import type { CategoryBudget } from '@/lib/finance/budget';
import { theme } from '@/lib/theme';

interface BudgetAlertBannerProps {
  alerts: CategoryBudget[];
}

export function BudgetAlertBanner({ alerts }: BudgetAlertBannerProps) {
  const { t } = useAppTranslation();

  if (alerts.length === 0) {
    return null;
  }

  return (
    <View style={styles.container} accessibilityRole="alert">
      <Text style={styles.title}>{t('budget.alertsTitle')}</Text>
      {alerts.map((alert) => (
        <Text key={alert.category.id} style={styles.message}>
          {alert.status === 'exceeded'
            ? t('budget.exceeded', { name: alert.category.name })
            : t('budget.approaching', { name: alert.category.name, percent: alert.percent })}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FEF3C7',
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: '#F59E0B',
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  title: {
    fontSize: theme.typography.label,
    fontWeight: '700',
    color: '#92400E',
  },
  message: {
    fontSize: theme.typography.caption,
    color: '#92400E',
    lineHeight: 18,
  },
});
