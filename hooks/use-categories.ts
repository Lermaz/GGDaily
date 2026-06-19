import { useCallback, useEffect, useState } from 'react';

import { useAuth } from '@/contexts/auth-context';
import { supabase } from '@/lib/supabase';
import type { Category, CategoryKind } from '@/types/database';

const DEFAULT_CATEGORIES: Array<{ name: string; kind: CategoryKind; color: string }> = [
  { name: 'Salary', kind: 'income', color: '#16A34A' },
  { name: 'Freelance', kind: 'income', color: '#22C55E' },
  { name: 'Other Income', kind: 'income', color: '#4ADE80' },
  { name: 'Food', kind: 'expense', color: '#EF4444' },
  { name: 'Rent', kind: 'expense', color: '#DC2626' },
  { name: 'Transport', kind: 'expense', color: '#F97316' },
  { name: 'Bills', kind: 'expense', color: '#EAB308' },
  { name: 'Shopping', kind: 'expense', color: '#8B5CF6' },
  { name: 'Entertainment', kind: 'expense', color: '#EC4899' },
  { name: 'Other', kind: 'expense', color: '#64748B' },
];

async function seedDefaultCategoriesIfNeeded(userId: string) {
  const { count, error: countError } = await supabase
    .from('categories')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);

  if (countError || (count ?? 0) > 0) {
    return;
  }

  await supabase.from('categories').insert(
    DEFAULT_CATEGORIES.map((category) => ({
      user_id: userId,
      name: category.name,
      kind: category.kind,
      color: category.color,
    })),
  );
}

interface UseCategoriesResult {
  categories: Category[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  createCategory: (input: {
    name: string;
    kind: CategoryKind;
    color: string;
    monthlyLimit?: number | null;
  }) => Promise<{ error: string | null }>;
  updateCategory: (
    id: string,
    input: { name: string; color: string; monthlyLimit?: number | null },
  ) => Promise<{ error: string | null }>;
  deleteCategory: (id: string) => Promise<{ error: string | null }>;
}

export function useCategories(): UseCategoriesResult {
  const { session } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    if (!session?.user.id) {
      setCategories([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    await seedDefaultCategoriesIfNeeded(session.user.id);

    const { data, error: fetchError } = await supabase
      .from('categories')
      .select('*')
      .eq('user_id', session.user.id)
      .order('name', { ascending: true });

    if (fetchError) {
      setError(fetchError.message);
      setCategories([]);
    } else {
      setError(null);
      setCategories(data ?? []);
    }
    setIsLoading(false);
  }, [session?.user.id]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const createCategory = useCallback(
    async (input: {
      name: string;
      kind: CategoryKind;
      color: string;
      monthlyLimit?: number | null;
    }) => {
      if (!session?.user.id) {
        return { error: 'Not authenticated' };
      }

      const { error: insertError } = await supabase.from('categories').insert({
        user_id: session.user.id,
        name: input.name.trim(),
        kind: input.kind,
        color: input.color,
        monthly_limit: input.kind === 'expense' ? (input.monthlyLimit ?? null) : null,
      });

      if (insertError) {
        return { error: insertError.message };
      }

      await refetch();
      return { error: null };
    },
    [refetch, session?.user.id],
  );

  const updateCategory = useCallback(
    async (id: string, input: { name: string; color: string; monthlyLimit?: number | null }) => {
      const { error: updateError } = await supabase
        .from('categories')
        .update({
          name: input.name.trim(),
          color: input.color,
          monthly_limit: input.monthlyLimit ?? null,
        })
        .eq('id', id);

      if (updateError) {
        return { error: updateError.message };
      }

      await refetch();
      return { error: null };
    },
    [refetch],
  );

  const deleteCategory = useCallback(
    async (id: string) => {
      const { error: deleteError } = await supabase.from('categories').delete().eq('id', id);

      if (deleteError) {
        if (deleteError.code === '23503') {
          return { error: 'Cannot delete a category that has transactions.' };
        }
        return { error: deleteError.message };
      }

      await refetch();
      return { error: null };
    },
    [refetch],
  );

  return {
    categories,
    isLoading,
    error,
    refetch,
    createCategory,
    updateCategory,
    deleteCategory,
  };
}
