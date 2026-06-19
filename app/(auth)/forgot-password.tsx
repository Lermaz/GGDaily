import { router } from 'expo-router';
import { useMemo, useState } from 'react';

import { AuthButton } from '@/components/auth/auth-button';
import { AuthInput, TextLink } from '@/components/auth/auth-input';
import { AuthScreen } from '@/components/auth/auth-screen';
import { ErrorBanner, SuccessBanner } from '@/components/auth/error-banner';
import { useAuth } from '@/contexts/auth-context';
import { useAppTranslation } from '@/hooks/use-translation';
import { getForgotPasswordSchema } from '@/lib/validation-i18n';

export default function ForgotPasswordScreen() {
  const { t } = useAppTranslation();
  const forgotPasswordSchema = useMemo(() => getForgotPasswordSchema(t), [t]);
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit() {
    setError('');
    setSuccess('');
    const result = forgotPasswordSchema.safeParse({ email: email.trim() });

    if (!result.success) {
      const errors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0];
        if (typeof field === 'string' && !errors[field]) {
          errors[field] = issue.message;
        }
      }
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    setIsLoading(true);
    const { error: resetError } = await resetPassword(result.data.email);
    setIsLoading(false);

    if (resetError) {
      setError(resetError);
      return;
    }

    setSuccess(t('auth.resetSuccess'));
  }

  return (
    <AuthScreen
      title={t('auth.forgotPasswordTitle')}
      subtitle={t('auth.forgotPasswordSubtitle')}
      footer={<TextLink label={t('auth.backToLogin')} onPress={() => router.push('/login')} />}
    >
      <ErrorBanner message={error} />
      <SuccessBanner message={success} />
      <AuthInput
        label={t('auth.email')}
        value={email}
        onChangeText={setEmail}
        error={fieldErrors.email}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        textContentType="emailAddress"
        editable={!isLoading}
      />
      <AuthButton label={t('auth.sendResetLink')} onPress={handleSubmit} isLoading={isLoading} />
    </AuthScreen>
  );
}
