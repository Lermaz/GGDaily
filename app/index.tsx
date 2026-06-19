import { Redirect, router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AuthButton } from '@/components/auth/auth-button';
import { useAuth } from '@/contexts/auth-context';
import { useAppTranslation } from '@/hooks/use-translation';
import { theme } from '@/lib/theme';

export default function HomeScreen() {
  const { t } = useAppTranslation();
  const { session, isLoading } = useAuth();

  if (!isLoading && session) {
    return <Redirect href="/(app)/(tabs)" />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.hero}>
          <Text style={styles.title} accessibilityRole="header">
            {t('common.appName')}
          </Text>
          <Text style={styles.subtitle}>{t('auth.homeSubtitle')}</Text>
        </View>

        <View style={styles.actions}>
          <AuthButton label={t('auth.logIn')} onPress={() => router.push('/login')} />
          <AuthButton
            label={t('auth.createAccount')}
            variant="secondary"
            onPress={() => router.push('/register')}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    flex: 1,
    padding: theme.spacing.lg,
    justifyContent: 'space-between',
  },
  hero: {
    flex: 1,
    justifyContent: 'center',
    gap: theme.spacing.md,
    paddingVertical: theme.spacing.xl,
  },
  title: {
    fontSize: 40,
    fontWeight: '800',
    color: theme.colors.text,
  },
  subtitle: {
    fontSize: theme.typography.subtitle,
    color: theme.colors.textSecondary,
    lineHeight: 24,
    maxWidth: 320,
  },
  actions: {
    gap: theme.spacing.md,
    paddingBottom: theme.spacing.lg,
  },
});
