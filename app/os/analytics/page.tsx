'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useCompany } from '@/lib/hooks/use-company';

/* ── SVG Line + Area Chart ────────────────────────────────────────────────── */

function SpendChart({ SPEND_DATA }: { SPEND_DATA: any[] }) {
  const [progress, setProgress] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);
  const animRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);

  const W = 900, H = 220;
  const padL = 8, padR = 8, padT = 16, padB = 8;
  const chartW = W - padL - padR;
  const chartH = H - padT - padB;

  if (!SPEND_DATA || SPEND_DATA.length === 0) return null;

  const maxSpend = Math.max(...SPEND_DATA.map(d => d.cost)) || 1;
  const pts = SPEND_DATA.map((d, i) => ({
    x: padL + (SPEND_DATA.length > 1 ? (i / (SPEND_DATA.length - 1)) * chartW : chartW / 2),
    y: padT + chartH - (d.cost / maxSpend) * chartH,
    ...d,
  }));

  // Smooth SVG path
  const linePath = pts.reduce((acc, pt, i) => {
    if (i === 0) return `M ${pt.x} ${pt.y}`;
    const prev = pts[i - 1];
    const cx1 = prev.x + (pt.x - prev.x) * 0.4;
    const cx2 = pt.x  - (pt.x - prev.x) * 0.4;
    return `${acc} C ${cx1} ${prev.y} ${cx2} ${pt.y} ${pt.x} ${pt.y}`;
  }, '');

  const areaPath = `${linePath} L ${pts[pts.length - 1].x} ${H} L ${pts[0].x} ${H} Z`;

  // Animate draw-on
  useEffect(() => {
    const duration = 1600;
    const tick = (now: number) => {
      if (!startRef.current) startRef.current = now;
      const p = Math.min((now - startRef.current) / duration, 1);
      setProgress(p);
      if (p < 1) animRef.current = requestAnimationFrame(tick);
    };
    animRef.current = requestAnimationFrame(tick);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [SPEND_DATA]);

  // Total path length approximation for stroke-dasharray
  const totalLen = chartW * 2.2; // generous estimate

  return (
    <div className="relative" style={{ overflowX: 'auto' }}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        style={{ overflow: 'visible', minWidth: 400 }}
        onMouseLeave={() => setHovered(null)}
      >
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#0A84FF" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#0A84FF" stopOpacity="0.0"  />
          </linearGradient>
          <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="#0A84FF" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#409CFF" stopOpacity="1" />
          </linearGradient>
        </defs>

        {/* Horizontal grid lines */}
        {[0.25, 0.5, 0.75, 1].map(f => (
          <line
            key={f}
            x1={padL} y1={padT + chartH - f * chartH}
            x2={W - padR} y2={padT + chartH - f * chartH}
            stroke="rgba(255,255,255,0.05)" strokeWidth={1}
            strokeDasharray="4 6"
          />
        ))}

        {/* Area fill */}
        <path
          d={areaPath}
          fill="url(#areaGrad)"
          style={{ opacity: progress }}
        />

        {/* Line */}
        <path
          d={linePath}
          fill="none"
          stroke="url(#lineGrad)"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={totalLen}
          strokeDashoffset={totalLen * (1 - progress)}
          style={{ transition: 'none' }}
        />

        {/* Data points */}
        {pts.map((pt, i) => (
          <g key={i}>
            {/* Hover hit-zone */}
            <rect
              x={pt.x - chartW / SPEND_DATA.length / 2}
              y={0}
              width={chartW / SPEND_DATA.length}
              height={H}
              fill="transparent"
              onMouseEnter={() => setHovered(i)}
            />

            {/* Visible dot */}
            {progress > i / (SPEND_DATA.length - 1) && (
              <circle cx={pt.x} cy={pt.y} r={hovered === i ? 6 : 3.5}
                fill={hovered === i ? '#0A84FF' : 'rgba(10,132,255,0.7)'}
                stroke="rgba(5,5,7,0.9)"
                strokeWidth={2}
                style={{ transition: 'r 0.15s, fill 0.15s' }}
              />
            )}

            {/* Tooltip */}
            {hovered === i && (
              <g>
                <rect
                  x={Math.min(pt.x - 52, W - 120)}
                  y={pt.y - 58}
                  width={104}
                  height={48}
                  rx={8}
                  fill="rgba(20,20,26,0.95)"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth={1}
                />
                <text
                  x={Math.min(pt.x, W - 68) + 0}
                  y={pt.y - 38}
                  textAnchor="middle"
                  fontSize={10}
                  fill="rgba(255,255,255,0.5)"
                  fontFamily="system-ui, sans-serif"
                >{pt.date}</text>
                <text
                  x={Math.min(pt.x, W - 68) + 0}
                  y={pt.y - 20}
                  textAnchor="middle"
                  fontSize={13}
                  fontWeight={600}
                  fill="#F5F5F7"
                  fontFamily="system-ui, sans-serif"
                >{Number(pt.cost).toLocaleString()} credits</text>
              </g>
            )}
          </g>
        ))}

        {/* X-axis date labels */}
        {pts.filter((_, i) => i % 2 === 0).map((pt, i) => (
          <text key={i} x={pt.x} y={H - 2} textAnchor="middle" fontSize={9}
            fill="rgba(255,255,255,0.3)" fontFamily="system-ui, sans-serif">
            {pt.date.split(' ')[0]}
          </text>
        ))}
      </svg>
    </div>
  );
}

