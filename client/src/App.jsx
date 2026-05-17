import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { gsap } from 'gsap'
import { Bell, Search, SunMedium, MoonStar } from 'lucide-react'
import { appRoutes, landingHighlights, quickActions } from './data/mockData.jsx'
import { AppShell } from './components/AppShell'
import { GlassCard } from './components/GlassCard'
import { FloatingOrbs } from './components/FloatingOrbs'
import { LoadingScreen } from './components/LoadingScreen'

function LandingPage() {
  return (
    <div className="relative overflow-hidden px-6 pb-16 pt-6 md:px-10 xl:px-14">
      <FloatingOrbs />
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col">
        <header className="flex items-center justify-between rounded-full border border-white/30 bg-white/60 px-5 py-3 shadow-[0_20px_60px_rgba(15,23,42,0.12)] backdrop-blur-xl">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">AstraExam Cloud</p>
            <p className="font-display text-xl text-slate-950">Future-ready examination OS</p>
          </div>
          <div className="hidden items-center gap-3 md:flex">
            {['Platform', 'Security', 'Pricing', 'Support'].map((item) => (
              <a key={item} className="text-sm text-slate-600 transition hover:text-slate-950" href="#0">
                {item}
              </a>
            ))}
            <button className="brand-cta inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold shadow-[0_10px_30px_rgba(15,23,42,0.2)] transition hover:-translate-y-0.5">
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-white/80" />
              Continue with Google
            </button>
          </div>
        </header>

        <section className="relative mt-8 grid flex-1 items-center gap-8 xl:grid-cols-[1.08fr_0.92fr]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="relative z-10 space-y-8"
          >
            <div className="inline-flex items-center gap-3 rounded-full border border-cyan-200/80 bg-cyan-100/80 px-4 py-2 text-sm font-medium text-cyan-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_0_6px_rgba(52,211,153,0.18)]" />
              Live proctoring, AI evaluation, and enterprise analytics in one experience
            </div>
            <div className="space-y-5">
              <h1 className="font-display max-w-4xl text-5xl font-semibold leading-[0.95] tracking-[-0.05em] text-slate-950 md:text-7xl">
                A premium online examination system built like a modern EdTech SaaS.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-600 md:text-xl">
                Launch secure assessments, immersive exam portals, and beautiful decision dashboards across
                students, faculty, and administrators with the polish clients expect from a commercial platform.
              </p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
              <a
                className="brand-cta inline-flex min-h-12 items-center justify-center rounded-full px-6 py-3 text-sm font-semibold shadow-[0_18px_45px_rgba(15,23,42,0.25)] transition hover:-translate-y-0.5 sm:w-auto"
                href="/student"
              >
                Launch Product Tour
              </a>
              <button className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/50 bg-white/70 px-6 py-3 text-sm font-semibold text-slate-800 shadow-[0_18px_45px_rgba(15,23,42,0.08)] backdrop-blur-xl transition hover:-translate-y-0.5 sm:w-auto">
                Request Demo
              </button>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {landingHighlights.map((item) => (
                <GlassCard key={item.title} className="p-5">
                  <p className="text-sm text-slate-500">{item.title}</p>
                  <p className="mt-2 font-display text-3xl text-slate-950">{item.value}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{item.copy}</p>
                </GlassCard>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.1, ease: 'easeOut' }}
            className="relative"
          >
            <div className="absolute -left-16 top-16 h-52 w-52 rounded-full bg-cyan-300/30 blur-3xl" />
            <div className="absolute -right-10 bottom-10 h-56 w-56 rounded-full bg-fuchsia-300/30 blur-3xl" />
            <GlassCard className="relative overflow-hidden p-5 md:p-6">
              <div className="grid gap-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Realtime command center</p>
                    <h2 className="font-display text-3xl text-slate-950">Assessment Pulse</h2>
                  </div>
                  <div className="flex items-center gap-2 rounded-full bg-slate-950 px-3 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white">
                    <Bell className="h-4 w-4" />
                    Live
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-[1.15fr_0.85fr]">
                  <div className="rounded-[28px] bg-slate-950 p-5 text-white shadow-[0_25px_60px_rgba(15,23,42,0.35)]">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm text-slate-300">Session health</p>
                        <p className="mt-2 font-display text-5xl">98.7%</p>
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-right backdrop-blur-xl">
                        <p className="text-xs uppercase tracking-[0.3em] text-slate-300">Today</p>
                        <p className="mt-1 text-lg font-semibold text-emerald-300">+14.8%</p>
                      </div>
                    </div>
                    <div className="mt-5 h-36 rounded-[22px] bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.45),_transparent_48%),linear-gradient(135deg,_rgba(15,23,42,0.9),_rgba(30,41,59,0.72))] p-4">
                      <div className="flex h-full items-end gap-2">
                        {[42, 55, 58, 73, 67, 84, 93, 88, 96].map((height) => (
                          <span
                            key={height}
                            className="flex-1 rounded-t-full bg-gradient-to-t from-cyan-400 to-blue-200"
                            style={{ height: `${height}%` }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="grid gap-4">
                    {quickActions.map((item) => (
                      <div key={item.title} className="rounded-[26px] border border-white/40 bg-white/70 p-5 shadow-[0_20px_45px_rgba(15,23,42,0.08)]">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-slate-900">{item.title}</p>
                          <p className="text-sm text-slate-400">{item.metric}</p>
                        </div>
                        <p className="mt-2 text-sm leading-6 text-slate-600">{item.copy}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </section>
      </div>
    </div>
  )
}

function RoutedExperience({ theme, setTheme }) {
  const location = useLocation()
  const routeConfig = useMemo(
    () => appRoutes.find((route) => route.path === location.pathname) ?? appRoutes[0],
    [location.pathname],
  )

  useEffect(() => {
    gsap.fromTo(
      '.page-transition',
      { opacity: 0, y: 20, filter: 'blur(16px)' },
      { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.8, ease: 'power3.out' },
    )
  }, [location.pathname])

  return (
    <div className="page-transition">
      <AppShell theme={theme} setTheme={setTheme} routeConfig={routeConfig}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<LandingPage />} />
            {appRoutes.map((route) => (
              <Route key={route.path} path={route.path} element={<route.component />} />
            ))}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </AppShell>
    </div>
  )
}

function App() {
  const [theme, setTheme] = useState(() => window.localStorage.getItem('astraexam-theme') ?? 'light')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 1700)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    window.localStorage.setItem('astraexam-theme', theme)
  }, [theme])

  if (loading) {
    return <LoadingScreen />
  }

  return (
    <BrowserRouter>
      <div className="fixed inset-x-0 top-0 z-40 flex justify-center px-4 pt-4">
        <div className="flex items-center gap-2 rounded-full border border-white/40 bg-white/65 p-2 shadow-[0_18px_45px_rgba(15,23,42,0.12)] backdrop-blur-xl">
          <button className="rounded-full bg-white/80 p-2 text-slate-700 shadow-inner">
            <Search className="h-4 w-4" />
          </button>
          <button
            onClick={() => setTheme((current) => (current === 'light' ? 'dark' : 'light'))}
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100/80"
          >
            {theme === 'light' ? <MoonStar className="h-4 w-4" /> : <SunMedium className="h-4 w-4" />}
            {theme === 'light' ? 'Dark mode' : 'Light mode'}
          </button>
        </div>
      </div>
      <RoutedExperience theme={theme} setTheme={setTheme} />
    </BrowserRouter>
  )
}

export default App
