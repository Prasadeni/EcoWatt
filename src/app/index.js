import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Image, ImageBackground,
  KeyboardAvoidingView, Platform,
  ScrollView,
  StyleSheet,
  Text, TextInput, TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../styles/colors';

export default function AuthScreen() {
  const router = useRouter();
  const [mode, setMode] = useState('login');

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [remember, setRemember] = useState(true);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState('');

  const rules = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
  };
  const metCount = [rules.length, rules.upper, rules.number].filter(Boolean).length;
  const passwordsMatch = confirmPassword.length === 0 || password === confirmPassword;

  const handleSubmit = () => {
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please enter your email and password.');
      return;
    }

    if (!agreeTerms) {
      setError('Please accept the Privacy Policy and User Agreement.');
      return;
    }

    if (mode === 'register') {
      if (!fullName.trim()) {
        setError('Please enter your full name.');
        return;
      }
      if (metCount < 3) {
        setError('Password does not meet requirements.');
        return;
      }
      if (!passwordsMatch) {
        setError('Passwords do not match.');
        return;
      }
      router.replace('/setup');
    } else {
      router.replace('/(tabs)/dashboard');
    }
  };

  const switchMode = (m) => {
    setMode(m);
    setError('');
  };

  return (
    <ImageBackground
      source={require('../assets/images/login.jpg')}
      style={styles.bg}
      resizeMode="cover"
    >
      <View style={styles.overlay} />

      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        {/* Top bar */}
        <View style={styles.topBar}>
          <View style={styles.logoWrap}>
          <Image
            source={require('../assets/images/logo.png')}
            style={styles.logoImg}
            resizeMode="contain"
          />
          </View>
          <TouchableOpacity style={styles.langBtn}>
            <MaterialIcons name="language" size={18} color="#FFFFFF" />
            <Text style={styles.langText}>Language</Text>
          </TouchableOpacity>
        </View>

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            contentContainerStyle={styles.scroll}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Auth card */}
            <View style={styles.card}>
              {/* Tabs */}
              <View style={styles.tabRow}>
                <TouchableOpacity
                  style={[styles.tab, mode === 'login' && styles.tabActive]}
                  onPress={() => switchMode('login')}
                  activeOpacity={0.85}
                >
                  <Text style={[styles.tabText, mode === 'login' && styles.tabTextActive]}>
                    Sign In
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.tab, mode === 'register' && styles.tabActive]}
                  onPress={() => switchMode('register')}
                  activeOpacity={0.85}
                >
                  <Text style={[styles.tabText, mode === 'register' && styles.tabTextActive]}>
                    Register
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Error banner */}
              {error ? (
                <View style={styles.errorBanner}>
                  <MaterialIcons name="error-outline" size={16} color="#93000A" />
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              ) : null}

              {mode === 'register' && (
                <Field
                  icon="person-outline"
                  placeholder="Full Name"
                  value={fullName}
                  onChangeText={setFullName}
                />
              )}

              <Field
                icon="mail-outline"
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <Field
                icon="lock-outline"
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                rightIcon={showPassword ? 'visibility-off' : 'visibility'}
                onRightPress={() => setShowPassword(!showPassword)}
              />

              {mode === 'register' && password.length > 0 && (
                <View style={styles.rulesCard}>
                  <View style={styles.rulesHeader}>
                    <Text style={styles.rulesTitle}>PASSWORD STRENGTH</Text>
                    <Text
                      style={[styles.rulesCount, metCount === 3 && styles.rulesCountDone]}
                    >
                      {metCount}/3
                    </Text>
                  </View>
                  <View style={styles.barTrack}>
                    <View
                      style={[
                        styles.barFill,
                        { width: `${(metCount / 3) * 100}%` },
                        metCount === 3 && { backgroundColor: colors.brandGreen },
                      ]}
                    />
                  </View>
                  <RuleItem label="At least 8 characters" met={rules.length} />
                  <RuleItem label="One uppercase letter" met={rules.upper} />
                  <RuleItem label="One number" met={rules.number} />
                </View>
              )}

              {mode === 'register' && (
                <Field
                  icon="lock-reset"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirm}
                  rightIcon={showConfirm ? 'visibility-off' : 'visibility'}
                  onRightPress={() => setShowConfirm(!showConfirm)}
                />
              )}

              {mode === 'register' && !passwordsMatch && (
                <Text style={styles.matchError}>Passwords do not match</Text>
              )}

              <View style={styles.metaRow}>
                <TouchableOpacity
                  style={styles.checkboxRow}
                  onPress={() => setRemember(!remember)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.checkbox, remember && styles.checkboxActive]}>
                    {remember ? <MaterialIcons name="check" size={12} color="#FFFFFF" /> : null}
                  </View>
                  <Text style={styles.metaText}>Remember me</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                  <Text style={styles.forgotText}>Forgot Password?</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={styles.primaryBtn}
                onPress={handleSubmit}
                activeOpacity={0.85}
              >
                <Text style={styles.primaryBtnText}>
                  {mode === 'login' ? 'Login' : 'Create Account'}
                </Text>
                <MaterialIcons
                  name={mode === 'login' ? 'login' : 'arrow-forward'}
                  size={18}
                  color="#FFFFFF"
                  style={{ marginLeft: 6 }}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.termsRow}
                onPress={() => setAgreeTerms(!agreeTerms)}
                activeOpacity={0.7}
              >
                <View style={[styles.checkbox, agreeTerms && styles.checkboxActive]}>
                  {agreeTerms ? <MaterialIcons name="check" size={12} color="#FFFFFF" /> : null}
                </View>
                <Text style={styles.termsText}>
                  I agree to the{' '}
                  <Text style={styles.termsLink}>Privacy Policy</Text> and{' '}
                  <Text style={styles.termsLink}>User Agreement</Text>
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.toggleRow}
                onPress={() => switchMode(mode === 'login' ? 'register' : 'login')}
                activeOpacity={0.7}
              >
                <Text style={styles.toggleText}>
                  {mode === 'login' ? 'No Account? ' : 'Already registered? '}
                  <Text style={styles.toggleLink}>
                    {mode === 'login' ? 'Sign up' : 'Sign in'}
                  </Text>
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>

        <View style={styles.bottomRow}>
          <TouchableOpacity style={styles.bottomBtn}>
            <MaterialIcons name="wifi" size={14} color="#FFFFFF" />
            <Text style={styles.bottomText}>WiFi Configuration</Text>
          </TouchableOpacity>
          <View style={styles.bottomDivider} />
          <TouchableOpacity style={styles.bottomBtn}>
            <MaterialIcons name="offline-bolt" size={14} color="#FFFFFF" />
            <Text style={styles.bottomText}>Local Operation</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

