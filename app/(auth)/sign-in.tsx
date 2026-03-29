import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { supabase } from '@/lib/supabase';

export default function SignInScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'sign-in' | 'sign-up'>('sign-in');

  const handleAuth = async () => {
    if (!email || !password) {
      Alert.alert('Missing fields', 'Please enter your email and password.');
      return;
    }
    setLoading(true);
    if (mode === 'sign-in') {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) Alert.alert('Sign in failed', error.message);
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        Alert.alert('Sign up failed', error.message);
      } else {
        Alert.alert('Check your email', 'A confirmation link has been sent to your inbox.');
      }
    }
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Text style={styles.logo}>🍵</Text>
      <Text style={styles.title}>T-Tracker</Text>
      <Text style={styles.subtitle}>
        {mode === 'sign-in' ? 'Welcome back' : 'Create your account'}
      </Text>

      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        placeholderTextColor="#BCAAA4"
        autoCapitalize="none"
        keyboardType="email-address"
        autoComplete="email"
      />
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        placeholderTextColor="#BCAAA4"
        secureTextEntry
        autoComplete={mode === 'sign-up' ? 'new-password' : 'password'}
      />

      <TouchableOpacity style={styles.button} onPress={handleAuth} disabled={loading}>
        <Text style={styles.buttonText}>
          {loading ? 'Loading…' : mode === 'sign-in' ? 'Sign In' : 'Sign Up'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setMode(mode === 'sign-in' ? 'sign-up' : 'sign-in')}>
        <Text style={styles.toggle}>
          {mode === 'sign-in'
            ? "Don't have an account? Sign up"
            : 'Already have an account? Sign in'}
        </Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FDF6EC',
    padding: 24,
  },
  logo: { fontSize: 64, marginBottom: 8 },
  title: { fontSize: 32, fontWeight: '700', color: '#3E2723', marginBottom: 4 },
  subtitle: { fontSize: 16, color: '#8D6E63', marginBottom: 40 },
  input: {
    width: '100%',
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E0D5CC',
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    color: '#3E2723',
    marginBottom: 12,
  },
  button: {
    width: '100%',
    backgroundColor: '#5C4033',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  buttonText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
  toggle: { color: '#8D6E63', fontSize: 14 },
});
