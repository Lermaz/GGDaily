import { router } from 'expo-router';
import { useMemo, useState } from 'react';

import { AuthButton } from '@/components/auth/auth-button';
import { AuthInput, PasswordInput, TextLink } from '@/components/auth/auth-input';
import { AuthScreen } from '@/components/auth/auth-screen';
import { ErrorBanner, SuccessBanner } from '@/components/auth/error-banner';
import { useAuth } from '@/contexts/auth-context';
import { useAppTranslation } from '@/hooks/use-translation';
import { getRegisterSchema } from '@/lib/validation-i18n';

export default function RegisterScreen() {
  const { t } = useAppTranslation();
  const registerSchema = useMemo(() => getRegisterSchema(t), [t]);
  const { signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit() {
    setError('');
    setSuccess('');
    const result = registerSchema.safeParse({
      email: email.trim(),
      password,
      confirmPassword,
    });

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
    const { error: signUpError } = await signUp(result.data.email, result.data.password);
    setIsLoading(false);

    if (signUpError) {
      setError(signUpError);
      return;
    }

    setSuccess(t('auth.registerSuccess'));
  }

  return (
    <AuthScreen
      title={t('auth.registerTitle')}
      subtitle={t('auth.registerSubtitle')}
      footer={<TextLink label={t('auth.hasAccount')} onPress={() => router.push('/login')} />}
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
      <PasswordInput
        label={t('auth.password')}
        value={password}
        onChangeText={setPassword}
        error={fieldErrors.password}
        editable={!isLoading}
      />
      <PasswordInput
        label={t('auth.confirmPassword')}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        error={fieldErrors.confirmPassword}
        editable={!isLoading}
      />
      <AuthButton label={t('auth.createAccount')} onPress={handleSubmit} isLoading={isLoading} />
    </AuthScreen>
  );
}
