import { router, Stack, useLocalSearchParams } from 'expo-router';

import { CategoryForm } from '@/components/finance/category-form';
import { useCategories } from '@/hooks/use-categories';
import { CATEGORY_COLORS } from '@/lib/finance/types';
import type { CategoryKind } from '@/types/database';

export default function NewCategoryScreen() {
  const { kind } = useLocalSearchParams<{ kind?: string }>();
  const { createCategory } = useCategories();
  const categoryKind = (kind === 'income' ? 'income' : 'expense') as CategoryKind;

  return (
    <>
      <Stack.Screen options={{ title: 'Add category' }} />
      <CategoryForm
        submitLabel="Save category"
        initialValues={{
          name: '',
          kind: categoryKind,
          color: CATEGORY_COLORS[0],
          monthlyLimit: '',
        }}
        onSubmit={async (values) => {
          const result = await createCategory(values);
          if (!result.error) {
            router.back();
          }
          return result;
        }}
      />
    </>
  );
}