/* ---------------- FIELD ---------------- */
function Field({
  icon, placeholder, value, onChangeText,
  secureTextEntry, keyboardType, autoCapitalize,
  rightIcon, onRightPress,
}) {
  return (
    <View style={styles.field}>
      <MaterialIcons name={icon} size={20} color={colors.textMuted} />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize || 'sentences'}
      />
      {rightIcon ? (
        <TouchableOpacity onPress={onRightPress} hitSlop={8}>
          <MaterialIcons name={rightIcon} size={20} color={colors.textMuted} />
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

/* ---------------- RULE ROW ---------------- */
function RuleItem({ label, met }) {
  return (
    <View style={styles.ruleRow}>
      <MaterialIcons
        name={met ? 'check-circle' : 'radio-button-unchecked'}
        size={14}
        color={met ? colors.brandGreen : colors.textMuted}
      />
      <Text style={[styles.ruleText, met && styles.ruleTextMet]}>{label}</Text>
    </View>
  );
}

/* ---------------- STYLES ---------------- */
const styles = StyleSheet.create({
  bg: { flex: 1 },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 10, 5, 0.5)',
  },
  safe: { flex: 1 },

  topBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 12,
  },
  logoImg: {
    width: 130, height: 40,
    tintColor: '#FFFFFF',
  },
  langBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  langText: { fontSize: 13, color: '#FFFFFF', fontWeight: '500' },

  scroll: {
    paddingHorizontal: 20, paddingBottom: 20,
    flexGrow: 1, justifyContent: 'center',
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20, padding: 20,
    shadowColor: '#000', shadowOpacity: 0.18, shadowRadius: 22,
    shadowOffset: { width: 0, height: 10 }, elevation: 8,
  },

  tabRow: {
    flexDirection: 'row',
    backgroundColor: '#F2F4F0',
    borderRadius: 12, padding: 4, marginBottom: 18,
  },
  tab: {
    flex: 1, paddingVertical: 10, borderRadius: 8,
    alignItems: 'center', justifyContent: 'center',
  },
  tabActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#043915', shadowOpacity: 0.06, shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 }, elevation: 2,
  },
  tabText: { fontSize: 13, fontWeight: '600', color: colors.textMuted },
  tabTextActive: { color: colors.primary },

  errorBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#FFDAD6', borderRadius: 10,
    padding: 10, marginBottom: 12,
  },
  errorText: { flex: 1, fontSize: 12, color: '#93000A', fontWeight: '500' },

  field: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: '#F2F4F0',
    borderRadius: 12, paddingHorizontal: 14,
    height: 52, marginBottom: 12,
  },
  input: { flex: 1, fontSize: 15, color: colors.textPrimary },

  rulesCard: {
    backgroundColor: '#F2F4F0',
    borderRadius: 12, padding: 12, marginBottom: 12, gap: 6,
  },
  rulesHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 4,
  },
  rulesTitle: {
    fontSize: 10, fontWeight: '700', color: colors.textMuted, letterSpacing: 0.5,
  },
  rulesCount: { fontSize: 10, color: colors.textMuted },
  rulesCountDone: { color: colors.brandGreen, fontWeight: '700' },
  barTrack: {
    height: 4, backgroundColor: '#E2EAE0', borderRadius: 999,
    overflow: 'hidden', marginBottom: 6,
  },
  barFill: { height: '100%', backgroundColor: colors.solarYellow, borderRadius: 999 },
  ruleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  ruleText: { fontSize: 11, color: colors.textMuted },
  ruleTextMet: { color: colors.deepPine, fontWeight: '600' },

  matchError: { color: '#BA1A1A', fontSize: 11, marginTop: -6, marginBottom: 10 },

  metaRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginTop: 4, marginBottom: 18,
  },
  checkboxRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  checkbox: {
    width: 18, height: 18, borderRadius: 4,
    borderWidth: 1.5, borderColor: '#C1C9BD',
    alignItems: 'center', justifyContent: 'center',
  },
  checkboxActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  metaText: { fontSize: 13, color: colors.textPrimary },
  forgotText: { fontSize: 13, color: colors.brandGreen, fontWeight: '600' },

  primaryBtn: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    borderRadius: 999, height: 52,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 16,
  },
  primaryBtnText: {
    fontSize: 15, fontWeight: '700', color: '#FFFFFF', letterSpacing: 0.3,
  },

  termsRow: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginBottom: 14,
  },
  termsText: { flex: 1, fontSize: 11, color: colors.textMuted, lineHeight: 15 },
  termsLink: { color: colors.brandGreen, fontWeight: '600' },

  toggleRow: { alignItems: 'center', paddingTop: 4 },
  toggleText: { fontSize: 13, color: colors.textMuted },
  toggleLink: { color: colors.brandGreen, fontWeight: '700' },

  bottomRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 20, paddingBottom: 10, gap: 16,
  },
  bottomBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  bottomText: { fontSize: 12, color: '#FFFFFF', fontWeight: '500' },
  bottomDivider: {
    width: 1, height: 14, backgroundColor: 'rgba(255,255,255,0.4)',
  },
});