import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { Tea } from '@/lib/types';

function TeaCard({ tea }: { tea: Tea }) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardName}>{tea.name}</Text>
        {tea.rating ? (
          <Text style={styles.cardRating}>{'★'.repeat(tea.rating)}</Text>
        ) : null}
      </View>
      {tea.type ? <Text style={styles.cardType}>{tea.type}</Text> : null}
      {tea.notes ? (
        <Text style={styles.cardNotes} numberOfLines={2}>
          {tea.notes}
        </Text>
      ) : null}
      <Text style={styles.cardDate}>
        {new Date(tea.created_at).toLocaleDateString(undefined, {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })}
      </Text>
    </View>
  );
}

export default function JournalScreen() {
  const [teas, setTeas] = useState<Tea[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTeas = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('teas')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) setTeas(data);
    setLoading(false);
  }, []);

  useFocusEffect(fetchTeas);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, styles.center]}>
        <ActivityIndicator color="#5C4033" size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Journal</Text>
        <TouchableOpacity onPress={handleSignOut}>
          <Text style={styles.signOut}>Sign out</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={teas}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <TeaCard tea={item} />}
        contentContainerStyle={teas.length === 0 ? styles.center : styles.list}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No teas yet. Add your first one!</Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FDF6EC' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 4,
  },
  title: { fontSize: 24, fontWeight: '600', color: '#5C4033' },
  signOut: { fontSize: 14, color: '#8D6E63' },
  list: { padding: 16 },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0D5CC',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  cardName: { fontSize: 17, fontWeight: '600', color: '#3E2723', flex: 1 },
  cardRating: { color: '#FFB300', fontSize: 14 },
  cardType: { fontSize: 13, color: '#8D6E63', marginBottom: 4 },
  cardNotes: { fontSize: 14, color: '#5D4037', marginBottom: 8, lineHeight: 20 },
  cardDate: { fontSize: 12, color: '#BCAAA4' },
  emptyText: { color: '#8D6E63', fontSize: 16 },
});
