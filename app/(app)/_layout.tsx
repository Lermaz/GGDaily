import { Redirect, Stack } from 'expo-router';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { useAuth } from '@/contexts/auth-context';
import { useAppTranslation } from '@/hooks/use-translation';
import { theme } from '@/lib/theme';

export default function AppLayout() {
  const { t } = useAppTranslation();
  const { session, isLoading } = useAuth();

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
        options={{ presentation: 'modal', headerShown: true, title: t('transactions.add') }}
      />
      <Stack.Screen
        name="transaction/[id]"
        options={{ presentation: 'modal', headerShown: true, title: t('transactions.edit') }}
      />
      <Stack.Screen
        name="category/new"
        options={{ presentation: 'modal', headerShown: true, title: t('categories.add') }}
      />
      <Stack.Screen
        name="category/[id]"
        options={{ presentation: 'modal', headerShown: true, title: t('categories.edit') }}
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
