import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput,
  Alert, Modal, ActivityIndicator, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useData } from '../../context/DataContext';
import { TRAINING_PLAN } from '../../data/trainingPlan';
import { COLORS, FONTS, SPACING, RADIUS, SHADOW } from '../../theme';

const CreateClientModal = ({ visible, onClose, onCreated, pts }) => {
  const { createClient } = useData();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedPT, setSelectedPT] = useState(null);
  const [loading, setLoading] = useState(false);

  const reset = () => { setName(''); setEmail(''); setPassword(''); setSelectedPT(null); };

  const submit = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      Alert.alert('Missing fields', 'Please fill in name, email and password.');
      return;
    }
    setLoading(true);
    try {
      await createClient({ name: name.trim(), email: email.trim(), password, assignedPT: selectedPT });
      reset();
      onCreated();
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
            <Text style={styles.modalTitle}>Add Runner</Text>
            <TouchableOpacity onPress={() => { reset(); onClose(); }}>
              <Text style={styles.modalClose}>✕</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Full Name</Text>
          <TextInput style={styles.input} placeholder="e.g. Oliver Bennett" value={name} onChangeText={setName} placeholderTextColor={COLORS.gray} />

          <Text style={styles.label}>Email</Text>
          <TextInput style={styles.input} placeholder="oliver@example.com" value={email} onChangeText={setEmail}
            autoCapitalize="none" keyboardType="email-address" placeholderTextColor={COLORS.gray} />

          <Text style={styles.label}>Password</Text>
          <TextInput style={styles.input} placeholder="Temporary password" value={password}
            onChangeText={setPassword} secureTextEntry placeholderTextColor={COLORS.gray} />

          <Text style={styles.label}>Assign to PT (optional)</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: SPACING.md }}>
            <View style={styles.ptPickerRow}>
              <TouchableOpacity
                style={[styles.ptChip, !selectedPT && styles.ptChipSelected]}
                onPress={() => setSelectedPT(null)}
              >
                <Text style={[styles.ptChipText, !selectedPT && styles.ptChipTextSelected]}>Unassigned</Text>
              </TouchableOpacity>
              {pts.map((pt) => (
                <TouchableOpacity
                  key={pt.id}
                  style={[styles.ptChip, selectedPT === pt.id && styles.ptChipSelected]}
                  onPress={() => setSelectedPT(pt.id)}
                >
                  <Text style={[styles.ptChipText, selectedPT === pt.id && styles.ptChipTextSelected]}>
                    {pt.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          <TouchableOpacity style={[styles.submitBtn, loading && { opacity: 0.6 }]} onPress={submit} disabled={loading}>
            {loading ? <ActivityIndicator color={COLORS.white} /> : <Text style={styles.submitBtnText}>Create Runner Account</Text>}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const AssignPTModal = ({ visible, client, pts, onClose, onAssigned }) => {
  const { assignClientToPT } = useData();
  const [selected, setSelected] = useState(client?.assignedPT || null);
  const [loading, setLoading] = useState(false);

  const save = async () => {
    if (!selected) {
      Alert.alert('Select a PT', 'Please select a PT to assign this runner to.');
      return;
    }
    setLoading(true);
    try {
      await assignClientToPT(client.id, selected);
      onAssigned();
    } catch (_) {
      Alert.alert('Error', 'Could not assign PT. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="formSheet" onRequestClose={onClose}>
      <View style={styles.modal}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Assign PT</Text>
            <TouchableOpacity onPress={onClose}><Text style={styles.modalClose}>✕</Text></TouchableOpacity>
          </View>
          {client && <Text style={styles.assignSubtitle}>Select a PT for {client.name}</Text>}

          {pts.map((pt) => (
            <TouchableOpacity
              key={pt.id}
              style={[styles.ptOption, selected === pt.id && styles.ptOptionSelected]}
              onPress={() => setSelected(pt.id)}
            >
              <View style={styles.ptOptionAvatar}>
                <Text style={styles.ptOptionAvatarText}>{pt.avatar}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.ptOptionName, selected === pt.id && styles.ptOptionNameSelected]}>{pt.name}</Text>
                <Text style={styles.ptOptionEmail}>{pt.email}</Text>
              </View>
              {selected === pt.id && <Text style={styles.ptOptionCheck}>✓</Text>}
            </TouchableOpacity>
          ))}

          <TouchableOpacity style={[styles.submitBtn, { marginTop: SPACING.md }, loading && { opacity: 0.6 }]} onPress={save} disabled={loading}>
            {loading ? <ActivityIndicator color={COLORS.white} /> : <Text style={styles.submitBtnText}>Assign PT</Text>}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default function ManageClientsScreen({ navigation }) {
  const { getClients, getPTs, getAllFeedback, deleteClient } = useData();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [assignTarget, setAssignTarget] = useState(null);
  const [search, setSearch] = useState('');

  const clients = getClients();
  const pts = getPTs();
  const allFeedback = getAllFeedback();

  const filtered = clients.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (client) => {
    Alert.alert(
      'Remove Runner',
      `Remove ${client.name}? This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', style: 'destructive', onPress: () => deleteClient(client.id) },
      ]
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.topBar}>
          <Text style={styles.pageTitle}>Runners ({clients.length})</Text>
          <TouchableOpacity style={styles.addBtn} onPress={() => setShowCreateModal(true)}>
            <Text style={styles.addBtnText}>+ Add Runner</Text>
          </TouchableOpacity>
        </View>

        <TextInput
          style={styles.searchInput}
          placeholder="Search runners..."
          placeholderTextColor={COLORS.gray}
          value={search}
          onChangeText={setSearch}
        />

        {filtered.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🏃</Text>
            <Text style={styles.emptyTitle}>No runners yet</Text>
            <Text style={styles.emptyText}>Add your first runner to get started.</Text>
          </View>
        ) : (
          filtered.map((client) => {
            const assignedPT = pts.find((p) => p.id === client.assignedPT);
            const pct = Math.round(((client.completedSessions || []).length / TRAINING_PLAN.length) * 100);
            const clientFeedback = allFeedback.filter((f) => f.userId === client.id);
            const hasInjury = clientFeedback.some((f) => f.injuries && f.injuries.trim());

            return (
              <View key={client.id} style={styles.clientCard}>
                <View style={styles.clientTop}>
                  <View style={styles.clientAvatar}>
                    <Text style={styles.clientAvatarText}>{client.avatar}</Text>
                  </View>
                  <View style={styles.clientInfo}>
                    <View style={styles.clientNameRow}>
                      <Text style={styles.clientName}>{client.name}</Text>
                      {hasInjury && <Text style={styles.injuryBadge}>⚠️</Text>}
                    </View>
                    <Text style={styles.clientEmail}>{client.email}</Text>
                    <Text style={styles.clientPT}>
                      {assignedPT ? `PT: ${assignedPT.name}` : 'No PT assigned'}
                    </Text>
                    <Text style={styles.clientProgress}>
                      {(client.completedSessions || []).length}/{TRAINING_PLAN.length} sessions • {pct}%
                    </Text>
                  </View>
                  <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(client)}>
                    <Text style={styles.deleteBtnText}>✕</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.progressBarBg}>
                  <View style={[styles.progressBarFill, { width: `${pct}%` }]} />
                </View>

                <View style={styles.clientActions}>
                  <TouchableOpacity
                    style={styles.clientActionBtn}
                    onPress={() => navigation.navigate('ClientDetailAdmin', { clientId: client.id })}
                  >
                    <Text style={styles.clientActionText}>View Details</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.clientActionBtn, styles.clientActionBtnSecondary]}
                    onPress={() => setAssignTarget(client)}
                  >
                    <Text style={[styles.clientActionText, { color: COLORS.superAdmin }]}>
                      {assignedPT ? 'Change PT' : 'Assign PT'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>

      <CreateClientModal
        visible={showCreateModal}
        pts={pts}
        onClose={() => setShowCreateModal(false)}
        onCreated={() => {
          setShowCreateModal(false);
          Alert.alert('Success', 'Runner account created successfully.');
        }}
      />

      {assignTarget && (
        <AssignPTModal
          visible={!!assignTarget}
          client={assignTarget}
          pts={pts}
          onClose={() => setAssignTarget(null)}
          onAssigned={() => {
            setAssignTarget(null);
            Alert.alert('Success', 'PT assigned successfully.');
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: SPACING.md, paddingBottom: SPACING.xl },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.sm },
  pageTitle: { fontSize: FONTS.size.xl, fontWeight: '800', color: COLORS.dark },
  addBtn: {
    backgroundColor: COLORS.pt, borderRadius: RADIUS.md, paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs,
  },
  addBtnText: { color: COLORS.white, fontWeight: '700', fontSize: FONTS.size.sm },
  searchInput: {
    backgroundColor: COLORS.card, borderRadius: RADIUS.md, padding: SPACING.sm,
    fontSize: FONTS.size.sm, color: COLORS.dark, borderWidth: 1, borderColor: COLORS.border, marginBottom: SPACING.md,
  },

  emptyState: { alignItems: 'center', padding: SPACING.xl },
  emptyIcon: { fontSize: 48, marginBottom: SPACING.sm },
  emptyTitle: { fontSize: FONTS.size.lg, fontWeight: '700', color: COLORS.dark },
  emptyText: { color: COLORS.gray, fontSize: FONTS.size.sm, marginTop: SPACING.xs },

  clientCard: {
    backgroundColor: COLORS.card, borderRadius: RADIUS.lg, padding: SPACING.md,
    marginBottom: SPACING.md, ...SHADOW.sm,
  },
  clientTop: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: SPACING.sm },
  clientAvatar: {
    width: 46, height: 46, borderRadius: 23, backgroundColor: COLORS.pt,
    alignItems: 'center', justifyContent: 'center', marginRight: SPACING.sm,
  },
  clientAvatarText: { color: COLORS.white, fontWeight: '700', fontSize: FONTS.size.md },
  clientInfo: { flex: 1 },
  clientNameRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs },
  clientName: { fontWeight: '700', color: COLORS.dark, fontSize: FONTS.size.md },
  injuryBadge: { fontSize: 14 },
  clientEmail: { color: COLORS.gray, fontSize: FONTS.size.xs },
  clientPT: { color: COLORS.pt, fontSize: FONTS.size.xs, fontWeight: '600' },
  clientProgress: { color: COLORS.darkGray, fontSize: FONTS.size.xs, marginTop: 2 },
  deleteBtn: {
    width: 28, height: 28, borderRadius: 14, backgroundColor: '#FFEBEE',
    alignItems: 'center', justifyContent: 'center',
  },
  deleteBtnText: { color: COLORS.danger, fontWeight: '700', fontSize: FONTS.size.sm },

  progressBarBg: {
    height: 5, backgroundColor: COLORS.lightGray, borderRadius: RADIUS.round, overflow: 'hidden',
    marginBottom: SPACING.sm,
  },
  progressBarFill: { height: '100%', backgroundColor: COLORS.success, borderRadius: RADIUS.round },

  clientActions: { flexDirection: 'row', gap: SPACING.sm },
  clientActionBtn: {
    flex: 1, backgroundColor: COLORS.pt, borderRadius: RADIUS.md, padding: SPACING.xs + 2, alignItems: 'center',
  },
  clientActionBtnSecondary: {
    backgroundColor: '#EDE7F6',
  },
  clientActionText: { color: COLORS.white, fontWeight: '600', fontSize: FONTS.size.sm },

  // Modal
  modal: { flex: 1, backgroundColor: COLORS.background },
  modalContent: { padding: SPACING.lg },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.lg },
  modalTitle: { fontSize: FONTS.size.xl, fontWeight: '800', color: COLORS.dark },
  modalClose: { fontSize: FONTS.size.xl, color: COLORS.gray, padding: SPACING.xs },
  assignSubtitle: { color: COLORS.gray, fontSize: FONTS.size.sm, marginBottom: SPACING.md },
  label: { fontSize: FONTS.size.sm, fontWeight: '600', color: COLORS.darkGray, marginBottom: SPACING.xs },
  input: {
    backgroundColor: COLORS.card, borderRadius: RADIUS.sm, padding: SPACING.md,
    fontSize: FONTS.size.md, color: COLORS.dark, borderWidth: 1, borderColor: COLORS.border, marginBottom: SPACING.md,
  },
  ptPickerRow: { flexDirection: 'row', gap: SPACING.sm },
  ptChip: {
    paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs, borderRadius: RADIUS.round,
    borderWidth: 1.5, borderColor: COLORS.border, backgroundColor: COLORS.card,
  },
  ptChipSelected: { backgroundColor: COLORS.superAdmin, borderColor: COLORS.superAdmin },
  ptChipText: { color: COLORS.darkGray, fontSize: FONTS.size.sm, fontWeight: '600' },
  ptChipTextSelected: { color: COLORS.white },

  ptOption: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.card,
    borderRadius: RADIUS.md, padding: SPACING.md, marginBottom: SPACING.sm,
    borderWidth: 1.5, borderColor: COLORS.border,
  },
  ptOptionSelected: { borderColor: COLORS.superAdmin, backgroundColor: '#F3E5F5' },
  ptOptionAvatar: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.superAdmin,
    alignItems: 'center', justifyContent: 'center', marginRight: SPACING.sm,
  },
  ptOptionAvatarText: { color: COLORS.white, fontWeight: '700' },
  ptOptionName: { fontWeight: '600', color: COLORS.dark, fontSize: FONTS.size.md },
  ptOptionNameSelected: { color: COLORS.superAdmin },
  ptOptionEmail: { color: COLORS.gray, fontSize: FONTS.size.xs },
  ptOptionCheck: { color: COLORS.superAdmin, fontSize: FONTS.size.lg, fontWeight: '700' },

  submitBtn: {
    backgroundColor: COLORS.pt, borderRadius: RADIUS.md, padding: SPACING.md, alignItems: 'center',
  },
  submitBtnText: { color: COLORS.white, fontSize: FONTS.size.lg, fontWeight: '700' },
});
