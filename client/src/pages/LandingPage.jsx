import { ArrowRight, BrainCircuit, ChartNoAxesCombined, Shield } from 'lucide-react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { GlassPanel } from '../components/GlassPanel'

const cards = [
  { title: 'Government CBT UX', copy: 'SSC, Railway, Banking, CUET, JEE and NEET-inspired exam ergonomics with premium polish.' },
  { title: 'Real-time integrity stack', copy: 'Fullscreen monitoring, tab-switch alerts, suspicious activity logging, and live teacher visibility.' },
  { title: 'AI paper generation', copy: 'Teachers can generate topic-based MCQs instantly with explanations and publish them live.' },
]

export default function LandingPage() {
  return (
    <div className="grid gap-8 pb-8 xl:grid-cols-[1.05fr_0.95fr]">
      <motion.section initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 pt-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/25 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-200">
          <Shield className="h-4 w-4" />
          Secure, scalable, commerce-grade examination platform
        </div>
        <div className="space-y-4">
          <h1 className="max-w-4xl font-display text-5xl leading-[0.95] text-white md:text-7xl">
            Premium online examination system built for real competitive exams.
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-slate-300">
            A production-ready CBT platform for students, teachers, and administrators with fast rendering,
            secure exam delivery, live monitoring, AI paper generation, and powerful analytics.
          </p>
        </div>
        <div className="flex flex-wrap gap-4">
          <Link to="/login/student" className="btn-primary inline-flex items-center gap-2 rounded-full px-6 py-3 font-semibold">
            Enter student portal
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link to="/login/teacher" className="rounded-full border border-white/15 px-6 py-3 font-semibold text-white">
            Teacher login
          </Link>
          <Link to="/login/admin" className="rounded-full border border-white/15 px-6 py-3 font-semibold text-white">
            Admin login
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {cards.map((card) => (
            <GlassPanel key={card.title} className="p-5">
              <p className="font-display text-xl text-white">{card.title}</p>
              <p className="mt-2 text-sm leading-7 text-slate-400">{card.copy}</p>
            </GlassPanel>
          ))}
        </div>
      </motion.section>

      <motion.section initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="pt-10">
        <GlassPanel className="overflow-hidden p-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-[28px] bg-gradient-to-br from-sky-500/18 to-slate-950 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-300">Exam concurrency</p>
                  <p className="mt-2 font-display text-5xl text-white">12.8K</p>
                </div>
                <ChartNoAxesCombined className="h-10 w-10 text-cyan-300" />
              </div>
              <div className="mt-6 flex h-28 items-end gap-2">
                {[38, 52, 61, 58, 75, 84, 92, 88].map((height) => (
                  <span key={height} className="flex-1 rounded-t-full bg-gradient-to-t from-cyan-400 to-blue-100" style={{ height: `${height}%` }} />
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
                <div className="flex items-center gap-3">
                  <BrainCircuit className="h-6 w-6 text-violet-300" />
                  <p className="font-display text-2xl text-white">AI Paper Engine</p>
                </div>
                <p className="mt-3 text-sm leading-7 text-slate-400">
                  Generate class-wise, topic-wise, bilingual MCQs with explanations and difficulty bands.
                </p>
              </div>
              <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
                <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Exam security</p>
                <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-slate-300">
                  <div className="rounded-2xl bg-slate-900/60 p-4">Fullscreen warnings</div>
                  <div className="rounded-2xl bg-slate-900/60 p-4">Auto save every 5s</div>
                  <div className="rounded-2xl bg-slate-900/60 p-4">Multi-tab detection</div>
                  <div className="rounded-2xl bg-slate-900/60 p-4">Teacher live alerts</div>
                </div>
              </div>
            </div>
          </div>
        </GlassPanel>
      </motion.section>
    </div>
  )
}
