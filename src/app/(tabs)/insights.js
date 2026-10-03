import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  Alert,
  ScrollView, StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';
import { insightsData } from '../../data/realData';
import { colors } from '../../styles/colors';

export default function Insights() {
  const [automation, setAutomation] = useState(insightsData.automation.enabled);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Header />
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Page header */}
        <View style={styles.pageHeader}>
          <View style={styles.pageHeaderTop}>
            <View style={styles.sparkleWrap}>
              <MaterialIcons name="auto-awesome" size={16} color={colors.primary} />
            </View>
            <Text style={styles.pageTitle}>Smart Insights</Text>
          </View>
          <Text style={styles.pageSub}>
            AI-driven actions to minimize your electricity bill and maximize solar yield.
          </Text>
        </View>

        {/* Score hero */}
        <ScoreCard data={insightsData} />

        {/* Priority actions header */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionLeft}>
            <Text style={styles.sectionTitle}>Priority Actions</Text>
            <View style={styles.countBadge}>
              <Text style={styles.countText}>{insightsData.actions.length}</Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() =>
              Alert.alert(
                'Auto-optimize',
                'In production, this would apply all suggested schedules automatically.'
              )
            }
          >
            <Text style={styles.autoOptimize}>Auto-optimize all</Text>
          </TouchableOpacity>
        </View>

        {/* Action cards */}
        {insightsData.actions.map((a, i) => (
          <ActionCard key={i} action={a} />
        ))}

        {/* ML Pattern Detection */}
        <MLDetectionCard data={insightsData.mlDetection} />

        {/* Automation toggle */}
        <View style={styles.automationCard}>
          <View style={styles.automationLeft}>
            <View style={styles.automationIconWrap}>
              <MaterialIcons name="tune" size={22} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.automationTitle}>{insightsData.automation.title}</Text>
              <Text style={styles.automationSub}>{insightsData.automation.subtitle}</Text>
            </View>
          </View>
          <Switch
            value={automation}
            onValueChange={setAutomation}
            trackColor={{ false: '#E1E3DF', true: colors.primary }}
            thumbColor="#FFFFFF"
          />
        </View>

        {/* Configure button */}
        <TouchableOpacity
          style={styles.configureBtn}
          activeOpacity={0.85}
          onPress={() =>
            Alert.alert(
              'Configure Rules',
              'In production, this opens the rules editor for appliance scheduling.'
            )
          }
        >
          <MaterialIcons name="tune" size={20} color="#FFFFFF" />
          <Text style={styles.configureText}>Configure Optimization Rules</Text>
        </TouchableOpacity>

        <View style={{ height: 20 }} />
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
          <Text style={styles.headerSub}>Insights</Text>
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

/* ---------------- SCORE CARD ---------------- */
function ScoreCard({ data }) {
  const SIZE = 120;
  const STROKE = 10;
  const RADIUS = (SIZE - STROKE) / 2;
  const CIRC = 2 * Math.PI * RADIUS;
  const progress = Math.max(0, Math.min(100, data.score)) / 100;
  const offset = CIRC * (1 - progress);

  return (
    <View style={styles.scoreCard}>
      <View style={styles.scoreRow}>
        {/* Gauge with text inside */}
        <View style={styles.gaugeWrap}>
          <Svg width={SIZE} height={SIZE} style={{ transform: [{ rotate: '-90deg' }] }}>
            <Circle
              cx={SIZE / 2} cy={SIZE / 2} r={RADIUS}
              stroke="#ECEEEB" strokeWidth={STROKE} fill="transparent"
            />
            <Circle
              cx={SIZE / 2} cy={SIZE / 2} r={RADIUS}
              stroke={colors.primary} strokeWidth={STROKE} fill="transparent"
              strokeDasharray={CIRC}
              strokeDashoffset={offset}
              strokeLinecap="round"
            />
          </Svg>
          <View style={styles.gaugeCenter}>
            <Text style={styles.gaugeScore}>
              {data.score}
              <Text style={styles.gaugeOutOf}>/100</Text>
            </Text>
            <Text style={styles.gaugeLabel}>Score</Text>
          </View>
        </View>

        {/* Right column - info */}
        <View style={styles.scoreInfo}>
          <View style={styles.healthPill}>
            <MaterialIcons name="verified" size={12} color="#002108" />
            <Text style={styles.healthText}>Monthly Health</Text>
          </View>
          <Text style={styles.scoreHeadline}>{data.scoreLabel}</Text>
          <Text style={styles.scoreDesc}>{data.scoreDescription}</Text>
        </View>
      </View>

      {/* Bottom meta row */}
      <View style={styles.scoreMetaRow}>
        <View style={styles.metaItem}>
          <MaterialIcons name="trending-up" size={14} color={colors.brandGreen} />
          <Text style={styles.metaText}>{data.scoreTrend}</Text>
        </View>
        <View style={styles.metaDivider} />
        <Text style={styles.metaTextMuted} numberOfLines={1}>
          {data.scoreRanking}
        </Text>
      </View>
    </View>
  );
}

