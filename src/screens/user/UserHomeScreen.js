import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { TRAINING_PLAN, getNextSession } from '../../data/trainingPlan';
import { COLORS, FONTS, SPACING, RADIUS, SHADOW } from '../../theme';

export default function UserHomeScreen({ navigation }) {
  const { user } = useAuth();
  const { getUserById, getFeedbackForUser } = useData();

  // Always get fresh user data
  const freshUser = getUserById(user.id) || user;
  const completedSessions = freshUser.completedSessions || [];
  const nextSession = getNextSession(completedSessions);
  const totalSessions = TRAINING_PLAN.length; // 27
  const completedCount = completedSessions.length;
  const progressPct = Math.round((completedCount / totalSessions) * 100);

  const recentFeedback = getFeedbackForUser(user.id).slice(0, 3);

  const greetingTime = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  // Group sessions by week for overview
  const weeks = Array.from({ length: 9 }, (_, i) => {
    const weekNum = i + 1;
    const sessions = TRAINING_PLAN.filter((s) => s.week === weekNum);
    const completedInWeek = sessions.filter((s) =>
      completedSessions.includes(`${s.week}-${s.session}`)
    ).length;
    return { week: weekNum, total: 3, completed: completedInWeek };
  });

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>{greetingTime()},</Text>
          <Text style={styles.userName}>{freshUser.name.split(' ')[0]} 👋</Text>
        </View>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarText}>{freshUser.avatar}</Text>
        </View>
      </View>

      {/* Progress bar */}
      <View style={styles.progressCard}>
        <Text style={styles.progressLabel}>Overall Progress</Text>
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: `${progressPct}%` }]} />
        </View>
        <Text style={styles.progressText}>{completedCount} / {totalSessions} sessions — {progressPct}%</Text>
      </View>

      {/* Next session card */}
      {nextSession ? (
        <TouchableOpacity
          style={styles.nextSessionCard}
          onPress={() => navigation.navigate('RunSession', { session: nextSession })}
          activeOpacity={0.85}
        >
          <View style={styles.nextSessionBadge}>
            <Text style={styles.nextSessionBadgeText}>UP NEXT</Text>
          </View>
          <Text style={styles.nextSessionTitle}>{nextSession.title}</Text>
          <Text style={styles.nextSessionDesc}>{nextSession.description}</Text>
          <View style={styles.nextSessionMeta}>
            <Text style={styles.nextSessionMetaItem}>⏱ {nextSession.totalMinutes} min</Text>
            <Text style={styles.nextSessionMetaItem}>
              🏃 {nextSession.intervals.filter((i) => i.type === 'run').length} runs
            </Text>
          </View>
          <View style={styles.startBtn}>
            <Text style={styles.startBtnText}>Start Session →</Text>
          </View>
        </TouchableOpacity>
      ) : (
        <View style={styles.completeCard}>
          <Text style={styles.completeEmoji}>🏅</Text>
          <Text style={styles.completeTitle}>Programme Complete!</Text>
          <Text style={styles.completeText}>You've completed all 9 weeks. You're a runner!</Text>
        </View>
      )}

      {/* Week overview */}
      <Text style={styles.sectionTitle}>9-Week Plan</Text>
      <View style={styles.weeksGrid}>
        {weeks.map(({ week, total, completed }) => {
          const allDone = completed === total;
          const inProgress = completed > 0 && !allDone;
          const isNext = nextSession && nextSession.week === week;
          return (
            <TouchableOpacity
              key={week}
              style={[
                styles.weekChip,
                allDone && styles.weekChipDone,
                isNext && styles.weekChipNext,
              ]}
              onPress={() => navigation.navigate('WeekDetail', { week })}
            >
              <Text style={[styles.weekChipLabel, (allDone || isNext) && styles.weekChipLabelActive]}>
                W{week}
              </Text>
              <Text style={[styles.weekChipSessions, (allDone || isNext) && styles.weekChipSessionsActive]}>
                {completed}/{total}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Recent feedback */}
      {recentFeedback.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Recent Sessions</Text>
          {recentFeedback.map((fb) => (
            <View key={fb.id} style={styles.feedbackCard}>
              <View style={styles.feedbackCardHeader}>
                <Text style={styles.feedbackCardTitle}>Week {fb.week} – Session {fb.session}</Text>
                <Text style={styles.feedbackDate}>{fb.date}</Text>
              </View>
              <View style={styles.ratingRow}>
                <Text style={styles.ratingLabel}>Feel: </Text>
                {'⭐'.repeat(fb.rating)}
                <Text style={styles.ratingLabel}>  Effort: </Text>
                {'💪'.repeat(fb.effort)}
              </View>
              {fb.notes ? <Text style={styles.feedbackNotes}>{fb.notes}</Text> : null}
              {fb.injuries ? (
                <View style={styles.injuryBadge}>
                  <Text style={styles.injuryText}>⚠️ {fb.injuries}</Text>
                </View>
              ) : null}
            </View>
          ))}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.md, paddingBottom: SPACING.xl },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start',
    marginBottom: SPACING.lg,
  },
  greeting: { fontSize: FONTS.size.md, color: COLORS.gray },
  userName: { fontSize: FONTS.size.xxl, fontWeight: '800', color: COLORS.dark },
  avatarCircle: {
    width: 46, height: 46, borderRadius: 23,
    backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { color: COLORS.white, fontWeight: '700', fontSize: FONTS.size.md },

  progressCard: {
    backgroundColor: COLORS.card, borderRadius: RADIUS.md, padding: SPACING.md,
    marginBottom: SPACING.md, ...SHADOW.sm,
  },
  progressLabel: { fontSize: FONTS.size.sm, color: COLORS.gray, marginBottom: SPACING.xs },
  progressBarBg: {
    height: 10, backgroundColor: COLORS.lightGray, borderRadius: RADIUS.round, overflow: 'hidden',
    marginBottom: SPACING.xs,
  },
  progressBarFill: {
    height: '100%', backgroundColor: COLORS.success, borderRadius: RADIUS.round,
  },
  progressText: { fontSize: FONTS.size.sm, color: COLORS.darkGray, textAlign: 'right' },

  nextSessionCard: {
    backgroundColor: COLORS.secondary, borderRadius: RADIUS.lg, padding: SPACING.lg,
    marginBottom: SPACING.lg, ...SHADOW.md,
  },
  nextSessionBadge: {
    backgroundColor: COLORS.primary, borderRadius: RADIUS.round, alignSelf: 'flex-start',
    paddingHorizontal: SPACING.sm, paddingVertical: 2, marginBottom: SPACING.sm,
  },
  nextSessionBadgeText: { color: COLORS.white, fontSize: FONTS.size.xs, fontWeight: '700', letterSpacing: 0.5 },
  nextSessionTitle: { color: COLORS.white, fontSize: FONTS.size.xl, fontWeight: '800', marginBottom: SPACING.xs },
  nextSessionDesc: { color: 'rgba(255,255,255,0.7)', fontSize: FONTS.size.sm, marginBottom: SPACING.md, lineHeight: 20 },
  nextSessionMeta: { flexDirection: 'row', gap: SPACING.md, marginBottom: SPACING.md },
  nextSessionMetaItem: { color: 'rgba(255,255,255,0.8)', fontSize: FONTS.size.sm },
  startBtn: {
    backgroundColor: COLORS.primary, borderRadius: RADIUS.md, padding: SPACING.md, alignItems: 'center',
  },
  startBtnText: { color: COLORS.white, fontWeight: '700', fontSize: FONTS.size.md },

  completeCard: {
    backgroundColor: COLORS.success, borderRadius: RADIUS.lg, padding: SPACING.lg,
    alignItems: 'center', marginBottom: SPACING.lg, ...SHADOW.md,
  },
  completeEmoji: { fontSize: 48, marginBottom: SPACING.sm },
  completeTitle: { color: COLORS.white, fontSize: FONTS.size.xl, fontWeight: '800' },
  completeText: { color: 'rgba(255,255,255,0.9)', fontSize: FONTS.size.sm, textAlign: 'center', marginTop: SPACING.xs },

  sectionTitle: { fontSize: FONTS.size.lg, fontWeight: '700', color: COLORS.dark, marginBottom: SPACING.sm, marginTop: SPACING.xs },

  weeksGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm, marginBottom: SPACING.lg },
  weekChip: {
    backgroundColor: COLORS.card, borderRadius: RADIUS.md, padding: SPACING.sm,
    alignItems: 'center', width: 68, borderWidth: 1.5, borderColor: COLORS.border, ...SHADOW.sm,
  },
  weekChipDone: { backgroundColor: COLORS.success, borderColor: COLORS.success },
  weekChipNext: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  weekChipLabel: { fontSize: FONTS.size.sm, fontWeight: '700', color: COLORS.dark },
  weekChipLabelActive: { color: COLORS.white },
  weekChipSessions: { fontSize: FONTS.size.xs, color: COLORS.gray, marginTop: 2 },
  weekChipSessionsActive: { color: 'rgba(255,255,255,0.8)' },

  feedbackCard: {
    backgroundColor: COLORS.card, borderRadius: RADIUS.md, padding: SPACING.md,
    marginBottom: SPACING.sm, ...SHADOW.sm,
  },
  feedbackCardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: SPACING.xs },
  feedbackCardTitle: { fontWeight: '600', color: COLORS.dark, fontSize: FONTS.size.sm },
  feedbackDate: { color: COLORS.gray, fontSize: FONTS.size.xs },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.xs },
  ratingLabel: { fontSize: FONTS.size.xs, color: COLORS.gray },
  feedbackNotes: { color: COLORS.darkGray, fontSize: FONTS.size.sm, lineHeight: 18 },
  injuryBadge: {
    backgroundColor: '#FFF3E0', borderRadius: RADIUS.sm, padding: SPACING.xs, marginTop: SPACING.xs,
  },
  injuryText: { color: '#E65100', fontSize: FONTS.size.xs, fontWeight: '500' },
});
