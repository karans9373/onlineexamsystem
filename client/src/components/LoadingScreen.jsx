import { motion } from 'framer-motion'

export function LoadingScreen() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(125,211,252,0.35),_transparent_35%),linear-gradient(135deg,_#f8fbff,_#eef6ff_55%,_#fff7ed)]">
      <div className="absolute h-72 w-72 rounded-full bg-cyan-300/20 blur-3xl" />
      <div className="absolute bottom-20 right-20 h-72 w-72 rounded-full bg-fuchsia-300/20 blur-3xl" />
      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative rounded-[36px] border border-white/40 bg-white/70 p-10 text-center shadow-[0_28px_90px_rgba(15,23,42,0.12)] backdrop-blur-2xl"
      >
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[28px] bg-slate-950 text-2xl font-bold text-white shadow-[0_20px_40px_rgba(15,23,42,0.22)]">
          A
        </div>
        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.45em] text-slate-400">Booting platform</p>
        <h1 className="font-display mt-3 text-4xl text-slate-950">AstraExam Cloud</h1>
        <div className="mt-6 h-2 w-72 overflow-hidden rounded-full bg-slate-100">
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
            className="h-full w-1/2 rounded-full bg-gradient-to-r from-cyan-400 via-sky-500 to-fuchsia-500"
          />
        </div>
      </motion.div>
    </div>
  )
}
