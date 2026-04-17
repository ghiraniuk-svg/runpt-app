import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { TRAINING_PLAN } from '../../data/trainingPlan';
import { COLORS, FONTS, SPACING, RADIUS, SHADOW } from '../../theme';

export default function PTDashboardScreen({ navigation }) {
  const { user } = useAuth();
  const { getClientsForPT, getFeedbackForPT, getUserById } = useData();
  const [search, setSearch] = useState('');

  const clients = getClientsForPT(user.id);
  const allFeedback = getFeedbackForPT(user.id);

  const filteredClients = clients.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const recentFeedback = allFeedback.slice(0, 10);
  const injuryReports = allFeedback.filter((f) => f.injuries && f.injuries.trim().length > 0);

  const getClientProgress = (client) => {
    const completed = (client.completedSessions || []).length;
    const pct = Math.round((completed / TRAINING_PLAN.length) * 100);
    return { completed, pct };
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>PT Dashboard</Text>
          <Text style={styles.subtitle}>Welcome, {user.name.split(' ')[0]}</Text>
        </View>
        <View style={styles.ptBadge}>
          <Text style={styles.ptBadgeText}>PT</Text>
        </View>
      </View>

      {/* Stats row */}
      <View style={styles.statsRow}>
        <View style={[styles.statCard, { borderTopColor: COLORS.pt }]}>
          <Text style={styles.statValue}>{clients.length}</Text>
          <Text style={styles.statLabel}>Clients</Text>
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

      {/* Injury alerts */}
      {injuryReports.length > 0 && (
        <View style={styles.alertCard}>
          <Text style={styles.alertTitle}>⚠️ Injury Reports</Text>
          {injuryReports.slice(0, 3).map((fb) => (
            <TouchableOpacity
              key={fb.id}
              style={styles.alertItem}
              onPress={() => navigation.navigate('ClientDetail', { clientId: fb.userId })}
            >
              <View style={styles.alertItemLeft}>
                <Text style={styles.alertClientName}>{fb.userName}</Text>
                <Text style={styles.alertDate}>Week {fb.week}, Session {fb.session} • {fb.date}</Text>
                <Text style={styles.alertInjury}>{fb.injuries}</Text>
              </View>
              <Text style={styles.alertArrow}>›</Text>
            </TouchableOpacity>
          ))}
          {injuryReports.length > 3 && (
            <Text style={styles.moreText}>+{injuryReports.length - 3} more reports</Text>
          )}
        </View>
      )}

      {/* Clients */}
      <Text style={styles.sectionTitle}>My Clients ({clients.length})</Text>
      <View style={styles.searchBox}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search clients..."
          placeholderTextColor={COLORS.gray}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {filteredClients.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No clients assigned yet.</Text>
        </View>
      ) : (
        filteredClients.map((client) => {
          const { completed, pct } = getClientProgress(client);
          const clientFeedback = allFeedback.filter((f) => f.userId === client.id);
          const hasInjury = clientFeedback.some((f) => f.injuries && f.injuries.trim());
          const lastSession = clientFeedback[0];

          return (
            <TouchableOpacity
              key={client.id}
              style={styles.clientCard}
              onPress={() => navigation.navigate('ClientDetail', { clientId: client.id })}
              activeOpacity={0.85}
            >
              <View style={styles.clientCardTop}>
                <View style={styles.clientAvatar}>
                  <Text style={styles.clientAvatarText}>{client.avatar}</Text>
                </View>
                <View style={styles.clientInfo}>
                  <View style={styles.clientNameRow}>
                    <Text style={styles.clientName}>{client.name}</Text>
                    {hasInjury && <Text style={styles.injuryFlag}>⚠️</Text>}
                  </View>
                  <Text style={styles.clientEmail}>{client.email}</Text>
                  <Text style={styles.clientProgress}>
                    {completed}/{TRAINING_PLAN.length} sessions • {pct}%
                  </Text>
                </View>
                <Text style={styles.clientArrow}>›</Text>
              </View>
              <View style={styles.clientProgressBar}>
                <View style={[styles.clientProgressFill, { width: `${pct}%` }]} />
              </View>
              {lastSession && (
                <Text style={styles.lastSessionText}>
                  Last: W{lastSession.week}S{lastSession.session} on {lastSession.date} •{' '}
                  {'⭐'.repeat(lastSession.rating)}
                </Text>
              )}
            </TouchableOpacity>
          );
        })
      )}

      {/* Recent feedback */}
      {recentFeedback.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          {recentFeedback.slice(0, 5).map((fb) => (
            <TouchableOpacity
              key={fb.id}
              style={styles.feedbackItem}
              onPress={() => navigation.navigate('ClientDetail', { clientId: fb.userId })}
            >
              <View style={styles.feedbackItemLeft}>
                <Text style={styles.feedbackClientName}>{fb.userName}</Text>
                <Text style={styles.feedbackSessionInfo}>
                  Week {fb.week}, Session {fb.session} • {fb.date}
                </Text>
                {fb.notes ? <Text style={styles.feedbackNotes} numberOfLines={1}>{fb.notes}</Text> : null}
                {fb.injuries ? (
                  <Text style={styles.feedbackInjury}>⚠️ {fb.injuries}</Text>
                ) : null}
              </View>
              <View style={styles.feedbackRatings}>
                <Text style={styles.feedbackRatingValue}>{'⭐'.repeat(fb.rating)}</Text>
                <Text style={styles.feedbackRatingValue}>{'💪'.repeat(fb.effort)}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </>
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
  ptBadge: {
    backgroundColor: COLORS.pt, borderRadius: RADIUS.round, paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
  },
  ptBadgeText: { color: COLORS.white, fontWeight: '800', fontSize: FONTS.size.sm },

  statsRow: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.lg },
  statCard: {
    flex: 1, backgroundColor: COLORS.card, borderRadius: RADIUS.md, padding: SPACING.md,
    borderTopWidth: 3, ...SHADOW.sm, alignItems: 'center',
  },
  statValue: { fontSize: FONTS.size.xxl, fontWeight: '800', color: COLORS.dark },
  statLabel: { fontSize: FONTS.size.xs, color: COLORS.gray, textAlign: 'center', marginTop: 2 },

  alertCard: {
    backgroundColor: '#FFF8E1', borderRadius: RADIUS.md, padding: SPACING.md,
    borderWidth: 1, borderColor: '#FFB74D', marginBottom: SPACING.md,
  },
  alertTitle: { fontSize: FONTS.size.md, fontWeight: '700', color: '#E65100', marginBottom: SPACING.sm },
  alertItem: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: SPACING.xs,
    borderBottomWidth: 1, borderBottomColor: '#FFE0B2',
  },
  alertItemLeft: { flex: 1 },
  alertClientName: { fontWeight: '600', color: COLORS.dark, fontSize: FONTS.size.sm },
  alertDate: { color: COLORS.gray, fontSize: FONTS.size.xs },
  alertInjury: { color: '#E65100', fontSize: FONTS.size.xs, marginTop: 2 },
  alertArrow: { color: '#E65100', fontSize: 20, fontWeight: '700' },
  moreText: { color: '#E65100', fontSize: FONTS.size.xs, marginTop: SPACING.xs },

  sectionTitle: { fontSize: FONTS.size.lg, fontWeight: '700', color: COLORS.dark, marginBottom: SPACING.sm },
  searchBox: { marginBottom: SPACING.sm },
  searchInput: {
    backgroundColor: COLORS.card, borderRadius: RADIUS.md, padding: SPACING.sm,
    fontSize: FONTS.size.sm, color: COLORS.dark, borderWidth: 1, borderColor: COLORS.border,
  },

  emptyState: { alignItems: 'center', padding: SPACING.xl },
  emptyText: { color: COLORS.gray, fontSize: FONTS.size.sm },

  clientCard: {
    backgroundColor: COLORS.card, borderRadius: RADIUS.lg, padding: SPACING.md,
    marginBottom: SPACING.sm, ...SHADOW.sm,
  },
  clientCardTop: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.sm },
  clientAvatar: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.pt,
    alignItems: 'center', justifyContent: 'center', marginRight: SPACING.sm,
  },
  clientAvatarText: { color: COLORS.white, fontWeight: '700', fontSize: FONTS.size.sm },
  clientInfo: { flex: 1 },
  clientNameRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs },
  clientName: { fontWeight: '700', color: COLORS.dark, fontSize: FONTS.size.md },
  injuryFlag: { fontSize: 14 },
  clientEmail: { color: COLORS.gray, fontSize: FONTS.size.xs },
  clientProgress: { color: COLORS.darkGray, fontSize: FONTS.size.xs, marginTop: 1 },
  clientArrow: { color: COLORS.gray, fontSize: 22, fontWeight: '700' },
  clientProgressBar: {
    height: 5, backgroundColor: COLORS.lightGray, borderRadius: RADIUS.round, overflow: 'hidden',
    marginBottom: SPACING.xs,
  },
  clientProgressFill: { height: '100%', backgroundColor: COLORS.pt, borderRadius: RADIUS.round },
  lastSessionText: { color: COLORS.gray, fontSize: FONTS.size.xs },

  feedbackItem: {
    backgroundColor: COLORS.card, borderRadius: RADIUS.md, padding: SPACING.md,
    marginBottom: SPACING.sm, ...SHADOW.sm, flexDirection: 'row',
  },
  feedbackItemLeft: { flex: 1 },
  feedbackClientName: { fontWeight: '600', color: COLORS.dark, fontSize: FONTS.size.sm },
  feedbackSessionInfo: { color: COLORS.gray, fontSize: FONTS.size.xs },
  feedbackNotes: { color: COLORS.darkGray, fontSize: FONTS.size.xs, marginTop: 2 },
  feedbackInjury: { color: '#E65100', fontSize: FONTS.size.xs, marginTop: 2 },
  feedbackRatings: { alignItems: 'flex-end', gap: 2 },
  feedbackRatingValue: { fontSize: FONTS.size.xs },
});
