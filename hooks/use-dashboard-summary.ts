import { useMemo } from 'react';

import { useTransactions } from '@/hooks/use-transactions';
import { computeSummary } from '@/lib/finance/types';

export function useDashboardSummary() {
  const { transactions, isLoading, error, refetch } = useTransactions();

  const summary = useMemo(() => computeSummary(transactions), [transactions]);

  return {
    ...summary,
    isLoading,
    error,
    refetch,
  };
}
