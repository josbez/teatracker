import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import TRexIllustration from '@/components/TRexIllustration';
import { supabase } from '@/lib/supabase';
import { colors, font, radius, spacing } from '@/lib/theme';

export default function SignInScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSendLink = async () => {
    const trimmed = email.trim();
    if (!trimmed) {
      Alert.alert('Email required', 'Enter your email address to continue.');
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email: trimmed,
      options: {
        // Configure this URL in your Supabase Auth settings → Redirect URLs
        emailRedirectTo: 'ttracker://',
      },
    });
    setLoading(false);

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      setSent(true);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.inner}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.top}>
          <TRexIllustration size={100} />
          <Text style={styles.title}>T-Tracker</Text>
          <Text style={styles.subtitle}>A serious tea journal.</Text>
        </View>

        {sent ? (
          <View style={styles.sentState}>
            <Text style={styles.sentTitle}>Check your email</Text>
            <Text style={styles.sentBody}>
              A magic link has been sent to{'\n'}
              <Text style={styles.sentEmail}>{email.trim()}</Text>
            </Text>
            <TouchableOpacity onPress={() => setSent(false)}>
              <Text style={styles.resendLink}>Use a different email</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.form}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              placeholderTextColor={colors.textMuted}
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
              autoFocus
              onSubmitEditing={handleSendLink}
              returnKeyType="send"
            />
            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleSendLink}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? 'Sending…' : 'Send Magic Link'}
              </Text>
            </TouchableOpacity>
            <Text style={styles.hint}>
              No password needed. We'll email you a one-tap link.
            </Text>
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  inner: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    justifyContent: 'center',
    gap: spacing.xl,
  },
  top: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  title: {
    ...font.h1,
    marginTop: spacing.sm,
  },
  subtitle: {
    ...font.body,
    color: colors.textMuted,
  },
  form: {
    gap: spacing.sm,
  },
  inputLabel: {
    ...font.label,
    marginBottom: 2,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.input,
    paddingHorizontal: spacing.md,
    paddingVertical: 13,
    ...font.body,
    color: colors.textPrimary,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 15,
    borderRadius: radius.input,
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '600',
  },
  hint: {
    ...font.caption,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  sentState: {
    alignItems: 'center',
    gap: spacing.md,
  },
  sentTitle: {
    ...font.h2,
  },
  sentBody: {
    ...font.body,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 22,
  },
  sentEmail: {
    color: colors.textPrimary,
    fontWeight: '600',
  },
  resendLink: {
    ...font.body,
    color: colors.accent,
    marginTop: spacing.xs,
  },
});
