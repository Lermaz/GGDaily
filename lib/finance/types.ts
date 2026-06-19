import type { CategoryKind, TransactionWithCategory } from '@/types/database';

export const CATEGORY_COLORS = [
  '#16A34A',
  '#22C55E',
  '#4ADE80',
  '#EF4444',
  '#DC2626',
  '#F97316',
  '#EAB308',
  '#8B5CF6',
  '#EC4899',
  '#64748B',
] as const;

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export function formatSignedAmount(amount: number, kind: CategoryKind): string {
  const prefix = kind === 'income' ? '+' : '−';
  return `${prefix}${formatCurrency(amount)}`;
}

export function isIncome(kind: string): kind is 'income' {
  return kind === 'income';
}

export function getMonthBounds(date = new Date()): { start: string; end: string } {
  const year = date.getFullYear();
  const month = date.getMonth();
  const start = new Date(year, month, 1);
  const end = new Date(year, month + 1, 0);
  return {
    start: toDateString(start),
    end: toDateString(end),
  };
}

export function toDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function parseDateString(value: string): Date {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function formatDisplayDate(value: string): string {
  return parseDateString(value).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export interface DashboardSummary {
  balance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  recentTransactions: TransactionWithCategory[];
}

export function computeSummary(transactions: TransactionWithCategory[]): DashboardSummary {
  const { start, end } = getMonthBounds();
  let balance = 0;
  let monthlyIncome = 0;
  let monthlyExpenses = 0;

  for (const transaction of transactions) {
    const kind = transaction.category?.kind;
    if (!kind || (kind !== 'income' && kind !== 'expense')) {
      continue;
    }

    if (kind === 'income') {
      balance += transaction.amount;
    } else {
      balance -= transaction.amount;
    }

    if (transaction.occurred_on >= start && transaction.occurred_on <= end) {
      if (kind === 'income') {
        monthlyIncome += transaction.amount;
      } else {
        monthlyExpenses += transaction.amount;
      }
    }
  }

  return {
    balance,
    monthlyIncome,
    monthlyExpenses,
    recentTransactions: transactions.slice(0, 5),
  };
}