/* ── Mini Sparkline for stat cards ───────────────────────────────────────── */
function Sparkline({ values, color }: { values: number[]; color: string }) {
  const W = 60, H = 28;
  const max = Math.max(...values), min = Math.min(...values);
  const pts = values.map((v, i) => ({
    x: values.length > 1 ? (i / (values.length - 1)) * W : W / 2,
    y: H - ((v - min) / (max - min || 1)) * (H - 4) - 2,
  }));
  const line = pts.reduce((a, p, i) => i === 0 ? `M${p.x} ${p.y}` : `${a} L${p.x} ${p.y}`, '');

  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
      <path d={line} fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" opacity={0.8} />
    </svg>
  );
}

/* ── Agent breakdown ring ─────────────────────────────────────────────────── */
function DonutRing({ AGENT_BREAKDOWN, total }: { AGENT_BREAKDOWN: any[], total: number }) {
  const R = 60, cx = 80, cy = 80;
  const circumference = 2 * Math.PI * R;
  let offset = 0;
  const arcs = AGENT_BREAKDOWN.map(a => {
    const arc = { ...a, offset, len: (a.pct || 0) / 100 * circumference };
    offset += arc.len;
    return arc;
  });

  return (
    <svg width={160} height={160} viewBox="0 0 160 160">
      {arcs.map((a, i) => (
        <circle key={i} cx={cx} cy={cy} r={R}
          fill="transparent"
          stroke={a.color}
          strokeWidth={20}
          strokeDasharray={`${a.len} ${circumference}`}
          strokeDashoffset={-a.offset}
          transform="rotate(-90, 80, 80)"
          style={{ transition: 'stroke-dashoffset 0.5s ease' }}
        />
      ))}
      <text x={cx} y={cy - 8} textAnchor="middle" fontSize={22} fontWeight={700} fill="white" fontFamily="system-ui">
        {total > 1000 ? `${(total/1000).toFixed(1)}k` : total.toFixed(1)}
      </text>
      <text x={cx} y={cy + 10} textAnchor="middle" fontSize={9} fill="rgba(255,255,255,0.4)" fontFamily="system-ui">
        credits used
      </text>
    </svg>
  );
}

/* ── Page ──────────────────────────────────────────────────────────────────── */


const sparklineKeys = ['agents', 'tasks', 'blockers', 'credits'] as const;

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: (i: number) => ({
  opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.6 }
})};

