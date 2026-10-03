import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator, RefreshControl,
  ScrollView, StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Path } from 'react-native-svg';
import { DEFAULT_LOCATION } from '../../data/cities';
import { evData, solarData } from '../../data/realData';
import { fetchWeather } from '../../services/weather';
import { colors } from '../../styles/colors';

export default function Dashboard() {
  const router = useRouter();
  const [setup, setSetup] = useState(null);
  const [weather, setWeather] = useState(null);
  const [loadingWeather, setLoadingWeather] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadWeather = async (setupData) => {
    setLoadingWeather(true);
    const loc = setupData?.location || DEFAULT_LOCATION;
    const w = await fetchWeather(loc.lat, loc.lon);
    setWeather(w);
    setLoadingWeather(false);
  };

  const loadAll = async () => {
    let setupData = null;
    try {
      const raw = await AsyncStorage.getItem('@ecowatt/setup');
      if (raw) {
        setupData = JSON.parse(raw);
        setSetup(setupData);
      }
    } catch (e) {}
    await loadWeather(setupData);
  };

  useEffect(() => {
    loadAll();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadAll();
    setRefreshing(false);
  }, []);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Header onProfile={() => router.push('/(tabs)/profile')} />
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <Greeting setup={setup} />
        <SavingsBanner setup={setup} />
        <HeroEnergyCard />
        <MetricGrid />
        <PowerFlowCard />
        <AIInsightCard />
        <WeatherCard weather={weather} loading={loadingWeather} setup={setup} />
        <QuickActions />
      </ScrollView>
    </SafeAreaView>
  );
}

/* ---------------- HEADER ---------------- */
function Header({ onProfile }) {
  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <View style={styles.headerLogo}>
          <MaterialIcons name="wb-sunny" size={22} color={colors.primary} />
        </View>
        <View>
          <Text style={styles.headerTitle}>EcoWatt</Text>
          <Text style={styles.headerSub}>Home</Text>
        </View>
      </View>
      <View style={styles.headerRight}>
        <TouchableOpacity style={styles.iconBtn}>
          <MaterialIcons name="notifications-none" size={24} color={colors.textMuted} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconBtn} onPress={onProfile}>
          <MaterialIcons name="person-outline" size={24} color={colors.textMuted} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

/* ---------------- GREETING ---------------- */
function Greeting({ setup }) {
  const today = new Date().toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'short',
  });
  return (
    <View style={styles.greetingRow}>
      <View style={{ flex: 1 }}>
        <Text style={styles.dateLabel}>{today}</Text>
        <Text style={styles.greetingTitle} numberOfLines={1}>
          Have a nice day !
        </Text>
      </View>
      <View style={styles.liveChip}>
        <View style={styles.liveDot} />
        <Text style={styles.liveText}>
          {solarData.isLive ? 'SolisCloud • Live' : 'Offline'}
        </Text>
      </View>
    </View>
  );
}

/* ---------------- SAVINGS BANNER ---------------- */
function SavingsBanner({ setup }) {
  let todaySavings = 0;
  let monthSavings = 0;

  if (setup?.cebUnits && setup?.cebAmount) {
    todaySavings = Math.round(solarData.todayGenerationKWh * 30);
    monthSavings = Math.round(solarData.monthGenerationKWh * 30);
  }

  return (
    <View style={styles.savingsBanner}>
      <View style={styles.savingsIconWrap}>
        <MaterialIcons name="savings" size={22} color="#BAF0BB" />
      </View>
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Text style={styles.savingsLabel}>Today's Savings:</Text>
          <Text style={styles.savingsValue}>Rs. {todaySavings}</Text>
        </View>
        <Text style={styles.savingsSub}>
          Est. this month: Rs. {monthSavings} saved
        </Text>
      </View>
      <MaterialIcons name="trending-up" size={22} color={colors.primary} />
    </View>
  );
}

