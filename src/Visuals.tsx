import { motion } from "framer-motion";

export function BatteryPack() {
  return (
    <svg viewBox="0 0 520 320" width="100%" role="img" aria-label="EV battery pack with blue data visualization">
      <defs>
        <linearGradient id="body" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#e9f3ff" /><stop offset="1" stopColor="#b9d6f5" /></linearGradient>
        <linearGradient id="top" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#0866D5" /><stop offset="1" stopColor="#168CFF" /></linearGradient>
      </defs>
      <ellipse cx="260" cy="285" rx="220" ry="18" fill="#0B2A5B" opacity=".12" />
      <path d="M40 120 L260 60 L480 120 L480 230 L260 290 L40 230Z" fill="url(#body)" stroke="#0866D5" strokeWidth="2" />
      <path d="M40 120 L260 180 L480 120 L260 60Z" fill="#f4f9ff" stroke="#0866D5" strokeWidth="2" />
      <path d="M260 180 L260 290 L40 230 L40 120Z" fill="#cfe4fa" opacity=".6" />
      {Array.from({ length: 4 }).map((_, r) => Array.from({ length: 6 }).map((_, c) => {
        const x = 130 + c * 44 - r * 26, y = 112 + c * 11 + r * 18;
        return <rect key={`${r}${c}`} x={x} y={y} width="30" height="14" rx="3" fill="url(#top)" opacity={0.55 + ((r + c) % 3) * 0.15} transform={`skewY(15) translate(0 ${-(x * 0.26) + 22})`} />;
      }))}
      <motion.path d="M70 150 L120 150 L140 125 L165 175 L190 140 L215 160 L260 160" fill="none" stroke="#168CFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }} />
      <rect x="215" y="40" width="26" height="14" rx="3" fill="#0B2A5B" /><rect x="279" y="40" width="26" height="14" rx="3" fill="#0B2A5B" />
      <text x="330" y="226" fill="#0B2A5B" fontSize="14" fontWeight="800" transform="rotate(-18 330 226)">BATTERY DNA+</text>
    </svg>
  );
}

export function Gauge({ value }: { value: number }) {
  const r = 78, c = 2 * Math.PI * r;
  return (
    <svg viewBox="0 0 200 200" width="220" role="img" aria-label={`Trust score ${value} out of 100`}>
      <circle cx="100" cy="100" r={r} fill="none" stroke="#DDF2FF" strokeWidth="16" />
      <motion.circle cx="100" cy="100" r={r} fill="none" stroke="#20B26B" strokeWidth="16" strokeLinecap="round" strokeDasharray={c} initial={{ strokeDashoffset: c }} animate={{ strokeDashoffset: c * (1 - value / 100) }} transition={{ duration: 1.4, ease: "easeOut" }} transform="rotate(-90 100 100)" />
      <text x="100" y="104" textAnchor="middle" fontSize="46" fontWeight="800" fill="#0B2A5B">{value}</text>
      <text x="100" y="128" textAnchor="middle" fontSize="14" fill="#486581">/ 100</text>
    </svg>
  );
}

// Fingerprint-like rings, each ring modulated by a waveform.
export function DnaPrint() {
  const rings = Array.from({ length: 14 }, (_, i) => {
    const r = 22 + i * 12;
    let d = "";
    for (let a = 0; a <= 360; a += 4) {
      const rad = (a * Math.PI) / 180;
      const rr = r + Math.sin(a / 9 + i) * (2 + i * 0.25);
      d += `${a === 0 ? "M" : "L"}${(160 + Math.cos(rad) * rr).toFixed(1)} ${(160 + Math.sin(rad) * rr * 0.92).toFixed(1)} `;
    }
    return d + "Z";
  });
  return (
    <svg viewBox="0 0 320 320" width="100%" style={{ maxWidth: 380 }} role="img" aria-label="Battery DNA fingerprint">
      {rings.map((d, i) => (
        <motion.path key={i} d={d} fill="none" stroke={i % 3 === 0 ? "#20B26B" : "#0866D5"} strokeWidth="1.6" opacity={0.35 + (i % 4) * 0.15} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2, delay: i * 0.08 }} />
      ))}
      <rect x="140" y="146" width="40" height="28" rx="5" fill="#fff" stroke="#0866D5" strokeWidth="2" /><rect x="180" y="154" width="4" height="12" fill="#0866D5" />
      <rect x="144" y="150" width="26" height="20" rx="3" fill="#168CFF" />
    </svg>
  );
}
