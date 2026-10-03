import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    FlatList,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text, TextInput, TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DEFAULT_LOCATION, SRI_LANKA_CITIES } from '../data/cities';
import { colors } from '../styles/colors';

export default function EnergySetup() {
  const router = useRouter();

  const [systemSize, setSystemSize] = useState('');
  const [inverterBrand, setInverterBrand] = useState('');
  const [cebAccount, setCebAccount] = useState('');
  const [cebUnits, setCebUnits] = useState('');
  const [cebAmount, setCebAmount] = useState('');
  const [hasEV, setHasEV] = useState(false);

  // Location — installation site
  const [location, setLocation] = useState(null); // { name, lat, lon }
  const [showCityPicker, setShowCityPicker] = useState(false);

  const handleContinue = async () => {
    const finalLocation = location || DEFAULT_LOCATION;

    const setup = {
      systemSizeKW: parseFloat(systemSize) || 0,
      inverterBrand: inverterBrand.trim(),
      cebAccount: cebAccount.trim(),
      cebUnits: parseFloat(cebUnits) || 0,
      cebAmount: parseFloat(cebAmount) || 0,
      hasEV,
      location: {
        name: finalLocation.name,
        lat: finalLocation.lat,
        lon: finalLocation.lon,
      },
      completedAt: new Date().toISOString(),
    };

    try {
      await AsyncStorage.setItem('@ecowatt/setup', JSON.stringify(setup));
    } catch (e) {}
    router.replace('/(tabs)/dashboard');
  };

  const handleSkip = () => {
    router.replace('/(tabs)/dashboard');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.headerRow}>
            <View style={styles.headerIcon}>
              <MaterialIcons name="bolt" size={22} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.headerTitle}>Set up your energy profile</Text>
              <Text style={styles.headerSub}>Takes 1 minute • You can skip and edit later</Text>
            </View>
          </View>

          <View style={styles.progressWrap}>
            <View style={[styles.progressStep, styles.progressStepActive]} />
            <View style={styles.progressStep} />
            <View style={styles.progressStep} />
          </View>

          {/* Solar */}
          <Section icon="wb-sunny" title="Solar System" subtitle="From your inverter or installation paperwork">
            <Field label="SYSTEM SIZE (kW)" placeholder="e.g. 5" value={systemSize} onChangeText={setSystemSize} keyboardType="numeric" />
            <Field label="INVERTER BRAND" placeholder="e.g. Solis, Growatt" value={inverterBrand} onChangeText={setInverterBrand} />
          </Section>

          {/* Location — NEW */}
          <Section
            icon="location-on"
            title="Installation Location"
            subtitle="Used for solar weather analysis at the site"
          >
            <TouchableOpacity
              style={styles.locationPicker}
              onPress={() => setShowCityPicker(true)}
              activeOpacity={0.8}
            >
              <MaterialIcons name="place" size={20} color={colors.primary} />
              <Text style={styles.locationText}>
                {location ? location.name : 'Select your city'}
              </Text>
              <MaterialIcons name="chevron-right" size={22} color={colors.textMuted} />
            </TouchableOpacity>
            <Text style={styles.locationHint}>
              Weather is fetched for the solar installation site, not your current location.
            </Text>
          </Section>

          {/* CEB */}
          <Section icon="receipt-long" title="CEB Bill" subtitle="From your most recent electricity bill">
            <Field label="CEB ACCOUNT NUMBER" placeholder="Optional" value={cebAccount} onChangeText={setCebAccount} />
            <View style={styles.rowTwo}>
              <View style={{ flex: 1 }}>
                <Field label="UNITS (kWh)" placeholder="e.g. 245" value={cebUnits} onChangeText={setCebUnits} keyboardType="numeric" />
              </View>
              <View style={{ width: 12 }} />
              <View style={{ flex: 1 }}>
                <Field label="AMOUNT (Rs.)" placeholder="e.g. 7850" value={cebAmount} onChangeText={setCebAmount} keyboardType="numeric" />
              </View>
            </View>
          </Section>

          {/* EV */}
          <Section icon="ev-station" title="Electric Vehicle" subtitle="Do you charge an EV at home?">
            <View style={styles.toggleRow}>
              <TouchableOpacity
                style={[styles.toggleBtn, !hasEV && styles.toggleBtnActive]}
                onPress={() => setHasEV(false)}
                activeOpacity={0.85}
              >
                <Text style={[styles.toggleText, !hasEV && styles.toggleTextActive]}>No</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.toggleBtn, hasEV && styles.toggleBtnActive]}
                onPress={() => setHasEV(true)}
                activeOpacity={0.85}
              >
                <Text style={[styles.toggleText, hasEV && styles.toggleTextActive]}>Yes</Text>
              </TouchableOpacity>
            </View>
          </Section>

          <TouchableOpacity style={styles.button} onPress={handleContinue} activeOpacity={0.85}>
            <Text style={styles.buttonText}>Continue to Dashboard</Text>
            <MaterialIcons name="arrow-forward" size={20} color={colors.solarYellow} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.skipBtn} onPress={handleSkip}>
            <Text style={styles.skipText}>Skip for now</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* City Picker Modal */}
      <Modal visible={showCityPicker} transparent animationType="slide">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select installation city</Text>
              <TouchableOpacity onPress={() => setShowCityPicker(false)}>
                <MaterialIcons name="close" size={24} color={colors.textMuted} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={SRI_LANKA_CITIES}
              keyExtractor={(item) => item.name}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.cityRow}
                  onPress={() => {
                    setLocation(item);
                    setShowCityPicker(false);
                  }}
                  activeOpacity={0.7}
                >
                  <MaterialIcons name="place" size={20} color={colors.brandGreen} />
                  <Text style={styles.cityText}>{item.name}</Text>
                  {location?.name === item.name && (
                    <MaterialIcons name="check-circle" size={20} color={colors.brandGreen} />
                  )}
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function Section({ icon, title, subtitle, children }) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionIconWrap}>
          <MaterialIcons name={icon} size={18} color={colors.primary} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.sectionTitle}>{title}</Text>
          <Text style={styles.sectionSub}>{subtitle}</Text>
        </View>
      </View>
      <View style={{ gap: 12 }}>{children}</View>
    </View>
  );
}

