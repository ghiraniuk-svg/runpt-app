import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView, Modal,
} from 'react-native';
import { formatTime } from '../../data/trainingPlan';
import { COLORS, FONTS, SPACING, RADIUS, SHADOW } from '../../theme';

export default function RunSessionScreen({ route, navigation }) {
  const { session } = route.params;
  const intervals = session.intervals;

  const [currentIntervalIdx, setCurrentIntervalIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(intervals[0].duration);
  const [running, setRunning] = useState(false);
  const [finished, setFinished] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [showQuitModal, setShowQuitModal] = useState(false);
  const timerRef = useRef(null);
  const elapsedRef = useRef(null);

  const currentInterval = intervals[currentIntervalIdx];

  const stopTimers = useCallback(() => {
    clearInterval(timerRef.current);
    clearInterval(elapsedRef.current);
  }, []);

  useEffect(() => () => stopTimers(), [stopTimers]);

  const startTimers = () => {
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setCurrentIntervalIdx((idx) => {
            const nextIdx = idx + 1;
            if (nextIdx >= intervals.length) {
              clearInterval(timerRef.current);
              clearInterval(elapsedRef.current);
              setRunning(false);
              setFinished(true);
              return idx;
            }
            setTimeLeft(intervals[nextIdx].duration);
            return nextIdx;
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    elapsedRef.current = setInterval(() => setElapsed((e) => e + 1), 1000);
  };

  const start = () => { setRunning(true); startTimers(); };
  const pause = () => { setRunning(false); stopTimers(); };

  const goToPrevious = () => {
    if (currentIntervalIdx === 0) return;
    stopTimers();
    setRunning(false);
    const prevIdx = currentIntervalIdx - 1;
    setCurrentIntervalIdx(prevIdx);
    setTimeLeft(intervals[prevIdx].duration);
  };

  const skipNext = () => {
    const nextIdx = currentIntervalIdx + 1;
    if (nextIdx >= intervals.length) {
      // last interval — complete
      stopTimers();
      setRunning(false);
      setFinished(true);
      return;
    }
    stopTimers();
    setCurrentIntervalIdx(nextIdx);
    setTimeLeft(intervals[nextIdx].duration);
    if (running) {
      // restart timers for new interval
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setCurrentIntervalIdx((idx) => {
              const n = idx + 1;
              if (n >= intervals.length) {
                clearInterval(timerRef.current);
                clearInterval(elapsedRef.current);
                setRunning(false);
                setFinished(true);
                return idx;
              }
              setTimeLeft(intervals[n].duration);
              return n;
            });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  const completeSession = () => {
    stopTimers();
    setRunning(false);
    setFinished(true);
  };

  const handleQuit = () => { pause(); setShowQuitModal(true); };

  const totalDuration = intervals.reduce((a, i) => a + i.duration, 0);
  const elapsedBeforeCurrent = intervals.slice(0, currentIntervalIdx).reduce((a, i) => a + i.duration, 0);
  const progressPct = finished
    ? 100
    : Math.min(100, Math.round(((elapsedBeforeCurrent + (currentInterval.duration - timeLeft)) / totalDuration) * 100));

  const bgColor = finished
    ? COLORS.success
    : currentInterval.type === 'run'
    ? COLORS.primary
    : COLORS.secondary;

  // ── Finished screen ──────────────────────────────────────────────────────────
  if (finished) {
    return (
      <View style={[styles.container, { backgroundColor: COLORS.success }]}>
        <View style={styles.finishedContent}>
          <Text style={styles.finishedEmoji}>🎉</Text>
          <Text style={styles.finishedTitle}>Session Complete!</Text>
          <Text style={styles.finishedSub}>{session.title}</Text>
          <Text style={styles.finishedTime}>Total time: {formatTime(elapsed)}</Text>
          <TouchableOpacity
            style={styles.feedbackBtn}
            onPress={() => navigation.replace('Feedback', { session, duration: elapsed })}
          >
            <Text style={styles.feedbackBtnText}>Log Feedback →</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.skipFeedbackBtn} onPress={() => navigation.popToTop()}>
            <Text style={styles.skipFeedbackText}>Skip for now</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // ── Active session ────────────────────────────────────────────────────────────
  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>

      {/* Top bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={handleQuit} style={styles.quitBtn}>
          <Text style={styles.quitBtnText}>✕ Quit</Text>
        </TouchableOpacity>
        <Text style={styles.sessionLabel}>{session.title}</Text>
        <Text style={styles.elapsedText}>{formatTime(elapsed)}</Text>
      </View>

      {/* Progress bar */}
      <View style={styles.progressBarBg}>
        <View style={[styles.progressBarFill, { width: `${progressPct}%` }]} />
      </View>
      <Text style={styles.progressText}>{progressPct}% complete</Text>

      {/* Interval display */}
      <View style={styles.intervalDisplay}>
        <Text style={styles.intervalType}>
          {currentInterval.type === 'run' ? '🏃 RUN' : '🚶 WALK'}
        </Text>
        <Text style={styles.intervalLabel}>{currentInterval.label}</Text>
        <Text style={styles.timer}>{formatTime(timeLeft)}</Text>
        <Text style={styles.intervalCount}>
          Interval {currentIntervalIdx + 1} of {intervals.length}
        </Text>
      </View>

      {/* Next preview */}
      {currentIntervalIdx + 1 < intervals.length && (
        <View style={styles.nextPreview}>
          <Text style={styles.nextPreviewLabel}>Next:</Text>
          <Text style={styles.nextPreviewValue}>
            {intervals[currentIntervalIdx + 1].type === 'run' ? '🏃' : '🚶'}{' '}
            {intervals[currentIntervalIdx + 1].label} —{' '}
            {formatTime(intervals[currentIntervalIdx + 1].duration)}
          </Text>
        </View>
      )}

      {/* Primary controls: Previous | Play/Pause | Skip */}
      <View style={styles.controls}>
        {/* Previous */}
        <TouchableOpacity
          style={[styles.sideBtn, currentIntervalIdx === 0 && styles.sideBtnDisabled]}
          onPress={goToPrevious}
          disabled={currentIntervalIdx === 0}
        >
          <Text style={styles.sideBtnIcon}>⏮</Text>
          <Text style={styles.sideBtnLabel}>Prev</Text>
        </TouchableOpacity>

        {/* Play / Pause */}
        {!running ? (
          <TouchableOpacity style={styles.playBtn} onPress={start}>
            <Text style={styles.playBtnText}>{elapsed === 0 ? '▶ Start' : '▶ Resume'}</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.pauseBtn} onPress={pause}>
            <Text style={styles.pauseBtnText}>⏸ Pause</Text>
          </TouchableOpacity>
        )}

        {/* Skip / Next */}
        <TouchableOpacity style={styles.sideBtn} onPress={skipNext}>
          <Text style={styles.sideBtnIcon}>⏭</Text>
          <Text style={styles.sideBtnLabel}>
            {currentIntervalIdx + 1 >= intervals.length ? 'Finish' : 'Skip'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Complete button */}
      <TouchableOpacity style={styles.completeBtn} onPress={completeSession}>
        <Text style={styles.completeBtnText}>✓ Complete Session</Text>
      </TouchableOpacity>

      {/* Interval strip */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.strip}
        contentContainerStyle={styles.stripContent}
      >
        {intervals.map((interval, idx) => (
          <TouchableOpacity
            key={idx}
            onPress={() => {
              stopTimers();
              setRunning(false);
              setCurrentIntervalIdx(idx);
              setTimeLeft(interval.duration);
            }}
            style={[
              styles.stripItem,
              { backgroundColor: idx === currentIntervalIdx
                  ? COLORS.white
                  : idx < currentIntervalIdx
                  ? 'rgba(255,255,255,0.3)'
                  : 'rgba(255,255,255,0.1)' },
            ]}
          >
            <Text style={styles.stripItemIcon}>
              {interval.type === 'run' ? '🏃' : '🚶'}
            </Text>
            <Text style={[styles.stripItemTime, idx === currentIntervalIdx && styles.stripItemTimeCurrent]}>
              {formatTime(interval.duration)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Quit confirmation modal */}
      <Modal visible={showQuitModal} transparent animationType="fade" onRequestClose={() => setShowQuitModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Quit Session?</Text>
            <Text style={styles.modalMessage}>Your progress will not be saved.</Text>
            <View style={styles.modalBtns}>
              <TouchableOpacity style={styles.modalCancel} onPress={() => setShowQuitModal(false)}>
                <Text style={styles.modalCancelText}>Keep Going</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalQuit}
                onPress={() => { stopTimers(); navigation.goBack(); }}
              >
                <Text style={styles.modalQuitText}>Quit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50 },

  topBar: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: SPACING.md, marginBottom: SPACING.sm,
  },
  quitBtn: { padding: SPACING.xs },
  quitBtnText: { color: 'rgba(255,255,255,0.8)', fontSize: FONTS.size.sm },
  sessionLabel: { color: 'rgba(255,255,255,0.9)', fontSize: FONTS.size.xs, fontWeight: '600', flex: 1, textAlign: 'center' },
  elapsedText: { color: 'rgba(255,255,255,0.8)', fontSize: FONTS.size.sm, fontWeight: '600' },

  progressBarBg: { height: 4, backgroundColor: 'rgba(255,255,255,0.2)', marginHorizontal: SPACING.md },
  progressBarFill: { height: '100%', backgroundColor: COLORS.white, borderRadius: RADIUS.round },
  progressText: { color: 'rgba(255,255,255,0.7)', fontSize: FONTS.size.xs, textAlign: 'right', marginRight: SPACING.md, marginTop: 2 },

  intervalDisplay: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: SPACING.lg },
  intervalType: { color: COLORS.white, fontSize: FONTS.size.xl, fontWeight: '700', letterSpacing: 2, marginBottom: SPACING.sm },
  intervalLabel: { color: 'rgba(255,255,255,0.8)', fontSize: FONTS.size.md, marginBottom: SPACING.lg },
  timer: { color: COLORS.white, fontSize: 80, fontWeight: '900', letterSpacing: -2 },
  intervalCount: { color: 'rgba(255,255,255,0.6)', fontSize: FONTS.size.sm, marginTop: SPACING.sm },

  nextPreview: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm, backgroundColor: 'rgba(0,0,0,0.2)',
    marginHorizontal: SPACING.md, borderRadius: RADIUS.md, marginBottom: SPACING.md,
  },
  nextPreviewLabel: { color: 'rgba(255,255,255,0.6)', fontSize: FONTS.size.sm, marginRight: SPACING.xs },
  nextPreviewValue: { color: COLORS.white, fontSize: FONTS.size.sm, fontWeight: '600' },

  // Controls row
  controls: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.lg, marginBottom: SPACING.sm, paddingHorizontal: SPACING.md },
  sideBtn: { alignItems: 'center', padding: SPACING.sm },
  sideBtnDisabled: { opacity: 0.3 },
  sideBtnIcon: { color: COLORS.white, fontSize: 26 },
  sideBtnLabel: { color: 'rgba(255,255,255,0.7)', fontSize: FONTS.size.xs, marginTop: 2 },
  playBtn: {
    backgroundColor: COLORS.white, borderRadius: RADIUS.round,
    paddingHorizontal: SPACING.xl, paddingVertical: SPACING.md, ...SHADOW.md,
  },
  playBtnText: { color: COLORS.primary, fontSize: FONTS.size.xl, fontWeight: '800' },
  pauseBtn: {
    backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: RADIUS.round,
    paddingHorizontal: SPACING.xl, paddingVertical: SPACING.md,
    borderWidth: 2, borderColor: 'rgba(255,255,255,0.4)',
  },
  pauseBtnText: { color: COLORS.white, fontSize: FONTS.size.xl, fontWeight: '700' },

  // Complete button
  completeBtn: {
    marginHorizontal: SPACING.md, marginBottom: SPACING.sm, padding: SPACING.sm,
    borderRadius: RADIUS.md, backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)', alignItems: 'center',
  },
  completeBtnText: { color: COLORS.white, fontSize: FONTS.size.sm, fontWeight: '600' },

  // Strip
  strip: { maxHeight: 76 },
  stripContent: { paddingHorizontal: SPACING.md, gap: 6, paddingBottom: SPACING.md },
  stripItem: { borderRadius: RADIUS.sm, padding: 6, alignItems: 'center', minWidth: 50 },
  stripItemIcon: { fontSize: 12 },
  stripItemTime: { color: 'rgba(255,255,255,0.7)', fontSize: 10, marginTop: 2 },
  stripItemTimeCurrent: { color: COLORS.dark, fontWeight: '700' },

  // Finished
  finishedContent: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: SPACING.xl },
  finishedEmoji: { fontSize: 80, marginBottom: SPACING.md },
  finishedTitle: { color: COLORS.white, fontSize: FONTS.size.xxxl, fontWeight: '900', textAlign: 'center' },
  finishedSub: { color: 'rgba(255,255,255,0.8)', fontSize: FONTS.size.md, marginTop: SPACING.sm, textAlign: 'center' },
  finishedTime: { color: 'rgba(255,255,255,0.7)', fontSize: FONTS.size.sm, marginTop: SPACING.xs, marginBottom: SPACING.xl },
  feedbackBtn: {
    backgroundColor: COLORS.white, borderRadius: RADIUS.md, paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md, marginBottom: SPACING.md, width: '100%', alignItems: 'center',
  },
  feedbackBtnText: { color: COLORS.success, fontSize: FONTS.size.lg, fontWeight: '800' },
  skipFeedbackBtn: { padding: SPACING.sm },
  skipFeedbackText: { color: 'rgba(255,255,255,0.7)', fontSize: FONTS.size.sm },

  // Quit modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', alignItems: 'center', justifyContent: 'center' },
  modalBox: { backgroundColor: COLORS.white, borderRadius: RADIUS.lg, padding: SPACING.lg, width: '85%', maxWidth: 340 },
  modalTitle: { fontSize: FONTS.size.xl, fontWeight: '800', color: COLORS.dark, marginBottom: SPACING.xs },
  modalMessage: { fontSize: FONTS.size.sm, color: COLORS.gray, marginBottom: SPACING.lg },
  modalBtns: { flexDirection: 'row', gap: SPACING.sm },
  modalCancel: { flex: 1, padding: SPACING.md, borderRadius: RADIUS.md, backgroundColor: COLORS.light, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  modalCancelText: { color: COLORS.darkGray, fontWeight: '600' },
  modalQuit: { flex: 1, padding: SPACING.md, borderRadius: RADIUS.md, backgroundColor: COLORS.danger, alignItems: 'center' },
  modalQuitText: { color: COLORS.white, fontWeight: '700' },
});
