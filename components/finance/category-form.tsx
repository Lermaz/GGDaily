import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { AuthButton } from '@/components/auth/auth-button';
import { AuthInput } from '@/components/auth/auth-input';
import { ErrorBanner } from '@/components/auth/error-banner';
import { ColorPicker } from '@/components/finance/color-picker';
import { CATEGORY_COLORS } from '@/lib/finance/types';
import { categoryFormSchema } from '@/lib/finance/validation';
import { theme } from '@/lib/theme';
import type { CategoryKind } from '@/types/database';

interface CategoryFormProps {
  initialValues: {
    name: string;
    kind: CategoryKind;
    color: string;
  };
  submitLabel: string;
  kindLocked?: boolean;
  onSubmit: (values: { name: string; kind: CategoryKind; color: string }) => Promise<{
    error: string | null;
  }>;
  onDelete?: () => Promise<{ error: string | null }>;
}

export function CategoryForm({
  initialValues,
  submitLabel,
  kindLocked = false,
  onSubmit,
  onDelete,
}: CategoryFormProps) {
  const [name, setName] = useState(initialValues.name);
  const [kind] = useState(initialValues.kind);
  const [color, setColor] = useState(initialValues.color);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit() {
    setError('');
    const result = categoryFormSchema.safeParse({ name, kind, color });

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
    const { error: submitError } = await onSubmit(result.data);
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

        <AuthInput
          label="Name"
          value={name}
          onChangeText={setName}
          error={fieldErrors.name}
          editable={!isLoading}
        />

        <View style={styles.kindField}>
          <Text style={styles.label}>Type</Text>
          <Text style={styles.kindValue}>{kind}</Text>
          {kindLocked ? (
            <Text style={styles.hint}>Category type cannot be changed after creation.</Text>
          ) : null}
        </View>

        <ColorPicker selectedColor={color} onSelect={setColor} />

        <AuthButton label={submitLabel} onPress={handleSubmit} isLoading={isLoading} />

        {onDelete ? (
          <AuthButton
            label="Delete category"
            variant="secondary"
            onPress={handleDelete}
            disabled={isLoading}
          />
        ) : null}
      </ScrollView>
    </KeyboardAvoidingView>
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
  kindField: {
    gap: theme.spacing.xs,
  },
  label: {
    fontSize: theme.typography.label,
    fontWeight: '600',
    color: theme.colors.text,
  },
  kindValue: {
    fontSize: theme.typography.body,
    color: theme.colors.text,
    textTransform: 'capitalize',
  },
  hint: {
    fontSize: theme.typography.caption,
    color: theme.colors.textSecondary,
  },
});