function Field({ label, placeholder, value, onChangeText, keyboardType }) {
  return (
    <View>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType || 'default'}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.surface },
  scroll: { padding: 20, paddingBottom: 40 },

  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
  headerIcon: {
    width: 44, height: 44, borderRadius: 12, backgroundColor: '#BDEDA5',
    justifyContent: 'center', alignItems: 'center',
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: colors.primary, letterSpacing: -0.2 },
  headerSub: { fontSize: 12, color: colors.textMuted, marginTop: 2 },

  progressWrap: { flexDirection: 'row', gap: 6, marginBottom: 20 },
  progressStep: { flex: 1, height: 4, borderRadius: 999, backgroundColor: '#E2EAE0' },
  progressStepActive: { backgroundColor: colors.primary },

  section: {
    backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginBottom: 14,
    borderWidth: 1, borderColor: '#E2EAE0',
    shadowColor: '#043915', shadowOpacity: 0.04, shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 }, elevation: 2,
  },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 },
  sectionIconWrap: {
    width: 34, height: 34, borderRadius: 10, backgroundColor: '#F2F4F0',
    justifyContent: 'center', alignItems: 'center',
  },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: colors.primary },
  sectionSub: { fontSize: 11, color: colors.textMuted, marginTop: 1 },

  fieldLabel: { fontSize: 11, fontWeight: '600', color: colors.textMuted, letterSpacing: 1, marginBottom: 6 },
  input: {
    height: 48, backgroundColor: '#F8FAF6', borderRadius: 12,
    borderWidth: 1, borderColor: '#E2EAE0', paddingHorizontal: 14,
    fontSize: 15, color: colors.textPrimary,
  },
  rowTwo: { flexDirection: 'row' },

  locationPicker: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    height: 48, backgroundColor: '#F8FAF6', borderRadius: 12,
    borderWidth: 1, borderColor: '#E2EAE0', paddingHorizontal: 14,
  },
  locationText: { flex: 1, fontSize: 15, color: colors.textPrimary, fontWeight: '500' },
  locationHint: { fontSize: 10, color: colors.textMuted, marginTop: 6, lineHeight: 14 },

  toggleRow: { flexDirection: 'row', gap: 10 },
  toggleBtn: {
    flex: 1, height: 48, borderRadius: 12, borderWidth: 1.5,
    borderColor: '#E2EAE0', backgroundColor: '#F8FAF6',
    justifyContent: 'center', alignItems: 'center',
  },
  toggleBtnActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  toggleText: { fontSize: 14, fontWeight: '600', color: colors.textMuted },
  toggleTextActive: { color: '#FFFFFF' },

  button: {
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
    gap: 10, backgroundColor: colors.primary, height: 54,
    borderRadius: 14, marginTop: 4,
  },
  buttonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700', letterSpacing: 0.2 },

  skipBtn: { alignItems: 'center', paddingVertical: 16 },
  skipText: { fontSize: 13, color: colors.textMuted, fontWeight: '600' },

  // City Picker Modal
  modalBackdrop: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    maxHeight: '70%', paddingTop: 16,
  },
  modalHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingBottom: 12,
    borderBottomWidth: 1, borderBottomColor: '#E2EAE0',
  },
  modalTitle: { fontSize: 16, fontWeight: '700', color: colors.primary },
  cityRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingVertical: 14, paddingHorizontal: 20,
  },
  cityText: { flex: 1, fontSize: 15, color: colors.textPrimary, fontWeight: '500' },
  separator: { height: 1, backgroundColor: '#F2F4F0', marginLeft: 52 },
});