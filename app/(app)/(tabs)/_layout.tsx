import { Tabs } from 'expo-router';
import { useMemo } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FLOATING_TAB_BAR_HEIGHT, FloatingTabBar } from '@/components/navigation/floating-tab-bar';
import { useLocale } from '@/contexts/locale-context';
import { useAppTranslation } from '@/hooks/use-translation';
import { theme } from '@/lib/theme';

export default function TabsLayout() {
  const { t } = useAppTranslation();
  const { language } = useLocale();
  const insets = useSafeAreaInsets();
  const tabBarBottomInset = Math.max(insets.bottom, theme.spacing.sm) + FLOATING_TAB_BAR_HEIGHT + theme.spacing.md;

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
      tabBarShowLabel: false,
      tabBarStyle: {
        position: 'absolute' as const,
        backgroundColor: 'transparent',
        borderTopWidth: 0,
        elevation: 0,
        height: 0,
      },
      sceneStyle: {
        paddingBottom: tabBarBottomInset,
      },
    }),
    [tabBarBottomInset],
  );

  return (
    <Tabs screenOptions={screenOptions} tabBar={(props) => <FloatingTabBar {...props} />}>
      <Tabs.Screen name="index" options={{ title: tabTitles.dashboard }} />
      <Tabs.Screen name="transactions" options={{ title: tabTitles.transactions }} />
      <Tabs.Screen name="categories" options={{ title: tabTitles.categories }} />
      <Tabs.Screen name="reports" options={{ title: tabTitles.reports }} />
    </Tabs>
  );
}
