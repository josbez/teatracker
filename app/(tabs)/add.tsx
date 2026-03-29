import { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '@/lib/supabase';

const TEA_TYPES = ['Green', 'Black', 'Oolong', 'White', 'Pu-erh', 'Herbal', 'Other'];

export default function AddScreen() {
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [rating, setRating] = useState(0);
  const [notes, setNotes] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Name required', 'Please enter a tea name.');
      return;
    }
    setSaving(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setSaving(false);
      return;
    }

    const { error } = await supabase.from('teas').insert({
      user_id: user.id,
      name: name.trim(),
      type: type || null,
      rating: rating || null,
      notes: notes.trim() || null,
      source_url: sourceUrl.trim() || null,
    });

    setSaving(false);

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert('Tea added!', `${name.trim()} has been added to your journal.`);
      setName('');
      setType('');
      setRating(0);
      setNotes('');
      setSourceUrl('');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Add Tea</Text>

        <Text style={styles.label}>Name *</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="e.g. Dragon Well"
          placeholderTextColor="#BCAAA4"
        />

        <Text style={styles.label}>Type</Text>
        <View style={styles.chipRow}>
          {TEA_TYPES.map((t) => (
            <TouchableOpacity
              key={t}
              style={[styles.chip, type === t && styles.chipActive]}
              onPress={() => setType(type === t ? '' : t)}
            >
              <Text style={[styles.chipText, type === t && styles.chipTextActive]}>{t}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Rating</Text>
        <View style={styles.ratingRow}>
          {[1, 2, 3, 4, 5].map((n) => (
            <TouchableOpacity key={n} onPress={() => setRating(rating === n ? 0 : n)}>
              <Text style={[styles.star, rating >= n && styles.starActive]}>★</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Notes</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={notes}
          onChangeText={setNotes}
          placeholder="Tasting notes, brewing tips…"
          placeholderTextColor="#BCAAA4"
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />

        <Text style={styles.label}>Source URL</Text>
        <TextInput
          style={styles.input}
          value={sourceUrl}
          onChangeText={setSourceUrl}
          placeholder="https://…"
          placeholderTextColor="#BCAAA4"
          autoCapitalize="none"
          keyboardType="url"
        />

        <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={saving}>
          <Text style={styles.saveButtonText}>{saving ? 'Saving…' : 'Add Tea'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FDF6EC' },
  scroll: { padding: 24 },
  title: { fontSize: 24, fontWeight: '600', color: '#5C4033', marginBottom: 24 },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8D6E63',
    marginBottom: 8,
    marginTop: 20,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  input: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E0D5CC',
    borderRadius: 10,
    padding: 13,
    fontSize: 16,
    color: '#3E2723',
  },
  textArea: { height: 100 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#BCAAA4',
  },
  chipActive: { backgroundColor: '#5C4033', borderColor: '#5C4033' },
  chipText: { color: '#8D6E63', fontSize: 14 },
  chipTextActive: { color: '#FFF' },
  ratingRow: { flexDirection: 'row', gap: 6 },
  star: { fontSize: 34, color: '#E0D5CC' },
  starActive: { color: '#FFB300' },
  saveButton: {
    backgroundColor: '#5C4033',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 36,
  },
  saveButtonText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
});
