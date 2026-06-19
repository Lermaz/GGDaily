import { StyleSheet, Text, View } from 'react-native';

import { theme } from '@/lib/theme';

interface ErrorBannerProps {
  message: string;
}

export function ErrorBanner({ message }: ErrorBannerProps) {
  if (!message) {
    return null;
  }

  return (
    <View style={styles.container} accessibilityRole="alert">
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

interface SuccessBannerProps {
  message: string;
}

export function SuccessBanner({ message }: SuccessBannerProps) {
  if (!message) {
    return null;
  }

  return (
    <View style={[styles.container, styles.successContainer]} accessibilityRole="text">
      <Text style={[styles.text, styles.successText]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.errorBackground,
    borderRadius: theme.radius.sm,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.error,
  },
  text: {
    color: theme.colors.error,
    fontSize: theme.typography.caption,
    lineHeight: 18,
  },
  successContainer: {
    backgroundColor: theme.colors.successBackground,
    borderColor: theme.colors.success,
  },
  successText: {
    color: theme.colors.success,
  },
});
