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

export default function OnboardingScreen() {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleStart = async () => {
    const trimmed = name.trim();
    if (!trimmed) {
      Alert.alert('Name required', 'What should we call you?');
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({
      data: { display_name: trimmed },
    });
    setLoading(false);

    if (error) {
      Alert.alert('Error', error.message);
    }
    // Navigation handled automatically by auth guard in _layout.tsx
    // once user_metadata.display_name is set
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.inner}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.top}>
          <TRexIllustration size={140} />
          <Text style={styles.title}>Welcome to T-Tracker</Text>
          <Text style={styles.subtitle}>
            Track what you drink. Know what you like.
          </Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.inputLabel}>What should we call you?</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Your name"
            placeholderTextColor={colors.textMuted}
            autoFocus
            returnKeyType="done"
            onSubmitEditing={handleStart}
          />
          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleStart}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Setting up…' : 'Start Tracking'}
            </Text>
          </TouchableOpacity>
        </View>
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
    gap: spacing.xxl,
  },
  top: {
    alignItems: 'center',
    gap: spacing.md,
  },
  title: {
    ...font.h1,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  subtitle: {
    ...font.body,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 22,
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
});
