import type { User } from '@supabase/supabase-js';

import { DEFAULT_CATEGORY_TEMPLATES } from '@/lib/default-categories';
import i18n, { AppLanguage, isAppLanguage } from '@/lib/i18n';
import { supabase } from '@/lib/supabase';

export function hasCompletedLanguageOnboarding(user: User): boolean {
  return user.user_metadata?.language_onboarded === true;
}

export function getPreferredLanguageFromUser(user: User): AppLanguage | null {
  const language = user.user_metadata?.preferred_language;
  return typeof language === 'string' && isAppLanguage(language) ? language : null;
}

export async function markLanguageOnboardingComplete(language: AppLanguage) {
  const { error } = await supabase.auth.updateUser({
    data: {
      language_onboarded: true,
      preferred_language: language,
    },
  });

  return { error: error?.message ?? null };
}

function getDefaultCategoryName(key: string, language: AppLanguage): string {
  return i18n.t(`defaultCategories.${key}`, { lng: language });
}

function isDefaultCategoryName(name: string, key: string, englishName: string): boolean {
  if (name === englishName) {
    return true;
  }

  return (
    name === getDefaultCategoryName(key, 'en') || name === getDefaultCategoryName(key, 'es')
  );
}

export async function syncDefaultCategoriesForLanguage(userId: string, language: AppLanguage) {
  const { data: existing, error } = await supabase
    .from('categories')
    .select('id, name, kind, color')
    .eq('user_id', userId);

  if (error) {
    throw new Error(error.message);
  }

  if (!existing || existing.length === 0) {
    const { error: insertError } = await supabase.from('categories').insert(
      DEFAULT_CATEGORY_TEMPLATES.map((template) => ({
        user_id: userId,
        name: getDefaultCategoryName(template.key, language),
        kind: template.kind,
        color: template.color,
      })),
    );

    if (insertError) {
      throw new Error(insertError.message);
    }

    return;
  }

  for (const template of DEFAULT_CATEGORY_TEMPLATES) {
    const category = existing.find(
      (item) => item.color === template.color && item.kind === template.kind,
    );

    if (!category || !isDefaultCategoryName(category.name, template.key, template.englishName)) {
      continue;
    }

    const { error: updateError } = await supabase
      .from('categories')
      .update({ name: getDefaultCategoryName(template.key, language) })
      .eq('id', category.id);

    if (updateError) {
      throw new Error(updateError.message);
    }
  }
}