/* ---------------- HERO ENERGY CARD ---------------- */
function HeroEnergyCard() {
  const size = 176;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const solarProduced = solarData.todayGenerationKWh || 0;
  const homeUsed = solarData.todayConsumptionKWh || 0;
  const solarUsedAtHome = Math.min(solarProduced, homeUsed);
  const exported = Math.max(0, solarProduced - solarUsedAtHome);

  const utilization =
    solarProduced > 0 ? Math.round((solarUsedAtHome / solarProduced) * 100) : 0;

  const progress = Math.max(0, Math.min(100, utilization)) / 100;
  const offset = circumference * (1 - progress);

  return (
    <View style={styles.card}>
      <View style={styles.cardHeaderRow}>
        <View>
          <Text style={styles.cardTitle}>Today's Energy</Text>
          <Text style={styles.cardSub}>Real-time solar performance</Text>
        </View>
        {utilization >= 70 ? (
          <View style={styles.pillGreen}>
            <Text style={styles.pillGreenText}>High Self-Consumption</Text>
          </View>
        ) : utilization > 0 ? (
          <View style={styles.pillYellow}>
            <Text style={styles.pillYellowText}>Moderate</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.gaugeWrap}>
        <Svg width={size} height={size} style={{ transform: [{ rotate: '-90deg' }] }}>
          <Circle
            cx={size / 2} cy={size / 2} r={radius}
            stroke="#E1E3DF" strokeWidth={strokeWidth} fill="transparent"
          />
          <Circle
            cx={size / 2} cy={size / 2} r={radius}
            stroke={colors.primary} strokeWidth={strokeWidth} fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
        </Svg>
        <View style={styles.gaugeCenter}>
          <Text style={styles.gaugeValue}>{utilization}%</Text>
          <Text style={styles.gaugeLabel}>Self-Consumption</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 }}>
            <MaterialIcons name="eco" size={14} color={colors.brandGreen} />
            <Text style={styles.gaugeTag}>USED AT HOME</Text>
          </View>
        </View>
      </View>

      <Text style={styles.gaugeSubline}>
        {solarUsedAtHome.toFixed(1)} kWh used at home · {exported.toFixed(1)} kWh exported to CEB
      </Text>
    </View>
  );
}

/* ---------------- METRIC GRID ---------------- */
function MetricGrid() {
  const tiles = [
    {
      key: 'solar',
      label: 'Solar Produced',
      value: solarData.todayGenerationKWh,
      unit: 'kWh',
      note: solarData.systemSizeKW ? `${solarData.systemSizeKW} kW system` : 'Today',
      icon: 'wb-sunny',
    },
    {
      key: 'home',
      label: 'Home Consumed',
      value: solarData.todayConsumptionKWh,
      unit: 'kWh',
      note: 'Today',
      icon: 'home',
    },
    {
      key: 'gridIn',
      label: 'Grid Imported',
      value: solarData.todayGridImportKWh,
      unit: 'kWh',
      note: 'From CEB',
      icon: 'power',
    },
    {
      key: 'gridOut',
      label: 'Grid Exported',
      value: solarData.todayGridExportKWh,
      unit: 'kWh',
      note: 'To CEB',
      icon: 'upload',
    },
  ];

  return (
    <View style={styles.metricGrid}>
      {tiles.map((t) => (
        <View key={t.key} style={styles.metricTile}>
          <View style={styles.metricTop}>
            <Text style={styles.metricLabel} numberOfLines={1}>{t.label}</Text>
            <View style={styles.metricIconWrap}>
              <MaterialIcons name={t.icon} size={16} color={colors.primary} />
            </View>
          </View>
          <View style={styles.metricValueRow}>
            <Text style={styles.metricValue}>{t.value}</Text>
            <Text style={styles.metricUnit}>{t.unit}</Text>
          </View>
          <Text style={styles.metricNote} numberOfLines={1}>{t.note}</Text>
        </View>
      ))}
    </View>
  );
}

