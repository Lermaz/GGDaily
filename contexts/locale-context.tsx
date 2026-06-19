import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import i18n, {
  AppLanguage,
  DEFAULT_LANGUAGE,
  isAppLanguage,
  LOCALE_STORAGE_KEY,
} from '@/lib/i18n';
import { getLocaleStorageItem, setLocaleStorageItem } from '@/lib/locale-storage';

interface LocaleContextValue {
  language: AppLanguage;
  setLanguage: (language: AppLanguage) => Promise<void>;
  isReady: boolean;
}

const LocaleContext = createContext<LocaleContextValue | undefined>(undefined);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<AppLanguage>(DEFAULT_LANGUAGE);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function loadLanguage() {
      const stored = await getLocaleStorageItem(LOCALE_STORAGE_KEY);
      const nextLanguage = stored && isAppLanguage(stored) ? stored : DEFAULT_LANGUAGE;
      await i18n.changeLanguage(nextLanguage);
      setLanguageState(nextLanguage);
      setIsReady(true);
    }

    void loadLanguage();
  }, []);

  const setLanguage = useCallback(async (nextLanguage: AppLanguage) => {
    await i18n.changeLanguage(nextLanguage);
    await setLocaleStorageItem(LOCALE_STORAGE_KEY, nextLanguage);
    setLanguageState(nextLanguage);
  }, []);

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      isReady,
    }),
    [language, setLanguage, isReady],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
}
