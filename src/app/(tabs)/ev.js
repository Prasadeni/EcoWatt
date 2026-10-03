import { MaterialIcons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import {
  Modal,
  ScrollView, StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Line } from 'react-native-svg';
import { evData, evModeData } from '../../data/realData';
import { colors } from '../../styles/colors';

const MODES = [
  { key: 'solar',  label: 'Solar Only' },
  { key: 'hybrid', label: 'Hybrid Eco' },
  { key: 'fast',   label: 'Fast Grid' },
];

export default function EV() {
  const [mode, setMode] = useState(evData.chargingMode);
  const [isCharging, setIsCharging] = useState(evData.isCharging);
  const [showModal, setShowModal] = useState(false);

  const packPercent = Math.max(0, Math.min(100, evData.batteryPercent));
  const targetPercent = Math.max(0, Math.min(100, evData.targetPercent));
  const deltaPercent = Math.max(0, targetPercent - packPercent);

  const m = useMemo(() => evModeData[mode], [mode]);

  // -------- Header status pill --------
  const statusPill = useMemo(() => {
    if (!evData.connected) {
      return { label: 'Disconnected', bg: '#E1E3DF', text: '#414940' };
    }
    if (isCharging) {
      return { label: `Charging • ${m.chargeRateKW} kW`, bg: '#043915', text: '#FFFFFF' };
    }
    return { label: 'Plugged In', bg: '#BDEDA5', text: '#043915' };
  }, [isCharging, m]);

  const handleConfirmStart = () => {
    setShowModal(false);
    setIsCharging(true);
  };

  const handleStop = () => {
    setIsCharging(false);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Header />
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Sub-header */}
        <View style={styles.subHeader}>
          <View style={{ flex: 1 }}>
            <Text style={styles.subTitle}>EV Energy Management</Text>
            <View style={styles.connectionRow}>
              <View style={styles.pulseDotOuter}>
                <View
                  style={[
                    styles.pulseDot,
                    isCharging && styles.pulseDotCharging,
                  ]}
                />
              </View>
              <Text style={styles.connectionText}>
                {evData.connected ? 'Connected' : 'Disconnected'} • {evData.chargerName} {evData.chargerMaxKW} kW
              </Text>
            </View>
          </View>
          <View style={[styles.pluggedPill, { backgroundColor: statusPill.bg }]}>
            <Text style={[styles.pluggedText, { color: statusPill.text }]}>
              {statusPill.label}
            </Text>
          </View>
        </View>

        {/* Charging live banner */}
        {isCharging && (
          <View style={styles.liveBanner}>
            <MaterialIcons name="bolt" size={20} color="#FFFFFF" />
            <View style={{ flex: 1 }}>
              <Text style={styles.liveTitle}>Charging in progress</Text>
              <Text style={styles.liveSub}>
                {m.chargeRateKW} kW • {m.label} • ETA {m.timeToTargetLabel}
              </Text>
            </View>
            <TouchableOpacity style={styles.liveStopBtn} onPress={handleStop}>
              <Text style={styles.liveStopText}>Stop</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Hero battery card */}
        <View style={styles.heroCard}>
          <View style={styles.heroTop}>
            <View style={{ flex: 1 }}>
              <Text style={styles.microLabel}>CURRENT STATE</Text>
              <View style={styles.bigRow}>
                <Text style={styles.bigValue}>{packPercent}</Text>
                <Text style={styles.bigUnit}>%</Text>
              </View>
              <View style={styles.rangeRow}>
                <MaterialIcons name="speed" size={18} color={colors.brandGreen} />
                <Text style={styles.rangeValue}>~{evData.estRangeKm} km</Text>
                <Text style={styles.rangeLabel}>est. range</Text>
              </View>
            </View>

            <BatteryGauge
              percent={packPercent}
              targetPercent={targetPercent}
            />
          </View>

          <View style={styles.saverBanner}>
            <MaterialIcons name="verified-user" size={20} color="#A4D38E" />
            <View style={{ flex: 1 }}>
              <Text style={styles.saverTitle}>
                Battery Saver Target: {targetPercent}%
              </Text>
              <Text style={styles.saverSub}>{evData.batterySaverNote}</Text>
            </View>
            <TouchableOpacity>
              <Text style={styles.saverAdjust}>Adjust</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Smart solar window */}
        <View style={styles.solarCard}>
          <View style={styles.solarRow}>
            <View style={styles.solarIconWrap}>
              <MaterialIcons name="solar-power" size={22} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.solarTopRow}>
                <Text style={styles.solarMicro}>SMART SOLAR WINDOW</Text>
                <View style={styles.optimalPill}>
                  <Text style={styles.optimalText}>{evData.smartWindow.status}</Text>
                </View>
              </View>
              <Text style={styles.solarTitle}>
                {evData.smartWindow.startLabel} – {evData.smartWindow.endLabel}
              </Text>
              <Text style={styles.solarNote}>
                Solar surplus of <Text style={styles.bold}>{evData.smartWindow.surplusKW} kW</Text> anticipated. {evData.smartWindow.note}
              </Text>
            </View>
          </View>
        </View>

        {/* Charging profile selector */}
        <Text style={styles.sectionLabel}>Charging Profile</Text>
        <View style={styles.modeBar}>
          {MODES.map((mm) => {
            const active = mode === mm.key;
            return (
              <TouchableOpacity
                key={mm.key}
                style={[styles.modeBtn, active && styles.modeBtnActive]}
                onPress={() => setMode(mm.key)}
                activeOpacity={0.85}
              >
                <Text style={[styles.modeText, active && styles.modeTextActive]}>
                  {mm.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Metrics grid — data changes with mode */}
        <View style={styles.metricsGrid}>
          <MetricTile
            label="Charge Rate"
            value={m.chargeRateKW.toString()}
            unit="kW"
            sub={m.label}
            subColor={colors.brandGreen}
            icon="power"
          />
          <MetricTile
            label="Time to Target"
            value={m.timeToTargetLabel}
            sub={`Target ${targetPercent}% (+${deltaPercent}%)`}
            icon="schedule"
          />
          <MetricTile
            label="Energy Needed"
            value={m.energyNeededKWh.toString()}
            unit="kWh"
            sub={`Pack ${evData.packCapacityKWh} kWh`}
            icon="battery-charging-full"
          />
          <MetricTile
            label="Est. Cost"
            value={`Rs. ${m.estCostRs}`}
            strike={m.estCostRs < evData.gridCostRs ? `Rs. ${evData.gridCostRs}` : null}
            sub={m.costLabel}
            subColor={colors.brandGreen}
            icon="payments"
          />
        </View>

        {/* Cost explanation strip */}
        <View style={styles.costNote}>
          <MaterialIcons name="info-outline" size={16} color={colors.textMuted} />
          <Text style={styles.costNoteText}>
            Grid charging costs Rs. {evData.gridCostRs}. Charging from solar surplus during the smart window saves Rs. {evData.gridCostRs - m.estCostRs}.
          </Text>
        </View>

        {/* Primary CTAs */}
        {!isCharging ? (
          <TouchableOpacity
            style={styles.primaryBtn}
            activeOpacity={0.85}
            onPress={() => setShowModal(true)}
          >
            <MaterialIcons name="bolt" size={20} color="#FFFFFF" />
            <Text style={styles.primaryBtnText}>Start Charging Now</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.stopBtn}
            activeOpacity={0.85}
            onPress={handleStop}
          >
            <MaterialIcons name="stop-circle" size={20} color="#FFFFFF" />
            <Text style={styles.primaryBtnText}>Stop Charging</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.secondaryBtn} activeOpacity={0.85}>
          <MaterialIcons name="calendar-today" size={20} color={colors.primary} />
          <Text style={styles.secondaryBtnText}>Schedule Smart Charge</Text>
        </TouchableOpacity>

        {/* Recent sessions */}
        <View style={styles.sessionsHeader}>
          <Text style={styles.sessionsTitle}>Recent Sessions</Text>
          <TouchableOpacity>
            <Text style={styles.viewLog}>View Log</Text>
          </TouchableOpacity>
        </View>

        {evData.sessions.map((s, i) => (
          <View key={i} style={styles.sessionCard}>
            <View style={styles.sessionLeft}>
              <View style={styles.sessionIconWrap}>
                <MaterialIcons name={s.icon} size={20} color={colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.sessionDate}>{s.dateLabel}</Text>
                <Text style={styles.sessionDetail}>
                  {s.energyKWh} kWh • {s.solarPercent}% Solar
                </Text>
              </View>
            </View>
            <View style={styles.sessionRight}>
              <Text style={styles.sessionSaved}>
                Saved Rs. {s.savedRs}
              </Text>
              <Text style={styles.sessionDuration}>{s.duration}</Text>
            </View>
          </View>
        ))}

        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Confirmation modal */}
      <Modal visible={showModal} transparent animationType="slide">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalGrabber} />

            <View style={styles.modalHeader}>
              <View style={styles.modalIconWrap}>
                <MaterialIcons name="electric-bolt" size={24} color={colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.modalTitle}>Start EV Charging?</Text>
                <Text style={styles.modalSub}>
                  {m.label} • {evData.smartWindow.surplusKW} kW solar surplus active
                </Text>
              </View>
            </View>

            <View style={styles.modalBody}>
              <ModalRow label="Charging Profile" value={m.label} />
              <ModalRow label="Charge Rate" value={`${m.chargeRateKW} kW`} />
              <ModalRow label="Target Battery State" value={`${targetPercent}% (+${deltaPercent}%)`} />
              <ModalRow label="Estimated Completion" value={m.timeToTargetLabel} />
              <ModalRow label="Estimated Energy" value={`${m.energyNeededKWh} kWh`} />
              <ModalRow
                label="Est. Session Cost"
                value={`Rs. ${m.estCostRs}.00`}
                highlight
              />
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancel}
                onPress={() => setShowModal(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalConfirm}
                onPress={handleConfirmStart}
              >
                <Text style={styles.modalConfirmText}>Confirm Start</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
          <Text style={styles.headerSub}>EV</Text>
        </View>
      </View>
      <View style={styles.headerRight}>
        <TouchableOpacity style={styles.iconBtn}>
          <MaterialIcons name="notifications-none" size={24} color={colors.textMuted} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconBtn}>
          <MaterialIcons name="person-outline" size={24} color={colors.textMuted} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

/* ---------------- BATTERY GAUGE ---------------- */
function BatteryGauge({ percent, targetPercent }) {
  const SIZE = 112;
  const STROKE = 9;
  const RADIUS = (SIZE - STROKE) / 2;
  const CIRC = 2 * Math.PI * RADIUS;
  const progress = percent / 100;
  const offset = CIRC * (1 - progress);

  const targetAngle = (targetPercent / 100) * 360;
  const angleRad = (targetAngle - 90) * (Math.PI / 180);
  const cx = SIZE / 2;
  const cy = SIZE / 2;
  const x1 = cx + (RADIUS - 2) * Math.cos(angleRad);
  const y1 = cy + (RADIUS - 2) * Math.sin(angleRad);
  const x2 = cx + (RADIUS + 6) * Math.cos(angleRad);
  const y2 = cy + (RADIUS + 6) * Math.sin(angleRad);

  return (
    <View style={{ width: SIZE, height: SIZE, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={SIZE} height={SIZE} style={{ transform: [{ rotate: '-90deg' }] }}>
        <Circle cx={cx} cy={cy} r={RADIUS} stroke="#E1E3DF" strokeWidth={STROKE} fill="transparent" />
        <Circle
          cx={cx} cy={cy} r={RADIUS}
          stroke={colors.brandGreen} strokeWidth={STROKE} fill="transparent"
          strokeDasharray={CIRC} strokeDashoffset={offset} strokeLinecap="round"
        />
      </Svg>
      <View style={{ position: 'absolute', width: SIZE, height: SIZE }}>
        <Svg width={SIZE} height={SIZE}>
          <Line
            x1={x1} y1={y1} x2={x2} y2={y2}
            stroke={colors.primary} strokeWidth={3} strokeLinecap="round"
          />
        </Svg>
      </View>
      <View style={styles.gaugeCenter}>
        <MaterialIcons name="bolt" size={26} color={colors.brandGreen} />
        <Text style={styles.gaugeLabel}>{targetPercent}% cap</Text>
      </View>
    </View>
  );
}

/* ---------------- METRIC TILE ---------------- */
function MetricTile({ label, value, unit, sub, subColor, strike, icon }) {
  return (
    <View style={styles.metricTile}>
      <View style={styles.metricTop}>
        <Text style={styles.metricLabel}>{label}</Text>
        <MaterialIcons name={icon} size={18} color={colors.textMuted} />
      </View>
      <View style={styles.metricValueRow}>
        <Text style={styles.metricValue}>{value}</Text>
        {unit ? <Text style={styles.metricUnit}>{unit}</Text> : null}
        {strike ? <Text style={styles.metricStrike}>{strike}</Text> : null}
      </View>
      {sub ? (
        <Text
          style={[styles.metricSub, subColor && { color: subColor, fontWeight: '600' }]}
          numberOfLines={1}
        >
          {sub}
        </Text>
      ) : null}
    </View>
  );
}

/* ---------------- MODAL ROW ---------------- */
function ModalRow({ label, value, highlight }) {
  return (
    <View style={styles.modalRow}>
      <Text style={styles.modalRowLabel}>{label}</Text>
      <Text style={[styles.modalRowValue, highlight && styles.modalRowHighlight]}>
        {value}
      </Text>
    </View>
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

  subHeader: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12, gap: 10,
  },
  subTitle: { fontSize: 18, fontWeight: '700', color: colors.primary, letterSpacing: -0.2 },
  connectionRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  pulseDotOuter: { width: 10, height: 10, justifyContent: 'center', alignItems: 'center' },
  pulseDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.brandGreen },
  pulseDotCharging: { backgroundColor: colors.primary },
  connectionText: { fontSize: 11, color: colors.textMuted, fontWeight: '500' },
  pluggedPill: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999 },
  pluggedText: { fontSize: 11, fontWeight: '700' },

  liveBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: colors.primary,
    marginHorizontal: 20, borderRadius: 14, padding: 14, marginBottom: 14,
  },
  liveTitle: { fontSize: 13, fontWeight: '700', color: '#FFFFFF' },
  liveSub: { fontSize: 11, color: '#BAF0BB', marginTop: 2 },
  liveStopBtn: {
    paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: 999, backgroundColor: '#FFFFFF',
  },
  liveStopText: { fontSize: 12, fontWeight: '700', color: colors.primary },

  heroCard: {
    backgroundColor: colors.surfaceCard,
    marginHorizontal: 20, borderRadius: 16, padding: 20,
    marginBottom: 14,
    shadowColor: '#043915', shadowOpacity: 0.05, shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 }, elevation: 2,
  },
  heroTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  microLabel: { fontSize: 10, fontWeight: '600', color: colors.textMuted, letterSpacing: 1 },
  bigRow: { flexDirection: 'row', alignItems: 'baseline', gap: 4, marginTop: 4 },
  bigValue: { fontSize: 34, fontWeight: '800', color: colors.primary, letterSpacing: -1 },
  bigUnit: { fontSize: 18, fontWeight: '600', color: colors.textMuted },
  rangeRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6 },
  rangeValue: { fontSize: 14, fontWeight: '600', color: colors.primary },
  rangeLabel: { fontSize: 11, color: colors.textMuted },

  gaugeCenter: { position: 'absolute', alignItems: 'center', justifyContent: 'center' },
  gaugeLabel: { fontSize: 10, fontWeight: '600', color: colors.textMuted, marginTop: 2 },

  saverBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: '#F2F4F0', borderRadius: 12,
    paddingHorizontal: 12, paddingVertical: 10, marginTop: 16,
  },
  saverTitle: { fontSize: 11, fontWeight: '700', color: colors.primary },
  saverSub: { fontSize: 10, color: colors.textMuted, marginTop: 1 },
  saverAdjust: { fontSize: 11, fontWeight: '700', color: colors.brandGreen },

  solarCard: {
    backgroundColor: '#C0F0A84D',
    marginHorizontal: 20, borderRadius: 16, padding: 16, marginBottom: 16,
  },
  solarRow: { flexDirection: 'row', gap: 12 },
  solarIconWrap: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#BDEDA5',
    justifyContent: 'center', alignItems: 'center',
  },
  solarTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  solarMicro: { fontSize: 10, fontWeight: '700', color: '#28501A', letterSpacing: 1 },
  optimalPill: {
    paddingHorizontal: 8, paddingVertical: 3,
    borderRadius: 999, backgroundColor: '#BAF0BB',
  },
  optimalText: { fontSize: 10, fontWeight: '700', color: '#002108' },
  solarTitle: { fontSize: 16, fontWeight: '700', color: '#042100', marginTop: 6 },
  solarNote: { fontSize: 12, color: colors.textMuted, marginTop: 6, lineHeight: 17 },
  bold: { fontWeight: '700', color: '#042100' },

  sectionLabel: {
    fontSize: 12, fontWeight: '600', color: colors.textMuted,
    paddingHorizontal: 20, marginBottom: 8,
  },
  modeBar: {
    flexDirection: 'row', marginHorizontal: 20,
    backgroundColor: '#E7E9E5', borderRadius: 12, padding: 4, marginBottom: 14,
  },
  modeBtn: {
    flex: 1, paddingVertical: 8, borderRadius: 8,
    alignItems: 'center', justifyContent: 'center',
  },
  modeBtnActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#043915', shadowOpacity: 0.06, shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 }, elevation: 2,
  },
  modeText: { fontSize: 12, fontWeight: '600', color: colors.textMuted },
  modeTextActive: { color: colors.primary },

  metricsGrid: {
    flexDirection: 'row', flexWrap: 'wrap',
    paddingHorizontal: 20, gap: 10, marginBottom: 12,
  },
  metricTile: {
    width: '48.5%',
    backgroundColor: colors.surfaceCard,
    borderRadius: 14, padding: 12,
    shadowColor: '#043915', shadowOpacity: 0.04, shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 }, elevation: 1,
  },
  metricTop: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 8,
  },
  metricLabel: { fontSize: 11, color: colors.textMuted, fontWeight: '500' },
  metricValueRow: { flexDirection: 'row', alignItems: 'baseline', gap: 4 },
  metricValue: { fontSize: 18, fontWeight: '700', color: colors.primary, letterSpacing: -0.3 },
  metricUnit: { fontSize: 11, color: colors.textMuted, marginLeft: 2 },
  metricStrike: {
    fontSize: 11, color: colors.textMuted,
    textDecorationLine: 'line-through', marginLeft: 4,
  },
  metricSub: { fontSize: 10, color: colors.textMuted, marginTop: 4 },

  costNote: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 8,
    marginHorizontal: 20, padding: 10,
    backgroundColor: '#F2F4F0', borderRadius: 10, marginBottom: 16,
  },
  costNoteText: { fontSize: 11, color: colors.textMuted, flex: 1, lineHeight: 15 },

  primaryBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, marginHorizontal: 20, height: 50,
    borderRadius: 999, backgroundColor: colors.primary, marginBottom: 10,
  },
  stopBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, marginHorizontal: 20, height: 50,
    borderRadius: 999, backgroundColor: '#BA1A1A', marginBottom: 10,
  },
  primaryBtnText: { fontSize: 14, fontWeight: '700', color: '#FFFFFF' },

  secondaryBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, marginHorizontal: 20, height: 50,
    borderRadius: 999, backgroundColor: '#BDEDA5', marginBottom: 20,
  },
  secondaryBtnText: { fontSize: 14, fontWeight: '700', color: colors.primary },

  sessionsHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingHorizontal: 20, marginBottom: 10,
  },
  sessionsTitle: { fontSize: 16, fontWeight: '700', color: colors.primary },
  viewLog: { fontSize: 12, fontWeight: '700', color: colors.brandGreen },

  sessionCard: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: colors.surfaceCard,
    marginHorizontal: 20, marginBottom: 8,
    borderRadius: 12, padding: 12,
    shadowColor: '#043915', shadowOpacity: 0.04, shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 }, elevation: 1,
  },
  sessionLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  sessionIconWrap: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#C0F0A880',
    justifyContent: 'center', alignItems: 'center',
  },
  sessionDate: { fontSize: 13, fontWeight: '600', color: colors.primary },
  sessionDetail: { fontSize: 11, color: colors.textMuted, marginTop: 2 },
  sessionRight: { alignItems: 'flex-end' },
  sessionSaved: { fontSize: 13, fontWeight: '700', color: colors.brandGreen },
  sessionDuration: { fontSize: 10, color: colors.textMuted, marginTop: 2 },

  modalBackdrop: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: 20, paddingTop: 12,
  },
  modalGrabber: {
    width: 48, height: 6, borderRadius: 3,
    backgroundColor: '#E1E3DF', alignSelf: 'center', marginBottom: 14,
  },
  modalHeader: { flexDirection: 'row', gap: 12, alignItems: 'center', marginBottom: 14 },
  modalIconWrap: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: '#BDEDA5',
    justifyContent: 'center', alignItems: 'center',
  },
  modalTitle: { fontSize: 16, fontWeight: '700', color: colors.primary },
  modalSub: { fontSize: 11, fontWeight: '600', color: colors.brandGreen, marginTop: 2 },
  modalBody: {
    backgroundColor: '#F2F4F0', borderRadius: 12, padding: 14, gap: 10,
    marginBottom: 16,
  },
  modalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  modalRowLabel: { fontSize: 12, color: colors.textMuted },
  modalRowValue: { fontSize: 12, fontWeight: '600', color: colors.primary },
  modalRowHighlight: { color: colors.brandGreen, fontWeight: '700' },

  modalActions: { flexDirection: 'row', gap: 10 },
  modalCancel: {
    flex: 1, height: 50, borderRadius: 999,
    backgroundColor: '#F2F4F0',
    justifyContent: 'center', alignItems: 'center',
  },
  modalCancelText: { fontSize: 14, fontWeight: '700', color: colors.primary },
  modalConfirm: {
    flex: 1, height: 50, borderRadius: 999,
    backgroundColor: colors.primary,
    justifyContent: 'center', alignItems: 'center',
  },
  modalConfirmText: { fontSize: 14, fontWeight: '700', color: '#FFFFFF' },
});