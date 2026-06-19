import { router } from 'expo-router';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CategoryRow } from '@/components/finance/category-row';
import { EmptyState } from '@/components/finance/empty-state';
import { ScreenHeader } from '@/components/finance/screen-header';
import { useCategories } from '@/hooks/use-categories';
import { theme } from '@/lib/theme';

export default function CategoriesScreen() {
  const { categories, isLoading, error } = useCategories();
  const incomeCategories = categories.filter((category) => category.kind === 'income');
  const expenseCategories = categories.filter((category) => category.kind === 'expense');

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScreenHeader title="Categories" />
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {isLoading ? (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          <CategorySection
            title="Income"
            categories={incomeCategories}
            onAdd={() => router.push('/category/new?kind=income')}
          />
          <CategorySection
            title="Expense"
            categories={expenseCategories}
            onAdd={() => router.push('/category/new?kind=expense')}
          />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

interface CategorySectionProps {
  title: string;
  categories: ReturnType<typeof useCategories>['categories'];
  onAdd: () => void;
}

function CategorySection({ title, categories, onAdd }: CategorySectionProps) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <Pressable onPress={onAdd} accessibilityRole="button">
          <Text style={styles.addLink}>Add category</Text>
        </Pressable>
      </View>

      {categories.length === 0 ? (
        <EmptyState title={`No ${title.toLowerCase()} categories`} message="Create one to get started." />
      ) : (
        <View style={styles.listCard}>
          {categories.map((category) => (
            <CategoryRow
              key={category.id}
              category={category}
              onPress={() => router.push(`/category/${category.id}`)}
            />
          ))}
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
});
