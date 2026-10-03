// ============================================================
// EcoWatt — Real Data
// ============================================================
// You update these values manually from SolisCloud app + CEB bill.
// ============================================================

// -------- Solar system (from SolisCloud app) --------
export const solarData = {
  systemSizeKW: 5,
  inverterBrand: 'Solis',

  todayGenerationKWh: 15,
  todayConsumptionKWh: 5,
  todayGridImportKWh: 0.5,
  todayGridExportKWh: 4.3,

  monthGenerationKWh: 380,
  monthConsumptionKWh: 260,
  monthGridImportKWh: 15,
  monthGridExportKWh: 135,

  currentSolarKW: 3.2,
  isLive: true,
  lastSync: new Date().toISOString(),
};

// -------- CEB bill (from latest actual bill) --------
export const cebBill = {
  month: '',
  unitsConsumed: 0,
  billAmountRs: 0,
  dueDate: '',
  accountNumber: '',
};

// -------- EV (simulated — would come from Tuya / OCPP charger) --------
export const evData = {
  connected: true,
  chargerName: 'Home Wallbox',
  chargerMaxKW: 7.2,

  batteryPercent: 68,
  targetPercent: 80,
  packCapacityKWh: 75,
  estRangeKm: 214,

  isCharging: false,
  chargingMode: 'solar', // 'solar' | 'hybrid' | 'fast'

  // Battery saver
  batterySaverNote: 'Daily cycle protection actively applied',

  // Smart solar window
  smartWindow: {
    startLabel: '11:00 AM',
    endLabel: '2:00 PM',
    surplusKW: 3.4,
    status: 'Optimal',
    note: 'Charging now minimizes peak tariffs and draws 100% clean rooftop generation.',
  },

  // Grid comparison — what charging would cost without solar
  gridCostRs: 420,

  // Session history
  sessions: [
    {
      icon: 'wb-sunny',
      dateLabel: 'Yesterday, 12:15 PM',
      energyKWh: 14.2,
      solarPercent: 86,
      savedRs: 380,
      duration: '2h 10m',
    },
    {
      icon: 'wb-sunny',
      dateLabel: 'Oct 21, 11:00 AM',
      energyKWh: 18.5,
      solarPercent: 92,
      savedRs: 510,
      duration: '2h 45m',
    },
  ],
};

// -------- Per-mode charging metrics --------
export const evModeData = {
  solar: {
    label: 'Solar Only',
    chargeRateKW: 3.4,
    timeToTargetLabel: '3h 20m',
    energyNeededKWh: 11.2,
    estCostRs: 0,
    costLabel: '100% Surplus Solar',
    costSub: 'Zero grid tariff',
  },
  hybrid: {
    label: 'Hybrid Eco',
    chargeRateKW: 5.5,
    timeToTargetLabel: '2h 05m',
    energyNeededKWh: 11.2,
    estCostRs: 120,
    costLabel: 'Solar + Off-Peak Grid',
    costSub: 'Balanced speed and cost',
  },
  fast: {
    label: 'Fast Grid',
    chargeRateKW: 7.2,
    timeToTargetLabel: '1h 45m',
    energyNeededKWh: 11.2,
    estCostRs: 420,
    costLabel: 'Full Grid Charging',
    costSub: 'Maximum speed',
  },
};

// ============================================================
// ENERGY TAB DATA
// ============================================================

// -------- Weekly energy data (from SolisCloud) --------
export const weeklyEnergy = {
  weekChangePercent: 14.2,
  days: [
    { label: 'M', fullName: 'Monday',    solarKWh: 6.8, homeKWh: 5.2 },
    { label: 'T', fullName: 'Tuesday',   solarKWh: 7.4, homeKWh: 5.8 },
    { label: 'W', fullName: 'Wednesday', solarKWh: 8.9, homeKWh: 6.4 },
    { label: 'T', fullName: 'Thursday',  solarKWh: 9.8, homeKWh: 6.9, peak: true },
    { label: 'F', fullName: 'Friday',    solarKWh: 8.1, homeKWh: 6.0 },
    { label: 'S', fullName: 'Saturday',  solarKWh: 7.2, homeKWh: 6.2 },
    { label: 'S', fullName: 'Sunday',    solarKWh: 6.6, homeKWh: 5.8, today: true },
  ],
};

// -------- Grid import/export for the period --------
export const gridFlow = {
  importKWh: 8.6,
  exportKWh: 21.1,
};

// -------- Financial (weekly) --------
export const financials = {
  estBillRs: 2840,   // what you would have paid WITHOUT solar
  savedRs: 1260,     // what solar saved you
  netPayRs: 1580,    // what you actually pay
};