/* ---------------- ACTION CARD ---------------- */
function ActionCard({ action }) {
  const isRecommended = action.type === 'recommended';
  const isAttention = action.type === 'attention';

  const iconBg = isRecommended ? '#C0F0A8' : isAttention ? '#FFDAD6' : '#BAF0BB';
  const iconColor = isAttention ? '#BA1A1A' : colors.primary;
  const badgeBg = isRecommended ? '#BDEDA5' : isAttention ? '#FFDAD6' : '#BAF0BB';
  const badgeText = isRecommended ? '#043915' : isAttention ? '#93000A' : '#205029';
  const badgeLabel = isRecommended ? 'RECOMMENDED' : isAttention ? 'ATTENTION' : 'GOOD';

  return (
    <View style={styles.actionCard}>
      <View style={styles.actionTop}>
        <View style={styles.actionTopLeft}>
          <View style={[styles.actionIconWrap, { backgroundColor: iconBg }]}>
            <MaterialIcons name={action.icon} size={20} color={iconColor} />
          </View>
          <View style={[styles.actionBadge, { backgroundColor: badgeBg }]}>
            <Text style={[styles.actionBadgeText, { color: badgeText }]}>{badgeLabel}</Text>
          </View>
        </View>
        <Text style={[styles.actionTime, isAttention && { color: '#BA1A1A' }]}>
          {action.timeLabel}
        </Text>
      </View>

      <Text style={styles.actionTitle}>{action.title}</Text>
      <Text style={styles.actionBody}>{action.body}</Text>

      {/* Metric strip */}
      <View style={styles.metricStrip}>
        <View style={styles.metricStripLeft}>
          <MaterialIcons
            name={action.metricIcon}
            size={20}
            color={isAttention ? '#BA1A1A' : colors.brandGreen}
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.metricStripLabel}>{action.metricLabel}</Text>
            <Text
              style={[
                styles.metricStripValue,
                isAttention && { color: '#BA1A1A' },
              ]}
            >
              {action.metricValue}
            </Text>
          </View>
        </View>
        {action.badgeRight ? (
          <View style={styles.metricStripBadge}>
            <Text style={styles.metricStripBadgeText}>{action.badgeRight}</Text>
          </View>
        ) : null}
      </View>

      {/* CTA */}
      {action.ctaText ? (
        <TouchableOpacity
          style={styles.actionBtn}
          activeOpacity={0.85}
          onPress={() => Alert.alert(action.title, action.ctaText)}
        >
          <Text style={styles.actionBtnText}>{action.ctaText}</Text>
          <MaterialIcons name="chevron-right" size={18} color={colors.primary} />
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

/* ---------------- ML DETECTION ---------------- */
function MLDetectionCard({ data }) {
  return (
    <View style={styles.mlCard}>
      <View style={styles.mlHeader}>
        <View style={styles.mlTitleRow}>
          <MaterialIcons name="psychology" size={20} color={colors.energyBlue} />
          <Text style={styles.mlTitle}>{data.title}</Text>
        </View>
        <View style={styles.mlPulseOuter}>
          <View style={styles.mlPulseInner} />
        </View>
      </View>

      <View style={styles.mlBody}>
        <View style={styles.mlIconWrap}>
          <MaterialIcons name={data.icon} size={20} color={colors.textMuted} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.mlMessage}>{data.message}</Text>
          <View style={styles.mlFooter}>
            <TouchableOpacity
              style={styles.mlActionRow}
              onPress={() => Alert.alert('Diagnostic', data.actionText)}
            >
              <Text style={styles.mlActionText}>{data.actionText}</Text>
              <MaterialIcons name="arrow-forward" size={14} color={colors.energyBlue} />
            </TouchableOpacity>
            <Text style={styles.mlConfidence}>Confidence {data.confidence}%</Text>
          </View>
        </View>
      </View>
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

  pageHeader: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12 },
  pageHeaderTop: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sparkleWrap: {
    width: 24, height: 24, borderRadius: 12, backgroundColor: '#BDEDA5',
    justifyContent: 'center', alignItems: 'center',
  },
  pageTitle: { fontSize: 22, fontWeight: '700', color: colors.primary, letterSpacing: -0.3 },
  pageSub: {
    fontSize: 12, color: colors.textMuted,
    marginTop: 6, lineHeight: 17,
  },

  /* ---- Score Card ---- */
  scoreCard: {
    backgroundColor: colors.surfaceCard,
    marginHorizontal: 20, borderRadius: 16, padding: 16,
    marginBottom: 16,
    shadowColor: '#043915', shadowOpacity: 0.05, shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 }, elevation: 2,
  },
  scoreRow: {
    flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 14,
  },
  gaugeWrap: {
    width: 120, height: 120,
    alignItems: 'center', justifyContent: 'center',
  },
  gaugeCenter: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center', justifyContent: 'center',
  },
  gaugeScore: {
    fontSize: 26, fontWeight: '800', color: colors.primary, letterSpacing: -0.5,
  },
  gaugeOutOf: { fontSize: 11, color: colors.textMuted, fontWeight: '500' },
  gaugeLabel: {
    fontSize: 10, color: colors.textMuted, marginTop: 1, fontWeight: '500',
  },

  scoreInfo: { flex: 1 },
  healthPill: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    alignSelf: 'flex-start',
    backgroundColor: '#BAF0BB', paddingHorizontal: 8, paddingVertical: 3,
    borderRadius: 999, marginBottom: 8,
  },
  healthText: { fontSize: 10, fontWeight: '700', color: '#002108' },
  scoreHeadline: { fontSize: 15, fontWeight: '700', color: colors.primary, lineHeight: 20 },
  scoreDesc: { fontSize: 12, color: colors.textMuted, marginTop: 4, lineHeight: 17 },

  scoreMetaRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingTop: 12,
    borderTopWidth: 1, borderTopColor: '#F2F4F0',
  },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: 11, fontWeight: '600', color: colors.brandGreen },
  metaDivider: { width: 1, height: 12, backgroundColor: '#E7E9E5' },
  metaTextMuted: { fontSize: 11, color: colors.textMuted, flex: 1 },

  /* ---- Section header ---- */
  sectionHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, marginBottom: 10,
  },
  sectionLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.primary },
  countBadge: {
    width: 20, height: 20, borderRadius: 10, backgroundColor: '#E7E9E5',
    justifyContent: 'center', alignItems: 'center',
  },
  countText: { fontSize: 11, fontWeight: '700', color: colors.textMuted },
  autoOptimize: { fontSize: 11, fontWeight: '700', color: colors.brandGreen },

  /* ---- Action Card ---- */
  actionCard: {
    backgroundColor: colors.surfaceCard,
    marginHorizontal: 20, marginBottom: 12,
    borderRadius: 16, padding: 16,
    shadowColor: '#043915', shadowOpacity: 0.05, shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 }, elevation: 2,
  },
  actionTop: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 10,
  },
  actionTopLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  actionIconWrap: {
    width: 36, height: 36, borderRadius: 10,
    justifyContent: 'center', alignItems: 'center',
  },
  actionBadge: {
    paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999,
  },
  actionBadgeText: { fontSize: 10, fontWeight: '700', letterSpacing: 0.3 },
  actionTime: { fontSize: 11, fontWeight: '600', color: colors.textMuted },
  actionTitle: { fontSize: 15, fontWeight: '700', color: colors.primary, marginBottom: 6 },
  actionBody: { fontSize: 12, color: colors.textMuted, lineHeight: 18, marginBottom: 12 },

  metricStrip: {
    backgroundColor: '#F2F4F0', borderRadius: 12, padding: 12,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginBottom: 10, gap: 8,
  },
  metricStripLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  metricStripLabel: { fontSize: 10, color: colors.textMuted },
  metricStripValue: { fontSize: 12, fontWeight: '700', color: colors.primary, marginTop: 1 },
  metricStripBadge: {
    paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6,
    backgroundColor: '#E7E9E5',
  },
  metricStripBadgeText: { fontSize: 10, color: colors.textMuted, fontWeight: '600' },

  actionBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, height: 44, borderRadius: 999,
    backgroundColor: '#F2F4F0',
  },
  actionBtnText: { fontSize: 13, fontWeight: '700', color: colors.primary },

  /* ---- ML Card ---- */
  mlCard: {
    backgroundColor: '#E5F0F8',
    marginHorizontal: 20, marginBottom: 12,
    borderRadius: 16, padding: 16,
    borderWidth: 1, borderColor: '#CBE6FF',
  },
  mlHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 12,
  },
  mlTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  mlTitle: {
    fontSize: 11, fontWeight: '700', color: '#154D71', letterSpacing: 1,
    textTransform: 'uppercase',
  },
  mlPulseOuter: {
    width: 10, height: 10, justifyContent: 'center', alignItems: 'center',
  },
  mlPulseInner: {
    width: 8, height: 8, borderRadius: 4, backgroundColor: colors.energyBlue,
  },
  mlBody: { flexDirection: 'row', gap: 12 },
  mlIconWrap: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center', alignItems: 'center',
  },
  mlMessage: { fontSize: 12, color: colors.primary, lineHeight: 18 },
  mlFooter: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginTop: 8,
  },
  mlActionRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  mlActionText: { fontSize: 11, fontWeight: '700', color: '#154D71' },
  mlConfidence: { fontSize: 10, color: colors.textMuted },

  /* ---- Automation ---- */
  automationCard: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: colors.surfaceCard,
    marginHorizontal: 20, marginBottom: 12,
    borderRadius: 14, padding: 14,
    shadowColor: '#043915', shadowOpacity: 0.04, shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 }, elevation: 1,
  },
  automationLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  automationIconWrap: {
    width: 40, height: 40, borderRadius: 10,
    backgroundColor: '#BDEDA5',
    justifyContent: 'center', alignItems: 'center',
  },
  automationTitle: { fontSize: 13, fontWeight: '700', color: colors.primary },
  automationSub: { fontSize: 11, color: colors.textMuted, marginTop: 2 },

  configureBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, marginHorizontal: 20, height: 50,
    borderRadius: 999, backgroundColor: colors.primary,
  },
  configureText: { fontSize: 14, fontWeight: '700', color: '#FFFFFF' },
});