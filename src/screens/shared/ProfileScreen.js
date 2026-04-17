import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { TRAINING_PLAN } from '../../data/trainingPlan';
import { COLORS, FONTS, SPACING, RADIUS, SHADOW } from '../../theme';

const ROLE_LABELS = {
  super_admin: { label: 'Head PT', color: COLORS.superAdmin },
  pt: { label: 'Personal Trainer', color: COLORS.pt },
  user: { label: 'Runner', color: COLORS.primary },
};

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const { getUserById } = useData();
  const [showConfirm, setShowConfirm] = useState(false);

  const freshUser = getUserById(user.id) || user;
  const role = ROLE_LABELS[freshUser.role] || ROLE_LABELS.user;
  const assignedPT = freshUser.assignedPT ? getUserById(freshUser.assignedPT) : null;
  const completedPct = freshUser.role === 'user'
    ? Math.round(((freshUser.completedSessions || []).length / TRAINING_PLAN.length) * 100)
    : null;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>

      {/* Profile card */}
      <View style={[styles.profileCard, { borderTopColor: role.color }]}>
        <View style={[styles.avatar, { backgroundColor: role.color }]}>
          <Text style={styles.avatarText}>{freshUser.avatar}</Text>
        </View>
        <Text style={styles.name}>{freshUser.name}</Text>
        <Text style={styles.email}>{freshUser.email}</Text>
        <View style={[styles.roleBadge, { backgroundColor: role.color }]}>
          <Text style={styles.roleBadgeText}>{role.label}</Text>
        </View>
      </View>

      {/* Runner info */}
      {freshUser.role === 'user' && (
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>My Programme</Text>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${completedPct}%` }]} />
          </View>
          <Text style={styles.progressText}>
            {(freshUser.completedSessions || []).length}/{TRAINING_PLAN.length} sessions — {completedPct}%
          </Text>
          {assignedPT ? (
            <View style={styles.ptInfo}>
              <Text style={styles.ptInfoLabel}>Your Personal Trainer</Text>
              <View style={styles.ptInfoRow}>
                <View style={styles.ptAvatar}>
                  <Text style={styles.ptAvatarText}>{assignedPT.avatar}</Text>
                </View>
                <View>
                  <Text style={styles.ptName}>{assignedPT.name}</Text>
                  <Text style={styles.ptEmail}>{assignedPT.email}</Text>
                </View>
              </View>
            </View>
          ) : (
            <Text style={styles.noPT}>No PT assigned yet. Contact your Head PT.</Text>
          )}
        </View>
      )}

      {/* PT info */}
      {freshUser.role === 'pt' && (
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Your Account</Text>
          <Text style={styles.infoText}>You are a Personal Trainer on RunPT.</Text>
          <Text style={styles.infoText}>Clients are assigned to you by the Head PT.</Text>
        </View>
      )}

      {/* Account details */}
      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Account Details</Text>
        {[
          { label: 'Name', value: freshUser.name },
          { label: 'Email', value: freshUser.email },
          { label: 'Role', value: role.label, color: role.color },
          { label: 'Member since', value: freshUser.createdAt },
        ].map((row, i, arr) => (
          <View key={row.label} style={[styles.detailRow, i === arr.length - 1 && { borderBottomWidth: 0 }]}>
            <Text style={styles.detailLabel}>{row.label}</Text>
            <Text style={[styles.detailValue, row.color && { color: row.color, fontWeight: '700' }]}>
              {row.value}
            </Text>
          </View>
        ))}
      </View>

      {/* Sign out */}
      <TouchableOpacity style={styles.logoutBtn} onPress={() => setShowConfirm(true)}>
        <Text style={styles.logoutBtnText}>Sign Out</Text>
      </TouchableOpacity>

      <Text style={styles.version}>RunPT v1.0.0 — Couch to 5K</Text>

      {/* Web-compatible confirm modal */}
      <Modal visible={showConfirm} transparent animationType="fade" onRequestClose={() => setShowConfirm(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Sign out?</Text>
            <Text style={styles.modalMessage}>You'll need to sign back in to access your account.</Text>
            <View style={styles.modalBtns}>
              <TouchableOpacity style={styles.modalCancel} onPress={() => setShowConfirm(false)}>
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalConfirm} onPress={logout}>
                <Text style={styles.modalConfirmText}>Sign Out</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.md, paddingBottom: SPACING.xl },

  profileCard: {
    backgroundColor: COLORS.card, borderRadius: RADIUS.lg, padding: SPACING.lg,
    alignItems: 'center', marginBottom: SPACING.md, borderTopWidth: 4, ...SHADOW.md,
  },
  avatar: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.md },
  avatarText: { color: COLORS.white, fontSize: FONTS.size.xxl, fontWeight: '800' },
  name: { fontSize: FONTS.size.xl, fontWeight: '800', color: COLORS.dark },
  email: { color: COLORS.gray, fontSize: FONTS.size.sm, marginTop: 4 },
  roleBadge: { borderRadius: RADIUS.round, paddingHorizontal: SPACING.md, paddingVertical: 4, marginTop: SPACING.sm },
  roleBadgeText: { color: COLORS.white, fontWeight: '700', fontSize: FONTS.size.sm },

  infoCard: { backgroundColor: COLORS.card, borderRadius: RADIUS.md, padding: SPACING.md, marginBottom: SPACING.md, ...SHADOW.sm },
  infoTitle: { fontSize: FONTS.size.lg, fontWeight: '700', color: COLORS.dark, marginBottom: SPACING.sm },
  progressBarBg: { height: 10, backgroundColor: COLORS.lightGray, borderRadius: RADIUS.round, overflow: 'hidden', marginBottom: SPACING.xs },
  progressBarFill: { height: '100%', backgroundColor: COLORS.success, borderRadius: RADIUS.round },
  progressText: { color: COLORS.darkGray, fontSize: FONTS.size.xs, textAlign: 'right', marginBottom: SPACING.md },
  ptInfo: { borderTopWidth: 1, borderTopColor: COLORS.border, paddingTop: SPACING.sm },
  ptInfoLabel: { fontSize: FONTS.size.sm, color: COLORS.gray, marginBottom: SPACING.xs },
  ptInfoRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  ptAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.pt, alignItems: 'center', justifyContent: 'center' },
  ptAvatarText: { color: COLORS.white, fontWeight: '700' },
  ptName: { fontWeight: '600', color: COLORS.dark, fontSize: FONTS.size.md },
  ptEmail: { color: COLORS.gray, fontSize: FONTS.size.xs },
  noPT: { color: COLORS.gray, fontSize: FONTS.size.sm, marginTop: SPACING.sm, fontStyle: 'italic' },
  infoText: { color: COLORS.darkGray, fontSize: FONTS.size.sm, lineHeight: 20, marginBottom: SPACING.xs },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: SPACING.sm, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  detailLabel: { color: COLORS.gray, fontSize: FONTS.size.sm },
  detailValue: { color: COLORS.dark, fontSize: FONTS.size.sm, fontWeight: '500' },

  logoutBtn: { backgroundColor: '#FFEBEE', borderRadius: RADIUS.md, padding: SPACING.md, alignItems: 'center', marginBottom: SPACING.sm, borderWidth: 1, borderColor: '#FFCDD2' },
  logoutBtnText: { color: COLORS.danger, fontSize: FONTS.size.md, fontWeight: '700' },
  version: { color: COLORS.gray, fontSize: FONTS.size.xs, textAlign: 'center', marginTop: SPACING.xs },

  // Confirm modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center' },
  modalBox: { backgroundColor: COLORS.white, borderRadius: RADIUS.lg, padding: SPACING.lg, width: '85%', maxWidth: 360, ...SHADOW.md },
  modalTitle: { fontSize: FONTS.size.xl, fontWeight: '800', color: COLORS.dark, marginBottom: SPACING.xs },
  modalMessage: { fontSize: FONTS.size.sm, color: COLORS.gray, marginBottom: SPACING.lg, lineHeight: 20 },
  modalBtns: { flexDirection: 'row', gap: SPACING.sm },
  modalCancel: { flex: 1, padding: SPACING.md, borderRadius: RADIUS.md, backgroundColor: COLORS.light, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  modalCancelText: { color: COLORS.darkGray, fontWeight: '600', fontSize: FONTS.size.md },
  modalConfirm: { flex: 1, padding: SPACING.md, borderRadius: RADIUS.md, backgroundColor: COLORS.danger, alignItems: 'center' },
  modalConfirmText: { color: COLORS.white, fontWeight: '700', fontSize: FONTS.size.md },
});
