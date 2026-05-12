import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTheme } from 'styled-components';
// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { authService } from '../services/AuthService';
import UserModel from '../models/UserModel';

interface Props {
  onRegisterSuccess: (user: UserModel) => void;
  onNavigateToLogin: () => void;
}

const Register: React.FC<Props> = ({ onRegisterSuccess, onNavigateToLogin }) => {
  const theme = useTheme();
  const [username, setUsername] = useState('');
  const [mail, setMail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validate = (): string => {
    if (!username.trim()) return 'Please enter a username.';
    if (!mail.trim()) return 'Please enter your email.';
    if (!/\S+@\S+\.\S+/.test(mail)) return 'Please enter a valid email address.';
    if (!password) return 'Please enter a password.';
    if (password.length < 6) return 'Password must be at least 6 characters.';
    if (password !== confirmPassword) return 'Passwords do not match.';
    return '';
  };

  const handleRegister = async () => {
    const validationError = validate();
    if (validationError) { setError(validationError); return; }
    setError('');
    setLoading(true);
    try {
      const user = await authService.register(username.trim(), mail.trim().toLowerCase(), password);
      onRegisterSuccess(user);
    } catch (e: any) {
      setError(e.message ?? 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Back button */}
          <TouchableOpacity style={styles.backBtn} onPress={onNavigateToLogin} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <MaterialCommunityIcons name="arrow-left" size={22} color={theme.secondary} />
            <Text style={[styles.backText, { color: theme.secondary }]}>Sign in</Text>
          </TouchableOpacity>

          {/* Branding */}
          <View style={styles.brandSection}>
            <View style={[styles.logoCircle, { backgroundColor: theme.main }]}>
              <MaterialCommunityIcons name="lightning-bolt" size={48} color="white" />
            </View>
            <Text style={[styles.appName, { color: theme.foreground }]}>Activities</Text>
          </View>

          {/* Form */}
          <View style={styles.formSection}>
            <Text style={[styles.formTitle, { color: theme.foreground }]}>Create your account</Text>
            <Text style={[styles.formSubtitle, { color: theme.secondary }]}>
              Start tracking your habits today
            </Text>

            {/* Username */}
            <View style={styles.fieldWrapper}>
              <Text style={[styles.fieldLabel, { color: theme.secondary }]}>Username</Text>
              <View style={[styles.inputRow, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <MaterialCommunityIcons name="account-outline" size={20} color={theme.secondary} />
                <TextInput
                  style={[styles.input, { color: theme.foreground }]}
                  placeholder="Your name"
                  placeholderTextColor={theme.secondary}
                  value={username}
                  onChangeText={v => { setUsername(v); setError(''); }}
                  autoCapitalize="words"
                  autoCorrect={false}
                  returnKeyType="next"
                />
              </View>
            </View>

            {/* Email */}
            <View style={styles.fieldWrapper}>
              <Text style={[styles.fieldLabel, { color: theme.secondary }]}>Email</Text>
              <View style={[styles.inputRow, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <MaterialCommunityIcons name="email-outline" size={20} color={theme.secondary} />
                <TextInput
                  style={[styles.input, { color: theme.foreground }]}
                  placeholder="your@email.com"
                  placeholderTextColor={theme.secondary}
                  value={mail}
                  onChangeText={v => { setMail(v); setError(''); }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="next"
                />
              </View>
            </View>

            {/* Password */}
            <View style={styles.fieldWrapper}>
              <Text style={[styles.fieldLabel, { color: theme.secondary }]}>Password</Text>
              <View style={[styles.inputRow, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <MaterialCommunityIcons name="lock-outline" size={20} color={theme.secondary} />
                <TextInput
                  style={[styles.input, { color: theme.foreground }]}
                  placeholder="At least 6 characters"
                  placeholderTextColor={theme.secondary}
                  value={password}
                  onChangeText={v => { setPassword(v); setError(''); }}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  returnKeyType="next"
                />
                <TouchableOpacity onPress={() => setShowPassword(v => !v)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                  <MaterialCommunityIcons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color={theme.secondary}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Confirm password */}
            <View style={styles.fieldWrapper}>
              <Text style={[styles.fieldLabel, { color: theme.secondary }]}>Confirm password</Text>
              <View style={[styles.inputRow, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <MaterialCommunityIcons name="lock-check-outline" size={20} color={theme.secondary} />
                <TextInput
                  style={[styles.input, { color: theme.foreground }]}
                  placeholder="Repeat your password"
                  placeholderTextColor={theme.secondary}
                  value={confirmPassword}
                  onChangeText={v => { setConfirmPassword(v); setError(''); }}
                  secureTextEntry={!showConfirm}
                  autoCapitalize="none"
                  returnKeyType="done"
                  onSubmitEditing={handleRegister}
                />
                <TouchableOpacity onPress={() => setShowConfirm(v => !v)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                  <MaterialCommunityIcons
                    name={showConfirm ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color={theme.secondary}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Error */}
            {error ? (
              <View style={[styles.errorBanner, { backgroundColor: `${theme.orange}18`, borderColor: `${theme.orange}40` }]}>
                <MaterialCommunityIcons name="alert-circle-outline" size={16} color={theme.orange} />
                <Text style={[styles.errorText, { color: theme.orange }]}>{error}</Text>
              </View>
            ) : null}

            {/* Register button */}
            <TouchableOpacity
              style={[styles.registerBtn, { backgroundColor: theme.main }, loading && { opacity: 0.7 }]}
              onPress={handleRegister}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <Text style={styles.registerBtnText}>Create Account</Text>
              )}
            </TouchableOpacity>

            {/* Security note */}
            <View style={styles.securityNote}>
              <MaterialCommunityIcons name="shield-check-outline" size={14} color={theme.secondary} />
              <Text style={[styles.securityText, { color: theme.secondary }]}>
                Password is encrypted with SHA-256 before being sent
              </Text>
            </View>

            {/* Login link */}
            <View style={styles.loginLink}>
              <Text style={[styles.loginLinkText, { color: theme.secondary }]}>Already have an account? </Text>
              <TouchableOpacity onPress={onNavigateToLogin}>
                <Text style={[styles.loginLinkAction, { color: theme.main }]}>Sign in</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1 },
  flex: { flex: 1 },
  container: {
    flexGrow: 1,
    paddingHorizontal: 28,
    paddingBottom: 40,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  backText: {
    fontSize: 15,
    fontWeight: '500',
  },
  brandSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 10,
  },
  appName: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  formSection: {
    gap: 0,
  },
  formTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 6,
  },
  formSubtitle: {
    fontSize: 14,
    marginBottom: 24,
  },
  fieldWrapper: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
    letterSpacing: 0.2,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    borderRadius: 16,
    borderWidth: 1.5,
    paddingHorizontal: 14,
    gap: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 0,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
  },
  errorText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '500',
  },
  registerBtn: {
    height: 56,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  registerBtnText: {
    color: 'white',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  securityNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 20,
  },
  securityText: {
    fontSize: 12,
  },
  loginLink: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  loginLinkText: {
    fontSize: 14,
  },
  loginLinkAction: {
    fontSize: 14,
    fontWeight: '700',
  },
});

export default Register;
