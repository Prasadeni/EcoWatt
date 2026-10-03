import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  ScrollView, StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { profileData } from '../../data/realData';
import { colors } from '../../styles/colors';

export default function Profile() {
  const router = useRouter();
  const [setup, setSetup] = useState(null);
  const [notifications, setNotifications] = useState(true);
  const [weeklyReport, setWeeklyReport] = useState(true);

  const loadSetup = useCallback(async () => {
    try {
      const raw = await AsyncStorage.getItem('@ecowatt/setup');
      if (raw) setSetup(JSON.parse(raw));
    } catch (e) {}
  }, []);

  useEffect(() => {
    loadSetup();
  }, [loadSetup]);

  const handleLogout = () => {
    Alert.alert(
      'Sign out',
      'Are you sure you want to sign out of EcoWatt?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign out',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('@ecowatt/setup');
            } catch (e) {}
            router.replace('/');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Header />
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <UserCard />

        <SetupSummary setup={setup} />

        <SectionTitle title="Connected Devices" />
        <View style={styles.deviceList}>
          {profileData.connectedDevices.map((d) => (
            <DeviceRow key={d.key} device={d} />
          ))}
        </View>

        <SectionTitle title="Preferences" />
        <View style={styles.prefCard}>
          <PrefRow
            icon="notifications-none"
            label="Notifications"
            sub="Alerts for solar drops, peak tariffs"
            value={notifications}
            onChange={setNotifications}
          />
          <View style={styles.divider} />
          <PrefRow
            icon="description"
            label="Weekly Energy Report"
            sub="Email summary every Sunday"
            value={weeklyReport}
            onChange={setWeeklyReport}
          />
        </View>

        <SectionTitle title="About" />
        <View style={styles.prefCard}>
          <LinkRow icon="info-outline" label="App version" value={profileData.appInfo.version} />
          <View style={styles.divider} />
          <LinkRow icon="star-outline" label="Built for" value={profileData.appInfo.build} />
          <View style={styles.divider} />
          <LinkRow
            icon="help-outline"
            label="Help & Support"
            onPress={() => Alert.alert('Support', 'Contact: team@ecowatt.app')}
          />
          <View style={styles.divider} />
          <LinkRow
            icon="privacy-tip"
            label="Privacy Policy"
            onPress={() => Alert.alert('Privacy', 'Your data stays on your device.')}
          />
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.85}>
          <MaterialIcons name="logout" size={20} color="#BA1A1A" />
          <Text style={styles.logoutText}>Sign out</Text>
        </TouchableOpacity>

        <Text style={styles.footer}>Team Nexora · Eminence 6.0 · 2026</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ---------------- HEADER ---------------- */
function Header() {
  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <View style={styles.headerLogo}>
          <MaterialIcons name="wb-sunny" size={22} color={colors.primary} />
        </View>
        <View>
          <Text style={styles.headerTitle}>EcoWatt</Text>
          <Text style={styles.headerSub}>Profile</Text>
        </View>
      </View>
      <View style={styles.headerRight}>
        <TouchableOpacity style={styles.iconBtn}>
          <MaterialIcons name="notifications-none" size={24} color={colors.textMuted} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

/* ---------------- USER CARD ---------------- */
function UserCard() {
  const { name, email } = profileData.user;
  return (
    <View style={styles.userCard}>
      <View style={styles.avatarWrap}>
        <MaterialIcons name="person" size={34} color={colors.primary} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.userName}>{name || 'EcoWatt User'}</Text>
        <Text style={styles.userEmail}>{email || 'Set up your profile'}</Text>
        <View style={styles.planPill}>
          <MaterialIcons name="verified" size={12} color="#002108" />
          <Text style={styles.planText}>Free Plan</Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.editBtn}
        onPress={() => Alert.alert('Edit Profile', 'Coming soon.')}
      >
        <MaterialIcons name="edit" size={18} color={colors.primary} />
      </TouchableOpacity>
    </View>
  );
}

