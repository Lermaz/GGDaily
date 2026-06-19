import { Redirect, Stack } from 'expo-router';
import { useMemo } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { useAuth } from '@/contexts/auth-context';
import { useLocale } from '@/contexts/locale-context';
import { useAppTranslation } from '@/hooks/use-translation';
import { theme } from '@/lib/theme';

export default function AppLayout() {
  const { t } = useAppTranslation();
  const { language } = useLocale();
  const { session, isLoading } = useAuth();

  const screenTitles = useMemo(
    () => ({
      addTransaction: t('transactions.add'),
      editTransaction: t('transactions.edit'),
      addCategory: t('categories.add'),
      editCategory: t('categories.edit'),
      settings: t('settings.title'),
    }),
    [language],
  );

  const headerOptions = useMemo(
    () => ({
      headerStyle: { backgroundColor: theme.colors.background },
      headerTintColor: theme.colors.primary,
      headerTitleStyle: { color: theme.colors.text, fontWeight: '700' as const },
    }),
    [],
  );

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (!session) {
    return <Redirect href="/login" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: theme.colors.background } }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen
        name="transaction/new"
        options={{
          presentation: 'modal',
          headerShown: true,
          title: screenTitles.addTransaction,
          ...headerOptions,
        }}
      />
      <Stack.Screen
        name="transaction/[id]"
        options={{
          presentation: 'modal',
          headerShown: true,
          title: screenTitles.editTransaction,
          ...headerOptions,
        }}
      />
      <Stack.Screen
        name="category/new"
        options={{
          presentation: 'modal',
          headerShown: true,
          title: screenTitles.addCategory,
          ...headerOptions,
        }}
      />
      <Stack.Screen
        name="category/[id]"
        options={{
          presentation: 'modal',
          headerShown: true,
          title: screenTitles.editCategory,
          ...headerOptions,
        }}
      />
      <Stack.Screen
        name="settings"
        options={{
          headerShown: true,
          title: screenTitles.settings,
          ...headerOptions,
        }}
      />
    </Stack>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.background,
  },
});
