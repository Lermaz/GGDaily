import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { theme } from '@/lib/theme';
import type { Category } from '@/types/database';

interface CategoryPickerProps {
  categories: Category[];
  selectedId: string;
  onSelect: (id: string) => void;
  error?: string;
}

export function CategoryPicker({ categories, selectedId, onSelect, error }: CategoryPickerProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Category</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.list}>
        {categories.map((category) => {
          const isSelected = category.id === selectedId;
          return (
            <Pressable
              key={category.id}
              onPress={() => onSelect(category.id)}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
              style={[
                styles.chip,
                isSelected && styles.chipSelected,
                { borderColor: category.color },
              ]}
            >
              <View style={[styles.dot, { backgroundColor: category.color }]} />
              <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                {category.name}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
      {error ? (
        <Text style={styles.error} accessibilityRole="alert">
          {error}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: theme.spacing.sm,
  },
  label: {
    fontSize: theme.typography.label,
    fontWeight: '600',
    color: theme.colors.text,
  },
  list: {
    gap: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    minHeight: theme.touchTarget,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  chipSelected: {
    backgroundColor: '#EFF6FF',
    borderWidth: 2,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  chipText: {
    fontSize: theme.typography.body,
    color: theme.colors.text,
  },
  chipTextSelected: {
    fontWeight: '700',
    color: theme.colors.primary,
  },
  error: {
    fontSize: theme.typography.caption,
    color: theme.colors.error,
  },
});
