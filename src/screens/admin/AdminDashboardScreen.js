import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { TRAINING_PLAN } from '../../data/trainingPlan';
import { COLORS, FONTS, SPACING, RADIUS, SHADOW } from '../../theme';

export default function AdminDashboardScreen({ navigation }) {
  const { user } = useAuth();
  const { getPTs, getClients, getAllFeedback } = useData();

  const pts = getPTs();
  const clients = getClients();
  const allFeedback = getAllFeedback();
  const injuryReports = allFeedback.filter((f) => f.injuries && f.injuries.trim().length > 0);
  const recentFeedback = allFeedback.slice(0, 6);

  const getClientProgress = (client) => {
    const completed = (client.completedSessions || []).length;
    return Math.round((completed / TRAINING_PLAN.length) * 100);
  };

  const avgProgress = clients.length
    ? Math.round(clients.reduce((a, c) => a + getClientProgress(c), 0) / clients.length)
    : 0;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Admin Portal</Text>
          <Text style={styles.subtitle}>{user.name} — Head PT</Text>
        </View>
        <View style={styles.adminBadge}>
          <Text style={styles.adminBadgeText}>HEAD PT</Text>
        </View>
      </View>

      {/* Overview stats */}
      <View style={styles.statsGrid}>
        <View style={[styles.statCard, { borderTopColor: COLORS.superAdmin }]}>
          <Text style={styles.statValue}>{pts.length}</Text>
          <Text style={styles.statLabel}>Personal Trainers</Text>
        </View>
        <View style={[styles.statCard, { borderTopColor: COLORS.pt }]}>
          <Text style={styles.statValue}>{clients.length}</Text>
          <Text style={styles.statLabel}>Runners</Text>
        </View>
        <View style={[styles.statCard, { borderTopColor: COLORS.success }]}>
          <Text style={styles.statValue}>{allFeedback.length}</Text>
          <Text style={styles.statLabel}>Sessions Logged</Text>
        </View>
        <View style={[styles.statCard, { borderTopColor: COLORS.danger }]}>
          <Text style={styles.statValue}>{injuryReports.length}</Text>
          <Text style={styles.statLabel}>Injury Reports</Text>
        </View>
      </View>

      {/* Avg progress */}
      <View style={styles.avgCard}>
        <Text style={styles.avgLabel}>Average Programme Progress</Text>
        <View style={styles.avgBarBg}>
          <View style={[styles.avgBarFill, { width: `${avgProgress}%` }]} />
        </View>
        <Text style={styles.avgPct}>{avgProgress}% across all runners</Text>
      </View>

      {/* Quick actions */}
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={[styles.actionCard, { backgroundColor: COLORS.superAdmin }]}
          onPress={() => navigation.navigate('ManagePTs')}
        >
          <Text style={styles.actionIcon}>👥</Text>
          <Text style={styles.actionText}>Manage PTs</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionCard, { backgroundColor: COLORS.pt }]}
          onPress={() => navigation.navigate('ManageClients')}
        >
          <Text style={styles.actionIcon}>🏃</Text>
          <Text style={styles.actionText}>Manage Runners</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionCard, { backgroundColor: COLORS.primary }]}
          onPress={() => navigation.navigate('AllFeedback')}
        >
          <Text style={styles.actionIcon}>📋</Text>
          <Text style={styles.actionText}>All Feedback</Text>
        </TouchableOpacity>
      </View>

      {/* PT overview */}
      <Text style={styles.sectionTitle}>Personal Trainers</Text>
      {pts.map((pt) => {
        const ptClients = clients.filter((c) => c.assignedPT === pt.id);
        const ptFeedback = allFeedback.filter((f) =>
          ptClients.some((c) => c.id === f.userId)
        );
        const ptInjuries = ptFeedback.filter((f) => f.injuries && f.injuries.trim());
        return (
          <TouchableOpacity
            key={pt.id}
            style={styles.ptCard}
            onPress={() => navigation.navigate('ManagePTs')}
            activeOpacity={0.85}
          >
            <View style={styles.ptAvatar}>
              <Text style={styles.ptAvatarText}>{pt.avatar}</Text>
            </View>
            <View style={styles.ptInfo}>
              <Text style={styles.ptName}>{pt.name}</Text>
              <Text style={styles.ptEmail}>{pt.email}</Text>
              <Text style={styles.ptMeta}>
                {ptClients.length} runners • {ptFeedback.length} sessions logged
                {ptInjuries.length > 0 ? ` • ⚠️ ${ptInjuries.length} injuries` : ''}
              </Text>
            </View>
            <Text style={styles.ptArrow}>›</Text>
          </TouchableOpacity>
        );
      })}

      {/* Injury alerts */}
      {injuryReports.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>⚠️ Recent Injury Reports</Text>
          {injuryReports.slice(0, 4).map((fb) => (
            <View key={fb.id} style={styles.injuryCard}>
              <View style={styles.injuryCardHeader}>
                <Text style={styles.injuryName}>{fb.userName}</Text>
                <Text style={styles.injuryDate}>{fb.date}</Text>
              </View>
              <Text style={styles.injurySession}>Week {fb.week}, Session {fb.session}</Text>
              <Text style={styles.injuryText}>{fb.injuries}</Text>
            </View>
          ))}
        </>
      )}

      {/* Recent activity */}
      <Text style={styles.sectionTitle}>Recent Activity</Text>
      {recentFeedback.map((fb) => (
        <View key={fb.id} style={styles.activityItem}>
          <View style={styles.activityDot} />
          <View style={styles.activityContent}>
            <Text style={styles.activityText}>
              <Text style={{ fontWeight: '600' }}>{fb.userName}</Text> completed W{fb.week}S{fb.session}
            </Text>
            <Text style={styles.activityDate}>{fb.date} • {'⭐'.repeat(fb.rating)}</Text>
            {fb.injuries ? <Text style={styles.activityInjury}>⚠️ {fb.injuries}</Text> : null}
          </View>
        </View>
      ))}
      {allFeedback.length === 0 && (
        <Text style={styles.emptyText}>No activity yet.</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.md, paddingBottom: SPACING.xl },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: SPACING.lg },
  title: { fontSize: FONTS.size.xxl, fontWeight: '800', color: COLORS.dark },
  subtitle: { color: COLORS.gray, fontSize: FONTS.size.sm },
  adminBadge: {
    backgroundColor: COLORS.superAdmin, borderRadius: RADIUS.round, paddingHorizontal: SPACING.sm, paddingVertical: 4,
  },
  adminBadgeText: { color: COLORS.white, fontWeight: '800', fontSize: FONTS.size.xs, letterSpacing: 0.5 },

  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm, marginBottom: SPACING.md },
  statCard: {
    width: '47%', backgroundColor: COLORS.card, borderRadius: RADIUS.md, padding: SPACING.md,
    borderTopWidth: 3, ...SHADOW.sm, alignItems: 'center',
  },
  statValue: { fontSize: FONTS.size.xxl, fontWeight: '800', color: COLORS.dark },
  statLabel: { fontSize: FONTS.size.xs, color: COLORS.gray, textAlign: 'center', marginTop: 2 },

  avgCard: {
    backgroundColor: COLORS.card, borderRadius: RADIUS.md, padding: SPACING.md, ...SHADOW.sm,
    marginBottom: SPACING.lg,
  },
  avgLabel: { fontSize: FONTS.size.sm, color: COLORS.gray, marginBottom: SPACING.xs },
  avgBarBg: { height: 10, backgroundColor: COLORS.lightGray, borderRadius: RADIUS.round, overflow: 'hidden', marginBottom: SPACING.xs },
  avgBarFill: { height: '100%', backgroundColor: COLORS.superAdmin, borderRadius: RADIUS.round },
  avgPct: { color: COLORS.darkGray, fontSize: FONTS.size.xs, textAlign: 'right' },

  sectionTitle: { fontSize: FONTS.size.lg, fontWeight: '700', color: COLORS.dark, marginBottom: SPACING.sm, marginTop: SPACING.xs },

  actionsRow: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.lg },
  actionCard: {
    flex: 1, borderRadius: RADIUS.lg, padding: SPACING.md, alignItems: 'center', ...SHADOW.sm,
  },
  actionIcon: { fontSize: 28, marginBottom: SPACING.xs },
  actionText: { color: COLORS.white, fontWeight: '700', fontSize: FONTS.size.xs, textAlign: 'center' },

  ptCard: {
    backgroundColor: COLORS.card, borderRadius: RADIUS.md, padding: SPACING.md,
    marginBottom: SPACING.sm, ...SHADOW.sm, flexDirection: 'row', alignItems: 'center',
  },
  ptAvatar: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.superAdmin,
    alignItems: 'center', justifyContent: 'center', marginRight: SPACING.sm,
  },
  ptAvatarText: { color: COLORS.white, fontWeight: '700', fontSize: FONTS.size.md },
  ptInfo: { flex: 1 },
  ptName: { fontWeight: '700', color: COLORS.dark, fontSize: FONTS.size.md },
  ptEmail: { color: COLORS.gray, fontSize: FONTS.size.xs },
  ptMeta: { color: COLORS.darkGray, fontSize: FONTS.size.xs, marginTop: 2 },
  ptArrow: { color: COLORS.gray, fontSize: 22 },

  injuryCard: {
    backgroundColor: '#FFF8E1', borderRadius: RADIUS.md, padding: SPACING.sm,
    marginBottom: SPACING.xs, borderLeftWidth: 3, borderLeftColor: COLORS.warning,
  },
  injuryCardHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  injuryName: { fontWeight: '600', color: COLORS.dark, fontSize: FONTS.size.sm },
  injuryDate: { color: COLORS.gray, fontSize: FONTS.size.xs },
  injurySession: { color: COLORS.darkGray, fontSize: FONTS.size.xs },
  injuryText: { color: '#E65100', fontSize: FONTS.size.sm, marginTop: 2 },

  activityItem: { flexDirection: 'row', marginBottom: SPACING.sm, alignItems: 'flex-start' },
  activityDot: {
    width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.primary,
    marginTop: 5, marginRight: SPACING.sm,
  },
  activityContent: { flex: 1 },
  activityText: { color: COLORS.dark, fontSize: FONTS.size.sm },
  activityDate: { color: COLORS.gray, fontSize: FONTS.size.xs },
  activityInjury: { color: '#E65100', fontSize: FONTS.size.xs },
  emptyText: { color: COLORS.gray, fontSize: FONTS.size.sm },
});
