import type { CategoryKind } from '@/types/database';

export interface DefaultCategoryTemplate {
  key: string;
  kind: CategoryKind;
  color: string;
  englishName: string;
}

export const DEFAULT_CATEGORY_TEMPLATES: DefaultCategoryTemplate[] = [
  { key: 'salary', kind: 'income', color: '#16A34A', englishName: 'Salary' },
  { key: 'freelance', kind: 'income', color: '#22C55E', englishName: 'Freelance' },
  { key: 'otherIncome', kind: 'income', color: '#4ADE80', englishName: 'Other Income' },
  { key: 'food', kind: 'expense', color: '#EF4444', englishName: 'Food' },
  { key: 'rent', kind: 'expense', color: '#DC2626', englishName: 'Rent' },
  { key: 'transport', kind: 'expense', color: '#F97316', englishName: 'Transport' },
  { key: 'bills', kind: 'expense', color: '#EAB308', englishName: 'Bills' },
  { key: 'shopping', kind: 'expense', color: '#8B5CF6', englishName: 'Shopping' },
  { key: 'entertainment', kind: 'expense', color: '#EC4899', englishName: 'Entertainment' },
  { key: 'other', kind: 'expense', color: '#64748B', englishName: 'Other' },
];
