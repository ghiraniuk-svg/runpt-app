import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet,
  Alert, ActivityIndicator, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { formatTime } from '../../data/trainingPlan';
import { COLORS, FONTS, SPACING, RADIUS, SHADOW } from '../../theme';

const RatingPicker = ({ label, emoji, value, onChange, max = 5 }) => (
  <View style={styles.ratingSection}>
    <Text style={styles.ratingLabel}>{label}</Text>
    <View style={styles.ratingRow}>
      {Array.from({ length: max }, (_, i) => i + 1).map((n) => (
        <TouchableOpacity
          key={n}
          style={[styles.ratingBtn, value >= n && styles.ratingBtnActive]}
          onPress={() => onChange(n)}
        >
          <Text style={styles.ratingBtnText}>{emoji}</Text>
          <Text style={[styles.ratingBtnNum, value >= n && styles.ratingBtnNumActive]}>{n}</Text>
        </TouchableOpacity>
      ))}
    </View>
  </View>
);

export default function FeedbackScreen({ route, navigation }) {
  const { session, duration } = route.params;
  const { user } = useAuth();
  const { addFeedback, getUserById } = useData();

  const [rating, setRating] = useState(3);
  const [effort, setEffort] = useState(3);
  const [completed, setCompleted] = useState(true);
  const [notes, setNotes] = useState('');
  const [injuries, setInjuries] = useState('');
  const [loading, setLoading] = useState(false);

  const freshUser = getUserById(user.id) || user;

  const submit = async () => {
    setLoading(true);
    try {
      await addFeedback({
        userId: user.id,
        userName: user.name,
        sessionKey: `${session.week}-${session.session}`,
        week: session.week,
        session: session.session,
        rating,
        effort,
        completed,
        notes: notes.trim(),
        injuries: injuries.trim(),
        duration: duration || 0,
      });
      Alert.alert(
        'Feedback submitted!',
        injuries.trim()
          ? 'Your PT has been notified about your injury report.'
          : 'Great work! Your PT can see your session feedback.',
        [{ text: 'Back to home', onPress: () => navigation.popToTop() }]
      );
    } catch (err) {
      Alert.alert('Error', 'Could not save feedback. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Session Feedback</Text>
          <Text style={styles.subtitle}>{session.title}</Text>
          {duration > 0 && <Text style={styles.durationText}>Duration: {formatTime(duration)}</Text>}
        </View>

        {/* Completed toggle */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Did you complete the session?</Text>
          <View style={styles.toggleRow}>
            <TouchableOpacity
              style={[styles.toggleBtn, completed && styles.toggleBtnActive]}
              onPress={() => setCompleted(true)}
            >
              <Text style={[styles.toggleBtnText, completed && styles.toggleBtnTextActive]}>✓ Yes, completed</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggleBtn, !completed && styles.toggleBtnPartial]}
              onPress={() => setCompleted(false)}
            >
              <Text style={[styles.toggleBtnText, !completed && styles.toggleBtnTextActive]}>⚡ Partial</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Ratings */}
        <View style={styles.card}>
          <RatingPicker
            label="How did the run feel?"
            emoji="⭐"
            value={rating}
            onChange={setRating}
          />
          <View style={styles.ratingHints}>
            <Text style={styles.ratingHint}>1 = Very hard</Text>
            <Text style={styles.ratingHint}>5 = Easy / great</Text>
          </View>

          <View style={styles.divider} />

          <RatingPicker
            label="Effort level"
            emoji="💪"
            value={effort}
            onChange={setEffort}
          />
          <View style={styles.ratingHints}>
            <Text style={styles.ratingHint}>1 = Light</Text>
            <Text style={styles.ratingHint}>5 = Maximum</Text>
          </View>
        </View>

        {/* Notes */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>How did you feel? (optional)</Text>
          <TextInput
            style={styles.textArea}
            placeholder="e.g. Felt strong, breathing was good, enjoyed the route..."
            placeholderTextColor={COLORS.gray}
            multiline
            numberOfLines={4}
            value={notes}
            onChangeText={setNotes}
            textAlignVertical="top"
          />
        </View>

        {/* Injuries */}
        <View style={[styles.card, styles.injuryCard]}>
          <View style={styles.injuryHeader}>
            <Text style={styles.injuryIcon}>⚠️</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardLabel}>Injury / Discomfort Report</Text>
              <Text style={styles.injuryNote}>Your PT will be notified if you report anything here</Text>
            </View>
          </View>
          <TextInput
            style={styles.textArea}
            placeholder="e.g. Right knee aching, shin pain during last run interval..."
            placeholderTextColor={COLORS.gray}
            multiline
            numberOfLines={3}
            value={injuries}
            onChangeText={setInjuries}
            textAlignVertical="top"
          />
          {injuries.trim().length > 0 && (
            <View style={styles.injuryWarning}>
              <Text style={styles.injuryWarningText}>
                Your PT ({freshUser.assignedPT ? 'your assigned PT' : 'team'}) will be able to review this.
              </Text>
            </View>
          )}
        </View>

        {/* Submit */}
        <TouchableOpacity
          style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
          onPress={submit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <Text style={styles.submitBtnText}>Submit Feedback</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelBtn} onPress={() => navigation.popToTop()}>
          <Text style={styles.cancelBtnText}>Skip feedback</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.md, paddingBottom: SPACING.xl },
  header: { marginBottom: SPACING.lg },
  title: { fontSize: FONTS.size.xxl, fontWeight: '800', color: COLORS.dark },
  subtitle: { color: COLORS.gray, fontSize: FONTS.size.sm, marginTop: 2 },
  durationText: { color: COLORS.primary, fontSize: FONTS.size.sm, fontWeight: '600', marginTop: 4 },

  card: {
    backgroundColor: COLORS.card, borderRadius: RADIUS.lg, padding: SPACING.md,
    marginBottom: SPACING.md, ...SHADOW.sm,
  },
  cardLabel: { fontSize: FONTS.size.md, fontWeight: '700', color: COLORS.dark, marginBottom: SPACING.sm },

  toggleRow: { flexDirection: 'row', gap: SPACING.sm },
  toggleBtn: {
    flex: 1, padding: SPACING.sm, borderRadius: RADIUS.md, borderWidth: 1.5,
    borderColor: COLORS.border, alignItems: 'center',
  },
  toggleBtnActive: { backgroundColor: COLORS.success, borderColor: COLORS.success },
  toggleBtnPartial: { backgroundColor: COLORS.warning, borderColor: COLORS.warning },
  toggleBtnText: { fontSize: FONTS.size.sm, color: COLORS.darkGray, fontWeight: '600' },
  toggleBtnTextActive: { color: COLORS.white },

  ratingSection: { marginBottom: SPACING.sm },
  ratingLabel: { fontSize: FONTS.size.sm, fontWeight: '600', color: COLORS.darkGray, marginBottom: SPACING.xs },
  ratingRow: { flexDirection: 'row', gap: SPACING.sm },
  ratingBtn: {
    flex: 1, alignItems: 'center', padding: SPACING.sm, borderRadius: RADIUS.md,
    borderWidth: 1.5, borderColor: COLORS.border, backgroundColor: COLORS.light,
  },
  ratingBtnActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  ratingBtnText: { fontSize: 18 },
  ratingBtnNum: { fontSize: FONTS.size.xs, color: COLORS.gray, fontWeight: '600', marginTop: 2 },
  ratingBtnNumActive: { color: COLORS.white },
  ratingHints: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 2 },
  ratingHint: { fontSize: FONTS.size.xs, color: COLORS.gray },
  divider: { height: 1, backgroundColor: COLORS.border, marginVertical: SPACING.md },

  textArea: {
    backgroundColor: COLORS.light, borderRadius: RADIUS.sm, padding: SPACING.sm,
    fontSize: FONTS.size.sm, color: COLORS.dark, borderWidth: 1, borderColor: COLORS.border,
    minHeight: 90,
  },

  injuryCard: { borderWidth: 1, borderColor: '#FFB74D' },
  injuryHeader: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.sm },
  injuryIcon: { fontSize: 24, marginTop: -2 },
  injuryNote: { fontSize: FONTS.size.xs, color: COLORS.gray, marginTop: 2 },
  injuryWarning: {
    backgroundColor: '#FFF3E0', borderRadius: RADIUS.sm, padding: SPACING.xs, marginTop: SPACING.xs,
  },
  injuryWarningText: { color: '#E65100', fontSize: FONTS.size.xs },

  submitBtn: {
    backgroundColor: COLORS.primary, borderRadius: RADIUS.md, padding: SPACING.md,
    alignItems: 'center', marginBottom: SPACING.sm,
  },
  submitBtnDisabled: { opacity: 0.6 },
  submitBtnText: { color: COLORS.white, fontSize: FONTS.size.lg, fontWeight: '700' },
  cancelBtn: { alignItems: 'center', padding: SPACING.sm },
  cancelBtnText: { color: COLORS.gray, fontSize: FONTS.size.sm },
});
