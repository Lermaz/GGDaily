import { router, Stack, useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { CategoryForm } from '@/components/finance/category-form';
import { useCategories } from '@/hooks/use-categories';
import { theme } from '@/lib/theme';
import type { CategoryKind } from '@/types/database';

export default function EditCategoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { categories, updateCategory, deleteCategory, isLoading } = useCategories();
  const category = categories.find((item) => item.id === id);

  if (isLoading && !category) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (!category) {
    return null;
  }

  return (
    <>
      <Stack.Screen options={{ title: 'Edit category' }} />
      <CategoryForm
        submitLabel="Update category"
        kindLocked
        initialValues={{
          name: category.name,
          kind: category.kind as CategoryKind,
          color: category.color,
        }}
        onSubmit={async (values) => {
          const result = await updateCategory(id, {
            name: values.name,
            color: values.color,
          });
          if (!result.error) {
            router.back();
          }
          return result;
        }}
        onDelete={async () => {
          const result = await deleteCategory(id);
          if (!result.error) {
            router.back();
          }
          return result;
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.background,
  },
});
