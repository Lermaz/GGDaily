import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useAppTranslation } from '@/hooks/use-translation';
import { CATEGORY_COLORS } from '@/lib/finance/types';
import { theme } from '@/lib/theme';

interface ColorPickerProps {
  selectedColor: string;
  onSelect: (color: string) => void;
}

export function ColorPicker({ selectedColor, onSelect }: ColorPickerProps) {
  const { t } = useAppTranslation();
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{t('categories.color')}</Text>
      <View style={styles.grid}>
        {CATEGORY_COLORS.map((color) => {
          const isSelected = color === selectedColor;
          return (
            <Pressable
              key={color}
              onPress={() => onSelect(color)}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
              style={[
                styles.swatch,
                { backgroundColor: color },
                isSelected && styles.swatchSelected,
              ]}
            />
          );
        })}
      </View>
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  swatch: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  swatchSelected: {
    borderWidth: 3,
    borderColor: theme.colors.text,
  },
});
