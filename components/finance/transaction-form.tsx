import { useEffect } from 'react';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { AuthButton } from '@/components/auth/auth-button';
import { AuthInput } from '@/components/auth/auth-input';
import { ErrorBanner } from '@/components/auth/error-banner';
import { AmountInput } from '@/components/finance/amount-input';
import { CategoryPicker } from '@/components/finance/category-picker';
import { useCategories } from '@/hooks/use-categories';
import { formatDisplayDate, parseDateString, toDateString } from '@/lib/finance/types';
import { transactionFormSchema } from '@/lib/finance/validation';
import { theme } from '@/lib/theme';
import type { CategoryKind } from '@/types/database';

interface TransactionFormProps {
  initialValues?: {
    amount: string;
    description: string;
    categoryId: string;
    occurredOn: string;
    kind: CategoryKind;
  };
  submitLabel: string;
  onSubmit: (values: {
    amount: number;
    description: string;
    categoryId: string;
    occurredOn: string;
  }) => Promise<{ error: string | null }>;
  onDelete?: () => Promise<{ error: string | null }>;
}

export function TransactionForm({
  initialValues,
  submitLabel,
  onSubmit,
  onDelete,
}: TransactionFormProps) {
  const { categories } = useCategories();
  const [kind, setKind] = useState<CategoryKind>(initialValues?.kind ?? 'expense');
  const [amount, setAmount] = useState(initialValues?.amount ?? '');
  const [description, setDescription] = useState(initialValues?.description ?? '');
  const [categoryId, setCategoryId] = useState(initialValues?.categoryId ?? '');
  const [occurredOn, setOccurredOn] = useState(
    initialValues?.occurredOn ?? toDateString(new Date()),
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const filteredCategories = categories.filter((category) => category.kind === kind);

  useEffect(() => {
    if (!categoryId && filteredCategories.length > 0) {
      setCategoryId(filteredCategories[0].id);
    }
  }, [categoryId, filteredCategories]);

  function handleKindChange(nextKind: CategoryKind) {
    setKind(nextKind);
    const nextCategories = categories.filter((category) => category.kind === nextKind);
    const stillValid = nextCategories.some((category) => category.id === categoryId);
    if (!stillValid) {
      setCategoryId(nextCategories[0]?.id ?? '');
    }
  }

  function handleDateChange(event: DateTimePickerEvent, selectedDate?: Date) {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (event.type === 'dismissed' || !selectedDate) {
      return;
    }
    setOccurredOn(toDateString(selectedDate));
  }

  async function handleSubmit() {
    setError('');
    const result = transactionFormSchema.safeParse({
      amount,
      description,
      categoryId: categoryId || undefined,
      occurredOn,
    });

    if (!result.success) {
      const errors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0];
        if (typeof field === 'string' && !errors[field]) {
          errors[field] = issue.message;
        }
      }
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    setIsLoading(true);
    const { error: submitError } = await onSubmit({
      amount: Number(result.data.amount),
      description: result.data.description,
      categoryId: result.data.categoryId,
      occurredOn: result.data.occurredOn,
    });
    setIsLoading(false);

    if (submitError) {
      setError(submitError);
    }
  }

  async function handleDelete() {
    if (!onDelete) {
      return;
    }
    setIsLoading(true);
    const { error: deleteError } = await onDelete();
    setIsLoading(false);
    if (deleteError) {
      setError(deleteError);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <ErrorBanner message={error} />

        <View style={styles.kindToggle}>
          <KindButton label="Expense" active={kind === 'expense'} onPress={() => handleKindChange('expense')} />
          <KindButton label="Income" active={kind === 'income'} onPress={() => handleKindChange('income')} />
        </View>

        <AmountInput
          label="Amount"
          value={amount}
          onChangeText={setAmount}
          error={fieldErrors.amount}
          editable={!isLoading}
        />

        <AuthInput
          label="Description"
          value={description}
          onChangeText={setDescription}
          error={fieldErrors.description}
          placeholder="What was this for?"
          editable={!isLoading}
        />

        <CategoryPicker
          categories={filteredCategories}
          selectedId={categoryId}
          onSelect={setCategoryId}
          error={fieldErrors.categoryId}
        />

        <View style={styles.dateField}>
          <Text style={styles.label}>Date</Text>
          <Pressable
            style={styles.dateButton}
            onPress={() => setShowDatePicker(true)}
            accessibilityRole="button"
          >
            <Text style={styles.dateText}>{formatDisplayDate(occurredOn)}</Text>
          </Pressable>
          {fieldErrors.occurredOn ? (
            <Text style={styles.errorText}>{fieldErrors.occurredOn}</Text>
          ) : null}
        </View>

        {showDatePicker ? (
          <DateTimePicker
            value={parseDateString(occurredOn)}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleDateChange}
          />
        ) : null}

        <AuthButton label={submitLabel} onPress={handleSubmit} isLoading={isLoading} />

        {onDelete ? (
          <AuthButton
            label="Delete transaction"
            variant="secondary"
            onPress={handleDelete}
            disabled={isLoading}
          />
        ) : null}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

interface KindButtonProps {
  label: string;
  active: boolean;
  onPress: () => void;
}

function KindButton({ label, active, onPress }: KindButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      style={[styles.kindButton, active && styles.kindButtonActive]}
    >
      <Text style={[styles.kindButtonText, active && styles.kindButtonTextActive]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
    paddingBottom: theme.spacing.xxl,
  },
  kindToggle: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  kindButton: {
    flex: 1,
    minHeight: theme.touchTarget,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surface,
  },
  kindButtonActive: {
    borderColor: theme.colors.primary,
    backgroundColor: '#EFF6FF',
  },
  kindButtonText: {
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  kindButtonTextActive: {
    color: theme.colors.primary,
  },
  dateField: {
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
    backgroundColor: theme.colors.surface,
  },
  dateText: {
    fontSize: theme.typography.body,
    color: theme.colors.text,
  },
  errorText: {
    fontSize: theme.typography.caption,
    color: theme.colors.error,
  },
});
