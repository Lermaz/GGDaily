import { useTranslation } from 'react-i18next';
import { Stack } from 'expo-router';

export default function AuthLayout() {
  const { t } = useTranslation();

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerBackTitle: t('common.back'),
        headerTintColor: '#2563EB',
        headerShadowVisible: false,
        headerStyle: { backgroundColor: '#F8FAFC' },
        contentStyle: { backgroundColor: '#F8FAFC' },
      }}
    >
      <Stack.Screen name="login" options={{ title: t('auth.logIn') }} />
      <Stack.Screen name="register" options={{ title: t('auth.createAccount') }} />
      <Stack.Screen name="forgot-password" options={{ title: t('auth.forgotPasswordTitle') }} />
    </Stack>
  );
}
