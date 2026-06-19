import { useCallback, useEffect, useState } from 'react';

import { useAuth } from '@/contexts/auth-context';
import i18n from '@/lib/i18n';
import { supabase } from '@/lib/supabase';
import type { Category, CategoryKind } from '@/types/database';

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
        return { error: i18n.t('common.notAuthenticated') };
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
          return { error: 'category_in_use' };
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
