import { Pressable, StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';

import { theme } from '@/lib/theme';

interface AuthInputProps extends TextInputProps {
  label: string;
  error?: string;
}

export function AuthInput({ label, error, style, ...props }: AuthInputProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label} accessibilityRole="text">
        {label}
      </Text>
      <TextInput
        style={[styles.input, error ? styles.inputError : null, style]}
        placeholderTextColor={theme.colors.textSecondary}
        accessibilityLabel={label}
        {...props}
      />
      {error ? (
        <Text style={styles.error} accessibilityRole="alert">
          {error}
        </Text>
      ) : null}
    </View>
  );
}

interface PasswordInputProps extends Omit<AuthInputProps, 'secureTextEntry'> {}

export function PasswordInput({ label, error, ...props }: PasswordInputProps) {
  return (
    <AuthInput
      label={label}
      error={error}
      secureTextEntry
      autoCapitalize="none"
      autoCorrect={false}
      textContentType="password"
      {...props}
    />
  );
}

interface TextLinkProps {
  label: string;
  onPress: () => void;
  accessibilityLabel?: string;
}

export function TextLink({ label, onPress, accessibilityLabel }: TextLinkProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="link"
      accessibilityLabel={accessibilityLabel ?? label}
      style={({ pressed }) => [styles.linkPressable, pressed && styles.linkPressed]}
    >
      <Text style={styles.link}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: theme.spacing.sm,
  },
  label: {
    fontSize: theme.typography.label,
    fontWeight: '600',
    color: theme.colors.text,
  },
  input: {
    minHeight: theme.touchTarget,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.md,
    fontSize: theme.typography.body,
    color: theme.colors.text,
    backgroundColor: theme.colors.surface,
  },
  inputError: {
    borderColor: theme.colors.error,
  },
  error: {
    fontSize: theme.typography.caption,
    color: theme.colors.error,
  },
  linkPressable: {
    minHeight: theme.touchTarget,
    justifyContent: 'center',
  },
  linkPressed: {
    opacity: 0.7,
  },
  link: {
    fontSize: theme.typography.body,
    color: theme.colors.primary,
    fontWeight: '600',
  },
});
