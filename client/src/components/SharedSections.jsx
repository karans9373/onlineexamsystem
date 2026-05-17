import { motion } from 'framer-motion'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { GlassCard } from './GlassCard'

export function SectionTitle({ title, copy, action }) {
  return (
    <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
      <div>
        <h2 className="font-display text-2xl text-slate-950">{title}</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{copy}</p>
      </div>
      {action ? <button className="rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white">{action}</button> : null}
    </div>
  )
}

export function StatGrid({ stats }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
      {stats.map((stat, index) => (
        <GlassCard key={stat.label} className="p-5">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.06 }}>
            <p className="text-xs uppercase tracking-[0.32em] text-slate-400">{stat.label}</p>
            <p className="mt-3 font-display text-4xl text-slate-950">{stat.value}</p>
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-slate-500">{stat.caption}</p>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">{stat.delta}</span>
            </div>
          </motion.div>
        </GlassCard>
      ))}
    </div>
  )
}

export function InsightCards({ cards }) {
  return (
    <div className="grid gap-4 xl:grid-cols-3">
      {cards.map((card) => (
        <GlassCard key={card.title} className="p-5">
          <p className="text-sm font-medium text-slate-900">{card.title}</p>
          <p className="mt-3 text-sm leading-6 text-slate-600">{card.copy}</p>
          <div className="mt-5 rounded-[24px] bg-slate-950/95 p-4 text-white">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{card.metricLabel}</p>
            <p className="mt-2 font-display text-3xl">{card.metricValue}</p>
          </div>
        </GlassCard>
      ))}
    </div>
  )
}

export function PerformanceAreaChart({ title, copy, data }) {
  return (
    <GlassCard className="p-5 xl:col-span-2">
      <SectionTitle title={title} copy={copy} />
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="astraArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.45} />
                <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(148,163,184,0.14)" vertical={false} />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
            <Tooltip />
            <Area type="monotone" dataKey="score" stroke="#0284c7" strokeWidth={3} fill="url(#astraArea)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  )
}

export function DistributionChart({ title, copy, data }) {
  const colors = ['#0f172a', '#38bdf8', '#f59e0b', '#d946ef']
  return (
    <GlassCard className="p-5">
      <SectionTitle title={title} copy={copy} />
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" innerRadius={72} outerRadius={110} paddingAngle={4}>
              {data.map((entry, index) => (
                <Cell key={entry.name} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  )
}

export function ActivityBars({ title, copy, data }) {
  return (
    <GlassCard className="p-5">
      <SectionTitle title={title} copy={copy} />
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid stroke="rgba(148,163,184,0.14)" vertical={false} />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="value" radius={[12, 12, 0, 0]} fill="#0f172a" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  )
}

export function ModernTable({ title, copy, rows }) {
  const headers = Object.keys(rows[0] ?? {})
  return (
    <GlassCard className="p-5">
      <SectionTitle title={title} copy={copy} />
      <div className="overflow-x-auto">
        <table className="min-w-full text-left">
          <thead>
            <tr className="border-b border-slate-200/60">
              {headers.map((header) => (
                <th key={header} className="px-3 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={`${row[headers[0]]}-${index}`} className="border-b border-slate-100/70 last:border-0">
                {headers.map((header) => (
                  <td key={header} className="px-3 py-4 text-sm text-slate-600">
                    {row[header]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </GlassCard>
  )
}

export function FeatureChecklist({ title, items }) {
  return (
    <GlassCard className="p-5">
      <h3 className="font-display text-2xl text-slate-950">{title}</h3>
      <div className="mt-5 space-y-3">
        {items.map((item) => (
          <div key={item} className="rounded-[22px] border border-white/50 bg-white/70 px-4 py-3 text-sm text-slate-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
            {item}
          </div>
        ))}
      </div>
    </GlassCard>
  )
}