/* ---------------- POWER FLOW ---------------- */
function PowerFlowCard() {
  const nodes = [
    { key: 'home', label: 'Home', kW: 0, state: 'Consuming', icon: 'home' },
    { key: 'ev', label: 'EV / Battery', kW: evData.isCharging ? evData.chargerKW : 0, state: evData.isCharging ? 'Charging' : 'Idle', icon: 'ev-station' },
    { key: 'grid', label: 'Grid', kW: solarData.todayGridImportKWh > 0 ? 0.4 : 0, state: solarData.todayGridImportKWh > 0 ? 'Importing' : 'Balanced', icon: 'bolt' },
  ];

  return (
    <View style={styles.card}>
      <View style={styles.cardHeaderRow}>
        <View>
          <Text style={styles.cardTitle}>Active Power Flow</Text>
          <Text style={styles.cardSub}>Current instantaneous generation</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <MaterialIcons name="bolt" size={18} color={colors.primary} />
          <Text style={styles.flowKW}>{solarData.currentSolarKW} kW Solar</Text>
        </View>
      </View>

      <View style={styles.flowBox}>
        <View style={styles.flowTop}>
          <View style={styles.solarBubble}>
            <MaterialIcons name="wb-sunny" size={24} color={colors.primary} />
          </View>
          <Text style={styles.flowNodeTitle}>Solar Array</Text>
          <Text style={styles.flowNodeKW}>{solarData.currentSolarKW} kW</Text>
        </View>

        <View style={styles.flowLines}>
          <Svg width="100%" height="100%" viewBox="0 0 300 40" fill="none">
            <Path d="M150 0 V40" stroke={colors.primary} strokeWidth="2" strokeDasharray="4 4" />
            <Path d="M150 20 H50 V40" stroke={colors.primary} strokeWidth="2" strokeDasharray="4 4" />
            <Path d="M150 20 H250 V40" stroke="#3396D3" strokeWidth="2" strokeDasharray="4 4" />
          </Svg>
        </View>

        <View style={styles.flowBottom}>
          {nodes.map((n) => (
            <View key={n.key} style={styles.flowNode}>
              <View style={styles.flowNodeIconWrap}>
                <MaterialIcons name={n.icon} size={22} color={colors.primary} />
              </View>
              <Text style={styles.flowNodeLabel}>{n.label}</Text>
              <Text style={styles.flowNodeValue}>{n.kW} kW</Text>
              <Text style={styles.flowNodeState}>{n.state}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

/* ---------------- AI INSIGHT ---------------- */
function AIInsightCard() {
  const message =
    solarData.todayGenerationKWh > 0
      ? `You generated ${solarData.todayGenerationKWh} kWh of solar today. Keep it up!`
      : 'Add your SolisCloud data to unlock personalized AI insights.';

  return (
    <View style={styles.aiCard}>
      <View style={styles.aiIconWrap}>
        <MaterialIcons name="auto-awesome" size={22} color={colors.primary} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.aiTitle}>AI OPTIMIZER</Text>
        <Text style={styles.aiMessage}>{message}</Text>
        <View style={styles.aiFooter}>
          <Text style={styles.aiHint}>Based on your recent energy patterns</Text>
          <TouchableOpacity style={styles.aiAction}>
            <Text style={styles.aiActionText}>View Insights</Text>
            <MaterialIcons name="arrow-forward" size={16} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

/* ---------------- WEATHER ---------------- */
function WeatherCard({ weather, loading, setup }) {
  const siteName = setup?.location?.name || DEFAULT_LOCATION.name;

  if (loading) {
    return (
      <View style={styles.weatherCard}>
        <View style={styles.weatherIconWrap}>
          <ActivityIndicator color={colors.primary} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.weatherCond}>Fetching weather…</Text>
          <Text style={styles.weatherPotential}>Site: {siteName}</Text>
        </View>
      </View>
    );
  }

  if (!weather || weather.error) {
    return (
      <View style={styles.weatherCard}>
        <View style={styles.weatherIconWrap}>
          <MaterialIcons name="wb-cloudy" size={28} color={colors.textMuted} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.weatherCond}>Weather unavailable</Text>
          <Text style={styles.weatherPotential}>
            {weather?.message || `Site: ${siteName}`}
          </Text>
        </View>
      </View>
    );
  }

  const potential =
    weather.cloudCover < 30
      ? 'Excellent'
      : weather.cloudCover < 60
      ? 'Good'
      : weather.cloudCover < 85
      ? 'Moderate'
      : 'Low';

  return (
    <View style={styles.weatherCard}>
      <View style={styles.weatherIconWrap}>
        <MaterialIcons name={weather.icon} size={28} color={colors.primary} />
      </View>
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 8 }}>
          <Text style={styles.weatherTemp}>{weather.tempC}°C</Text>
          <Text style={styles.weatherCond} numberOfLines={1}>
            {weather.description || weather.condition}
          </Text>
        </View>
        <Text style={styles.weatherPotential}>
          Solar Potential: {potential} • {weather.cloudCover}% clouds
        </Text>
        <Text style={styles.weatherCity}>📍 {siteName} (installation site)</Text>
      </View>
    </View>
  );
}

/* ---------------- QUICK ACTIONS ---------------- */
function QuickActions() {
  const router = useRouter();
  const actions = [
    { icon: 'wb-sunny', label: 'Energy', route: '/(tabs)/energy' },
    { icon: 'account-balance-wallet', label: 'Savings', route: '/(tabs)/insights' },
    { icon: 'ev-station', label: 'EV Charge', route: '/(tabs)/ev' },
    { icon: 'tune', label: 'Appliances', route: null },
  ];
  return (
    <View style={{ paddingHorizontal: 20, paddingTop: 8 }}>
      <Text style={styles.qaTitle}>QUICK ACTIONS</Text>
      <View style={styles.qaGrid}>
        {actions.map((a) => (
          <TouchableOpacity
            key={a.label}
            style={styles.qaBtn}
            activeOpacity={0.7}
            onPress={() => a.route && router.push(a.route)}
          >
            <MaterialIcons name={a.icon} size={24} color={colors.primary} />
            <Text style={styles.qaLabel}>{a.label}</Text>
          </TouchableOpacity>
        ))}
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

  greetingRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12, gap: 10,
  },
  dateLabel: {
    fontSize: 11, fontWeight: '600', color: colors.textMuted,
    letterSpacing: 1, textTransform: 'uppercase',
  },
  greetingTitle: {
    fontSize: 22, fontWeight: '700', color: colors.primary,
    marginTop: 2, letterSpacing: -0.3,
  },
  liveChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 10, paddingVertical: 6,
    borderRadius: 999, backgroundColor: '#BDEDA5',
  },
  liveDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary },
  liveText: { fontSize: 11, fontWeight: '600', color: colors.primary },

  savingsBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    marginHorizontal: 20, padding: 14, borderRadius: 12,
    backgroundColor: '#C0F0A880', marginBottom: 14,
  },
  savingsIconWrap: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: colors.primary,
    justifyContent: 'center', alignItems: 'center',
  },
  savingsLabel: { fontSize: 11, color: colors.textMuted },
  savingsValue: { fontSize: 12, fontWeight: '700', color: colors.primary },
  savingsSub: { fontSize: 12, color: '#28501A', marginTop: 2 },

  card: {
    backgroundColor: colors.surfaceCard, marginHorizontal: 20,
    borderRadius: 16, padding: 20, marginBottom: 14,
    shadowColor: '#043915', shadowOpacity: 0.05, shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 }, elevation: 2,
  },
  cardHeaderRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'flex-start', marginBottom: 12,
  },
  cardTitle: { fontSize: 16, fontWeight: '700', color: colors.primary },
  cardSub: { fontSize: 11, color: colors.textMuted, marginTop: 2 },
  pillGreen: {
    paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: 999, backgroundColor: '#BDEDA5',
  },
  pillGreenText: { fontSize: 11, fontWeight: '600', color: colors.primary },
  pillYellow: {
    paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: 999, backgroundColor: '#FFFD8F',
  },
  pillYellowText: { fontSize: 11, fontWeight: '600', color: '#043915' },

  gaugeWrap: { alignItems: 'center', justifyContent: 'center', paddingVertical: 8 },
  gaugeCenter: { position: 'absolute', alignItems: 'center', justifyContent: 'center' },
  gaugeValue: { fontSize: 32, fontWeight: '700', color: colors.primary, letterSpacing: -0.5 },
  gaugeLabel: { fontSize: 11, color: colors.textMuted, marginTop: 2 },
  gaugeTag: { fontSize: 10, fontWeight: '700', color: colors.brandGreen, letterSpacing: 1 },
  gaugeSubline: {
    fontSize: 11,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 2,
  },

  metricGrid: {
    flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between',
    paddingHorizontal: 20, gap: 10, marginBottom: 14,
  },
  metricTile: {
    width: '48.5%', backgroundColor: '#F2F4F0',
    borderRadius: 12, padding: 12,
  },
  metricTop: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 8,
  },
  metricLabel: { fontSize: 11, color: colors.textMuted, flex: 1 },
  metricIconWrap: {
    width: 24, height: 24, borderRadius: 12, backgroundColor: '#BDEDA5',
    justifyContent: 'center', alignItems: 'center',
  },
  metricValueRow: { flexDirection: 'row', alignItems: 'baseline', gap: 4 },
  metricValue: { fontSize: 20, fontWeight: '700', color: colors.primary, letterSpacing: -0.3 },
  metricUnit: { fontSize: 11, color: colors.textMuted },
  metricNote: { fontSize: 10, color: colors.textMuted, marginTop: 4 },

  flowKW: { fontSize: 12, fontWeight: '700', color: colors.primary },
  flowBox: { backgroundColor: '#F2F4F0', borderRadius: 12, padding: 16, marginTop: 4 },
  flowTop: { alignItems: 'center' },
  solarBubble: {
    width: 56, height: 56, borderRadius: 28, backgroundColor: '#C0F0A8',
    justifyContent: 'center', alignItems: 'center',
    shadowColor: '#043915', shadowOpacity: 0.1, shadowRadius: 6, elevation: 3,
  },
  flowNodeTitle: { fontSize: 12, fontWeight: '700', color: colors.primary, marginTop: 6 },
  flowNodeKW: { fontSize: 11, fontWeight: '600', color: colors.primary },
  flowLines: { height: 40, width: '100%' },
  flowBottom: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 4 },
  flowNode: { alignItems: 'center', flex: 1 },
  flowNodeIconWrap: {
    width: 48, height: 48, borderRadius: 24, backgroundColor: '#E1E3DF',
    justifyContent: 'center', alignItems: 'center',
  },
  flowNodeLabel: { fontSize: 11, fontWeight: '600', color: colors.primary, marginTop: 6 },
  flowNodeValue: { fontSize: 12, fontWeight: '700', color: colors.primary, marginTop: 2 },
  flowNodeState: { fontSize: 10, color: colors.textMuted, marginTop: 1 },

  aiCard: {
    flexDirection: 'row', gap: 12, backgroundColor: colors.surfaceCard,
    marginHorizontal: 20, borderRadius: 16, padding: 16, marginBottom: 14,
    shadowColor: '#043915', shadowOpacity: 0.05, shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 }, elevation: 2,
  },
  aiIconWrap: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: '#BDEDA5',
    justifyContent: 'center', alignItems: 'center',
  },
  aiTitle: { fontSize: 11, fontWeight: '700', color: colors.brandGreen, letterSpacing: 1 },
  aiMessage: {
    fontSize: 14, fontWeight: '600', color: colors.primary,
    marginTop: 4, lineHeight: 20,
  },
  aiFooter: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginTop: 10, gap: 8,
  },
  aiHint: { fontSize: 11, color: colors.textMuted, flex: 1 },
  aiAction: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  aiActionText: { fontSize: 11, fontWeight: '700', color: colors.primary },

  weatherCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: colors.surfaceCard, marginHorizontal: 20,
    borderRadius: 16, padding: 14, marginBottom: 14,
    shadowColor: '#043915', shadowOpacity: 0.05, shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 }, elevation: 2,
  },
  weatherIconWrap: {
    width: 48, height: 48, borderRadius: 12, backgroundColor: '#F2F4F0',
    justifyContent: 'center', alignItems: 'center',
  },
  weatherTemp: { fontSize: 16, fontWeight: '700', color: colors.primary },
  weatherCond: { fontSize: 13, color: colors.textMuted, flexShrink: 1 },
  weatherPotential: { fontSize: 11, color: colors.brandGreen, marginTop: 2, fontWeight: '500' },
  weatherCity: { fontSize: 10, color: colors.textMuted, marginTop: 1 },

  qaTitle: {
    fontSize: 11, fontWeight: '700', color: colors.textMuted,
    letterSpacing: 1, marginBottom: 8,
  },
  qaGrid: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  qaBtn: {
    flex: 1, backgroundColor: colors.surfaceCard, borderRadius: 12,
    paddingVertical: 12, alignItems: 'center', gap: 6,
    shadowColor: '#043915', shadowOpacity: 0.05, shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 }, elevation: 2,
  },
  qaLabel: { fontSize: 10, fontWeight: '600', color: colors.primary, textAlign: 'center' },
});