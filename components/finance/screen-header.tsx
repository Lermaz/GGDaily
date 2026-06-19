import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { theme } from '@/lib/theme';

interface ScreenHeaderProps {
  title: string;
  rightAction?: {
    label: string;
    onPress: () => void;
  };
  rightIconAction?: {
    accessibilityLabel: string;
    onPress: () => void;
  };
}

export function ScreenHeader({ title, rightAction, rightIconAction }: ScreenHeaderProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title} accessibilityRole="header">
        {title}
      </Text>
      {rightIconAction ? (
        <Pressable
          onPress={rightIconAction.onPress}
          accessibilityRole="button"
          accessibilityLabel={rightIconAction.accessibilityLabel}
          style={({ pressed }) => [styles.iconAction, pressed && styles.pressed]}
        >
          <Ionicons name="settings-outline" size={24} color={theme.colors.primary} />
        </Pressable>
      ) : rightAction ? (
        <Pressable
          onPress={rightAction.onPress}
          accessibilityRole="button"
          accessibilityLabel={rightAction.label}
          style={({ pressed }) => [styles.action, pressed && styles.pressed]}
        >
          <Text style={styles.actionText}>{rightAction.label}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.background,
  },
  title: {
    fontSize: theme.typography.title,
    fontWeight: '700',
    color: theme.colors.text,
  },
  action: {
    minHeight: theme.touchTarget,
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.sm,
  },
  iconAction: {
    minWidth: theme.touchTarget,
    minHeight: theme.touchTarget,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.7,
  },
  actionText: {
    fontSize: theme.typography.body,
    color: theme.colors.primary,
    fontWeight: '600',
  },
});
