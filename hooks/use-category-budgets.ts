import { useMemo } from 'react';

import { useCategories } from '@/hooks/use-categories';
import { useTransactions } from '@/hooks/use-transactions';
import { computeCategoryBudgets, getBudgetAlerts } from '@/lib/finance/budget';

export function useCategoryBudgets() {
  const { categories, isLoading: isCategoriesLoading } = useCategories();
  const { transactions, isLoading: isTransactionsLoading } = useTransactions();

  const budgets = useMemo(
    () => computeCategoryBudgets(categories, transactions),
    [categories, transactions],
  );

  const alerts = useMemo(() => getBudgetAlerts(budgets), [budgets]);

  return {
    budgets,
    alerts,
    isLoading: isCategoriesLoading || isTransactionsLoading,
  };
}
