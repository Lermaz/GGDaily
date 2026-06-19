import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { AuthInput } from '@/components/auth/auth-input';
import { AmountInput } from '@/components/finance/amount-input';
import { useCategories } from '@/hooks/use-categories';
import { useAppTranslation } from '@/hooks/use-translation';
import type { TransactionFilters } from '@/lib/finance/filters';
import { formatDisplayDate, parseDateString, toDateString } from '@/lib/finance/types';
import { theme } from '@/lib/theme';

interface TransactionFiltersPanelProps {
  filters: TransactionFilters;
  onChange: (next: Partial<TransactionFilters>) => void;
  onClear: () => void;
  hasActiveFilters: boolean;
}

export function TransactionFiltersPanel({
  filters,
  onChange,
  onClear,
  hasActiveFilters,
}: TransactionFiltersPanelProps) {
  const { t } = useAppTranslation();
  const { categories } = useCategories();
  const [expanded, setExpanded] = useState(false);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  function handleDateChange(
    field: 'startDate' | 'endDate',
    event: DateTimePickerEvent,
    date?: Date,
  ) {
    if (Platform.OS === 'android') {
      setShowStartPicker(false);
      setShowEndPicker(false);
    }
    if (event.type === 'dismissed' || !date) {
      return;
    }
    onChange({ [field]: toDateString(date) });
  }

  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => setExpanded((value) => !value)}
        accessibilityRole="button"
        style={styles.toggle}
      >
        <Text style={styles.toggleText}>{t('transactions.filters')}</Text>
        <Text style={styles.toggleHint}>{expanded ? '−' : '+'}</Text>
      </Pressable>

      {expanded ? (
        <View style={styles.panel}>
          <AuthInput
            label={t('transactions.search')}
            value={filters.search ?? ''}
            onChangeText={(value) => onChange({ search: value })}
          />

          <View style={styles.categoryFilter}>
            <Text style={styles.label}>{t('transactions.category')}</Text>
            <View style={styles.chipRow}>
              <FilterChip
                label={t('transactions.allCategories')}
                active={!filters.categoryId}
                onPress={() => onChange({ categoryId: undefined })}
              />
              {categories.map((category) => (
                <FilterChip
                  key={category.id}
                  label={category.name}
                  active={filters.categoryId === category.id}
                  onPress={() => onChange({ categoryId: category.id })}
                />
              ))}
            </View>
          </View>

          <View style={styles.dateRow}>
            <DateField
              label={t('transactions.startDate')}
              value={filters.startDate}
              onPress={() => setShowStartPicker(true)}
            />
            <DateField
              label={t('transactions.endDate')}
              value={filters.endDate}
              onPress={() => setShowEndPicker(true)}
            />
          </View>

          <View style={styles.amountRow}>
            <AmountInput
              label={t('transactions.minAmount')}
              value={filters.minAmount != null ? String(filters.minAmount) : ''}
              onChangeText={(value) =>
                onChange({ minAmount: value ? Number(value) : undefined })
              }
            />
            <AmountInput
              label={t('transactions.maxAmount')}
              value={filters.maxAmount != null ? String(filters.maxAmount) : ''}
              onChangeText={(value) =>
                onChange({ maxAmount: value ? Number(value) : undefined })
              }
            />
          </View>

          {hasActiveFilters ? (
            <Pressable onPress={onClear} accessibilityRole="button">
              <Text style={styles.clear}>{t('transactions.clearFilters')}</Text>
            </Pressable>
          ) : null}
        </View>
      ) : null}

      {showStartPicker ? (
        <DateTimePicker
          value={filters.startDate ? parseDateString(filters.startDate) : new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, date) => handleDateChange('startDate', event, date)}
        />
      ) : null}
      {showEndPicker ? (
        <DateTimePicker
          value={filters.endDate ? parseDateString(filters.endDate) : new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, date) => handleDateChange('endDate', event, date)}
        />
      ) : null}
    </View>
  );
}

interface DateFieldProps {
  label: string;
  value?: string;
  onPress: () => void;
}

function DateField({ label, value, onPress }: DateFieldProps) {
  return (
    <View style={styles.dateField}>
      <Text style={styles.label}>{label}</Text>
      <Pressable style={styles.dateButton} onPress={onPress}>
        <Text style={styles.dateText}>
          {value ? formatDisplayDate(value) : '—'}
        </Text>
      </Pressable>
    </View>
  );
}

interface FilterChipProps {
  label: string;
  active: boolean;
  onPress: () => void;
}

function FilterChip({ label, active, onPress }: FilterChipProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.chip, active && styles.chipActive]}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
    >
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.sm,
    gap: theme.spacing.sm,
  },
  toggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: theme.touchTarget,
  },
  toggleText: {
    fontSize: theme.typography.body,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  toggleHint: {
    fontSize: theme.typography.title,
    color: theme.colors.primary,
  },
  panel: {
    gap: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.md,
  },
  dateRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  dateField: {
    flex: 1,
    gap: theme.spacing.sm,
  },
  label: {
    fontSize: theme.typography.label,
    fontWeight: '600',
    color: theme.colors.text,
  },
  dateButton: {
    minHeight: theme.touchTarget,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.background,
  },
  dateText: {
    fontSize: theme.typography.caption,
    color: theme.colors.text,
  },
  amountRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  categoryFilter: {
    gap: theme.spacing.sm,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  chip: {
    paddingHorizontal: theme.spacing.md,
    minHeight: 36,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    justifyContent: 'center',
    backgroundColor: theme.colors.background,
  },
  chipActive: {
    borderColor: theme.colors.primary,
    backgroundColor: '#EFF6FF',
  },
  chipText: {
    fontSize: theme.typography.caption,
    color: theme.colors.textSecondary,
  },
  chipTextActive: {
    color: theme.colors.primary,
    fontWeight: '700',
  },
  clear: {
    color: theme.colors.primary,
    fontWeight: '600',
    textAlign: 'center',
  },
});
