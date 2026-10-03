// ============================================================
// EcoWatt — Global Configuration
// ============================================================
// Replace PASTE_YOUR_API_KEY_HERE with your real OpenWeather key.
// ============================================================

// --- Weather ---
export const WEATHER_API_KEY = '4e63c2d7d3350a9e15f1c690fa0c5666';

// --- CEB Tariff (Domestic) ---
export const CEB_TARIFF = {
  blocks: [
    { upTo: 30, rate: 8.0 },
    { upTo: 60, rate: 10.0 },
    { upTo: 90, rate: 16.0 },
    { upTo: 120, rate: 26.0 },
    { upTo: 180, rate: 32.0 },
    { upTo: Infinity, rate: 42.0 },
  ],
  fixedCharge: 500,
};

// --- Helper: calculate CEB bill from units ---
export function calculateCebBill(units) {
  let remaining = units;
  let prev = 0;
  let total = 0;
  for (const b of CEB_TARIFF.blocks) {
    if (remaining <= 0) break;
    const blockUnits = Math.min(remaining, b.upTo - prev);
    total += blockUnits * b.rate;
    remaining -= blockUnits;
    prev = b.upTo;
  }
  return Math.round(total + CEB_TARIFF.fixedCharge);
}