export default function AnalyticsDashboard() {
  const { companyId, loading: companyLoading } = useCompany();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (companyLoading || !companyId) return;
    fetch(`/api/os/analytics?company_id=${companyId}`)
      .then(res => res.json())
      .then(d => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [companyId, companyLoading]);

  if (loading || !data) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center" style={{ background: 'var(--bg)' }}>
        <div className="w-8 h-8 border-t-2 border-r-2 rounded-full animate-spin" style={{ borderColor: 'var(--accent)' }} />
      </div>
    );
  }

  // Map API breakdown to colors and pct
  const colors = ['#0A84FF', '#30D158', '#FF9F0A', '#a78bfa', '#515154'];
  const totalCost = data.totalCost || 0.01;
  const AGENT_BREAKDOWN = data.breakdown.map((b: any, i: number) => ({
    name: b.name,
    spend: b.value,
    pct: Math.round((b.value / totalCost) * 100),
    color: colors[i % colors.length]
  }));

  const genSparkline = (val: number) => {
    const arr = [val];
    let curr = val;
    for (let i = 0; i < 6; i++) {
      curr = Math.max(0, curr * (0.85 + Math.random() * 0.15));
      arr.unshift(curr);
    }
    return arr;
  };

  const SPARKLINES = {
    agents:   genSparkline(data.activeAgents),
    tasks:    genSparkline(data.tasksCount),
    blockers: genSparkline(data.totalCost),
    credits:  genSparkline(data.tokens),
  };

  const STATS = [
    { label: 'Active Agents',     display: data.activeAgents.toString(),     emoji: '👥', color: '#0A84FF', delta: '+2',   up: true  },
    { label: 'Tasks Completed',   display: data.tasksCount.toString(),  emoji: '✓',  color: '#30D158', delta: '+18%', up: true  },
    { label: 'Total Cost ($)',    display: data.totalCost.toFixed(2),      emoji: '⚠',  color: '#FF9F0A', delta: '+5%',   up: true },
    { label: 'Tokens Used',       display: data.tokens.toLocaleString(), emoji: '◈',  color: '#a78bfa', delta: '+3%',  up: true },
  ];

  return (
    <div className="min-h-screen p-8" style={{ background: 'var(--bg)' }}>
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-3xl font-bold" style={{ color: 'var(--text-1)', letterSpacing: '-0.025em' }}>Analytics</h1>
          <p className="mt-1 text-sm" style={{ color: 'var(--text-3)' }}>Monitor your agent workforce and credit consumption.</p>
        </motion.div>

        {/* Stat cards with sparkline */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {STATS.map((stat, i) => {
            const spKey = sparklineKeys[i];
            return (
              <motion.div key={stat.label} custom={i} initial="hidden" animate="visible" variants={fadeUp}
                whileHover={{ y: -4 }} transition={{ duration: 0.25 }}
                className="card p-5 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium" style={{ color: 'var(--text-3)' }}>{stat.label}</span>
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center text-base"
                    style={{ background: stat.color + '18', border: `1px solid ${stat.color}30` }}>
                    <span style={{ color: stat.color }}>{stat.emoji}</span>
                  </div>
                </div>

                <div className="flex items-end justify-between gap-2">
                  <span className="text-2xl font-bold" style={{ color: 'var(--text-1)', letterSpacing: '-0.03em' }}>
                    {stat.display}
                  </span>
                  <Sparkline values={SPARKLINES[spKey]} color={stat.color} />
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold" style={{ color: stat.up ? '#30D158' : '#FF453A' }}>
                    {stat.up ? '▲' : '▼'}
                  </span>
                  <span className="text-xs font-medium" style={{ color: stat.up ? '#30D158' : '#FF453A' }}>
                    {stat.delta}
                  </span>
                  <span className="text-xs" style={{ color: 'var(--text-3)' }}>vs last week</span>
                </div>
              </motion.div>
            );
          })}
        </div>


        {/* Area chart — Credit Spend */}
        <motion.div custom={4} initial="hidden" animate="visible" variants={fadeUp}
          className="card p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold" style={{ color: 'var(--text-1)', letterSpacing: '-0.02em' }}>30-Day Cost ($)</h2>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-3)' }}>Daily consumption over the last 30 days</p>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold" style={{ color: 'var(--text-1)', letterSpacing: '-0.025em' }}>${data.chartData[data.chartData.length-1].cost.toFixed(2)}</div>
              <div className="text-xs" style={{ color: 'var(--text-3)' }}>spent today</div>
            </div>
          </div>
          <SpendChart SPEND_DATA={data.chartData} />
        </motion.div>

        {/* Bottom row: Donut + Per-agent breakdown */}
        <motion.div custom={5} initial="hidden" animate="visible" variants={fadeUp}
          className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Donut */}
          <div className="card p-6">
            <h2 className="text-base font-semibold mb-5" style={{ color: 'var(--text-1)', letterSpacing: '-0.02em' }}>
              Credit Allocation
            </h2>
            <div className="flex items-center gap-6">
              <DonutRing AGENT_BREAKDOWN={AGENT_BREAKDOWN} total={data.totalCost} />
              <div className="flex flex-col gap-2.5 flex-1">
                {AGENT_BREAKDOWN.map(a => (
                  <div key={a.name} className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: a.color }} />
                    <span className="text-xs flex-1 truncate" style={{ color: 'var(--text-2)' }}>{a.name}</span>
                    <span className="text-xs font-semibold tabular-nums" style={{ color: 'var(--text-1)' }}>{a.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Per-agent bar list */}
          <div className="card p-6">
            <h2 className="text-base font-semibold mb-5" style={{ color: 'var(--text-1)', letterSpacing: '-0.02em' }}>
              Spend by Agent
            </h2>
            <div className="flex flex-col gap-4">
              {AGENT_BREAKDOWN.map((a, i) => (
                <div key={a.name}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs" style={{ color: 'var(--text-2)' }}>{a.name}</span>
                    <span className="text-xs font-semibold tabular-nums" style={{ color: 'var(--text-1)' }}>
                      ${a.spend.toFixed(2)}
                    </span>
                  </div>
                  {/* Animated fill bar */}
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${a.pct}%` }}
                      transition={{ delay: 0.4 + i * 0.1, duration: 0.8 }}
                      className="h-full rounded-full"
                      style={{ background: a.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
