import { useEffect, useRef, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '@/lib/supabase';

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export default function SteepScreen() {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [saving, setSaving] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running]);

  const handleReset = () => {
    setRunning(false);
    setSeconds(0);
  };

  const handleSave = async () => {
    if (seconds === 0) return;
    setSaving(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setSaving(false);
      return;
    }

    const { error } = await supabase.from('steep_sessions').insert({
      user_id: user.id,
      duration_seconds: seconds,
    });

    setSaving(false);

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert('Saved!', `Steep session of ${formatTime(seconds)} saved.`);
      handleReset();
    }
  };

  const showSave = seconds > 0 && !running;

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Steep Timer</Text>
      <Text style={styles.timer}>{formatTime(seconds)}</Text>

      <View style={styles.controls}>
        <TouchableOpacity style={styles.button} onPress={() => setRunning((r) => !r)}>
          <Text style={styles.buttonText}>{running ? 'Pause' : 'Start'}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.outlineButton]}
          onPress={handleReset}
        >
          <Text style={[styles.buttonText, styles.outlineButtonText]}>Reset</Text>
        </TouchableOpacity>
      </View>

      {showSave && (
        <TouchableOpacity
          style={[styles.button, styles.saveButton]}
          onPress={handleSave}
          disabled={saving}
        >
          <Text style={styles.buttonText}>{saving ? 'Saving…' : 'Save Session'}</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FDF6EC',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#5C4033',
    marginBottom: 40,
  },
  timer: {
    fontSize: 80,
    fontWeight: '200',
    color: '#3E2723',
    letterSpacing: 4,
    marginBottom: 48,
    fontVariant: ['tabular-nums'],
  },
  controls: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#5C4033',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: '#5C4033',
  },
  saveButton: {
    backgroundColor: '#2E7D32',
    marginTop: 8,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  outlineButtonText: {
    color: '#5C4033',
  },
});
