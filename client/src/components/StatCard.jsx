import { motion } from 'framer-motion'
import { GlassPanel } from './GlassPanel'

export function StatCard({ label, value, meta, index = 0 }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.06 }}>
      <GlassPanel className="h-full p-5">
        <p className="text-xs uppercase tracking-[0.35em] text-slate-400">{label}</p>
        <p className="mt-3 font-display text-3xl text-white">{value}</p>
        <p className="mt-2 text-sm text-slate-400">{meta}</p>
      </GlassPanel>
    </motion.div>
  )
}
