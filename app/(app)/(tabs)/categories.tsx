import { router } from 'expo-router';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BudgetProgressBar } from '@/components/finance/budget-progress-bar';
import { CategoryRow } from '@/components/finance/category-row';
import { EmptyState } from '@/components/finance/empty-state';
import { ScreenHeader } from '@/components/finance/screen-header';
import { useCategoryBudgets } from '@/hooks/use-category-budgets';
import { useCategories } from '@/hooks/use-categories';
import { useAppTranslation } from '@/hooks/use-translation';
import { theme } from '@/lib/theme';

export default function CategoriesScreen() {
  const { t } = useAppTranslation();
  const { categories, isLoading, error } = useCategories();
  const { budgets } = useCategoryBudgets();
  const incomeCategories = categories.filter((category) => category.kind === 'income');
  const expenseCategories = categories.filter((category) => category.kind === 'expense');

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScreenHeader title={t('categories.title')} />
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {isLoading ? (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          <CategorySection
            title={t('categories.income')}
            typeLabel={t('categories.income').toLowerCase()}
            categories={incomeCategories}
            onAdd={() => router.push('/category/new?kind=income')}
          />
          <CategorySection
            title={t('categories.expense')}
            typeLabel={t('categories.expense').toLowerCase()}
            categories={expenseCategories}
            budgets={budgets}
            onAdd={() => router.push('/category/new?kind=expense')}
          />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

interface CategorySectionProps {
  title: string;
  typeLabel: string;
  categories: ReturnType<typeof useCategories>['categories'];
  budgets?: ReturnType<typeof useCategoryBudgets>['budgets'];
  onAdd: () => void;
}

function CategorySection({ title, typeLabel, categories, budgets, onAdd }: CategorySectionProps) {
  const { t } = useAppTranslation();

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <Pressable onPress={onAdd} accessibilityRole="button">
          <Text style={styles.addLink}>{t('categories.add')}</Text>
        </Pressable>
      </View>

      {categories.length === 0 ? (
        <EmptyState
          title={t('categories.noCategories', { type: typeLabel })}
          message={t('categories.noCategoriesMessage')}
        />
      ) : (
        <View style={styles.listCard}>
          {categories.map((category) => {
            const budget = budgets?.find((item) => item.category.id === category.id);
            return (
              <View key={category.id}>
                <CategoryRow
                  category={category}
                  onPress={() => router.push(`/category/${category.id}`)}
                />
                {budget ? (
                  <View style={styles.budgetWrap}>
                    <BudgetProgressBar budget={budget} />
                  </View>
                ) : null}
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  error: {
    color: theme.colors.error,
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.sm,
  },
  content: {
    padding: theme.spacing.lg,
    gap: theme.spacing.xl,
    paddingBottom: theme.spacing.xxl,
  },
  section: {
    gap: theme.spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontSize: theme.typography.subtitle,
    fontWeight: '700',
    color: theme.colors.text,
  },
  addLink: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
  listCard: {
    borderRadius: theme.radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  budgetWrap: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
});
