import { Tabs } from 'expo-router';

import { useAppTranslation } from '@/hooks/use-translation';
import { theme } from '@/lib/theme';

export default function TabsLayout() {
  const { t } = useAppTranslation();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
        },
      }}
    >
      <Tabs.Screen name="index" options={{ title: t('tabs.dashboard') }} />
      <Tabs.Screen name="transactions" options={{ title: t('tabs.transactions') }} />
      <Tabs.Screen name="categories" options={{ title: t('tabs.categories') }} />
      <Tabs.Screen name="reports" options={{ title: t('tabs.reports') }} />
    </Tabs>
  );
}
