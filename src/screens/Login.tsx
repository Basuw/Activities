import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTheme } from 'styled-components';
import Icon from '../components/Icon';
import { authService } from '../services/AuthService';
import UserModel from '../models/UserModel';

interface Props {
  onLoginSuccess: (user: UserModel) => void;
  onNavigateToRegister: () => void;
}

const Login: React.FC<Props> = ({ onLoginSuccess, onNavigateToRegister }) => {
  const theme = useTheme();
  const [mail, setMail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!mail.trim()) { setError('Please enter your email.'); return; }
    if (!password) { setError('Please enter your password.'); return; }
    setError('');
    setLoading(true);
    try {
      const user = await authService.login(mail.trim().toLowerCase(), password);
      onLoginSuccess(user);
    } catch (e: any) {
      setError(e.message ?? 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Logo / Branding */}
        <View style={styles.brandSection}>
          <View style={[styles.logoCircle, { backgroundColor: theme.main }]}>
            <Icon sfSymbol="bolt.fill" androidIcon="lightning-bolt" size={48} color="white" />
          </View>
          <Text style={[styles.appName, { color: theme.foreground }]}>Activities</Text>
          <Text style={[styles.tagline, { color: theme.secondary }]}>
            Track your habits, build your best self
          </Text>
        </View>

        {/* Form */}
        <View style={styles.formSection}>
          <Text style={[styles.formTitle, { color: theme.foreground }]}>Welcome back</Text>

          {/* Email field */}
          <View style={styles.fieldWrapper}>
            <Text style={[styles.fieldLabel, { color: theme.secondary }]}>Email</Text>
            <View
              style={[
                styles.inputRow,
                { backgroundColor: theme.surface, borderColor: error && !mail ? theme.orange : theme.border },
              ]}
            >
              <Icon sfSymbol="envelope" androidIcon="email-outline" size={20} color={theme.secondary} />
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

          {/* Password field */}
          <View style={styles.fieldWrapper}>
            <Text style={[styles.fieldLabel, { color: theme.secondary }]}>Password</Text>
            <View
              style={[
                styles.inputRow,
                { backgroundColor: theme.surface, borderColor: error && !password ? theme.orange : theme.border },
              ]}
            >
              <Icon sfSymbol="lock" androidIcon="lock-outline" size={20} color={theme.secondary} />
              <TextInput
                style={[styles.input, { color: theme.foreground }]}
                placeholder="Your password"
                placeholderTextColor={theme.secondary}
                value={password}
                onChangeText={v => { setPassword(v); setError(''); }}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                returnKeyType="done"
                onSubmitEditing={handleLogin}
              />
              <TouchableOpacity onPress={() => setShowPassword(v => !v)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <Icon
                  sfSymbol={showPassword ? 'eye.slash' : 'eye'}
                  androidIcon={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color={theme.secondary}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Error message */}
          {error ? (
            <View style={[styles.errorBanner, { backgroundColor: `${theme.orange}18`, borderColor: `${theme.orange}40` }]}>
              <Icon sfSymbol="exclamationmark.circle" androidIcon="alert-circle-outline" size={16} color={theme.orange} />
              <Text style={[styles.errorText, { color: theme.orange }]}>{error}</Text>
            </View>
          ) : null}

          {/* Login button */}
          <TouchableOpacity
            style={[styles.loginBtn, { backgroundColor: theme.main }, loading && { opacity: 0.7 }]}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <Text style={styles.loginBtnText}>Sign In</Text>
            )}
          </TouchableOpacity>

          {/* Security note */}
          <View style={styles.securityNote}>
            <Icon sfSymbol="checkmark.shield" androidIcon="shield-check-outline" size={14} color={theme.secondary} />
            <Text style={[styles.securityText, { color: theme.secondary }]}>
              Password is encrypted with SHA-256 before being sent
            </Text>
          </View>

          {/* Register link */}
          <View style={styles.registerLink}>
            <Text style={[styles.registerLinkText, { color: theme.secondary }]}>Don't have an account? </Text>
            <TouchableOpacity onPress={onNavigateToRegister}>
              <Text style={[styles.registerLinkAction, { color: theme.main }]}>Sign up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  brandSection: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logoCircle: {
    width: 88,
    height: 88,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 10,
  },
  appName: {
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  tagline: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
  formSection: {
    gap: 0,
  },
  formTitle: {
    fontSize: 22,
    fontWeight: '700',
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
  loginBtn: {
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
  loginBtnText: {
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
  registerLink: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  registerLinkText: {
    fontSize: 14,
  },
  registerLinkAction: {
    fontSize: 14,
    fontWeight: '700',
  },
});

export default Login;
