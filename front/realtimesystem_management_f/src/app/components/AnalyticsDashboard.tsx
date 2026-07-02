import { useState, useEffect, useRef } from "react";
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Users,
  DollarSign,
  Zap,
  Server,
  Globe,
  AlertCircle,
  Wifi,
} from "lucide-react";

// ── color palette ──────────────────────────────────────────────
const C = {
  cyan:   "#22d3ee",
  green:  "#4ade80",
  amber:  "#fbbf24",
  violet: "#a78bfa",
  rose:   "#f87171",
  blue:   "#60a5fa",
  indigo: "#818cf8",
};

const HISTORY = 60;
const SESSION_HIST = 40;

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}

function step(prev: number, lo: number, hi: number, vol: number) {
  return clamp(prev + (Math.random() - 0.5) * 2 * vol, lo, hi);
}

function initArr(start: number, lo: number, hi: number, len: number, vol: number) {
  const a = [start];
  for (let i = 1; i < len; i++) a.push(step(a[i - 1], lo, hi, vol));
  return a;
}

function toSeries(arrs: Record<string, number[]>) {
  const len = Object.values(arrs)[0].length;
  return Array.from({ length: len }, (_, i) => {
    const pt: Record<string, number | string> = { t: i };
    for (const [k, arr] of Object.entries(arrs)) pt[k] = +arr[i].toFixed(1);
    return pt;
  });
}

function fmt(n: number, decimals = 0) {
  return n.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

function fmtMs(n: number) {
  return `${n.toFixed(0)}ms`;
}

// ── tiny custom tooltip ─────────────────────────────────────────
function ChartTip({ active, payload, label, unit = "" }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-neutral-900 border border-neutral-700 rounded-md px-3 py-2 text-xs font-mono shadow-xl">
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full shrink-0" style={{ background: p.color }} />
          <span className="text-neutral-400">{p.name}:</span>
          <span style={{ color: p.color }}>{p.value}{unit}</span>
        </div>
      ))}
    </div>
  );
}

// ── KPI card ───────────────────────────────────────────────────
interface KpiProps {
  label: string;
  value: string;
  delta: string;
  up: boolean;
  icon: React.ReactNode;
  accent: string;
  sparkData: number[];
}

