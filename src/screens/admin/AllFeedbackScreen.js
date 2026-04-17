import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { useData } from '../../context/DataContext';
import { COLORS, FONTS, SPACING, RADIUS, SHADOW } from '../../theme';

export default function AllFeedbackScreen() {
  const { getAllFeedback, getUserById } = useData();
  const [filter, setFilter] = useState('all'); // 'all' | 'injuries'

  const allFeedback = getAllFeedback();
  const displayed = filter === 'injuries'
    ? allFeedback.filter((f) => f.injuries && f.injuries.trim())
    : allFeedback;

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>All Feedback</Text>

        <View style={styles.filterRow}>
          <TouchableOpacity
            style={[styles.filterBtn, filter === 'all' && styles.filterBtnActive]}
            onPress={() => setFilter('all')}
          >
            <Text style={[styles.filterBtnText, filter === 'all' && styles.filterBtnTextActive]}>
              All ({allFeedback.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterBtn, filter === 'injuries' && styles.filterBtnInjuryActive]}
            onPress={() => setFilter('injuries')}
          >
            <Text style={[styles.filterBtnText, filter === 'injuries' && styles.filterBtnTextActive]}>
              ⚠️ Injuries ({allFeedback.filter((f) => f.injuries && f.injuries.trim()).length})
            </Text>
          </TouchableOpacity>
        </View>

        {displayed.length === 0 ? (
          <Text style={styles.emptyText}>No feedback logged yet.</Text>
        ) : (
          displayed.map((fb) => {
            const client = getUserById(fb.userId);
            const ptId = client?.assignedPT;
            const pt = ptId ? getUserById(ptId) : null;

            return (
              <View key={fb.id} style={[styles.feedbackCard, fb.injuries && styles.feedbackCardInjury]}>
                <View style={styles.feedbackHeader}>
                  <View style={styles.feedbackAvatar}>
                    <Text style={styles.feedbackAvatarText}>{client?.avatar || '??'}</Text>
                  </View>
                  <View style={styles.feedbackMeta}>
                    <Text style={styles.feedbackName}>{fb.userName}</Text>
                    <Text style={styles.feedbackPT}>{pt ? `PT: ${pt.name}` : 'No PT'}</Text>
                  </View>
                  <View style={styles.feedbackDateBox}>
                    <Text style={styles.feedbackDate}>{fb.date}</Text>
                    <Text style={styles.feedbackSession}>W{fb.week}S{fb.session}</Text>
                  </View>
                </View>

                <View style={styles.ratingsRow}>
                  <View style={styles.ratingPill}>
                    <Text style={styles.ratingPillText}>Feel: {'⭐'.repeat(fb.rating)} {fb.rating}/5</Text>
                  </View>
                  <View style={styles.ratingPill}>
                    <Text style={styles.ratingPillText}>Effort: {'💪'.repeat(fb.effort)} {fb.effort}/5</Text>
                  </View>
                  <View style={[styles.ratingPill, !fb.completed && styles.partialPill]}>
                    <Text style={styles.ratingPillText}>{fb.completed ? '✓ Done' : '⚡ Partial'}</Text>
                  </View>
                </View>

                {fb.notes ? <Text style={styles.notes}>{fb.notes}</Text> : null}
                {fb.injuries ? (
                  <View style={styles.injuryBanner}>
                    <Text style={styles.injuryBannerText}>⚠️ {fb.injuries}</Text>
                  </View>
                ) : null}
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: SPACING.md, paddingBottom: SPACING.xl },
  title: { fontSize: FONTS.size.xxl, fontWeight: '800', color: COLORS.dark, marginBottom: SPACING.md },

  filterRow: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.md },
  filterBtn: {
    paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs, borderRadius: RADIUS.round,
    borderWidth: 1.5, borderColor: COLORS.border, backgroundColor: COLORS.card,
  },
  filterBtnActive: { backgroundColor: COLORS.pt, borderColor: COLORS.pt },
  filterBtnInjuryActive: { backgroundColor: COLORS.warning, borderColor: COLORS.warning },
  filterBtnText: { fontSize: FONTS.size.sm, fontWeight: '600', color: COLORS.darkGray },
  filterBtnTextActive: { color: COLORS.white },

  emptyText: { color: COLORS.gray, textAlign: 'center', marginTop: SPACING.xl },

  feedbackCard: {
    backgroundColor: COLORS.card, borderRadius: RADIUS.lg, padding: SPACING.md,
    marginBottom: SPACING.sm, ...SHADOW.sm,
  },
  feedbackCardInjury: { borderLeftWidth: 3, borderLeftColor: COLORS.warning },
  feedbackHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.sm },
  feedbackAvatar: {
    width: 38, height: 38, borderRadius: 19, backgroundColor: COLORS.pt,
    alignItems: 'center', justifyContent: 'center', marginRight: SPACING.sm,
  },
  feedbackAvatarText: { color: COLORS.white, fontWeight: '700', fontSize: FONTS.size.sm },
  feedbackMeta: { flex: 1 },
  feedbackName: { fontWeight: '700', color: COLORS.dark, fontSize: FONTS.size.md },
  feedbackPT: { color: COLORS.gray, fontSize: FONTS.size.xs },
  feedbackDateBox: { alignItems: 'flex-end' },
  feedbackDate: { color: COLORS.gray, fontSize: FONTS.size.xs },
  feedbackSession: { color: COLORS.primary, fontSize: FONTS.size.xs, fontWeight: '600' },

  ratingsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.xs, marginBottom: SPACING.xs },
  ratingPill: {
    backgroundColor: COLORS.light, borderRadius: RADIUS.round, paddingHorizontal: SPACING.xs,
    paddingVertical: 2,
  },
  partialPill: { backgroundColor: '#FFF8E1' },
  ratingPillText: { fontSize: FONTS.size.xs, color: COLORS.darkGray },

  notes: { color: COLORS.darkGray, fontSize: FONTS.size.sm, lineHeight: 18 },
  injuryBanner: {
    backgroundColor: '#FFF3E0', borderRadius: RADIUS.sm, padding: SPACING.xs, marginTop: SPACING.xs,
  },
  injuryBannerText: { color: '#E65100', fontSize: FONTS.size.sm },
});
