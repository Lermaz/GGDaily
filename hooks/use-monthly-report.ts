import { useMemo } from 'react';

import { useTransactions } from '@/hooks/use-transactions';
import type { TransactionWithCategory } from '@/types/database';

export interface CategoryExpenseSlice {
  name: string;
  amount: number;
  color: string;
}

export interface WeeklyTotals {
  label: string;
  income: number;
  expense: number;
}

function getMonthRange(monthKey: string): { start: string; end: string } {
  const [year, month] = monthKey.split('-').map(Number);
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 0);
  return {
    start: `${year}-${String(month).padStart(2, '0')}-01`,
    end: `${year}-${String(month).padStart(2, '0')}-${String(end.getDate()).padStart(2, '0')}`,
  };
}

function filterByMonth(transactions: TransactionWithCategory[], monthKey: string) {
  const { start, end } = getMonthRange(monthKey);
  return transactions.filter(
    (transaction) => transaction.occurred_on >= start && transaction.occurred_on <= end,
  );
}

function buildExpensesByCategory(
  transactions: TransactionWithCategory[],
): CategoryExpenseSlice[] {
  const totals = new Map<string, CategoryExpenseSlice>();

  for (const transaction of transactions) {
    if (transaction.category?.kind !== 'expense') {
      continue;
    }
    const key = transaction.category.id;
    const existing = totals.get(key);
    if (existing) {
      existing.amount += Number(transaction.amount);
    } else {
      totals.set(key, {
        name: transaction.category.name,
        amount: Number(transaction.amount),
        color: transaction.category.color,
      });
    }
  }

  const sorted = [...totals.values()].sort((a, b) => b.amount - a.amount);
  if (sorted.length <= 6) {
    return sorted;
  }

  const top = sorted.slice(0, 5);
  const otherAmount = sorted.slice(5).reduce((sum, item) => sum + item.amount, 0);
  return [...top, { name: 'Other', amount: otherAmount, color: '#64748B' }];
}

function buildWeeklyTotals(transactions: TransactionWithCategory[]): WeeklyTotals[] {
  const weeks = new Map<string, WeeklyTotals>();

  for (const transaction of transactions) {
    const date = new Date(`${transaction.occurred_on}T00:00:00`);
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() - date.getDay());
    const label = `W${Math.ceil(weekStart.getDate() / 7)}`;
    const key = weekStart.toISOString().slice(0, 10);
    const existing = weeks.get(key) ?? { label, income: 0, expense: 0 };

    if (transaction.category?.kind === 'income') {
      existing.income += Number(transaction.amount);
    } else if (transaction.category?.kind === 'expense') {
      existing.expense += Number(transaction.amount);
    }

    weeks.set(key, existing);
  }

  return [...weeks.values()];
}

export function useMonthlyReport(monthKey: string) {
  const { transactions, isLoading, error } = useTransactions();

  const report = useMemo(() => {
    const monthTransactions = filterByMonth(transactions, monthKey);
    let totalIncome = 0;
    let totalExpenses = 0;

    for (const transaction of monthTransactions) {
      if (transaction.category?.kind === 'income') {
        totalIncome += Number(transaction.amount);
      } else if (transaction.category?.kind === 'expense') {
        totalExpenses += Number(transaction.amount);
      }
    }

    return {
      totalIncome,
      totalExpenses,
      expensesByCategory: buildExpensesByCategory(monthTransactions),
      weeklyTotals: buildWeeklyTotals(monthTransactions),
      hasData: monthTransactions.length > 0,
    };
  }, [transactions, monthKey]);

  return {
    ...report,
    isLoading,
    error,
  };
}

export function getCurrentMonthKey(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

export function shiftMonthKey(monthKey: string, delta: number): string {
  const [year, month] = monthKey.split('-').map(Number);
  const date = new Date(year, month - 1 + delta, 1);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

export function formatMonthLabel(monthKey: string, locale: string): string {
  const [year, month] = monthKey.split('-').map(Number);
  return new Date(year, month - 1, 1).toLocaleDateString(locale === 'es' ? 'es-ES' : 'en-US', {
    month: 'long',
    year: 'numeric',
  });
}
