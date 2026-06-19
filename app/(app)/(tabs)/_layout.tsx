import { Tabs } from 'expo-router';
import { useMemo } from 'react';

import { useLocale } from '@/contexts/locale-context';
import { useAppTranslation } from '@/hooks/use-translation';
import { theme } from '@/lib/theme';

export default function TabsLayout() {
  const { t } = useAppTranslation();
  const { language } = useLocale();

  const tabTitles = useMemo(
    () => ({
      dashboard: t('tabs.dashboard'),
      transactions: t('tabs.transactions'),
      categories: t('tabs.categories'),
      reports: t('tabs.reports'),
    }),
    [language],
  );

  const screenOptions = useMemo(
    () => ({
      headerShown: false,
      tabBarActiveTintColor: theme.colors.primary,
      tabBarInactiveTintColor: theme.colors.textSecondary,
      tabBarStyle: {
        backgroundColor: theme.colors.surface,
        borderTopColor: theme.colors.border,
      },
    }),
    [],
  );

  return (
    <Tabs screenOptions={screenOptions}>
      <Tabs.Screen name="index" options={{ title: tabTitles.dashboard }} />
      <Tabs.Screen name="transactions" options={{ title: tabTitles.transactions }} />
      <Tabs.Screen name="categories" options={{ title: tabTitles.categories }} />
      <Tabs.Screen name="reports" options={{ title: tabTitles.reports }} />
    </Tabs>
  );
}
