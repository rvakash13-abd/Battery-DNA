// Simulated battery data. Replace these generators with a FastAPI call
// (e.g. POST /api/analyze) or live BMS/CAN data when hardware is ready.
export type Battery = { id: string; chemistry: string; voltage: number; current: number; temp: number; resistance: number; cycles: number; soh: number };

export const DEMO: Battery = { id: "EVB-2048", chemistry: "Lithium-Ion", voltage: 3.65, current: 18.4, temp: 30, resistance: 18, cycles: 742, soh: 92 };
export const EMPTY: Battery = { id: "", chemistry: "Lithium-Ion", voltage: 0, current: 0, temp: 0, resistance: 0, cycles: 0, soh: 0 };

const noise = (i: number, s: number) => Math.sin(i * 12.9898 + s) * 0.5;

export const voltageProfile = Array.from({ length: 25 }, (_, i) => ({ t: i * 5, v: +(3.62 + Math.sin(i / 3) * 0.05 + noise(i, 1) * 0.015).toFixed(3) }));
export const tempProfile = Array.from({ length: 25 }, (_, i) => ({ t: i * 5, c: +(27 + i * 0.18 + Math.sin(i / 4) * 0.8 + noise(i, 2)).toFixed(1) }));
export const resistanceTrend = Array.from({ length: 12 }, (_, i) => ({ cycle: i * 70, r: +(12.5 + i * 0.5 + noise(i, 3) * 0.3).toFixed(1) }));
export const chargeCurve = Array.from({ length: 21 }, (_, i) => {
  const s = i * 5;
  return { soc: s, charge: +(3.2 + 0.95 * (s / 100) ** 0.8 + (s > 85 ? (s - 85) * 0.004 : 0)).toFixed(3), discharge: +(3.12 + 0.88 * (s / 100) ** 0.9).toFixed(3) };
});

export const scenarios = {
  normal: { label: "Normal Usage", pts: [94, 86, 78], note: "Gradual, expected ageing under moderate daily use." },
  fast: { label: "Frequent Fast Charging", pts: [94, 82, 68], note: "Higher charge current may accelerate resistance growth." },
  heat: { label: "High Temperature", pts: [94, 80, 64], note: "Sustained heat may speed up electrolyte and SEI degradation." },
} as const;
export const futureLabels = ["Today", "6 Months", "1 Year"];

export const analysisSteps = ["Collecting Battery Data...", "Extracting Behavioral Features...", "Generating Battery DNA Profile...", "Running AI Analysis...", "Calculating Trust Score..."];
