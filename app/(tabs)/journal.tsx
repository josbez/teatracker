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
import { useFocusEffect, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import TeaCard from '@/components/TeaCard';
import TRexIllustration from '@/components/TRexIllustration';
import { supabase } from '@/lib/supabase';
import { colors, font, spacing } from '@/lib/theme';
import { Tea } from '@/lib/types';

export default function JournalScreen() {
  const [teas, setTeas] = useState<Tea[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchTeas = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('teas')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) setTeas(data as Tea[]);
    setLoading(false);
  }, []);

  useFocusEffect(fetchTeas);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
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
        <Text style={styles.title}>Journal</Text>
        <TouchableOpacity onPress={handleSignOut} hitSlop={8}>
          <Ionicons name="log-out-outline" size={22} color={colors.textMuted} />
        </TouchableOpacity>
      </View>

      {teas.length === 0 ? (
        <View style={styles.empty}>
          <TRexIllustration size={130} />
          <Text style={styles.emptyTitle}>Start Your Journal</Text>
          <Text style={styles.emptySubtitle}>
            Nothing logged yet. Add your first tea.
          </Text>
          <TouchableOpacity
            style={styles.emptyButton}
            onPress={() => router.push('/(tabs)/add')}
          >
            <Text style={styles.emptyButtonText}>Add a Tea</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={teas}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TeaCard
              tea={item}
              onPress={() => router.push(`/tea/${item.id}`)}
            />
          )}
          contentContainerStyle={styles.list}
        />
      )}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    ...font.h2,
  },
  list: {
    padding: spacing.md,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.xl,
  },
  emptyTitle: {
    ...font.h2,
    marginTop: spacing.sm,
  },
  emptySubtitle: {
    ...font.body,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 22,
  },
  emptyButton: {
    backgroundColor: colors.primary,
    paddingVertical: 13,
    paddingHorizontal: spacing.xl,
    borderRadius: 8,
    marginTop: spacing.sm,
  },
  emptyButtonText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '600',
  },
});
