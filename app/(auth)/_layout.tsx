import { useTranslation } from 'react-i18next';
import { Stack } from 'expo-router';
import { useMemo } from 'react';

import { useLocale } from '@/contexts/locale-context';

export default function AuthLayout() {
  const { t } = useTranslation();
  const { language } = useLocale();

  const screenOptions = useMemo(
    () => ({
      headerShown: true,
      headerBackTitle: t('common.back'),
      headerTintColor: '#2563EB',
      headerShadowVisible: false,
      headerStyle: { backgroundColor: '#F8FAFC' },
    }),
    [language],
  );

  const titles = useMemo(
    () => ({
      login: t('auth.logIn'),
      register: t('auth.createAccount'),
      forgotPassword: t('auth.forgotPasswordTitle'),
    }),
    [language],
  );

  return (
    <Stack screenOptions={screenOptions}>
      <Stack.Screen name="login" options={{ title: titles.login }} />
      <Stack.Screen name="register" options={{ title: titles.register }} />
      <Stack.Screen name="forgot-password" options={{ title: titles.forgotPassword }} />
    </Stack>
  );
}