function KpiCard({ label, value, delta, up, icon, accent, sparkData }: KpiProps) {
  const spark = sparkData.map((v, i) => ({ t: i, v }));
  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 flex flex-col gap-3 hover:border-neutral-700 transition-colors">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-neutral-500 text-xs uppercase tracking-widest font-mono mb-1">{label}</p>
          <p className="text-neutral-50 text-2xl font-mono font-bold tracking-tight">{value}</p>
        </div>
        <div className="size-9 rounded-lg flex items-center justify-center" style={{ background: `${accent}1a` }}>
          <span style={{ color: accent }}>{icon}</span>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          {up
            ? <TrendingUp size={12} className="text-green-400" />
            : <TrendingDown size={12} className="text-rose-400" />}
          <span className={`text-xs font-mono ${up ? "text-green-400" : "text-rose-400"}`}>{delta}</span>
          <span className="text-neutral-600 text-xs ml-1">vs last hr</span>
        </div>
        <div className="w-24 h-8">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={spark}>
              <Line type="monotone" dataKey="v" stroke={accent} dot={false} strokeWidth={1.5} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

// ── live dot indicator ──────────────────────────────────────────
function LiveDot() {
  return (
    <span className="relative flex size-2">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
      <span className="relative inline-flex rounded-full size-2 bg-green-400" />
    </span>
  );
}

// ── section card wrapper ────────────────────────────────────────
function Card({ title, children, accent, className = "" }: {
  title: string;
  children: React.ReactNode;
  accent?: string;
  className?: string;
}) {
  return (
    <div className={`bg-neutral-900 border border-neutral-800 rounded-xl p-5 flex flex-col gap-4 ${className}`}>
      <div className="flex items-center gap-2">
        {accent && <span className="w-1 h-4 rounded-full" style={{ background: accent }} />}
        <p className="text-neutral-300 text-sm font-mono tracking-wide">{title}</p>
      </div>
      {children}
    </div>
  );
}

// ── traffic donut ───────────────────────────────────────────────
const SOURCES = [
  { name: "Organic", color: C.cyan },
  { name: "Direct",  color: C.violet },
  { name: "Referral",color: C.amber },
  { name: "Social",  color: C.green },
];

// ── main component ─────────────────────────────────────────────
export function AnalyticsDashboard() {
  // ── initial state ─────────────────────────────────────────────
  const [cpu,  setCpu]  = useState(() => initArr(45, 10, 95, HISTORY, 8));
  const [mem,  setMem]  = useState(() => initArr(62, 30, 85, HISTORY, 4));
  const [net,  setNet]  = useState(() => initArr(30, 5,  90, HISTORY, 12));

  const [p50,  setP50]  = useState(() => initArr(48,  20,  120, HISTORY, 10));
  const [p95,  setP95]  = useState(() => initArr(120, 60,  280, HISTORY, 18));
  const [p99,  setP99]  = useState(() => initArr(220, 120, 500, HISTORY, 25));

  const [sess, setSess] = useState(() => initArr(3200, 800, 6000, SESSION_HIST, 120));

  const [rps,  setRps]  = useState(342);
  const [err,  setErr]  = useState(0.12);
  const [dau,  setDau]  = useState(14231);
  const [rev,  setRev]  = useState(24817);

  const [apiCounts, setApiCounts] = useState([
    { name: "/api/auth",    count: 1820 },
    { name: "/api/users",   count: 1340 },
    { name: "/api/data",    count: 2210 },
    { name: "/api/events",  count:  980 },
    { name: "/api/metrics", count: 1560 },
    { name: "/api/search",  count:  740 },
    { name: "/api/export",  count:  410 },
  ]);

  const [traffic, setTraffic] = useState([
    { name: "Organic",  value: 43 },
    { name: "Direct",   value: 28 },
    { name: "Referral", value: 18 },
    { name: "Social",   value: 11 },
  ]);

  // spark arrays for KPI cards
  const [cpuSpark,  setCpuSpark]  = useState(() => initArr(45, 10, 95, 20, 8));
  const [sessSpark, setSessSpark] = useState(() => initArr(3200, 800, 6000, 20, 120));
  const [rpsSpark,  setRpsSpark]  = useState(() => initArr(342, 100, 900, 20, 40));
  const [errSpark,  setErrSpark]  = useState(() => initArr(0.12, 0, 2, 20, 0.05));

  const tick = useRef(0);

  useEffect(() => {
    const id = setInterval(() => {
      tick.current++;

      // slide CPU / MEM / NET
      setCpu(prev => { const n = step(prev[prev.length - 1], 10, 95, 8); return [...prev.slice(1), n]; });
      setMem(prev => { const n = step(prev[prev.length - 1], 30, 85, 3); return [...prev.slice(1), n]; });
      setNet(prev => { const n = step(prev[prev.length - 1], 5,  90, 14); return [...prev.slice(1), n]; });

      // response time
      setP50(prev  => { const n = step(prev[prev.length - 1], 20, 120, 8); return [...prev.slice(1), n]; });
      setP95(prev  => { const n = step(prev[prev.length - 1], 60, 280, 15); return [...prev.slice(1), n]; });
      setP99(prev  => { const n = step(prev[prev.length - 1], 120, 500, 22); return [...prev.slice(1), n]; });

      // sessions (slower)
      if (tick.current % 2 === 0) {
        setSess(prev => { const n = step(prev[prev.length - 1], 800, 6000, 80); return [...prev.slice(1), n]; });
      }

      // live KPI numbers
      setRps(prev  => clamp(prev + (Math.random() - 0.48) * 30, 80, 950));
      setErr(prev  => clamp(prev + (Math.random() - 0.5) * 0.04, 0, 2.5));
      setDau(prev  => clamp(Math.round(prev + (Math.random() - 0.48) * 12), 10000, 20000));
      setRev(prev  => prev + Math.random() * 3.2);

      // spark series
      setCpuSpark(prev  => { const n = step(prev[prev.length - 1], 10, 95, 8); return [...prev.slice(1), n]; });
      setSessSpark(prev => { const n = step(prev[prev.length - 1], 800, 6000, 80); return [...prev.slice(1), n]; });
      setRpsSpark(prev  => { const n = step(prev[prev.length - 1], 100, 900, 40); return [...prev.slice(1), n]; });
      setErrSpark(prev  => { const n = clamp(step(prev[prev.length - 1], 0, 2.5, 0.05), 0, 2.5); return [...prev.slice(1), n]; });

      // API counts every ~3s (6 ticks at 500ms)
      if (tick.current % 6 === 0) {
        setApiCounts(prev =>
          prev.map(d => ({ ...d, count: clamp(Math.round(d.count + (Math.random() - 0.45) * 80), 100, 4000) }))
        );
        setTraffic(prev => {
          const raw = prev.map(d => ({ ...d, value: clamp(d.value + (Math.random() - 0.5) * 2, 5, 60) }));
          const total = raw.reduce((s, d) => s + d.value, 0);
          return raw.map(d => ({ ...d, value: +((d.value / total) * 100).toFixed(1) }));
        });
      }
    }, 500);
    return () => clearInterval(id);
  }, []);

  // ── derived chart data ─────────────────────────────────────────
  const serverData   = toSeries({ CPU: cpu, Memory: mem, Network: net });
  const latencyData  = toSeries({ P50: p50, P95: p95, P99: p99 });
  const sessionData  = toSeries({ Sessions: sess });

  const now = new Date();
  const timeStr = now.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });

  // ── render ─────────────────────────────────────────────────────
  return (
    <div className="flex-1 h-full bg-neutral-950 overflow-auto">
      <div className="p-6 max-w-[1400px] mx-auto space-y-5">

        {/* header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-neutral-50 text-2xl font-mono font-bold tracking-tight">분석 대시보드</h1>
            <p className="text-neutral-500 text-xs font-mono mt-0.5">실시간 시스템 및 비즈니스 지표</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2">
              <LiveDot />
              <span className="text-green-400 text-xs font-mono">LIVE</span>
              <span className="text-neutral-500 text-xs font-mono ml-1">{timeStr}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2">
              <Server size={12} className="text-neutral-500" />
              <span className="text-neutral-400 text-xs font-mono">prod-cluster-01</span>
            </div>
          </div>
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard
            label="매출"
            value={`$${fmt(rev)}`}
            delta="+12.3%"
            up
            icon={<DollarSign size={16} />}
            accent={C.green}
            sparkData={rpsSpark.map(v => v * 0.08)}
          />
          <KpiCard
            label="일간 활성 사용자"
            value={fmt(dau)}
            delta="+8.1%"
            up
            icon={<Users size={16} />}
            accent={C.cyan}
            sparkData={sessSpark.map(v => v / 1000)}
          />
          <KpiCard
            label="요청/초"
            value={fmt(rps)}
            delta={rps > 400 ? "+high" : "normal"}
            up={rps < 600}
            icon={<Zap size={16} />}
            accent={C.amber}
            sparkData={rpsSpark}
          />
          <KpiCard
            label="에러율"
            value={`${err.toFixed(2)}%`}
            delta={err < 0.5 ? "−healthy" : "+warning"}
            up={err < 0.5}
            icon={<AlertCircle size={16} />}
            accent={err > 1 ? C.rose : C.violet}
            sparkData={errSpark}
          />
        </div>

        {/* row 2: server metrics + traffic sources */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card title="서버 리소스 (실시간)" accent={C.cyan} className="lg:col-span-2">
            <div className="flex gap-4 mb-1">
              {[
                { key: "CPU",     color: C.cyan,   val: cpu[cpu.length - 1],   unit: "%" },
                { key: "Memory",  color: C.violet, val: mem[mem.length - 1],   unit: "%" },
                { key: "Network", color: C.amber,  val: net[net.length - 1],   unit: "%" },
              ].map(s => (
                <div key={s.key} className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ background: s.color }} />
                  <span className="text-neutral-500 text-xs font-mono">{s.key}</span>
                  <span className="font-mono text-xs font-bold" style={{ color: s.color }}>
                    {s.val.toFixed(1)}{s.unit}
                  </span>
                </div>
              ))}
            </div>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={serverData} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
                  <defs>
                    {[
                      { id: "gcpu",  color: C.cyan },
                      { id: "gmem",  color: C.violet },
                      { id: "gnet",  color: C.amber },
                    ].map(g => (
                      <linearGradient key={g.id} id={g.id} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor={g.color} stopOpacity={0.15} />
                        <stop offset="95%" stopColor={g.color} stopOpacity={0.01} />
                      </linearGradient>
                    ))}
                  </defs>
                  <CartesianGrid stroke="#262626" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="t" hide />
                  <YAxis domain={[0, 100]} tick={{ fill: "#525252", fontSize: 10, fontFamily: "monospace" }} />
                  <Tooltip content={<ChartTip unit="%" />} />
                  <Area type="monotone" dataKey="CPU"     stroke={C.cyan}   fill="url(#gcpu)"  strokeWidth={1.5} dot={false} isAnimationActive={false} name="CPU" />
                  <Area type="monotone" dataKey="Memory"  stroke={C.violet} fill="url(#gmem)"  strokeWidth={1.5} dot={false} isAnimationActive={false} name="Memory" />
                  <Area type="monotone" dataKey="Network" stroke={C.amber}  fill="url(#gnet)"  strokeWidth={1.5} dot={false} isAnimationActive={false} name="Network" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card title="트래픽 소스" accent={C.violet}>
            <div className="flex-1 flex flex-col items-center">
              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={traffic}
                      cx="50%"
                      cy="50%"
                      innerRadius={52}
                      outerRadius={76}
                      paddingAngle={3}
                      dataKey="value"
                      isAnimationActive={false}
                    >
                      {traffic.map((_, i) => (
                        <Cell key={i} fill={SOURCES[i].color} stroke="transparent" />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(v: number) => [`${v.toFixed(1)}%`, ""]}
                      contentStyle={{ background: "#171717", border: "1px solid #404040", borderRadius: 8, fontSize: 12, fontFamily: "monospace" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="w-full space-y-2 mt-1">
                {traffic.map((d, i) => (
                  <div key={d.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full" style={{ background: SOURCES[i].color }} />
                      <span className="text-neutral-400 text-xs font-mono">{d.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1 bg-neutral-800 rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${d.value}%`, background: SOURCES[i].color }} />
                      </div>
                      <span className="text-xs font-mono font-bold" style={{ color: SOURCES[i].color }}>{d.value.toFixed(1)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* row 3: response latency + active sessions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card title="응답 지연 시간 (ms)" accent={C.rose}>
            <div className="flex gap-4 mb-1">
              {[
                { key: "P50", color: C.green,  val: p50[p50.length - 1] },
                { key: "P95", color: C.amber,  val: p95[p95.length - 1] },
                { key: "P99", color: C.rose,   val: p99[p99.length - 1] },
              ].map(s => (
                <div key={s.key} className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ background: s.color }} />
                  <span className="text-neutral-500 text-xs font-mono">{s.key}</span>
                  <span className="font-mono text-xs font-bold" style={{ color: s.color }}>{fmtMs(s.val)}</span>
                </div>
              ))}
            </div>
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={latencyData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                  <CartesianGrid stroke="#262626" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="t" hide />
                  <YAxis tick={{ fill: "#525252", fontSize: 10, fontFamily: "monospace" }} />
                  <Tooltip content={<ChartTip unit="ms" />} />
                  <Line type="monotone" dataKey="P50" stroke={C.green} strokeWidth={1.5} dot={false} isAnimationActive={false} name="P50" />
                  <Line type="monotone" dataKey="P95" stroke={C.amber} strokeWidth={1.5} dot={false} isAnimationActive={false} name="P95" />
                  <Line type="monotone" dataKey="P99" stroke={C.rose}  strokeWidth={2}   dot={false} isAnimationActive={false} name="P99" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card title="활성 세션" accent={C.blue}>
            <div className="flex items-end justify-between mb-1">
              <span className="text-neutral-50 text-2xl font-mono font-bold">
                {fmt(sess[sess.length - 1])}
              </span>
              <span className="text-neutral-500 text-xs font-mono">현재 동시 접속</span>
            </div>
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sessionData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gsess" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor={C.blue} stopOpacity={0.2} />
                      <stop offset="95%" stopColor={C.blue} stopOpacity={0.01} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#262626" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="t" hide />
                  <YAxis tick={{ fill: "#525252", fontSize: 10, fontFamily: "monospace" }} />
                  <Tooltip
                    formatter={(v: number) => [fmt(v), "Sessions"]}
                    contentStyle={{ background: "#171717", border: "1px solid #404040", borderRadius: 8, fontSize: 12, fontFamily: "monospace" }}
                  />
                  <Area type="monotone" dataKey="Sessions" stroke={C.blue} fill="url(#gsess)" strokeWidth={2} dot={false} isAnimationActive={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* row 4: API endpoint bar chart */}
        <Card title="API 엔드포인트별 요청 수" accent={C.indigo}>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={apiCounts} margin={{ top: 4, right: 4, left: -10, bottom: 0 }} barSize={24}>
                <CartesianGrid stroke="#262626" strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fill: "#737373", fontSize: 11, fontFamily: "monospace" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis tick={{ fill: "#525252", fontSize: 10, fontFamily: "monospace" }} axisLine={false} tickLine={false} />
                <Tooltip
                  formatter={(v: number) => [fmt(v), "요청"]}
                  contentStyle={{ background: "#171717", border: "1px solid #404040", borderRadius: 8, fontSize: 12, fontFamily: "monospace" }}
                />
                <Bar dataKey="count" name="요청" radius={[4, 4, 0, 0]} isAnimationActive={false}>
                  {apiCounts.map((_, i) => {
                    const palette = [C.indigo, C.cyan, C.violet, C.blue, C.green, C.amber, C.rose];
                    return <Cell key={i} fill={palette[i % palette.length]} fillOpacity={0.85} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* row 5: system status grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "DB 연결", status: "정상", color: C.green, icon: <Server size={12} /> },
            { label: "캐시 히트율", status: `${clamp(87 + Math.round((rps % 10) - 5), 70, 98)}%`, color: C.cyan, icon: <Zap size={12} /> },
            { label: "CDN 상태", status: "운영중", color: C.green, icon: <Globe size={12} /> },
            { label: "평균 업타임", status: "99.97%", color: C.amber, icon: <Activity size={12} /> },
          ].map(item => (
            <div key={item.label} className="bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-3 flex items-center gap-3 hover:border-neutral-700 transition-colors">
              <div className="size-7 rounded-md flex items-center justify-center" style={{ background: `${item.color}1a` }}>
                <span style={{ color: item.color }}>{item.icon}</span>
              </div>
              <div>
                <p className="text-neutral-500 text-xs font-mono">{item.label}</p>
                <p className="font-mono text-sm font-bold" style={{ color: item.color }}>{item.status}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
