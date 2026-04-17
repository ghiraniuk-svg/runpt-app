import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator,
} from 'react-native';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { COLORS, FONTS, SPACING, RADIUS, SHADOW } from '../../theme';

export default function RegisterScreen({ navigation }) {
  const { refreshUser } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const validate = () => {
    if (!name.trim()) return 'Please enter your full name.';
    if (!email.trim() || !email.includes('@')) return 'Please enter a valid email.';
    if (password.length < 6) return 'Password must be at least 6 characters.';
    if (password !== confirmPassword) return 'Passwords do not match.';
    return null;
  };

  const handleRegister = async () => {
    const err = validate();
    if (err) { setError(err); return; }

    setLoading(true);
    setError('');
    try {
      // Check email not already in use
      const { data: existing } = await supabase
        .from('users')
        .select('id')
        .eq('email', email.toLowerCase().trim())
        .maybeSingle();

      if (existing) {
        setError('An account with this email already exists.');
        setLoading(false);
        return;
      }

      const avatar = name.trim().split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
      const newUser = {
        id: `u${Date.now()}`,
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password,
        role: 'user',
        avatar,
        assigned_pt: null,
        completed_sessions: [],
        created_at: new Date().toISOString().split('T')[0],
      };

      const { error: insertError } = await supabase.from('users').insert([newUser]);
      if (insertError) throw new Error(insertError.message);

      // Auto-login
      const appUser = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        avatar: newUser.avatar,
        assignedPT: null,
        completedSessions: [],
        createdAt: newUser.created_at,
      };

      await refreshUser(appUser);
    } catch (e) {
      setError(e.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoIcon}>🏃</Text>
          </View>
          <Text style={styles.appName}>Gops Running</Text>
          <Text style={styles.tagline}>Create your runner account</Text>
        </View>

        {/* Form */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Create account</Text>

          {error ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>⚠️ {error}</Text>
            </View>
          ) : null}

          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Oliver Bennett"
            placeholderTextColor={COLORS.gray}
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="you@example.com"
            placeholderTextColor={COLORS.gray}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <Text style={styles.label}>Password</Text>
          <View style={styles.passwordRow}>
            <TextInput
              style={[styles.input, styles.passwordInput]}
              placeholder="Min. 6 characters"
              placeholderTextColor={COLORS.gray}
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowPassword(v => !v)}>
              <Text style={styles.eyeText}>{showPassword ? '🙈' : '👁️'}</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Confirm Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Repeat your password"
            placeholderTextColor={COLORS.gray}
            secureTextEntry={!showPassword}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />

          <TouchableOpacity
            style={[styles.registerBtn, loading && styles.btnDisabled]}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading
              ? <ActivityIndicator color={COLORS.white} />
              : <Text style={styles.registerBtnText}>Create Account</Text>}
          </TouchableOpacity>
        </View>

        {/* Back to login */}
        <TouchableOpacity style={styles.loginLink} onPress={() => navigation.goBack()}>
          <Text style={styles.loginLinkText}>Already have an account? <Text style={styles.loginLinkBold}>Sign in</Text></Text>
        </TouchableOpacity>

        <View style={styles.noteBox}>
          <Text style={styles.noteText}>
            💡 After registering, a Head PT will assign a Personal Trainer to your account.
          </Text>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scroll: { flexGrow: 1, padding: SPACING.md, justifyContent: 'center' },

  header: { alignItems: 'center', marginBottom: SPACING.sm },
  logoCircle: { width: 56, height: 56, borderRadius: 28, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.xs, ...SHADOW.md },
  logoIcon: { fontSize: 24 },
  appName: { fontSize: FONTS.size.xxl, fontWeight: '800', color: COLORS.secondary, letterSpacing: -0.5 },
  tagline: { fontSize: FONTS.size.sm, color: COLORS.gray, marginTop: 2, textAlign: 'center' },

  card: { backgroundColor: COLORS.card, borderRadius: RADIUS.lg, padding: SPACING.md, ...SHADOW.md, marginBottom: SPACING.sm },
  cardTitle: { fontSize: FONTS.size.lg, fontWeight: '700', color: COLORS.dark, marginBottom: SPACING.sm },

  errorBox: { backgroundColor: '#FFEBEE', borderRadius: RADIUS.sm, padding: SPACING.sm, marginBottom: SPACING.md, borderLeftWidth: 3, borderLeftColor: COLORS.danger },
  errorText: { color: COLORS.danger, fontSize: FONTS.size.sm },

  label: { fontSize: FONTS.size.sm, fontWeight: '600', color: COLORS.darkGray, marginBottom: SPACING.xs },
  input: {
    backgroundColor: COLORS.light, borderRadius: RADIUS.sm, padding: SPACING.sm,
    fontSize: FONTS.size.md, color: COLORS.dark, borderWidth: 1, borderColor: COLORS.border,
    marginBottom: SPACING.sm,
  },
  passwordRow: { position: 'relative' },
  passwordInput: { paddingRight: 50 },
  eyeBtn: { position: 'absolute', right: 12, top: 12 },
  eyeText: { fontSize: 18 },

  registerBtn: { backgroundColor: COLORS.primary, borderRadius: RADIUS.md, padding: SPACING.md, alignItems: 'center', marginTop: SPACING.xs },
  btnDisabled: { opacity: 0.6 },
  registerBtnText: { color: COLORS.white, fontSize: FONTS.size.lg, fontWeight: '700' },

  loginLink: { alignItems: 'center', padding: SPACING.sm },
  loginLinkText: { color: COLORS.gray, fontSize: FONTS.size.sm },
  loginLinkBold: { color: COLORS.primary, fontWeight: '700' },

  noteBox: { backgroundColor: '#E3F2FD', borderRadius: RADIUS.md, padding: SPACING.md, marginTop: SPACING.xs },
  noteText: { color: '#1565C0', fontSize: FONTS.size.xs, lineHeight: 18 },
});
