import React from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from 'styled-components';
// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import UserModel from '../models/UserModel';

interface Props {
  user: UserModel;
  onLogout: () => void;
}

const Profil: React.FC<Props> = ({ user, onLogout }) => {
  const theme = useTheme();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      {/* Avatar */}
      <View style={styles.avatarSection}>
        <View style={[styles.avatarCircle, { backgroundColor: theme.purple }]}>
          <Text style={styles.avatarInitial}>
            {user.username?.charAt(0).toUpperCase() ?? '?'}
          </Text>
        </View>
        <Text style={[styles.username, { color: theme.foreground }]}>{user.username}</Text>
        <Text style={[styles.mail, { color: theme.secondary }]}>{user.mail}</Text>
      </View>

      {/* Info cards */}
      <View style={styles.cards}>
        <View style={[styles.card, { backgroundColor: theme.surface }]}>
          <InfoRow icon="weight-kilogram" label="Weight" value={`${user.weight} kg`} theme={theme} />
          <Divider theme={theme} />
          <InfoRow icon="human-male-height" label="Height" value={`${user.height} m`} theme={theme} />
          <Divider theme={theme} />
          <InfoRow icon="flag-checkered" label="Target weight" value={`${user.targetWeight} kg`} theme={theme} />
        </View>
      </View>

      {/* Logout */}
      <TouchableOpacity
        style={[styles.logoutBtn, { backgroundColor: `${theme.orange}18`, borderColor: `${theme.orange}40` }]}
        onPress={onLogout}
        activeOpacity={0.8}
      >
        <MaterialCommunityIcons name="logout" size={20} color={theme.orange} />
        <Text style={[styles.logoutText, { color: theme.orange }]}>Sign out</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const InfoRow = ({
  icon,
  label,
  value,
  theme,
}: {
  icon: string;
  label: string;
  value: string;
  theme: any;
}) => (
  <View style={styles.infoRow}>
    <MaterialCommunityIcons name={icon} size={20} color={theme.secondary} />
    <Text style={[styles.infoLabel, { color: theme.secondary }]}>{label}</Text>
    <Text style={[styles.infoValue, { color: theme.foreground }]}>{value}</Text>
  </View>
);

const Divider = ({ theme }: { theme: any }) => (
  <View style={[styles.divider, { backgroundColor: theme.border }]} />
);

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    paddingHorizontal: 20,
  },
  avatarSection: {
    alignItems: 'center',
    paddingTop: 40,
    marginBottom: 32,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  avatarInitial: {
    color: 'white',
    fontSize: 36,
    fontWeight: '700',
  },
  username: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 4,
  },
  mail: {
    fontSize: 15,
  },
  cards: {
    gap: 16,
  },
  card: {
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    gap: 12,
  },
  infoLabel: {
    flex: 1,
    fontSize: 15,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '600',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginLeft: 32,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    borderRadius: 16,
    borderWidth: 1.5,
    gap: 8,
    marginTop: 32,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Profil;
