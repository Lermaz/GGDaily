import { Redirect, Stack } from 'expo-router';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { useAuth } from '@/contexts/auth-context';
import { theme } from '@/lib/theme';

export default function AppLayout() {
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
        options={{ presentation: 'modal', headerShown: true, title: 'Add transaction' }}
      />
      <Stack.Screen
        name="transaction/[id]"
        options={{ presentation: 'modal', headerShown: true, title: 'Edit transaction' }}
      />
      <Stack.Screen
        name="category/new"
        options={{ presentation: 'modal', headerShown: true, title: 'Add category' }}
      />
      <Stack.Screen
        name="category/[id]"
        options={{ presentation: 'modal', headerShown: true, title: 'Edit category' }}
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
