import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  AppState,
  AppStateStatus,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import * as Notifications from 'expo-notifications';
import { colors, font, radius, spacing } from '@/lib/theme';

const PRESETS = [
  { label: '3:00', seconds: 180 },
  { label: '5:00', seconds: 300 },
] as const;

type Preset = (typeof PRESETS)[number]['seconds'] | 'custom';

function formatTime(s: number): string {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
}

function parseCustomInput(input: string): number | null {
  const parts = input.trim().split(':');
  if (parts.length === 2) {
    const m = parseInt(parts[0], 10);
    const s = parseInt(parts[1], 10);
    if (!isNaN(m) && !isNaN(s) && s < 60 && m >= 0) return m * 60 + s;
  }
  const n = parseInt(input, 10);
  if (!isNaN(n) && n > 0) return n * 60;
  return null;
}

async function requestNotificationPermission(): Promise<boolean> {
  const { status } = await Notifications.getPermissionsAsync();
  if (status === 'granted') return true;
  const { status: newStatus } = await Notifications.requestPermissionsAsync();
  return newStatus === 'granted';
}

export default function SteepScreen() {
  const [preset, setPreset] = useState<Preset>(180);
  const [customInput, setCustomInput] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [duration, setDuration] = useState(180);
  const [remaining, setRemaining] = useState(180);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimestampRef = useRef<number | null>(null);
  const remainingAtStartRef = useRef<number>(180);
  const notificationIdRef = useRef<string | null>(null);
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);

  // Background / foreground sync — recalculate elapsed when app comes back
  useEffect(() => {
    const sub = AppState.addEventListener('change', (next) => {
      if (
        appStateRef.current.match(/inactive|background/) &&
        next === 'active' &&
        running &&
        startTimestampRef.current !== null
      ) {
        const elapsed = Math.floor((Date.now() - startTimestampRef.current) / 1000);
        const newRemaining = Math.max(0, remainingAtStartRef.current - elapsed);
        setRemaining(newRemaining);
        if (newRemaining === 0) finishTimer();
      }
      appStateRef.current = next;
    });
    return () => sub.remove();
  }, [running]);

  // Interval tick
  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        if (startTimestampRef.current === null) return;
        const elapsed = Math.floor((Date.now() - startTimestampRef.current) / 1000);
        const newRemaining = Math.max(0, remainingAtStartRef.current - elapsed);
        setRemaining(newRemaining);
        if (newRemaining === 0) {
          clearInterval(intervalRef.current!);
          finishTimer();
        }
      }, 500);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running]);

  const cancelNotification = async () => {
    if (notificationIdRef.current) {
      await Notifications.cancelScheduledNotificationAsync(notificationIdRef.current);
      notificationIdRef.current = null;
    }
  };

  const finishTimer = () => {
    setRunning(false);
    setDone(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const handleStart = async () => {
    if (done) return;

    if (!running) {
      // Starting or resuming
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      startTimestampRef.current = Date.now();
      remainingAtStartRef.current = remaining;
      setRunning(true);

      // Schedule background notification
      const granted = await requestNotificationPermission();
      if (granted && remaining > 0) {
        try {
          const id = await Notifications.scheduleNotificationAsync({
            content: {
              title: 'T-Tracker',
              body: 'Steep complete. Your tea is ready.',
              sound: true,
            },
            trigger: { seconds: remaining } as Notifications.NotificationTriggerInput,
          });
          notificationIdRef.current = id;
        } catch {
          // Notifications not critical — continue silently
        }
      }
    } else {
      // Pausing
      await cancelNotification();
      setRunning(false);
    }
  };

  const handleReset = async () => {
    await cancelNotification();
    if (intervalRef.current) clearInterval(intervalRef.current);
    setRunning(false);
    setDone(false);
    setRemaining(duration);
    startTimestampRef.current = null;
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const applyPreset = async (secs: number) => {
    if (running) return;
    setPreset(secs);
    setDuration(secs);
    setRemaining(secs);
    setDone(false);
    setShowCustomInput(false);
  };

  const handleCustomPreset = () => {
    if (running) return;
    setPreset('custom');
    setShowCustomInput(true);
    setCustomInput(formatTime(duration));
  };

  const confirmCustom = () => {
    const secs = parseCustomInput(customInput);
    if (!secs) {
      Alert.alert('Invalid time', 'Enter a time like 4:30 or just a number of minutes.');
      return;
    }
    setDuration(secs);
    setRemaining(secs);
    setDone(false);
    setShowCustomInput(false);
  };

  const timerColor = done ? colors.accent : running ? colors.primary : colors.textMuted;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Steep</Text>
      </View>

      <View style={styles.body}>
        {/* Preset selector */}
        <View style={styles.presets}>
          {PRESETS.map((p) => (
            <TouchableOpacity
              key={p.seconds}
              style={[styles.presetChip, preset === p.seconds && styles.presetChipActive]}
              onPress={() => applyPreset(p.seconds)}
              disabled={running}
            >
              <Text style={[styles.presetText, preset === p.seconds && styles.presetTextActive]}>
                {p.label}
              </Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={[styles.presetChip, preset === 'custom' && styles.presetChipActive]}
            onPress={handleCustomPreset}
            disabled={running}
          >
            <Text style={[styles.presetText, preset === 'custom' && styles.presetTextActive]}>
              Custom
            </Text>
          </TouchableOpacity>
        </View>

        {/* Custom time input */}
        {showCustomInput && (
          <View style={styles.customRow}>
            <TextInput
              style={styles.customInput}
              value={customInput}
              onChangeText={setCustomInput}
              placeholder="mm:ss"
              placeholderTextColor={colors.textMuted}
              keyboardType="numbers-and-punctuation"
              autoFocus
              selectTextOnFocus
              onSubmitEditing={confirmCustom}
              returnKeyType="done"
            />
            <TouchableOpacity style={styles.customSetButton} onPress={confirmCustom}>
              <Text style={styles.customSetText}>Set</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Timer display */}
        <Text style={[styles.timer, { color: timerColor }]}>
          {done ? 'Done' : formatTime(remaining)}
        </Text>

        {done && (
          <Text style={styles.doneSubtitle}>Your tea is ready.</Text>
        )}

        {/* Controls */}
        <View style={styles.controls}>
          {!done && (
            <TouchableOpacity
              style={[styles.primaryButton, running && styles.pauseButton]}
              onPress={handleStart}
            >
              <Text style={styles.primaryButtonText}>
                {running ? 'Pause' : remaining === duration ? 'Start' : 'Resume'}
              </Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
            <Text style={styles.resetButtonText}>Reset</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    ...font.h2,
  },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  presets: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  presetChip: {
    paddingVertical: 8,
    paddingHorizontal: spacing.md,
    borderRadius: radius.chip,
    borderWidth: 1,
    borderColor: colors.border,
  },
  presetChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  presetText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textMuted,
  },
  presetTextActive: {
    color: colors.white,
  },
  customRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'center',
  },
  customInput: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.input,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    fontSize: 16,
    color: colors.textPrimary,
    width: 100,
    textAlign: 'center',
  },
  customSetButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    borderRadius: radius.input,
  },
  customSetText: {
    color: colors.white,
    fontWeight: '600',
    fontSize: 14,
  },
  timer: {
    fontSize: 80,
    fontWeight: '200',
    letterSpacing: 2,
    fontVariant: ['tabular-nums'],
  },
  doneSubtitle: {
    ...font.body,
    color: colors.accent,
    marginTop: -spacing.lg,
  },
  controls: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.input,
    minWidth: 120,
    alignItems: 'center',
  },
  pauseButton: {
    backgroundColor: colors.accent,
  },
  primaryButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  resetButton: {
    paddingVertical: 14,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.input,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textMuted,
  },
});
