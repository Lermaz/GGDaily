import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AuthButton } from '@/components/auth/auth-button';
import { ErrorBanner } from '@/components/auth/error-banner';
import { LanguagePicker } from '@/components/settings/language-picker';
import { useAuth } from '@/contexts/auth-context';
import { useLocale } from '@/contexts/locale-context';
import { useAppTranslation } from '@/hooks/use-translation';
import i18n, { DEFAULT_LANGUAGE, type AppLanguage } from '@/lib/i18n';
import {
  markLanguageOnboardingComplete,
  syncDefaultCategoriesForLanguage,
} from '@/lib/language-onboarding';
import { theme } from '@/lib/theme';

export default function LanguageOnboardingScreen() {
  const { t } = useAppTranslation();
  const { session } = useAuth();
  const { setLanguage } = useLocale();
  const [selectedLanguage, setSelectedLanguage] = useState<AppLanguage>(DEFAULT_LANGUAGE);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  function translate(key: string) {
    return i18n.t(key, { lng: selectedLanguage });
  }

  async function handleContinue() {
    if (!session?.user.id) {
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      await setLanguage(selectedLanguage);
      await syncDefaultCategoriesForLanguage(session.user.id, selectedLanguage);
      const { error: onboardingError } = await markLanguageOnboardingComplete(selectedLanguage);

      if (onboardingError) {
        setError(onboardingError);
        return;
      }

      router.replace('/(app)/(tabs)');
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : t('common.error'));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.hero}>
          <Text style={styles.title}>{translate('onboarding.languageTitle')}</Text>
          <Text style={styles.subtitle}>{translate('onboarding.languageSubtitle')}</Text>
        </View>

        <View style={styles.content}>
          <ErrorBanner message={error} />
          <LanguagePicker
            language={selectedLanguage}
            onLanguageChange={setSelectedLanguage}
            label={translate('language.label')}
          />
        </View>

        <AuthButton
          label={translate('onboarding.continue')}
          onPress={handleContinue}
          isLoading={isLoading}
        />
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
    gap: theme.spacing.xl,
  },
  hero: {
    gap: theme.spacing.sm,
    paddingTop: theme.spacing.xl,
  },
  title: {
    fontSize: theme.typography.title,
    fontWeight: '800',
    color: theme.colors.text,
  },
  subtitle: {
    fontSize: theme.typography.body,
    color: theme.colors.textSecondary,
    lineHeight: 22,
  },
  content: {
    gap: theme.spacing.lg,
  },
});
