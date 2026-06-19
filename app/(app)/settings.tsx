import { router, Stack } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AuthButton } from '@/components/auth/auth-button';
import { LanguagePicker } from '@/components/settings/language-picker';
import { useAuth } from '@/contexts/auth-context';
import { useAppTranslation } from '@/hooks/use-translation';
import { DONATION_URL } from '@/lib/constants';
import { theme } from '@/lib/theme';

export default function SettingsScreen() {
  const { t } = useAppTranslation();
  const { signOut } = useAuth();

  async function handleSignOut() {
    await signOut();
    router.replace('/');
  }

  async function handleDonation() {
    await WebBrowser.openBrowserAsync(DONATION_URL);
  }

  return (
    <>
      <Stack.Screen options={{ title: t('settings.title') }} />
      <SafeAreaView style={styles.safeArea} edges={['bottom']}>
        <ScrollView contentContainerStyle={styles.content}>
          <LanguagePicker />

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('settings.supportTitle')}</Text>
            <Text style={styles.sectionDescription}>{t('settings.donationDescription')}</Text>
            <AuthButton
              label={t('settings.donation')}
              variant="secondary"
              onPress={handleDonation}
            />
          </View>

          <View style={styles.signOutSection}>
            <AuthButton label={t('auth.signOut')} variant="secondary" onPress={handleSignOut} />
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing.lg,
    gap: theme.spacing.xl,
    paddingBottom: theme.spacing.xxl,
  },
  section: {
    gap: theme.spacing.sm,
  },
  sectionTitle: {
    fontSize: theme.typography.caption,
    color: theme.colors.textSecondary,
    fontWeight: '600',
  },
  sectionDescription: {
    fontSize: theme.typography.caption,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  signOutSection: {
    marginTop: theme.spacing.md,
  },
});