// -------- Consumption categories --------
export const energyCategories = [
  { icon: 'ac-unit',       label: 'Cooling (Inverter ACs)', percent: 38, kWh: 16.1, color: '#043915' },
  { icon: 'countertops',   label: 'Cooking & Kitchen',      percent: 26, kWh: 11.0, color: '#3F682F' },
  { icon: 'water-drop',    label: 'Water Heating & Pumps',  percent: 18, kWh: 7.6,  color: '#3396D3' },
  { icon: 'tv',            label: 'Lighting & Media',       percent: 12, kWh: 5.1,  color: '#A4D38E' },
  { icon: 'devices-other', label: 'Other Smart Loads',      percent: 6,  kWh: 2.5,  color: '#71796F' },
];

// -------- Telemetry --------
export const telemetry = {
  peakSolar: { time: '11:45 AM', kW: 4.8, note: 'Clear sunny zenith' },
  tariff:    { offPeakPercent: 88, savingRs: 420, note: 'Low-cost imports' },
};

// -------- Array status --------
export const arrayStatus = {
  sizeKW: 6.2,
  panels: 14,
  panelType: 'Monocrystalline',
  healthPercent: 98.4,
};

// ============================================================
// PERIOD DATA — 4 timeframes for the Energy tab toggle
// ============================================================
export const periodData = {
  Today: {
    heading: 'DAILY GENERATION CURVE',
    totalLabel: 'kWh generated today',
    totalSolar: 29.1,
    totalHome: 12.4,
    changePercent: 8.4,
    gridImport: 0.5,
    gridExport: 16.7,
    peakValue: 5.2,
    peakLabel: '12:30 PM',
    dailyEarning: 785,
    fullLoadHours: 4.85,
    isLive: true,
    chart: [
      { label: '6a',  value: 0.2 },
      { label: '7a',  value: 0.7 },
      { label: '8a',  value: 1.6 },
      { label: '9a',  value: 2.9 },
      { label: '10a', value: 4.1 },
      { label: '11a', value: 4.9 },
      { label: '12p', value: 5.2, peak: true },
      { label: '1p',  value: 4.9 },
      { label: '2p',  value: 4.5 },
      { label: '3p',  value: 3.7 },
      { label: '4p',  value: 2.4 },
      { label: '5p',  value: 1.2 },
      { label: '6p',  value: 0.4 },
    ],
    financials: { estBillRs: 420, savedRs: 195, netPayRs: 225 },
    telemetry: {
      peakSolar: { time: '12:30 PM', kW: 5.2, note: 'Clear sunny zenith' },
      tariff:    { offPeakPercent: 92, savingRs: 62, note: 'Smart scheduling' },
    },
  },

  Week: {
    heading: 'WEEKLY GENERATION CURVE',
    totalLabel: 'kWh generated',
    totalSolar: 54.8,
    totalHome: 42.3,
    changePercent: 14.2,
    gridImport: 8.6,
    gridExport: 21.1,
    peakValue: 9.8,
    peakLabel: 'Thursday',
    dailyEarning: 1480,
    fullLoadHours: 4.4,
    chart: [
      { label: 'M', value: 6.8 },
      { label: 'T', value: 7.4 },
      { label: 'W', value: 8.9 },
      { label: 'T', value: 9.8, peak: true },
      { label: 'F', value: 8.1 },
      { label: 'S', value: 7.2 },
      { label: 'S', value: 6.6 },
    ],
    financials: { estBillRs: 2840, savedRs: 1260, netPayRs: 1580 },
    telemetry: {
      peakSolar: { time: 'Thu 11:45 AM', kW: 4.8, note: 'Weekly high' },
      tariff:    { offPeakPercent: 88, savingRs: 420, note: 'Low-cost imports' },
    },
  },

  Month: {
    heading: 'MONTHLY GENERATION CURVE',
    totalLabel: 'kWh this month',
    totalSolar: 676.1,
    totalHome: 380,
    changePercent: 11.6,
    gridImport: 40,
    gridExport: 240,
    peakValue: 32.4,
    peakLabel: 'Week 2',
    dailyEarning: 15800,
    fullLoadHours: 4.6,
    chart: [
      { label: 'W1', value: 142 },
      { label: 'W2', value: 168 },
      { label: 'W3', value: 178, peak: true },
      { label: 'W4', value: 188 },
    ],
    financials: { estBillRs: 12400, savedRs: 5400, netPayRs: 7000 },
    telemetry: {
      peakSolar: { time: 'Week 4', kW: 5.1, note: 'Highest weekly total' },
      tariff:    { offPeakPercent: 84, savingRs: 1850, note: 'Optimised imports' },
    },
  },

  Year: {
    heading: 'ANNUAL GENERATION CURVE',
    totalLabel: 'kWh this year',
    totalSolar: 3329,
    totalHome: 2160,
    changePercent: 18.7,
    gridImport: 480,
    gridExport: 1120,
    peakValue: 320,
    peakLabel: 'April',
    dailyEarning: 62000,
    fullLoadHours: 4.5,
    chart: [
      { label: 'J', value: 220 },
      { label: 'F', value: 240 },
      { label: 'M', value: 260 },
      { label: 'A', value: 320, peak: true },
      { label: 'M', value: 230 },
      { label: 'J', value: 210 },
      { label: 'J', value: 195 },
      { label: 'A', value: 200 },
      { label: 'S', value: 215 },
      { label: 'O', value: 225 },
      { label: 'N', value: 230 },
      { label: 'D', value: 245 },
    ],
    financials: { estBillRs: 148000, savedRs: 62000, netPayRs: 86000 },
    telemetry: {
      peakSolar: { time: 'April', kW: 5.4, note: 'Peak summer yield' },
      tariff:    { offPeakPercent: 82, savingRs: 9800, note: 'Optimal strategy' },
    },
  },
};

