import { Pressable, StyleSheet, Text, View } from 'react-native';

import { theme } from '@/lib/theme';
import type { Category } from '@/types/database';

interface CategoryRowProps {
  category: Category;
  onPress?: () => void;
}

export function CategoryRow({ category, onPress }: CategoryRowProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole="button"
      style={({ pressed }) => [styles.row, pressed && onPress && styles.pressed]}
    >
      <View style={styles.left}>
        <View style={[styles.swatch, { backgroundColor: category.color }]} />
        <Text style={styles.name}>{category.name}</Text>
      </View>
      <Text style={styles.kind}>{category.kind}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  pressed: {
    backgroundColor: '#F1F5F9',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  swatch: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  name: {
    fontSize: theme.typography.body,
    fontWeight: '600',
    color: theme.colors.text,
  },
  kind: {
    fontSize: theme.typography.caption,
    color: theme.colors.textSecondary,
    textTransform: 'capitalize',
  },
});
