import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Battery as Bat, Fingerprint, HelpCircle, EyeOff, TrendingDown, ShieldAlert, QrCode, Check, AlertTriangle, ArrowRight, ArrowDown, Zap, Recycle, Wrench, Play, Home, Leaf, Coins, Cpu } from "lucide-react";
import { DEMO, EMPTY, Battery, voltageProfile, tempProfile, resistanceTrend, chargeCurve, scenarios, futureLabels, analysisSteps } from "./data";
import { BatteryPack, Gauge, DnaPrint } from "./Visuals";

const Head = ({ t, s }: { t: string; s?: string }) => (<><h2>{t}</h2>{s && <p className="sub">{s}</p>}</>);
const Ck = ({ children }: { children: React.ReactNode }) => <div className="chk"><Check size={14} />{children}</div>;

function Chart({ title, data, x, lines, unit }: { title: string; data: any[]; x: string; lines: { k: string; c: string; n?: string }[]; unit?: string }) {
  return (
    <div className="card chart">
      <h3>{title}</h3>
      <ResponsiveContainer width="100%" height={230}>
        <LineChart data={data} margin={{ left: -10, right: 8, top: 5 }}>
          <CartesianGrid stroke="#e3effc" strokeDasharray="3 3" />
          <XAxis dataKey={x} tick={{ fontSize: 12 }} /><YAxis tick={{ fontSize: 12 }} domain={["auto", "auto"]} unit={unit} />
          <Tooltip />{lines.length > 1 && <Legend />}
          {lines.map((l) => <Line key={l.k} dataKey={l.k} name={l.n ?? l.k} stroke={l.c} strokeWidth={2.4} dot={false} type="monotone" />)}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default function App() {
  const [b, setB] = useState<Battery>(EMPTY);
  const [stage, setStage] = useState<"idle" | "run" | "done">("idle");
  const [step, setStep] = useState(0);
  const [scn, setScn] = useState<keyof typeof scenarios>("normal");
  const results = useRef<HTMLDivElement>(null);
  const loaded = b.id !== "";

  const num = (k: keyof Battery) => (e: React.ChangeEvent<HTMLInputElement>) => setB({ ...b, id: b.id || "EVB-CUSTOM", [k]: +e.target.value });
  const load = () => { setB(DEMO); setStage("idle"); };
  const analyze = () => { if (!loaded) setB(DEMO); setStage("run"); setStep(0); document.getElementById("scan")?.scrollIntoView(); };

  useEffect(() => {
    if (stage !== "run") return;
    if (step >= analysisSteps.length) { setStage("done"); setTimeout(() => results.current?.scrollIntoView({ behavior: "smooth" }), 150); return; }
    const t = setTimeout(() => setStep(step + 1), 800);
    return () => clearTimeout(t);
  }, [stage, step]);

  const done = stage === "done";
  const sc = scenarios[scn];
  const fut = futureLabels.map((l, i) => ({ l, score: sc.pts[i] }));

  const fields: [string, string][] = [["Battery ID", b.id || "—"], ["Chemistry", b.chemistry], ["Voltage", loaded ? `${b.voltage} V` : "—"], ["Current", loaded ? `${b.current} A` : "—"], ["Temperature", loaded ? `${b.temp}°C` : "—"], ["Internal Resistance", loaded ? `${b.resistance} mΩ` : "—"], ["Cycle Count", loaded ? `${b.cycles}` : "—"], ["SOH", loaded ? `${b.soh}%` : "—"]];

  return (
    <>
      <nav><div className="wrap">
        <div className="logo"><span style={{ position: "relative", display: "grid" }}><Bat size={26} color="#0866D5" /><Fingerprint size={13} color="#168CFF" style={{ position: "absolute", left: 6, top: 6 }} /></span>Battery DNA+</div>
        <div className="links">{[["Home", "#home"], ["How It Works", "#how"], ["Battery Scan", "#scan"], ["Results", "#results"]].map(([n, h]) => <a key={n} href={h}>{n}</a>)}</div>
        <button className="btn primary" style={{ padding: "9px 18px" }} onClick={analyze}>Analyze Battery</button>
      </div></nav>

      <header className="hero" id="home"><div className="wrap hero-grid">
        <div>
          <div className="badge-top"><i />AI-powered electrochemical trust</div>
          <h1>Know Your Battery. Trust Its Future.</h1>
          <p>Battery DNA+ analyzes the behavioral fingerprint of an EV battery to reveal its condition, detect anomalies and guide its next life.</p>
          <div className="row"><button className="btn primary" onClick={analyze}>Analyze Battery</button><a href="#how"><button className="btn">See How It Works</button></a></div>
          <div className="stats"><div><b>94/100</b><span>Trust Score</span></div><div><b>5</b><span>Behavioral signatures</span></div><div><b>4</b><span>Next-life decisions</span></div></div>
        </div>
        <div className="pack">
          <BatteryPack />
          <div className="card float">
            <div style={{ fontSize: 13, color: "#486581", fontWeight: 600 }}>Battery Trust Score</div>
            <div className="big">94 <span style={{ fontSize: 18, color: "#627d98" }}>/ 100</span></div>
            <span className="tag">High Trust</span>
            <Ck>Safe</Ck><Ck>Low Tamper Risk</Ck><Ck>Behavioral Consistency</Ck>
          </div>
        </div>
      </div></header>

      <section><div className="wrap">
        <Head t="The Battery Trust Gap" s="Used EV batteries can look normal externally while their actual internal condition remains uncertain." />
        <div className="grid g4">
          {[[HelpCircle, "Unknown condition", "Actual battery condition may not be visible from external inspection."], [TrendingDown, "Hidden degradation", "Electrical and thermal behavior can reveal degradation that is not obvious externally."], [ShieldAlert, "Possible tampering", "Cell replacement or improper repair may create behavioral inconsistencies."], [QrCode, "Limited trust", "A QR code, serial number or historical record does not by itself show present condition."]].map(([I, t, d]: any) => (
            <div className="card" key={t}><div className="ic"><I size={22} /></div><h3>{t}</h3><p>{d}</p></div>
          ))}
        </div>
        <div className="banner">Battery Identity ≠ Battery Condition</div>
      </div></section>

      <section className="alt"><div className="wrap">
        <Head t="Why Battery DNA+?" />
        <table><thead><tr><th>Existing Systems</th><th>Battery DNA+</th></tr></thead><tbody>
          {[["QR / Serial Number", "Behavioral Fingerprint"], ["Battery Passport", "Present-Condition Verification"], ["SOH", "Trust + Condition"], ["SOC", "Not the Primary Objective"], ["RUL", "Future Degradation Prediction"], ["BMS", "AI-Powered Analysis Layer"], ["Fault Detection", "Tamper + Anomaly Detection"], ["Battery Testing", "Testing + Decision Recommendation"]].map(([a, c]) => <tr key={a}><td>{a}</td><td>{c}</td></tr>)}
        </tbody></table>
        <p className="quote">“Battery DNA+ focuses on how the battery behaves now—not only what its records say about it.”</p>
      </div></section>

      <section id="how"><div className="wrap">
        <Head t="How Battery DNA+ Works" />
        <div className="flow">
          {[["Data", "Voltage + Current + Temperature + Resistance + BMS"], ["Features", "Electrical + Thermal Behavioral Patterns"], ["Battery DNA", "Battery-Specific Behavioral Profile"], ["AI", "Anomalies + Condition + Degradation"], ["Decision", "Trust Score + Recommendation"]].map(([t, d], i, a) => (
            <div key={t} style={{ display: "contents" }}>
              <div className="card"><div className="num">{i + 1}</div><h3>{t}</h3><p>{d}</p></div>
              {i < a.length - 1 && <div className="arrow"><ArrowRight /></div>}
            </div>
          ))}
        </div>
      </div></section>

      <section className="alt" id="scan"><div className="wrap">
        <Head t="Analyze a Battery" s="No hardware needed — load the demo battery or edit the readings yourself." />
        <div className="scan">
          <div className="card">
            <div className="row" style={{ justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}><h3 style={{ fontSize: 18 }}>Battery Information</h3><Bat color="#0866D5" /></div>
            {stage === "idle" || stage === "done" ? (
              <>
                {fields.map(([k, v]) => <div className="field" key={k}><span>{k}</span><b>{v}</b></div>)}
                <details style={{ marginTop: 10 }}><summary style={{ cursor: "pointer", color: "var(--pri)", fontWeight: 600 }}>Edit readings</summary>
                  <div className="grid g2" style={{ marginTop: 10 }}>
                    {([["voltage", "Voltage (V)"], ["current", "Current (A)"], ["temp", "Temp (°C)"], ["resistance", "Resistance (mΩ)"], ["cycles", "Cycles"], ["soh", "SOH (%)"]] as [keyof Battery, string][]).map(([k, l]) => (
                      <label key={k} style={{ fontSize: 13 }}>{l}<input type="number" step="any" value={b[k] as number} onChange={num(k)} style={{ width: "100%", padding: 8, border: "1px solid var(--border)", borderRadius: 8, marginTop: 3 }} /></label>
                    ))}
                  </div></details>
              </>
            ) : null}
            {stage === "run" && <ul className="steps">{analysisSteps.map((s, i) => <li key={s} className={i < step ? "done" : i === step ? "on" : ""}>{i < step ? <Check size={16} /> : <Zap size={16} />}{s}</li>)}</ul>}
            {stage === "run" && <div className="bar"><i style={{ width: `${(step / analysisSteps.length) * 100}%` }} /></div>}
            <div className="row" style={{ marginTop: 18 }}>
              <button className="btn primary" disabled={stage === "run"} onClick={analyze}>Analyze Battery</button>
              <button className="btn" disabled={stage === "run"} onClick={load}>Load Demo Battery</button>
            </div>
          </div>
          <div className="card" style={{ display: "grid", placeItems: "center", background: "linear-gradient(160deg,#fff,var(--light))" }}>
            <div style={{ textAlign: "center" }}>
              <DnaPrint />
              <p style={{ color: "#486581", fontSize: 14 }}>{stage === "run" ? "Building behavioral fingerprint…" : done ? "Battery DNA profile generated." : "Your battery's behavioral fingerprint appears here."}</p>
            </div>
          </div>
        </div>
      </div></section>

      <div ref={results} id="results">
        {!done ? (
          <section><div className="wrap"><div className="card locked"><Play size={28} color="#0866D5" /><h3 style={{ marginTop: 8 }}>Results appear here</h3><p>Click “Analyze Battery” to run the demo and see the Trust Score, analytics and recommendation.</p></div></div></section>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <section><div className="wrap">
              <Head t="Battery DNA Profile" s={`${b.id} · ${b.chemistry}`} />
              <div className="grid g2">
                <div className="card" style={{ textAlign: "center" }}>
                  <DnaPrint />
                  <div className="sig">{["Voltage Signature", "Current Signature", "Thermal Signature", "Resistance Signature", "Charge/Discharge Pattern"].map((s) => <span key={s}>{s}</span>)}</div>
                </div>
                <div className="grid">
                  <div className="card metric"><p>Behavioral Consistency</p><div className="big">92%</div><div className="bar"><i style={{ width: "92%", background: "var(--green)" }} /></div></div>
                  <div className="card metric"><p>Anomaly Level</p><div className="big" style={{ color: "var(--green)" }}>LOW</div></div>
                  <div className="card" style={{ textAlign: "center" }}>
                    <h3>Battery Trust Score</h3><Gauge value={94} /><div><span className="tag">HIGH TRUST</span></div>
                    <ul className="list" style={{ textAlign: "left", maxWidth: 260, margin: "10px auto 0" }}>
                      {[["Safety", "Safe"], ["Behavioral Consistency", "High"], ["Tamper Risk", "Low"], ["Condition", "Good"]].map(([k, v]) => <li key={k}><Check size={16} className="ok" />{k}: <b>{v}</b></li>)}
                    </ul>
                    <p className="note">AI-assisted assessment based on available battery data. Not a guarantee of authenticity or safety.</p>
                  </div>
                </div>
              </div>
            </div></section>

            <section className="alt"><div className="wrap">
              <Head t="Battery Analytics" />
              <div className="grid g2">
                <Chart title="Voltage Profile" data={voltageProfile} x="t" unit="" lines={[{ k: "v", c: "#0866D5", n: "Voltage (V)" }]} />
                <Chart title="Temperature Profile" data={tempProfile} x="t" lines={[{ k: "c", c: "#F5A623", n: "Temp (°C)" }]} />
                <Chart title="Resistance Trend" data={resistanceTrend} x="cycle" lines={[{ k: "r", c: "#168CFF", n: "Resistance (mΩ)" }]} />
                <Chart title="Charge / Discharge Curve" data={chargeCurve} x="soc" lines={[{ k: "charge", c: "#20B26B", n: "Charge (V)" }, { k: "discharge", c: "#0B2A5B", n: "Discharge (V)" }]} />
              </div>
              <p className="note">X-axes: time (min), cycle count, or state of charge (%). Demo data is simulated.</p>
            </div></section>

            <section><div className="wrap">
              <Head t="Behavioral Anomaly Analysis" />
              <div className="grid g2">
                <div className="card metric"><p>Tamper Risk</p><div className="big" style={{ color: "var(--green)" }}>LOW — 12%</div><div className="bar"><i style={{ width: "12%", background: "var(--green)" }} /></div></div>
                <div className="card">
                  <ul className="list">
                    {[["Voltage behavior", "Normal"], ["Temperature response", "Normal"], ["Resistance", "Normal"]].map(([k, v]) => <li key={k}><Check size={16} className="ok" />{k} — {v}</li>)}
                    <li><AlertTriangle size={16} className="warn" />Cell balance — Minor deviation</li>
                  </ul>
                  <p className="note" style={{ fontSize: 14 }}>A minor behavioral deviation was detected. Further inspection may be recommended. This is a probability estimate, not a confirmation of tampering.</p>
                </div>
              </div>
            </div></section>

            <section className="alt"><div className="wrap">
              <Head t="Future Impact Simulator" s="See how different usage patterns may influence battery condition over time." />
              <div className="row" style={{ marginBottom: 18 }}>
                {(Object.keys(scenarios) as (keyof typeof scenarios)[]).map((k) => <button key={k} className={`pill ${scn === k ? "sel" : ""}`} aria-pressed={scn === k} onClick={() => setScn(k)}>{scenarios[k].label}</button>)}
              </div>
              <div className="card"><h3>Estimated Trust Trend: {sc.pts.join(" → ")}</h3>
                <ResponsiveContainer width="100%" height={240}><LineChart data={fut}><CartesianGrid stroke="#e3effc" strokeDasharray="3 3" /><XAxis dataKey="l" /><YAxis domain={[50, 100]} /><Tooltip /><Line dataKey="score" name="Trust Score" stroke="#0866D5" strokeWidth={3} type="monotone" /></LineChart></ResponsiveContainer>
                <p className="note">{sc.note} Model-based prediction — actual results will vary.</p></div>
            </div></section>

            <section><div className="wrap">
              <Head t="What Should Happen Next?" />
              <div className="grid g4">
                {[["🟢", "CONTINUE", "Safe to continue using based on current assessment."], ["🟡", "REPAIR", "Further service or inspection recommended."], ["🔵", "REPURPOSE", "Potentially suitable for second-life applications."], ["🔴", "RECYCLE", "Not recommended for further use."]].map(([e, t, d]) => {
                  const hit = t === "REPURPOSE";
                  return <div key={t} className={`card dec ${hit ? "hit" : "dim"}`}>{hit && <div className="badge">Recommended</div>}<div className="em">{e}</div><h3>{t}</h3><p>{d}</p>{hit && <p style={{ marginTop: 8, fontWeight: 700, color: "var(--pri)" }}>Recommended based on current battery assessment.</p>}</div>;
                })}
              </div>
            </div></section>

            <section className="alt"><div className="wrap">
              <Head t="Second-Life Journey" />
              <div className="journey">
                {[[Bat, "Used EV Battery"], [Cpu, "Battery DNA+ Assessment"], [Recycle, "REPURPOSE"], [Home, "Second-Life Energy Storage"]].map(([I, t]: any, i, a) => (
                  <div key={t} style={{ display: "contents" }}><div className="card"><div className="ic" style={{ margin: "0 auto 10px" }}><I size={22} /></div><b>{t}</b></div>{i < a.length - 1 && <ArrowRight color="#168CFF" />}</div>
                ))}
              </div>
              <p className="quote">Extend useful battery life before recycling.</p>
            </div></section>
          </motion.div>
        )}
      </div>

      <section className={done ? "" : "alt"}><div className="wrap">
        <Head t="Why It Matters" />
        <div className="grid g3">
          {[[Leaf, "Environmental", ["Extends battery life", "Promotes second-life use", "Reduces battery waste"]], [Coins, "Economic", ["Supports used EV battery markets", "Reduces unnecessary replacement", "Helps refurbishers make decisions"]], [ShieldAlert, "Safety & Technology", ["Detects abnormal behavior", "Identifies possible tampering", "Enables AI-assisted trust scoring"]]].map(([I, t, l]: any) => (
            <div className="card" key={t}><div className="ic"><I size={22} /></div><h3>{t}</h3><ul className="list">{l.map((x: string) => <li key={x}><Check size={15} className="ok" />{x}</li>)}</ul></div>
          ))}
        </div>
      </div></section>

      <section className={done ? "alt" : ""}><div className="wrap">
        <Head t="Who Can Use It?" />
        <div className="grid g5">
          {[["EV Owners", "Understand battery condition."], ["Used Battery Buyers", "Make informed decisions."], ["Service Centers", "Support battery inspection."], ["Refurbishers", "Identify second-life opportunities."], ["Recyclers", "Identify end-of-life batteries."]].map(([t, d]) => <div className="card" key={t}><h3>{t}</h3><p>{d}</p></div>)}
        </div>
      </div></section>

      <section className={done ? "" : "alt"}><div className="wrap">
        <Head t="Technology Stack" />
        <div className="grid g3 stack">
          {[["Data Acquisition", ["Voltage Sensors", "Current Sensors", "Temperature Sensors", "BMS / CAN / OBD", "Impedance / Resistance"]], ["AI / ML", ["Feature Extraction", "Pattern Recognition", "Anomaly Detection", "Battery Fingerprinting", "Degradation Prediction"]], ["Backend", ["Python", "FastAPI", "REST API"]], ["Database", ["Battery Profiles", "Scan History", "Reference Data", "Trust Scores"]], ["Frontend", ["React / TypeScript", "Interactive Dashboard", "Charts", "Battery DNA Visualization"]], ["Decision Engine", ["Continue", "Repair", "Repurpose", "Recycle"]]].map(([t, l]: any) => (
            <div className="card" key={t} style={{ background: "var(--light)" }}><h3>{t}</h3><ul>{l.map((x: string) => <li key={x}>{x}</li>)}</ul></div>
          ))}
        </div>
      </div></section>

      <section className={done ? "alt" : ""}><div className="wrap">
        <Head t="Simple Architecture" />
        <div className="arch">
          {["EV Battery", "Data Acquisition", "Feature Extraction", "Battery DNA Profile", "AI Analysis", "Trust Score", "Decision Engine", "Continue / Repair / Repurpose / Recycle"].map((t, i, a) => (
            <div key={t} style={{ display: "contents" }}><div className="card" style={i === a.length - 1 ? { background: "var(--pri)", color: "#fff" } : undefined}>{t}</div>{i < a.length - 1 && <ArrowDown size={20} />}</div>
          ))}
        </div>
      </div></section>

      <section className={done ? "" : "alt"}><div className="wrap about">
        <h2>Battery DNA+</h2>
        <p className="sub" style={{ margin: "0 auto" }}>An AI-powered electrochemical trust platform designed to bridge the gap between battery identity, present condition and second-life decisions.</p>
        <div className="kw"><span>AI</span><span>Battery Science</span><span>Trust</span></div>
      </div></section>

      <footer className="final">
        <h2>Don't just know your battery. Know whether you can trust it.</h2>
        <button className="btn" style={{ background: "#fff" }} onClick={() => { document.getElementById("scan")?.scrollIntoView(); load(); }}>Load Demo Battery</button>
      </footer>
    </>
  );
}
