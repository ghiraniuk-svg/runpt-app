import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { getWeekSessions } from '../../data/trainingPlan';
import { COLORS, FONTS, SPACING, RADIUS, SHADOW } from '../../theme';

export default function WeekDetailScreen({ route, navigation }) {
  const { week } = route.params;
  const { user } = useAuth();
  const { getUserById } = useData();

  const freshUser = getUserById(user.id) || user;
  const completedSessions = freshUser.completedSessions || [];
  const sessions = getWeekSessions(week);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.weekTitle}>Week {week}</Text>
      <Text style={styles.weekSubtitle}>
        {sessions.filter((s) => completedSessions.includes(`${s.week}-${s.session}`)).length} of 3 sessions completed
      </Text>

      {sessions.map((session) => {
        const key = `${session.week}-${session.session}`;
        const done = completedSessions.includes(key);
        const runIntervals = session.intervals.filter((i) => i.type === 'run');
        const walkIntervals = session.intervals.filter((i) => i.type === 'walk' && i.label !== 'Warm Up Walk' && i.label !== 'Cool Down Walk');

        return (
          <View key={key} style={styles.sessionCard}>
            <View style={styles.sessionHeader}>
              <Text style={styles.sessionTitle}>Session {session.session}</Text>
              {done && <View style={styles.doneBadge}><Text style={styles.doneText}>✓ Done</Text></View>}
            </View>
            <Text style={styles.sessionDesc}>{session.description}</Text>

            <View style={styles.intervalPreview}>
              {session.intervals.slice(0, 12).map((interval, idx) => (
                <View
                  key={idx}
                  style={[
                    styles.intervalDot,
                    { backgroundColor: interval.type === 'run' ? COLORS.run : COLORS.walk },
                    interval.label.includes('Warm') || interval.label.includes('Cool')
                      ? styles.intervalDotWarm : null,
                  ]}
                />
              ))}
              {session.intervals.length > 12 && (
                <Text style={styles.moreIntervals}>+{session.intervals.length - 12}</Text>
              )}
            </View>

            <View style={styles.metaRow}>
              <Text style={styles.metaItem}>⏱ {session.totalMinutes} min</Text>
              <Text style={styles.metaItem}>🏃 {runIntervals.length} runs</Text>
              <Text style={styles.metaItem}>🚶 {walkIntervals.length} walks</Text>
            </View>

            <TouchableOpacity
              style={[styles.startBtn, done && styles.startBtnDone]}
              onPress={() => navigation.navigate('RunSession', { session })}
            >
              <Text style={styles.startBtnText}>{done ? 'Repeat Session' : 'Start Session'} →</Text>
            </TouchableOpacity>
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.md, paddingBottom: SPACING.xl },
  weekTitle: { fontSize: FONTS.size.xxl, fontWeight: '800', color: COLORS.dark },
  weekSubtitle: { fontSize: FONTS.size.sm, color: COLORS.gray, marginBottom: SPACING.lg },
  sessionCard: {
    backgroundColor: COLORS.card, borderRadius: RADIUS.lg, padding: SPACING.md,
    marginBottom: SPACING.md, ...SHADOW.sm,
  },
  sessionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.xs },
  sessionTitle: { fontSize: FONTS.size.lg, fontWeight: '700', color: COLORS.dark },
  doneBadge: {
    backgroundColor: COLORS.success, borderRadius: RADIUS.round, paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
  },
  doneText: { color: COLORS.white, fontSize: FONTS.size.xs, fontWeight: '700' },
  sessionDesc: { color: COLORS.darkGray, fontSize: FONTS.size.sm, lineHeight: 18, marginBottom: SPACING.sm },
  intervalPreview: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginBottom: SPACING.sm, alignItems: 'center' },
  intervalDot: { width: 12, height: 12, borderRadius: 6 },
  intervalDotWarm: { opacity: 0.4 },
  moreIntervals: { fontSize: FONTS.size.xs, color: COLORS.gray },
  metaRow: { flexDirection: 'row', gap: SPACING.md, marginBottom: SPACING.md },
  metaItem: { color: COLORS.darkGray, fontSize: FONTS.size.sm },
  startBtn: {
    backgroundColor: COLORS.primary, borderRadius: RADIUS.md, padding: SPACING.md, alignItems: 'center',
  },
  startBtnDone: { backgroundColor: COLORS.darkGray },
  startBtnText: { color: COLORS.white, fontWeight: '700', fontSize: FONTS.size.md },
});
