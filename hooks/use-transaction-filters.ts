import { useCallback, useState } from 'react';

import {
  EMPTY_TRANSACTION_FILTERS,
  hasActiveFilters,
  type TransactionFilters,
} from '@/lib/finance/filters';

export function useTransactionFilters() {
  const [filters, setFilters] = useState<TransactionFilters>(EMPTY_TRANSACTION_FILTERS);

  const updateFilters = useCallback((next: Partial<TransactionFilters>) => {
    setFilters((current) => ({ ...current, ...next }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters(EMPTY_TRANSACTION_FILTERS);
  }, []);

  return {
    filters,
    updateFilters,
    clearFilters,
    hasActiveFilters: hasActiveFilters(filters),
  };
}
