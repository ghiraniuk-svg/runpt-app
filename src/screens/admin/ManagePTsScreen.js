import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput,
  Alert, Modal, ActivityIndicator, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useData } from '../../context/DataContext';
import { COLORS, FONTS, SPACING, RADIUS, SHADOW } from '../../theme';

const CreatePTModal = ({ visible, onClose, onCreated }) => {
  const { createPT } = useData();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const reset = () => { setName(''); setEmail(''); setPassword(''); };

  const submit = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      Alert.alert('Missing fields', 'Please fill in all fields.');
      return;
    }
    setLoading(true);
    try {
      const pt = await createPT({ name: name.trim(), email: email.trim(), password });
      reset();
      onCreated(pt);
    } catch (err) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView style={styles.modal} contentContainerStyle={styles.modalContent} keyboardShouldPersistTaps="handled">
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add Personal Trainer</Text>
            <TouchableOpacity onPress={() => { reset(); onClose(); }}>
              <Text style={styles.modalClose}>✕</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Full Name</Text>
          <TextInput style={styles.input} placeholder="e.g. James Carter" value={name} onChangeText={setName} placeholderTextColor={COLORS.gray} />

          <Text style={styles.label}>Email</Text>
          <TextInput style={styles.input} placeholder="james@runpt.com" value={email} onChangeText={setEmail}
            autoCapitalize="none" keyboardType="email-address" placeholderTextColor={COLORS.gray} />

          <Text style={styles.label}>Password</Text>
          <TextInput style={styles.input} placeholder="Temporary password" value={password}
            onChangeText={setPassword} secureTextEntry placeholderTextColor={COLORS.gray} />

          <TouchableOpacity style={[styles.submitBtn, loading && { opacity: 0.6 }]} onPress={submit} disabled={loading}>
            {loading ? <ActivityIndicator color={COLORS.white} /> : <Text style={styles.submitBtnText}>Create PT Account</Text>}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default function ManagePTsScreen({ navigation }) {
  const { getPTs, getClients, getAllFeedback, deletePT } = useData();
  const [showModal, setShowModal] = useState(false);

  const pts = getPTs();
  const clients = getClients();
  const allFeedback = getAllFeedback();

  const handleDelete = (pt) => {
    const ptClients = clients.filter((c) => c.assignedPT === pt.id);
    Alert.alert(
      'Remove PT',
      `Remove ${pt.name}? Their ${ptClients.length} client(s) will be unassigned.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', style: 'destructive', onPress: () => deletePT(pt.id) },
      ]
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.topBar}>
          <Text style={styles.pageTitle}>Personal Trainers ({pts.length})</Text>
          <TouchableOpacity style={styles.addBtn} onPress={() => setShowModal(true)}>
            <Text style={styles.addBtnText}>+ Add PT</Text>
          </TouchableOpacity>
        </View>

        {pts.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>👥</Text>
            <Text style={styles.emptyTitle}>No PTs yet</Text>
            <Text style={styles.emptyText}>Add your first PT to get started.</Text>
          </View>
        ) : (
          pts.map((pt) => {
            const ptClients = clients.filter((c) => c.assignedPT === pt.id);
            const ptFeedback = allFeedback.filter((f) =>
              ptClients.some((c) => c.id === f.userId)
            );
            const injuries = ptFeedback.filter((f) => f.injuries && f.injuries.trim());

            return (
              <View key={pt.id} style={styles.ptCard}>
                <View style={styles.ptCardTop}>
                  <View style={styles.ptAvatar}>
                    <Text style={styles.ptAvatarText}>{pt.avatar}</Text>
                  </View>
                  <View style={styles.ptInfo}>
                    <Text style={styles.ptName}>{pt.name}</Text>
                    <Text style={styles.ptEmail}>{pt.email}</Text>
                    <Text style={styles.ptJoined}>Joined: {pt.createdAt}</Text>
                  </View>
                  <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(pt)}>
                    <Text style={styles.deleteBtnText}>✕</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.ptStats}>
                  <View style={styles.ptStatItem}>
                    <Text style={styles.ptStatValue}>{ptClients.length}</Text>
                    <Text style={styles.ptStatLabel}>Clients</Text>
                  </View>
                  <View style={styles.ptStatItem}>
                    <Text style={styles.ptStatValue}>{ptFeedback.length}</Text>
                    <Text style={styles.ptStatLabel}>Sessions</Text>
                  </View>
                  <View style={styles.ptStatItem}>
                    <Text style={[styles.ptStatValue, injuries.length > 0 && { color: COLORS.danger }]}>
                      {injuries.length}
                    </Text>
                    <Text style={styles.ptStatLabel}>Injuries</Text>
                  </View>
                </View>

                {/* Client list */}
                {ptClients.length > 0 && (
                  <View style={styles.ptClientList}>
                    <Text style={styles.ptClientListLabel}>Runners:</Text>
                    {ptClients.map((c) => (
                      <TouchableOpacity
                        key={c.id}
                        style={styles.ptClientChip}
                        onPress={() => navigation.navigate('ClientDetailAdmin', { clientId: c.id })}
                      >
                        <Text style={styles.ptClientChipText}>{c.name}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            );
          })
        )}
      </ScrollView>

      <CreatePTModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        onCreated={() => {
          setShowModal(false);
          Alert.alert('Success', 'PT account created successfully.');
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: SPACING.md, paddingBottom: SPACING.xl },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md },
  pageTitle: { fontSize: FONTS.size.xl, fontWeight: '800', color: COLORS.dark },
  addBtn: {
    backgroundColor: COLORS.superAdmin, borderRadius: RADIUS.md, paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs,
  },
  addBtnText: { color: COLORS.white, fontWeight: '700', fontSize: FONTS.size.sm },

  emptyState: { alignItems: 'center', padding: SPACING.xl },
  emptyIcon: { fontSize: 48, marginBottom: SPACING.sm },
  emptyTitle: { fontSize: FONTS.size.lg, fontWeight: '700', color: COLORS.dark },
  emptyText: { color: COLORS.gray, fontSize: FONTS.size.sm, marginTop: SPACING.xs },

  ptCard: {
    backgroundColor: COLORS.card, borderRadius: RADIUS.lg, padding: SPACING.md,
    marginBottom: SPACING.md, ...SHADOW.sm,
  },
  ptCardTop: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.sm },
  ptAvatar: {
    width: 50, height: 50, borderRadius: 25, backgroundColor: COLORS.superAdmin,
    alignItems: 'center', justifyContent: 'center', marginRight: SPACING.sm,
  },
  ptAvatarText: { color: COLORS.white, fontSize: FONTS.size.lg, fontWeight: '700' },
  ptInfo: { flex: 1 },
  ptName: { fontWeight: '700', color: COLORS.dark, fontSize: FONTS.size.md },
  ptEmail: { color: COLORS.gray, fontSize: FONTS.size.sm },
  ptJoined: { color: COLORS.gray, fontSize: FONTS.size.xs },
  deleteBtn: {
    width: 30, height: 30, borderRadius: 15, backgroundColor: '#FFEBEE',
    alignItems: 'center', justifyContent: 'center',
  },
  deleteBtnText: { color: COLORS.danger, fontWeight: '700', fontSize: FONTS.size.sm },

  ptStats: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.sm },
  ptStatItem: {
    flex: 1, backgroundColor: COLORS.light, borderRadius: RADIUS.sm, padding: SPACING.sm, alignItems: 'center',
  },
  ptStatValue: { fontSize: FONTS.size.lg, fontWeight: '800', color: COLORS.dark },
  ptStatLabel: { fontSize: FONTS.size.xs, color: COLORS.gray },

  ptClientList: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.xs, alignItems: 'center' },
  ptClientListLabel: { fontSize: FONTS.size.xs, color: COLORS.gray, marginRight: 2 },
  ptClientChip: {
    backgroundColor: '#EDE7F6', borderRadius: RADIUS.round, paddingHorizontal: SPACING.sm, paddingVertical: 3,
  },
  ptClientChipText: { color: COLORS.superAdmin, fontSize: FONTS.size.xs, fontWeight: '600' },

  // Modal
  modal: { flex: 1, backgroundColor: COLORS.background },
  modalContent: { padding: SPACING.lg },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.lg },
  modalTitle: { fontSize: FONTS.size.xl, fontWeight: '800', color: COLORS.dark },
  modalClose: { fontSize: FONTS.size.xl, color: COLORS.gray, padding: SPACING.xs },
  label: { fontSize: FONTS.size.sm, fontWeight: '600', color: COLORS.darkGray, marginBottom: SPACING.xs },
  input: {
    backgroundColor: COLORS.card, borderRadius: RADIUS.sm, padding: SPACING.md,
    fontSize: FONTS.size.md, color: COLORS.dark, borderWidth: 1, borderColor: COLORS.border, marginBottom: SPACING.md,
  },
  submitBtn: {
    backgroundColor: COLORS.superAdmin, borderRadius: RADIUS.md, padding: SPACING.md,
    alignItems: 'center', marginTop: SPACING.sm,
  },
  submitBtnText: { color: COLORS.white, fontSize: FONTS.size.lg, fontWeight: '700' },
});
