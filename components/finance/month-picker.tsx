import { Pressable, StyleSheet, Text, View } from 'react-native';

import { formatMonthLabel } from '@/hooks/use-monthly-report';
import { useLocale } from '@/contexts/locale-context';
import { theme } from '@/lib/theme';

interface MonthPickerProps {
  monthKey: string;
  onPrevious: () => void;
  onNext: () => void;
}

export function MonthPicker({ monthKey, onPrevious, onNext }: MonthPickerProps) {
  const { language } = useLocale();

  return (
    <View style={styles.container}>
      <Pressable onPress={onPrevious} accessibilityRole="button" style={styles.button}>
        <Text style={styles.buttonText}>‹</Text>
      </Pressable>
      <Text style={styles.label}>{formatMonthLabel(monthKey, language)}</Text>
      <Pressable onPress={onNext} accessibilityRole="button" style={styles.button}>
        <Text style={styles.buttonText}>›</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing.md,
  },
  button: {
    width: theme.touchTarget,
    height: theme.touchTarget,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surface,
  },
  buttonText: {
    fontSize: 24,
    color: theme.colors.primary,
    lineHeight: 28,
  },
  label: {
    flex: 1,
    textAlign: 'center',
    fontSize: theme.typography.subtitle,
    fontWeight: '700',
    color: theme.colors.text,
    textTransform: 'capitalize',
  },
});
