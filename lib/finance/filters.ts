export interface TransactionFilters {
  search?: string;
  categoryId?: string;
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
}

export const EMPTY_TRANSACTION_FILTERS: TransactionFilters = {};

export function hasActiveFilters(filters: TransactionFilters): boolean {
  return Boolean(
    filters.search ||
      filters.categoryId ||
      filters.startDate ||
      filters.endDate ||
      filters.minAmount != null ||
      filters.maxAmount != null,
  );
}
