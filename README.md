# Battery DNA+ (hackathon prototype)

React + TypeScript + Vite, Recharts, Framer Motion, Lucide.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
```

Demo flow: click **Analyze Battery** (auto-loads EVB-2048) → watch the 5-step analysis → results, charts, anomaly analysis, simulator and REPURPOSE recommendation.

All data is simulated in `src/data.ts`. To connect real data later, replace those generators with a FastAPI call (e.g. `POST /api/analyze`) or a BMS/CAN feed.
