import { useCallback, useEffect, useState } from 'react';

import { useAuth } from '@/contexts/auth-context';
import type { TransactionFilters } from '@/lib/finance/filters';
import { supabase } from '@/lib/supabase';
import type { TransactionWithCategory } from '@/types/database';

interface UseTransactionsResult {
  transactions: TransactionWithCategory[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  createTransaction: (input: {
    amount: number;
    description: string;
    categoryId: string;
    occurredOn: string;
  }) => Promise<{ error: string | null }>;
  updateTransaction: (
    id: string,
    input: {
      amount: number;
      description: string;
      categoryId: string;
      occurredOn: string;
    },
  ) => Promise<{ error: string | null }>;
  deleteTransaction: (id: string) => Promise<{ error: string | null }>;
  getTransaction: (id: string) => TransactionWithCategory | undefined;
}

const TRANSACTION_SELECT = `
  *,
  category:categories (
    id,
    name,
    kind,
    color
  )
`;

export function useTransactions(filters?: TransactionFilters): UseTransactionsResult {
  const { session } = useAuth();
  const [transactions, setTransactions] = useState<TransactionWithCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    if (!session?.user.id) {
      setTransactions([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    let query = supabase
      .from('transactions')
      .select(TRANSACTION_SELECT)
      .eq('user_id', session.user.id);

    if (filters?.search?.trim()) {
      query = query.ilike('description', `%${filters.search.trim()}%`);
    }
    if (filters?.categoryId) {
      query = query.eq('category_id', filters.categoryId);
    }
    if (filters?.startDate) {
      query = query.gte('occurred_on', filters.startDate);
    }
    if (filters?.endDate) {
      query = query.lte('occurred_on', filters.endDate);
    }
    if (filters?.minAmount != null) {
      query = query.gte('amount', filters.minAmount);
    }
    if (filters?.maxAmount != null) {
      query = query.lte('amount', filters.maxAmount);
    }

    const { data, error: fetchError } = await query
      .order('occurred_on', { ascending: false })
      .order('created_at', { ascending: false });

    if (fetchError) {
      setError(fetchError.message);
      setTransactions([]);
    } else {
      setError(null);
      setTransactions((data as TransactionWithCategory[]) ?? []);
    }
    setIsLoading(false);
  }, [
    session?.user.id,
    filters?.search,
    filters?.categoryId,
    filters?.startDate,
    filters?.endDate,
    filters?.minAmount,
    filters?.maxAmount,
  ]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const createTransaction = useCallback(
    async (input: {
      amount: number;
      description: string;
      categoryId: string;
      occurredOn: string;
    }) => {
      if (!session?.user.id) {
        return { error: 'Not authenticated' };
      }

      const { error: insertError } = await supabase.from('transactions').insert({
        user_id: session.user.id,
        amount: input.amount,
        description: input.description.trim(),
        category_id: input.categoryId,
        occurred_on: input.occurredOn,
      });

      if (insertError) {
        return { error: insertError.message };
      }

      await refetch();
      return { error: null };
    },
    [refetch, session?.user.id],
  );

  const updateTransaction = useCallback(
    async (
      id: string,
      input: {
        amount: number;
        description: string;
        categoryId: string;
        occurredOn: string;
      },
    ) => {
      const { error: updateError } = await supabase
        .from('transactions')
        .update({
          amount: input.amount,
          description: input.description.trim(),
          category_id: input.categoryId,
          occurred_on: input.occurredOn,
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

  const deleteTransaction = useCallback(
    async (id: string) => {
      const { error: deleteError } = await supabase.from('transactions').delete().eq('id', id);

      if (deleteError) {
        return { error: deleteError.message };
      }

      await refetch();
      return { error: null };
    },
    [refetch],
  );

  const getTransaction = useCallback(
    (id: string) => transactions.find((transaction) => transaction.id === id),
    [transactions],
  );

  return {
    transactions,
    isLoading,
    error,
    refetch,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    getTransaction,
  };
}
