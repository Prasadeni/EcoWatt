import { MaterialIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import {
  Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, {
  Circle,
  Defs,
  Line,
  LinearGradient,
  Path,
  Stop,
} from 'react-native-svg';
import { arrayStatus, periodData } from '../../data/realData';
import { colors } from '../../styles/colors';

const PERIODS = ['Today', 'Week', 'Month', 'Year'];

export default function Energy() {
  const [period, setPeriod] = useState('Week');
  const active = periodData[period];

  const [activePoint, setActivePoint] = useState(
    active.chart.find((d) => d.peak) || active.chart[0]
  );

  useEffect(() => {
    const peak = active.chart.find((d) => d.peak) || active.chart[0];
    setActivePoint(peak);
  }, [period]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Header />
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Title row */}
        <View style={styles.titleRow}>
          <View style={styles.titleLeft}>
            <Text style={styles.title}>Energy Analytics</Text>
            <View style={styles.liveChip}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>Live Sync</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.tuneBtn}>
            <MaterialIcons name="tune" size={20} color={colors.textMuted} />
          </TouchableOpacity>
        </View>
        <Text style={styles.subtitle}>
          Detailed breakdown of production, consumption & grid tariffs
        </Text>

        {/* Period toggle */}
        <View style={styles.periodBar}>
          {PERIODS.map((p) => {
            const isActive = period === p;
            return (
              <TouchableOpacity
                key={p}
                onPress={() => setPeriod(p)}
                style={[styles.periodBtn, isActive && styles.periodBtnActive]}
                activeOpacity={0.85}
              >
                <Text style={[styles.periodText, isActive && styles.periodTextActive]}>
                  {p}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Chart card */}
        <View style={styles.card}>
          <View style={styles.chartHeader}>
            <View>
              <Text style={styles.microLabel}>{active.heading}</Text>
              <View style={styles.metricRow}>
                <Text style={styles.metricHero}>{active.totalSolar.toFixed(1)}</Text>
                <Text style={styles.metricUnit}>{active.totalLabel}</Text>
              </View>
            </View>
            {active.changePercent !== 0 && (
              <View style={styles.deltaPill}>
                <MaterialIcons name="arrow-upward" size={16} color={colors.primary} />
                <Text style={styles.deltaText}>
                  +{active.changePercent.toFixed(1)}%
                </Text>
              </View>
            )}
          </View>

          {/* Solar area chart */}
          <SolarAreaChart
            data={active.chart}
            activeIndex={active.chart.findIndex((d) => d === activePoint)}
            onSelect={setActivePoint}
          />

          {/* Inspector toast */}
          <View style={styles.toast}>
            <View style={styles.toastLeft}>
              <MaterialIcons name="wb-sunny" size={18} color={colors.brandGreen} />
              <Text style={styles.toastText} numberOfLines={1}>
                {activePoint.label === activePoint.label.toUpperCase() && activePoint.label.length === 1
                  ? `${dayName(activePoint.label)}`
                  : activePoint.label}
                {activePoint.peak ? ' Peak' : ''}: {activePoint.value} kWh generated
              </Text>
            </View>
            <Text style={styles.toastTag}>
              {activePoint.peak ? 'Highest' : 'Normal'}
            </Text>
          </View>

          {/* Sub-metrics row */}
          <View style={styles.subMetricsRow}>
            <SubMetric
              label="Peak Output"
              value={`${active.peakValue} kW`}
              sub={active.peakLabel}
            />
            <SubMetric
              label="Daily Earning"
              value={`Rs. ${active.dailyEarning.toLocaleString()}`}
              sub="At CEB tariff"
            />
            <SubMetric
              label="Full Load Hours"
              value={`${active.fullLoadHours} h`}
              sub="Equivalent"
            />
          </View>

          {/* Legend */}
          <View style={styles.legendGrid}>
            <LegendTile color="#3F682F" label="Solar Made" value={`${active.totalSolar.toFixed(1)} kWh`} />
            <LegendTile color="#043915" label="Home Load" value={`${active.totalHome.toFixed(1)} kWh`} />
            <LegendTile color="#3396D3" label="Grid Import" value={`${active.gridImport} kWh`} />
            <LegendTile color="#A4D38E" label="Export Credit" value={`${active.gridExport} kWh`} />
          </View>
        </View>

        {/* Financial impact */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Financial Impact</Text>
          <Text style={styles.sectionHint}>Net Metering Act</Text>
        </View>
        <View style={styles.financeGrid}>
          <View style={styles.financeTile}>
            <Text style={styles.financeLabel}>Est. Bill</Text>
            <Text style={styles.financeValue}>
              Rs. {active.financials.estBillRs.toLocaleString()}
            </Text>
            <Text style={styles.financeNote}>Gross cost</Text>
          </View>
          <View style={[styles.financeTile, styles.financeTileSaved]}>
            <View style={styles.financeTopRow}>
              <Text style={styles.financeLabelGreen}>Saved</Text>
              <MaterialIcons name="eco" size={16} color={colors.primary} />
            </View>
            <Text style={styles.financeValueGreen}>
              Rs. {active.financials.savedRs.toLocaleString()}
            </Text>
            <Text style={styles.financeNoteGreen}>
              -{((active.financials.savedRs / Math.max(1, active.financials.estBillRs)) * 100).toFixed(1)}% offset
            </Text>
          </View>
          <View style={styles.financeTile}>
            <Text style={styles.financeLabel}>Net Pay</Text>
            <Text style={styles.financeValue}>
              Rs. {active.financials.netPayRs.toLocaleString()}
            </Text>
            <Text style={styles.financeNoteGreen2}>To utility</Text>
          </View>
        </View>

        {/* Telemetry tiles */}
        <View style={styles.telemetryGrid}>
          <View style={styles.telemetryTile}>
            <View style={styles.telemetryTop}>
              <Text style={styles.microLabel}>Peak Solar</Text>
              <MaterialIcons name="solar-power" size={18} color={colors.brandGreen} />
            </View>
            <Text style={styles.telemetryValue}>{active.telemetry.peakSolar.time}</Text>
            <Text style={styles.telemetryNoteGreen}>
              {active.telemetry.peakSolar.kW} kW max surge
            </Text>
            <Text style={styles.telemetrySub}>{active.telemetry.peakSolar.note}</Text>
          </View>

          <View style={styles.telemetryTile}>
            <View style={styles.telemetryTop}>
              <Text style={styles.microLabel}>Tariff Smartness</Text>
              <MaterialIcons name="schedule" size={18} color={colors.energyBlue} />
            </View>
            <Text style={styles.telemetryValue}>
              {active.telemetry.tariff.offPeakPercent}% Off-Peak
            </Text>
            <Text style={styles.telemetryNoteBlue}>{active.telemetry.tariff.note}</Text>
            <Text style={styles.telemetrySub}>
              Saves Rs. {active.telemetry.tariff.savingRs} vs standard
            </Text>
          </View>
        </View>

        {/* Array status */}
        <View style={styles.arrayCard}>
          <View style={{ flex: 1 }}>
            <View style={styles.arrayStatusRow}>
              <View style={styles.arrayDot} />
              <Text style={styles.arrayStatusText}>ARRAY STATUS</Text>
            </View>
            <Text style={styles.arrayTitle}>Rooftop {arrayStatus.sizeKW} kW Array</Text>
            <Text style={styles.arraySub}>
              {arrayStatus.panels} {arrayStatus.panelType} panels performing at {arrayStatus.healthPercent}% health.
            </Text>
          </View>
          <View style={styles.arrayIconWrap}>
            <MaterialIcons name="solar-power" size={32} color={colors.primary} />
          </View>
        </View>

        {/* Download button */}
        <TouchableOpacity
          style={styles.downloadBtn}
          activeOpacity={0.85}
          onPress={() =>
            Alert.alert(
              'Report',
              `In production, this would generate a PDF report from your ${period.toLowerCase()} data.`
            )
          }
        >
          <MaterialIcons name="description" size={20} color={colors.primary} />
          <Text style={styles.downloadText}>
            Download {period}ly Energy Report (PDF)
          </Text>
        </TouchableOpacity>
        <Text style={styles.downloadHint}>
          Includes net-metering log & audit trails
        </Text>

        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

/* ---------------- HELPERS ---------------- */
function dayName(label) {
  const map = { M: 'Monday', T: 'Tuesday', W: 'Wednesday', F: 'Friday', S: 'Saturday' };
  return map[label] || label;
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
          <Text style={styles.headerSub}>Energy</Text>
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

/* ---------------- SOLAR AREA CHART ---------------- */
function SolarAreaChart({ data, activeIndex, onSelect }) {
  const [layoutWidth, setLayoutWidth] = useState(320);
  const HEIGHT = 180;
  const PADDING = { left: 40, right: 12, top: 12, bottom: 24 };
  const chartW = layoutWidth - PADDING.left - PADDING.right;
  const chartH = HEIGHT - PADDING.top - PADDING.bottom;

  const maxValue = Math.max(1, ...data.map((d) => d.value));

  // Compute points
  const points = data.map((d, i) => ({
    x: PADDING.left + (i / Math.max(1, data.length - 1)) * chartW,
    y: PADDING.top + chartH - (d.value / maxValue) * chartH,
    ...d,
    originalIndex: i,
  }));

  // Build smooth SVG path
  let linePath = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i];
    const p1 = points[i + 1];
    const midX = (p0.x + p1.x) / 2;
    linePath += ` C ${midX} ${p0.y}, ${midX} ${p1.y}, ${p1.x} ${p1.y}`;
  }
  const baseY = PADDING.top + chartH;
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${baseY} L ${points[0].x} ${baseY} Z`;

  // Y axis grid values
  const yTicks = [0, maxValue * 0.5, maxValue];
  const activePoint = points[activeIndex];

  return (
    <View style={styles.chartContainer}>
      <View
        style={styles.chartInner}
        onLayout={(e) => setLayoutWidth(e.nativeEvent.layout.width)}
      >
        {/* Y-axis labels (left column) */}
        <View style={styles.yAxis}>
          {[...yTicks].reverse().map((v, i) => (
            <Text key={i} style={styles.yLabel}>
              {v.toFixed(1)}
            </Text>
          ))}
        </View>

        {/* SVG chart */}
        <View style={{ flex: 1, height: HEIGHT, position: 'relative' }}>
          <Svg width={layoutWidth - 48} height={HEIGHT}>
            <Defs>
              <LinearGradient id="solarGrad" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor="#E8A100" stopOpacity="0.55" />
                <Stop offset="1" stopColor="#E8A100" stopOpacity="0.03" />
              </LinearGradient>
            </Defs>

            {/* Grid lines */}
            {yTicks.map((v, i) => {
              const y = PADDING.top + chartH - (v / maxValue) * chartH;
              return (
                <Line
                  key={i}
                  x1={PADDING.left} y1={y}
                  x2={layoutWidth - 48 - PADDING.right} y2={y}
                  stroke="#E7E9E5" strokeWidth="1" strokeDasharray="3 3"
                />
              );
            })}

            {/* Area fill */}
            <Path d={areaPath} fill="url(#solarGrad)" />

            {/* Smooth line */}
            <Path
              d={linePath}
              stroke="#E8A100"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Active marker */}
            {activePoint && (
              <>
                <Line
                  x1={activePoint.x} y1={activePoint.y}
                  x2={activePoint.x} y2={baseY}
                  stroke="#E8A100" strokeWidth="1" strokeDasharray="2 3"
                />
                <Circle
                  cx={activePoint.x} cy={activePoint.y} r="5"
                  fill="#E8A100" stroke="#FFFFFF" strokeWidth="2"
                />
              </>
            )}

            {/* Peak marker */}
            {points.filter((p) => p.peak).map((p, i) => (
              <Circle
                key={i}
                cx={p.x} cy={p.y} r="4"
                fill="#FFFFFF" stroke="#E8A100" strokeWidth="2"
              />
            ))}
          </Svg>

          {/* Tap targets (invisible) */}
          <View style={styles.tapRow}>
            {data.map((d, i) => (
              <TouchableOpacity
                key={i}
                style={styles.tapTarget}
                onPress={() => onSelect(d)}
              />
            ))}
          </View>
        </View>
      </View>

      {/* X-axis labels */}
      <View style={styles.xAxis}>
        {data.map((d, i) => {
          const active = i === activeIndex;
          return (
            <TouchableOpacity key={i} onPress={() => onSelect(d)} style={styles.xItem}>
              <Text style={[styles.xLabel, active && styles.xLabelActive]}>
                {d.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

/* ---------------- SUB-METRIC ---------------- */
function SubMetric({ label, value, sub }) {
  return (
    <View style={styles.subMetric}>
      <Text style={styles.subMetricLabel}>{label}</Text>
      <Text style={styles.subMetricValue}>{value}</Text>
      <Text style={styles.subMetricSub}>{sub}</Text>
    </View>
  );
}

/* ---------------- LEGEND TILE ---------------- */
function LegendTile({ color, label, value }) {
  return (
    <View style={styles.legendTile}>
      <View style={styles.legendLeft}>
        <View style={[styles.legendDot, { backgroundColor: color }]} />
        <Text style={styles.legendLabel} numberOfLines={1}>{label}</Text>
      </View>
      <Text style={styles.legendValue}>{value}</Text>
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

  titleRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: 16,
  },
  titleLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  title: { fontSize: 22, fontWeight: '700', color: colors.primary, letterSpacing: -0.3 },
  liveChip: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 8, paddingVertical: 3,
    borderRadius: 999, backgroundColor: '#BDEDA5',
  },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.brandGreen },
  liveText: { fontSize: 10, fontWeight: '600', color: colors.primary },
  tuneBtn: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: '#F2F4F0',
    justifyContent: 'center', alignItems: 'center',
  },
  subtitle: {
    fontSize: 12, color: colors.textMuted,
    paddingHorizontal: 20, marginTop: 4, marginBottom: 14,
  },

  periodBar: {
    flexDirection: 'row', marginHorizontal: 20,
    backgroundColor: '#E7E9E5', borderRadius: 12, padding: 4, marginBottom: 14,
  },
  periodBtn: {
    flex: 1, paddingVertical: 8, borderRadius: 8,
    alignItems: 'center', justifyContent: 'center',
  },
  periodBtnActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#043915', shadowOpacity: 0.06, shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 }, elevation: 2,
  },
  periodText: { fontSize: 12, fontWeight: '600', color: colors.textMuted },
  periodTextActive: { color: colors.primary },

  card: {
    backgroundColor: colors.surfaceCard,
    marginHorizontal: 20, borderRadius: 16, padding: 16, marginBottom: 14,
    shadowColor: '#043915', shadowOpacity: 0.05, shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 }, elevation: 2,
  },
  chartHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'flex-start', marginBottom: 12,
  },
  microLabel: {
    fontSize: 10, fontWeight: '600', color: colors.textMuted, letterSpacing: 1,
  },
  metricRow: { flexDirection: 'row', alignItems: 'baseline', gap: 6, marginTop: 2 },
  metricHero: { fontSize: 26, fontWeight: '700', color: colors.primary, letterSpacing: -0.5 },
  metricUnit: { fontSize: 12, color: colors.textMuted },
  deltaPill: {
    flexDirection: 'row', alignItems: 'center', gap: 2,
    paddingHorizontal: 10, paddingVertical: 5,
    borderRadius: 999, backgroundColor: '#C0F0A8',
  },
  deltaText: { fontSize: 11, fontWeight: '700', color: colors.primary },

  chartContainer: { marginBottom: 8 },
  chartInner: { flexDirection: 'row' },
  yAxis: {
    width: 40, justifyContent: 'space-between',
    paddingTop: 12, paddingBottom: 24,
  },
  yLabel: { fontSize: 9, color: '#C1C9BD', textAlign: 'right' },
  tapRow: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row', paddingLeft: 40, paddingRight: 12,
  },
  tapTarget: { flex: 1 },
  xAxis: {
    flexDirection: 'row', paddingLeft: 40, paddingRight: 12, marginTop: -18,
  },
  xItem: { flex: 1, alignItems: 'center' },
  xLabel: { fontSize: 10, color: colors.textMuted, fontWeight: '500' },
  xLabelActive: { color: colors.primary, fontWeight: '700' },

  toast: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#F2F4F0', paddingHorizontal: 12, paddingVertical: 10,
    borderRadius: 12, marginBottom: 12, gap: 8, marginTop: 8,
  },
  toastLeft: { flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 },
  toastText: { fontSize: 12, color: colors.primary, fontWeight: '500', flex: 1 },
  toastTag: { fontSize: 10, fontWeight: '600', color: colors.brandGreen },

  subMetricsRow: {
    flexDirection: 'row', gap: 8, marginBottom: 12,
  },
  subMetric: {
    flex: 1, backgroundColor: '#F2F4F0', borderRadius: 10, padding: 10,
  },
  subMetricLabel: { fontSize: 9, color: colors.textMuted, fontWeight: '600', letterSpacing: 0.5 },
  subMetricValue: { fontSize: 14, fontWeight: '700', color: colors.primary, marginTop: 4 },
  subMetricSub: { fontSize: 9, color: colors.textMuted, marginTop: 2 },

  legendGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  legendTile: {
    flexBasis: '48.5%', flexGrow: 1,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#F2F4F0', borderRadius: 10, padding: 10, gap: 6,
  },
  legendLeft: { flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendLabel: { fontSize: 11, color: colors.primary, flex: 1 },
  legendValue: { fontSize: 11, fontWeight: '700', color: colors.primary },

  sectionHeaderRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingHorizontal: 20, marginBottom: 8,
  },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.primary },
  sectionHint: { fontSize: 11, color: colors.textMuted },

  financeGrid: {
    flexDirection: 'row', gap: 8, paddingHorizontal: 20, marginBottom: 14,
  },
  financeTile: {
    flex: 1, backgroundColor: colors.surfaceCard,
    borderRadius: 12, padding: 12, gap: 4,
    shadowColor: '#043915', shadowOpacity: 0.04, shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 }, elevation: 1,
  },
  financeTileSaved: { backgroundColor: '#BDEDA5' },
  financeTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  financeLabel: { fontSize: 10, color: colors.textMuted },
  financeLabelGreen: { fontSize: 10, fontWeight: '700', color: colors.primary },
  financeValue: { fontSize: 14, fontWeight: '700', color: colors.primary },
  financeValueGreen: { fontSize: 14, fontWeight: '800', color: colors.primary },
  financeNote: { fontSize: 9, color: colors.textMuted },
  financeNoteGreen: { fontSize: 9, color: colors.primary, fontWeight: '600' },
  financeNoteGreen2: { fontSize: 9, color: colors.brandGreen, fontWeight: '600' },

  telemetryGrid: { flexDirection: 'row', gap: 8, paddingHorizontal: 20, marginBottom: 14 },
  telemetryTile: {
    flex: 1, backgroundColor: colors.surfaceCard,
    borderRadius: 14, padding: 12, gap: 3,
    shadowColor: '#043915', shadowOpacity: 0.04, shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 }, elevation: 1,
  },
  telemetryTop: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 4,
  },
  telemetryValue: { fontSize: 15, fontWeight: '700', color: colors.primary },
  telemetryNoteGreen: { fontSize: 11, fontWeight: '600', color: colors.brandGreen },
  telemetryNoteBlue: { fontSize: 11, fontWeight: '600', color: colors.energyBlue },
  telemetrySub: { fontSize: 10, color: colors.textMuted, marginTop: 2 },

  arrayCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.surfaceCard,
    marginHorizontal: 20, borderRadius: 16, padding: 16,
    marginBottom: 14, gap: 12,
    shadowColor: '#043915', shadowOpacity: 0.05, shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 }, elevation: 2,
  },
  arrayStatusRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  arrayDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.brandGreen },
  arrayStatusText: {
    fontSize: 10, fontWeight: '700', color: colors.textMuted, letterSpacing: 1,
  },
  arrayTitle: { fontSize: 15, fontWeight: '700', color: colors.primary },
  arraySub: { fontSize: 11, color: colors.textMuted, marginTop: 4, lineHeight: 16 },
  arrayIconWrap: {
    width: 60, height: 60, borderRadius: 14,
    backgroundColor: '#C0F0A8',
    justifyContent: 'center', alignItems: 'center',
  },

  downloadBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, marginHorizontal: 20, height: 50,
    borderRadius: 999, backgroundColor: '#E7E9E5',
  },
  downloadText: { fontSize: 13, fontWeight: '600', color: colors.primary },
  downloadHint: {
    fontSize: 10, color: colors.textMuted,
    textAlign: 'center', marginTop: 6, marginBottom: 8,
  },
});