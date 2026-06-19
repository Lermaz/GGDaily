import { router } from 'expo-router';
import { useState } from 'react';

import { AuthButton } from '@/components/auth/auth-button';
import { AuthInput, PasswordInput, TextLink } from '@/components/auth/auth-input';
import { AuthScreen } from '@/components/auth/auth-screen';
import { ErrorBanner } from '@/components/auth/error-banner';
import { useAuth } from '@/contexts/auth-context';
import { loginSchema } from '@/lib/validation';

export default function LoginScreen() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit() {
    setError('');
    const result = loginSchema.safeParse({ email: email.trim(), password });
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
    const { error: signInError } = await signIn(result.data.email, result.data.password);
    setIsLoading(false);

    if (signInError) {
      setError(signInError);
      return;
    }

    router.replace('/(app)/(tabs)');
  }

  return (
    <AuthScreen
      title="Welcome back"
      subtitle="Log in with your email and password."
      footer={
        <TextLink
          label="Don't have an account? Create one"
          onPress={() => router.push('/register')}
        />
      }
    >
      <ErrorBanner message={error} />
      <AuthInput
        label="Email"
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
        label="Password"
        value={password}
        onChangeText={setPassword}
        error={fieldErrors.password}
        editable={!isLoading}
      />
      <TextLink
        label="Forgot password?"
        onPress={() => router.push('/forgot-password')}
        accessibilityLabel="Forgot password"
      />
      <AuthButton label="Log in" onPress={handleSubmit} isLoading={isLoading} />
    </AuthScreen>
  );
}
