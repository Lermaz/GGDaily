import { getMonthBounds } from '@/lib/finance/types';
import type { Category, TransactionWithCategory } from '@/types/database';

export type BudgetStatus = 'ok' | 'warning' | 'exceeded';

export interface CategoryBudget {
  category: Category;
  spent: number;
  limit: number;
  percent: number;
  status: BudgetStatus;
}

const WARNING_THRESHOLD = 0.8;

export function getBudgetStatus(spent: number, limit: number): BudgetStatus {
  if (spent >= limit) {
    return 'exceeded';
  }
  if (spent / limit >= WARNING_THRESHOLD) {
    return 'warning';
  }
  return 'ok';
}

export function computeCategoryBudgets(
  categories: Category[],
  transactions: TransactionWithCategory[],
): CategoryBudget[] {
  const { start, end } = getMonthBounds();

  return categories
    .filter((category) => category.kind === 'expense' && category.monthly_limit != null)
    .map((category) => {
      const limit = Number(category.monthly_limit);
      const spent = transactions
        .filter(
          (transaction) =>
            transaction.category_id === category.id &&
            transaction.occurred_on >= start &&
            transaction.occurred_on <= end,
        )
        .reduce((sum, transaction) => sum + Number(transaction.amount), 0);

      const percent = limit > 0 ? Math.round((spent / limit) * 100) : 0;
      return {
        category,
        spent,
        limit,
        percent,
        status: getBudgetStatus(spent, limit),
      };
    });
}

export function getBudgetAlerts(budgets: CategoryBudget[]): CategoryBudget[] {
  return budgets.filter((budget) => budget.status !== 'ok');
}