/* ---------------- SETUP SUMMARY ---------------- */
function SetupSummary({ setup }) {
  if (!setup) {
    return (
      <View style={styles.setupCard}>
        <View style={styles.setupHeader}>
          <MaterialIcons name="tune" size={20} color={colors.primary} />
          <Text style={styles.setupTitle}>Energy Profile</Text>
        </View>
        <Text style={styles.setupHint}>
          You skipped setup. Tap below to configure your solar system and CEB bill.
        </Text>
        <TouchableOpacity style={styles.setupBtn}>
          <Text style={styles.setupBtnText}>Complete Setup</Text>
          <MaterialIcons name="arrow-forward" size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    );
  }

  const items = [
    {
      icon: 'solar-power',
      label: 'System size',
      value: setup.systemSizeKW ? `${setup.systemSizeKW} kW` : '—',
    },
    {
      icon: 'memory',
      label: 'Inverter',
      value: setup.inverterBrand || '—',
    },
    {
      icon: 'place',
      label: 'Installation site',
      value: setup.location?.name || '—',
    },
    {
      icon: 'receipt-long',
      label: 'Last CEB bill',
      value: setup.cebAmount ? `Rs. ${setup.cebAmount}` : '—',
    },
  ];

  return (
    <View style={styles.setupCard}>
      <View style={styles.setupHeader}>
        <MaterialIcons name="tune" size={20} color={colors.primary} />
        <Text style={styles.setupTitle}>Energy Profile</Text>
        <TouchableOpacity
          style={styles.setupEdit}
          onPress={() => Alert.alert('Edit Setup', 'Re-run setup from onboarding.')}
        >
          <Text style={styles.setupEditText}>Edit</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.setupGrid}>
        {items.map((it) => (
          <View key={it.label} style={styles.setupItem}>
            <View style={styles.setupItemIconWrap}>
              <MaterialIcons name={it.icon} size={16} color={colors.primary} />
            </View>
            <Text style={styles.setupItemLabel}>{it.label}</Text>
            <Text style={styles.setupItemValue} numberOfLines={1}>{it.value}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

/* ---------------- DEVICE ROW ---------------- */
function DeviceRow({ device }) {
  const statusStyles = {
    connected:    { bg: '#BDEDA5', text: '#043915', label: 'Connected' },
    disconnected: { bg: '#E1E3DF', text: '#414940', label: 'Offline' },
    manual:       { bg: '#FFFD8F', text: '#043915', label: 'Manual' },
  };
  const s = statusStyles[device.status] || statusStyles.disconnected;

  return (
    <View style={styles.deviceRow}>
      <View style={styles.deviceIconWrap}>
        <MaterialIcons name={device.icon} size={20} color={colors.primary} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.deviceName}>{device.name}</Text>
        <Text style={styles.deviceDetail}>{device.detail}</Text>
      </View>
      <View style={[styles.deviceBadge, { backgroundColor: s.bg }]}>
        <Text style={[styles.deviceBadgeText, { color: s.text }]}>{s.label}</Text>
      </View>
    </View>
  );
}

/* ---------------- SECTION + PREF ROWS ---------------- */
function SectionTitle({ title }) {
  return <Text style={styles.sectionTitle}>{title}</Text>;
}

function PrefRow({ icon, label, sub, value, onChange }) {
  return (
    <View style={styles.prefRow}>
      <View style={styles.prefIconWrap}>
        <MaterialIcons name={icon} size={20} color={colors.primary} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.prefLabel}>{label}</Text>
        {sub ? <Text style={styles.prefSub}>{sub}</Text> : null}
      </View>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: '#E1E3DF', true: colors.primary }}
        thumbColor="#FFFFFF"
      />
    </View>
  );
}

function LinkRow({ icon, label, value, onPress }) {
  return (
    <TouchableOpacity style={styles.prefRow} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.prefIconWrap}>
        <MaterialIcons name={icon} size={20} color={colors.primary} />
      </View>
      <Text style={[styles.prefLabel, { flex: 1 }]}>{label}</Text>
      {value ? <Text style={styles.prefValue}>{value}</Text> : null}
      <MaterialIcons name="chevron-right" size={20} color={colors.textMuted} />
    </TouchableOpacity>
  );
}

