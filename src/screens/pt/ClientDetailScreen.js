import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useData } from '../../context/DataContext';
import { TRAINING_PLAN } from '../../data/trainingPlan';
import { COLORS, FONTS, SPACING, RADIUS, SHADOW } from '../../theme';

export default function ClientDetailScreen({ route }) {
  const { clientId } = route.params;
  const { getUserById, getFeedbackForUser } = useData();

  const client = getUserById(clientId);
  const feedback = getFeedbackForUser(clientId);
  const completedSessions = client?.completedSessions || [];
  const pct = Math.round((completedSessions.length / TRAINING_PLAN.length) * 100);

  const injuryReports = feedback.filter((f) => f.injuries && f.injuries.trim().length > 0);
  const avgRating = feedback.length
    ? (feedback.reduce((a, f) => a + f.rating, 0) / feedback.length).toFixed(1)
    : 'N/A';
  const avgEffort = feedback.length
    ? (feedback.reduce((a, f) => a + f.effort, 0) / feedback.length).toFixed(1)
    : 'N/A';

  if (!client) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Client not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {/* Profile */}
      <View style={styles.profileCard}>
        <View style={styles.profileAvatar}>
          <Text style={styles.profileAvatarText}>{client.avatar}</Text>
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{client.name}</Text>
          <Text style={styles.profileEmail}>{client.email}</Text>
          <Text style={styles.profileJoined}>Joined: {client.createdAt}</Text>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={[styles.statCard, { borderTopColor: COLORS.pt }]}>
          <Text style={styles.statValue}>{completedSessions.length}</Text>
          <Text style={styles.statLabel}>Sessions Done</Text>
        </View>
        <View style={[styles.statCard, { borderTopColor: COLORS.success }]}>
          <Text style={styles.statValue}>{pct}%</Text>
          <Text style={styles.statLabel}>Complete</Text>
        </View>
        <View style={[styles.statCard, { borderTopColor: COLORS.primary }]}>
          <Text style={styles.statValue}>{avgRating}</Text>
          <Text style={styles.statLabel}>Avg Feel ⭐</Text>
        </View>
        <View style={[styles.statCard, { borderTopColor: COLORS.info }]}>
          <Text style={styles.statValue}>{avgEffort}</Text>
          <Text style={styles.statLabel}>Avg Effort 💪</Text>
        </View>
      </View>

      {/* Progress */}
      <View style={styles.progressCard}>
        <Text style={styles.sectionTitle}>Programme Progress</Text>
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: `${pct}%` }]} />
        </View>
        <Text style={styles.progressText}>{completedSessions.length} / {TRAINING_PLAN.length} sessions</Text>

        {/* Week grid */}
        <View style={styles.weekGrid}>
          {Array.from({ length: 9 }, (_, i) => {
            const week = i + 1;
            const weekSessions = [1, 2, 3].map((s) => `${week}-${s}`);
            const doneCount = weekSessions.filter((k) => completedSessions.includes(k)).length;
            return (
              <View key={week} style={styles.weekItem}>
                <Text style={styles.weekLabel}>W{week}</Text>
                <View style={styles.weekDots}>
                  {[1, 2, 3].map((s) => (
                    <View
                      key={s}
                      style={[
                        styles.weekDot,
                        completedSessions.includes(`${week}-${s}`) && styles.weekDotDone,
                      ]}
                    />
                  ))}
                </View>
              </View>
            );
          })}
        </View>
      </View>

      {/* Injury alerts */}
      {injuryReports.length > 0 && (
        <View style={styles.injurySection}>
          <Text style={styles.injurySectionTitle}>⚠️ Injury / Discomfort Reports ({injuryReports.length})</Text>
          {injuryReports.map((fb) => (
            <View key={fb.id} style={styles.injuryCard}>
              <View style={styles.injuryCardHeader}>
                <Text style={styles.injuryCardTitle}>Week {fb.week}, Session {fb.session}</Text>
                <Text style={styles.injuryCardDate}>{fb.date}</Text>
              </View>
              <Text style={styles.injuryText}>{fb.injuries}</Text>
              {fb.notes ? <Text style={styles.injuryNotes}>Notes: {fb.notes}</Text> : null}
            </View>
          ))}
        </View>
      )}

      {/* All feedback */}
      <Text style={styles.sectionTitle}>All Session Feedback ({feedback.length})</Text>
      {feedback.length === 0 ? (
        <Text style={styles.emptyText}>No feedback logged yet.</Text>
      ) : (
        feedback.map((fb) => (
          <View key={fb.id} style={styles.feedbackCard}>
            <View style={styles.feedbackCardHeader}>
              <Text style={styles.feedbackCardTitle}>Week {fb.week} – Session {fb.session}</Text>
              <Text style={styles.feedbackDate}>{fb.date}</Text>
            </View>
            <View style={styles.feedbackRatingRow}>
              <Text style={styles.ratingChip}>⭐ Feel: {fb.rating}/5</Text>
              <Text style={styles.ratingChip}>💪 Effort: {fb.effort}/5</Text>
              <Text style={[styles.completedChip, !fb.completed && styles.partialChip]}>
                {fb.completed ? '✓ Completed' : '⚡ Partial'}
              </Text>
            </View>
            {fb.notes ? <Text style={styles.feedbackNotes}>{fb.notes}</Text> : null}
            {fb.injuries ? (
              <View style={styles.feedbackInjuryBadge}>
                <Text style={styles.feedbackInjuryText}>⚠️ {fb.injuries}</Text>
              </View>
            ) : null}
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.md, paddingBottom: SPACING.xl },
  errorText: { color: COLORS.danger, textAlign: 'center', marginTop: SPACING.xl },

  profileCard: {
    flexDirection: 'row', backgroundColor: COLORS.card, borderRadius: RADIUS.lg,
    padding: SPACING.md, marginBottom: SPACING.md, ...SHADOW.sm, alignItems: 'center',
  },
  profileAvatar: {
    width: 60, height: 60, borderRadius: 30, backgroundColor: COLORS.pt,
    alignItems: 'center', justifyContent: 'center', marginRight: SPACING.md,
  },
  profileAvatarText: { color: COLORS.white, fontSize: FONTS.size.xl, fontWeight: '700' },
  profileInfo: { flex: 1 },
  profileName: { fontSize: FONTS.size.xl, fontWeight: '800', color: COLORS.dark },
  profileEmail: { color: COLORS.gray, fontSize: FONTS.size.sm },
  profileJoined: { color: COLORS.gray, fontSize: FONTS.size.xs, marginTop: 2 },

  statsRow: { flexDirection: 'row', gap: SPACING.xs, marginBottom: SPACING.md },
  statCard: {
    flex: 1, backgroundColor: COLORS.card, borderRadius: RADIUS.md, padding: SPACING.sm,
    borderTopWidth: 3, ...SHADOW.sm, alignItems: 'center',
  },
  statValue: { fontSize: FONTS.size.lg, fontWeight: '800', color: COLORS.dark },
  statLabel: { fontSize: 9, color: COLORS.gray, textAlign: 'center' },

  progressCard: {
    backgroundColor: COLORS.card, borderRadius: RADIUS.lg, padding: SPACING.md,
    marginBottom: SPACING.md, ...SHADOW.sm,
  },
  sectionTitle: { fontSize: FONTS.size.lg, fontWeight: '700', color: COLORS.dark, marginBottom: SPACING.sm },
  progressBarBg: {
    height: 10, backgroundColor: COLORS.lightGray, borderRadius: RADIUS.round, overflow: 'hidden',
    marginBottom: SPACING.xs,
  },
  progressBarFill: { height: '100%', backgroundColor: COLORS.pt, borderRadius: RADIUS.round },
  progressText: { color: COLORS.darkGray, fontSize: FONTS.size.xs, textAlign: 'right', marginBottom: SPACING.sm },
  weekGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm, marginTop: SPACING.xs },
  weekItem: { alignItems: 'center' },
  weekLabel: { fontSize: FONTS.size.xs, color: COLORS.gray, marginBottom: 4 },
  weekDots: { flexDirection: 'row', gap: 3 },
  weekDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: COLORS.lightGray },
  weekDotDone: { backgroundColor: COLORS.success },

  injurySection: {
    backgroundColor: '#FFF8E1', borderRadius: RADIUS.lg, padding: SPACING.md,
    borderWidth: 1, borderColor: '#FFB74D', marginBottom: SPACING.md,
  },
  injurySectionTitle: { fontSize: FONTS.size.md, fontWeight: '700', color: '#E65100', marginBottom: SPACING.sm },
  injuryCard: {
    backgroundColor: COLORS.white, borderRadius: RADIUS.sm, padding: SPACING.sm,
    marginBottom: SPACING.xs,
  },
  injuryCardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 },
  injuryCardTitle: { fontWeight: '600', color: COLORS.dark, fontSize: FONTS.size.sm },
  injuryCardDate: { color: COLORS.gray, fontSize: FONTS.size.xs },
  injuryText: { color: '#E65100', fontSize: FONTS.size.sm },
  injuryNotes: { color: COLORS.darkGray, fontSize: FONTS.size.xs, marginTop: 2 },

  emptyText: { color: COLORS.gray, fontSize: FONTS.size.sm, marginBottom: SPACING.md },
  feedbackCard: {
    backgroundColor: COLORS.card, borderRadius: RADIUS.md, padding: SPACING.md,
    marginBottom: SPACING.sm, ...SHADOW.sm,
  },
  feedbackCardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: SPACING.xs },
  feedbackCardTitle: { fontWeight: '600', color: COLORS.dark, fontSize: FONTS.size.sm },
  feedbackDate: { color: COLORS.gray, fontSize: FONTS.size.xs },
  feedbackRatingRow: { flexDirection: 'row', gap: SPACING.xs, marginBottom: SPACING.xs, flexWrap: 'wrap' },
  ratingChip: {
    backgroundColor: COLORS.light, borderRadius: RADIUS.round, paddingHorizontal: SPACING.xs,
    paddingVertical: 2, fontSize: FONTS.size.xs, color: COLORS.darkGray,
  },
  completedChip: {
    backgroundColor: '#E8F5E9', borderRadius: RADIUS.round, paddingHorizontal: SPACING.xs,
    paddingVertical: 2, fontSize: FONTS.size.xs, color: COLORS.success,
  },
  partialChip: { backgroundColor: '#FFF8E1', color: COLORS.warning },
  feedbackNotes: { color: COLORS.darkGray, fontSize: FONTS.size.sm, lineHeight: 18 },
  feedbackInjuryBadge: {
    backgroundColor: '#FFF3E0', borderRadius: RADIUS.sm, padding: SPACING.xs, marginTop: SPACING.xs,
  },
  feedbackInjuryText: { color: '#E65100', fontSize: FONTS.size.xs },
});
