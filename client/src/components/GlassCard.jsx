import clsx from 'clsx'
import { motion } from 'framer-motion'

export function GlassCard({ className, children }) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.3 }}
      className={clsx(
        'rounded-[32px] border border-white/35 bg-white/65 shadow-[0_22px_60px_rgba(15,23,42,0.08)] backdrop-blur-2xl',
        className,
      )}
    >
      {children}
    </motion.div>
  )
}
