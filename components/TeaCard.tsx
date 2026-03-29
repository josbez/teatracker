import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, font, radius, spacing } from '@/lib/theme';
import { Tea } from '@/lib/types';

interface Props {
  tea: Tea;
  onPress: () => void;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function TeaCard({ tea, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.row}>
        <View style={styles.left}>
          <Text style={styles.name} numberOfLines={1}>
            {tea.name}
          </Text>
          <View style={styles.meta}>
            {tea.type ? (
              <View style={styles.typeBadge}>
                <Text style={styles.typeText}>{tea.type}</Text>
              </View>
            ) : null}
            <Text style={styles.date}>{formatDate(tea.created_at)}</Text>
          </View>
          {tea.notes ? (
            <Text style={styles.notes} numberOfLines={2}>
              {tea.notes}
            </Text>
          ) : null}
        </View>
        {tea.rating ? <Text style={styles.rating}>{tea.rating}</Text> : null}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  left: {
    flex: 1,
    gap: spacing.xs,
  },
  name: {
    ...font.h3,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  typeBadge: {
    backgroundColor: 'rgba(28, 46, 20, 0.08)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.chip,
  },
  typeText: {
    ...font.label,
    color: colors.primary,
  },
  date: {
    ...font.caption,
  },
  notes: {
    ...font.bodySmall,
    lineHeight: 18,
    marginTop: 2,
  },
  rating: {
    fontSize: 24,
    lineHeight: 28,
    marginTop: 2,
  },
});
