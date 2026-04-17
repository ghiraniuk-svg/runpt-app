import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, Alert,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { COLORS, FONTS, SPACING, RADIUS, SHADOW } from '../../theme';

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Missing fields', 'Please enter your email and password.');
      return;
    }
    setLoading(true);
    try {
      await login(email.trim(), password);
    } catch (err) {
      Alert.alert('Login failed', err.message);
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (preset) => {
    const presets = {
      admin: { email: 'sarah@runpt.com', password: 'admin123' },
      pt: { email: 'james@runpt.com', password: 'pt123' },
      user: { email: 'oliver@example.com', password: 'user123' },
    };
    setEmail(presets[preset].email);
    setPassword(presets[preset].password);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoIcon}>🏃</Text>
          </View>
          <Text style={styles.appName}>Gops Running</Text>
          <Text style={styles.tagline}>Couch to 5K — Guided by your PT</Text>
        </View>

        {/* Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Sign in</Text>

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="you@example.com"
            placeholderTextColor={COLORS.gray}
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />

          <Text style={styles.label}>Password</Text>
          <View style={styles.passwordRow}>
            <TextInput
              style={[styles.input, styles.passwordInput]}
              placeholder="••••••••"
              placeholderTextColor={COLORS.gray}
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity
              style={styles.eyeBtn}
              onPress={() => setShowPassword((v) => !v)}
            >
              <Text style={styles.eyeText}>{showPassword ? '🙈' : '👁️'}</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.loginBtn, loading && styles.loginBtnDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <Text style={styles.loginBtnText}>Sign In</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Register link */}
        <TouchableOpacity style={styles.registerLink} onPress={() => navigation.navigate('Register')}>
          <Text style={styles.registerLinkText}>
            New runner? <Text style={styles.registerLinkBold}>Create an account</Text>
          </Text>
        </TouchableOpacity>

        {/* Demo accounts */}
        <View style={styles.demoSection}>
          <Text style={styles.demoTitle}>Demo accounts</Text>
          <View style={styles.demoRow}>
            <TouchableOpacity style={[styles.demoBtn, { borderColor: COLORS.superAdmin }]} onPress={() => fillDemo('admin')}>
              <Text style={[styles.demoBtnText, { color: COLORS.superAdmin }]}>Head PT</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.demoBtn, { borderColor: COLORS.pt }]} onPress={() => fillDemo('pt')}>
              <Text style={[styles.demoBtnText, { color: COLORS.pt }]}>PT</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.demoBtn, { borderColor: COLORS.primary }]} onPress={() => fillDemo('user')}>
              <Text style={[styles.demoBtnText, { color: COLORS.primary }]}>Runner</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scroll: { flexGrow: 1, padding: SPACING.md, justifyContent: 'center' },
  header: { alignItems: 'center', marginBottom: SPACING.md },
  logoCircle: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center',
    marginBottom: SPACING.sm,
    ...SHADOW.md,
  },
  logoIcon: { fontSize: 28 },
  appName: { fontSize: FONTS.size.xxl, fontWeight: '800', color: COLORS.secondary, letterSpacing: -0.5 },
  tagline: { fontSize: FONTS.size.sm, color: COLORS.gray, marginTop: 4, textAlign: 'center' },
  card: {
    backgroundColor: COLORS.card, borderRadius: RADIUS.lg, padding: SPACING.md,
    ...SHADOW.md, marginBottom: SPACING.md,
  },
  cardTitle: { fontSize: FONTS.size.lg, fontWeight: '700', color: COLORS.dark, marginBottom: SPACING.md },
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
  loginBtn: {
    backgroundColor: COLORS.primary, borderRadius: RADIUS.md, padding: SPACING.md,
    alignItems: 'center', marginTop: SPACING.sm,
  },
  loginBtnDisabled: { opacity: 0.6 },
  loginBtnText: { color: COLORS.white, fontSize: FONTS.size.lg, fontWeight: '700' },
  demoSection: { alignItems: 'center' },
  demoTitle: { fontSize: FONTS.size.sm, color: COLORS.gray, marginBottom: SPACING.sm },
  demoRow: { flexDirection: 'row', gap: SPACING.sm },
  demoBtn: {
    borderWidth: 1.5, borderRadius: RADIUS.round, paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
  },
  demoBtnText: { fontSize: FONTS.size.sm, fontWeight: '600' },
  registerLink: { alignItems: 'center', paddingVertical: SPACING.sm, marginBottom: SPACING.xs },
  registerLinkText: { fontSize: FONTS.size.sm, color: COLORS.gray },
  registerLinkBold: { color: COLORS.primary, fontWeight: '700' },
});