/* ---------------- STYLES ---------------- */
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.surface },
  scroll: { paddingBottom: 32 },

  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, height: 56,
    backgroundColor: colors.surfaceCard,
    borderBottomWidth: 1, borderBottomColor: colors.outline,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  headerLogo: {
    width: 34, height: 34, borderRadius: 10,
    backgroundColor: '#BDEDA5', justifyContent: 'center', alignItems: 'center',
  },
  headerTitle: { fontSize: 16, fontWeight: '700', color: colors.primary },
  headerSub: { fontSize: 11, color: colors.textMuted },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  iconBtn: { width: 44, height: 44, justifyContent: 'center', alignItems: 'center' },

  userCard: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: colors.surfaceCard,
    marginHorizontal: 20, marginTop: 16,
    borderRadius: 16, padding: 16, marginBottom: 14,
    shadowColor: '#043915', shadowOpacity: 0.05, shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 }, elevation: 2,
  },
  avatarWrap: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: '#BDEDA5',
    justifyContent: 'center', alignItems: 'center',
  },
  userName: { fontSize: 17, fontWeight: '700', color: colors.primary },
  userEmail: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  planPill: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    alignSelf: 'flex-start', marginTop: 8,
    backgroundColor: '#BAF0BB', paddingHorizontal: 8, paddingVertical: 3,
    borderRadius: 999,
  },
  planText: { fontSize: 10, fontWeight: '700', color: '#002108' },
  editBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#F2F4F0',
    justifyContent: 'center', alignItems: 'center',
  },

  setupCard: {
    backgroundColor: colors.surfaceCard,
    marginHorizontal: 20, borderRadius: 16, padding: 16, marginBottom: 16,
    shadowColor: '#043915', shadowOpacity: 0.05, shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 }, elevation: 2,
  },
  setupHeader: {
    flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12,
  },
  setupTitle: { fontSize: 14, fontWeight: '700', color: colors.primary, flex: 1 },
  setupEdit: {
    paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: 999, backgroundColor: '#F2F4F0',
  },
  setupEditText: { fontSize: 11, fontWeight: '700', color: colors.brandGreen },
  setupHint: { fontSize: 12, color: colors.textMuted, marginBottom: 12, lineHeight: 17 },
  setupBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, height: 44, borderRadius: 999,
    backgroundColor: colors.primary,
  },
  setupBtnText: { fontSize: 13, fontWeight: '700', color: '#FFFFFF' },

  setupGrid: {
    flexDirection: 'row', flexWrap: 'wrap',
    gap: 10,
  },
  setupItem: {
    width: '48.5%',
    backgroundColor: '#F2F4F0',
    borderRadius: 12, padding: 10,
  },
  setupItemIconWrap: {
    width: 24, height: 24, borderRadius: 8,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center', alignItems: 'center', marginBottom: 6,
  },
  setupItemLabel: { fontSize: 10, color: colors.textMuted },
  setupItemValue: { fontSize: 13, fontWeight: '700', color: colors.primary, marginTop: 2 },

  sectionTitle: {
    fontSize: 12, fontWeight: '700', color: colors.textMuted,
    paddingHorizontal: 20, letterSpacing: 1,
    textTransform: 'uppercase', marginBottom: 8,
  },

  deviceList: {
    backgroundColor: colors.surfaceCard,
    marginHorizontal: 20, borderRadius: 16, marginBottom: 16,
    shadowColor: '#043915', shadowOpacity: 0.05, shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 }, elevation: 2,
    overflow: 'hidden',
  },
  deviceRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 14, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: '#F2F4F0',
  },
  deviceIconWrap: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: '#F2F4F0',
    justifyContent: 'center', alignItems: 'center',
  },
  deviceName: { fontSize: 13, fontWeight: '700', color: colors.primary },
  deviceDetail: { fontSize: 11, color: colors.textMuted, marginTop: 2 },
  deviceBadge: {
    paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999,
  },
  deviceBadgeText: { fontSize: 10, fontWeight: '700' },

  prefCard: {
    backgroundColor: colors.surfaceCard,
    marginHorizontal: 20, borderRadius: 16, marginBottom: 16,
    shadowColor: '#043915', shadowOpacity: 0.05, shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 }, elevation: 2,
    overflow: 'hidden',
  },
  prefRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 14, paddingVertical: 12,
  },
  prefIconWrap: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: '#F2F4F0',
    justifyContent: 'center', alignItems: 'center',
  },
  prefLabel: { fontSize: 13, fontWeight: '600', color: colors.primary },
  prefSub: { fontSize: 11, color: colors.textMuted, marginTop: 2 },
  prefValue: { fontSize: 12, color: colors.textMuted, marginRight: 4 },
  divider: { height: 1, backgroundColor: '#F2F4F0', marginLeft: 62 },

  logoutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, marginHorizontal: 20, height: 50,
    borderRadius: 999, borderWidth: 1.5,
    borderColor: '#FFDAD6', backgroundColor: '#FFFFFF',
    marginTop: 4, marginBottom: 16,
  },
  logoutText: { fontSize: 14, fontWeight: '700', color: '#BA1A1A' },

  footer: {
    fontSize: 10, color: colors.textMuted,
    textAlign: 'center', letterSpacing: 0.3,
  },
});