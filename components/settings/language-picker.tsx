import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useLocale } from '@/contexts/locale-context';
import { useAppTranslation } from '@/hooks/use-translation';
import type { AppLanguage } from '@/lib/i18n';
import { theme } from '@/lib/theme';

interface LanguagePickerProps {
  language?: AppLanguage;
  onLanguageChange?: (language: AppLanguage) => void;
  label?: string;
}

export function LanguagePicker(props: LanguagePickerProps = {}) {
  const { language: controlledLanguage, onLanguageChange, label } = props;
  const { t } = useAppTranslation();
  const locale = useLocale();
  const language = controlledLanguage ?? locale.language;

  async function handleSelect(nextLanguage: AppLanguage) {
    if (onLanguageChange) {
      onLanguageChange(nextLanguage);
      return;
    }

    await locale.setLanguage(nextLanguage);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label ?? t('language.label')}</Text>
      <View style={styles.row}>
        <LanguageButton
          label={t('language.english')}
          active={language === 'en'}
          onPress={() => handleSelect('en')}
        />
        <LanguageButton
          label={t('language.spanish')}
          active={language === 'es'}
          onPress={() => handleSelect('es')}
        />
      </View>
    </View>
  );
}

interface LanguageButtonProps {
  label: string;
  active: boolean;
  onPress: () => void;
}

function LanguageButton({ label, active, onPress }: LanguageButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      style={[styles.button, active && styles.buttonActive]}
    >
      <Text style={[styles.buttonText, active && styles.buttonTextActive]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: theme.spacing.sm,
  },
  label: {
    fontSize: theme.typography.caption,
    color: theme.colors.textSecondary,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  button: {
    flex: 1,
    minHeight: theme.touchTarget,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surface,
  },
  buttonActive: {
    borderColor: theme.colors.primary,
    backgroundColor: '#EFF6FF',
  },
  buttonText: {
    fontSize: theme.typography.caption,
    color: theme.colors.textSecondary,
    fontWeight: '600',
  },
  buttonTextActive: {
    color: theme.colors.primary,
  },
});
