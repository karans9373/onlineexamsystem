import { GlassPanel } from './GlassPanel'

export function ChartCard({ title, subtitle, children }) {
  return (
    <GlassPanel className="p-5">
      <p className="font-display text-2xl text-white">{title}</p>
      <p className="mt-1 text-sm text-slate-400">{subtitle}</p>
      <div className="mt-5">{children}</div>
    </GlassPanel>
  )
}