// ============================================================
// INSIGHTS TAB DATA
// ============================================================

export const insightsData = {
  // Energy score — computed from real data in production
  score: 82,
  scoreLabel: 'Excellent Energy Efficiency',
  scoreDescription: 'You are utilizing 82% of your generated solar power locally.',
  scoreTrend: '+6 pts vs last month',
  scoreRanking: 'Top 8% in region',

  // Priority actions (rule-based recommendations)
  actions: [
    {
      type: 'recommended',
      icon: 'wb-sunny',
      timeLabel: '10:00 AM – 2:00 PM',
      title: 'Shift high-power appliances to midday',
      body: 'Your solar generation consistently peaks between 10:00 AM and 2:00 PM (generating ~4.2 kW). Running your washing machine and water pump now will utilize free solar energy.',
      metricIcon: 'savings',
      metricLabel: 'Projected Monthly Savings',
      metricValue: 'Up to Rs. 320 / month',
      ctaText: 'View Schedule Suggestion',
    },
    {
      type: 'attention',
      icon: 'warning',
      timeLabel: 'Peak Tariff',
      title: 'Evening peak consumption increased',
      body: 'Your 6:00 PM – 9:00 PM usage is 14% higher than your monthly average, falling into the highest peak grid tariff bracket.',
      metricIcon: 'trending-up',
      metricLabel: 'Grid Cost Impact',
      metricValue: '+Rs. 185 this week',
      badgeRight: 'Grid Surcharge',
      ctaText: 'Review Peak Appliances',
    },
    {
      type: 'good',
      icon: 'solar-power',
      timeLabel: '+12% vs LW',
      title: 'Great solar performance this week',
      body: 'Your Solis inverter achieved 12% higher solar conversion efficiency compared to last week due to optimal tilt and clear weather.',
      metricIcon: 'bolt',
      metricLabel: 'Grid Export Bonus',
      metricValue: '+6.8 kWh surplus exported',
      badgeRight: 'Optimal Status',
    },
  ],

  // ML anomaly detection
  mlDetection: {
    icon: 'kitchen',
    title: 'ML Pattern Detection',
    message: 'EcoWatt detected an unusual baseline draw (+180W) in Kitchen circuits. Possible refrigeration cycle inefficiency or door seal leakage.',
    actionText: 'Run Circuit Diagnostic',
    confidence: 94,
  },

  // Automation
  automation: {
    title: 'Automated Shifting',
    subtitle: '3 IoT smart plugs linked',
    enabled: true,
  },
};

// ============================================================
// PROFILE TAB DATA
// ============================================================

export const profileData = {
  user: {
    name: '',           // from auth later, empty for now
    email: '',
    initials: '',       // optional
  },
  connectedDevices: [
    {
      key: 'solis',
      icon: 'solar-power',
      name: 'SolisCloud',
      detail: 'Inverter • Live sync',
      status: 'connected',
    },
    {
      key: 'weather',
      icon: 'cloud',
      name: 'OpenWeather',
      detail: 'Location-based solar forecast',
      status: 'connected',
    },
    {
      key: 'ev',
      icon: 'ev-station',
      name: 'EV Wallbox',
      detail: 'Not connected',
      status: 'disconnected',
    },
    {
      key: 'ceb',
      icon: 'receipt-long',
      name: 'CEB Bill Sync',
      detail: 'Manual entry',
      status: 'manual',
    },
  ],
  appInfo: {
    version: '1.0.0',
    build: 'Eminence 6.0',
  },
};