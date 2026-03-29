import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '@/lib/supabase';
import { colors, font, radius, spacing } from '@/lib/theme';
import { Rating, Tea, TeaType } from '@/lib/types';

const TEA_TYPES: TeaType[] = [
  'Green', 'Black', 'Oolong', 'White', 'Jasmine', 'Herbal', 'Rooibos', 'Pu-erh',
];

const RATINGS: { value: Rating; label: string }[] = [
  { value: '👍', label: 'Lekker' },
  { value: '😐', label: 'Zo-zo' },
  { value: '👎', label: 'Niet lekker' },
];

export default function TeaDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [tea, setTea] = useState<Tea | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Editable fields
  const [name, setName] = useState('');
  const [source, setSource] = useState('');
  const [type, setType] = useState<TeaType | ''>('');
  const [rating, setRating] = useState<Rating | null>(null);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    const fetchTea = async () => {
      const { data, error } = await supabase
        .from('teas')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !data) {
        Alert.alert('Error', 'Could not load tea.');
        router.back();
        return;
      }

      const t = data as Tea;
      setTea(t);
      setName(t.name);
      setSource(t.source ?? '');
      setType((t.type as TeaType) ?? '');
      setRating(t.rating);
      setNotes(t.notes ?? '');
      setLoading(false);
    };

    fetchTea();
  }, [id]);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Name required', 'Give this tea a name.');
      return;
    }

    setSaving(true);
    const { error } = await supabase
      .from('teas')
      .update({
        name: name.trim(),
        source: source.trim() || null,
        type: type || null,
        rating,
        notes: notes.trim() || null,
      })
      .eq('id', id);

    setSaving(false);

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      router.back();
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete tea',
      `Remove "${tea?.name}" from your journal? This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await supabase.from('teas').delete().eq('id', id);
            router.back();
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, styles.center]}>
        <ActivityIndicator color={colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {tea?.name}
        </Text>
        <TouchableOpacity onPress={handleDelete} hitSlop={8}>
          <Ionicons name="trash-outline" size={20} color={colors.danger} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        {/* Name */}
        <View style={styles.field}>
          <Text style={styles.label}>Name *</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholderTextColor={colors.textMuted}
          />
        </View>

        {/* Source */}
        <View style={styles.field}>
          <Text style={styles.label}>Source</Text>
          <TextInput
            style={styles.input}
            value={source}
            onChangeText={setSource}
            placeholder="URL or shop name"
            placeholderTextColor={colors.textMuted}
            autoCapitalize="none"
          />
        </View>

        {/* Type */}
        <View style={styles.field}>
          <Text style={styles.label}>Type</Text>
          <View style={styles.chips}>
            {TEA_TYPES.map((t) => (
              <TouchableOpacity
                key={t}
                style={[styles.chip, type === t && styles.chipActive]}
                onPress={() => setType(type === t ? '' : t)}
              >
                <Text style={[styles.chipText, type === t && styles.chipTextActive]}>
                  {t}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Rating */}
        <View style={styles.field}>
          <Text style={styles.label}>Rating</Text>
          <View style={styles.ratingRow}>
            {RATINGS.map(({ value, label }) => (
              <TouchableOpacity
                key={value}
                style={[styles.ratingButton, rating === value && styles.ratingButtonActive]}
                onPress={() => setRating(rating === value ? null : value)}
              >
                <Text style={styles.ratingEmoji}>{value}</Text>
                <Text style={[styles.ratingLabel, rating === value && styles.ratingLabelActive]}>
                  {label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Notes */}
        <View style={styles.field}>
          <Text style={styles.label}>Notes</Text>
          <TextInput
            style={[styles.input, styles.textarea]}
            value={notes}
            onChangeText={setNotes}
            placeholder="Taste, brewing notes, impressions…"
            placeholderTextColor={colors.textMuted}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        <TouchableOpacity
          style={[styles.saveButton, saving && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={saving}
        >
          <Text style={styles.saveButtonText}>{saving ? 'Saving…' : 'Save Changes'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: spacing.md,
  },
  headerTitle: {
    ...font.h3,
    flex: 1,
  },
  scroll: {
    padding: spacing.lg,
    gap: spacing.lg,
  },
  field: {
    gap: spacing.sm,
  },
  label: {
    ...font.label,
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
  textarea: {
    height: 96,
    paddingTop: 13,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    paddingVertical: 6,
    paddingHorizontal: spacing.md,
    borderRadius: radius.chip,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textMuted,
  },
  chipTextActive: {
    color: colors.white,
  },
  ratingRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  ratingButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderRadius: radius.input,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    gap: spacing.xs,
  },
  ratingButtonActive: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(28, 46, 20, 0.06)',
  },
  ratingEmoji: {
    fontSize: 24,
  },
  ratingLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: colors.textMuted,
  },
  ratingLabelActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: colors.primary,
    paddingVertical: 15,
    borderRadius: radius.input,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '600',
  },
});
