import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import clsx from 'clsx'
import { House, MoonStar, SunMedium } from 'lucide-react'
import { sidebarLinks } from '../data/mockData.jsx'
import { GlassCard } from './GlassCard'

export function AppShell({ children, routeConfig, theme, setTheme }) {
  const location = useLocation()
  const isLanding = location.pathname === '/'

  if (isLanding) {
    return children
  }

  return (
    <div className="min-h-screen px-4 pb-24 pt-20 md:px-6 md:pb-8">
      <div className="mx-auto grid max-w-[1600px] gap-6 xl:grid-cols-[290px_minmax(0,1fr)]">
        <GlassCard className="sticky top-24 hidden h-[calc(100vh-7rem)] overflow-hidden p-5 xl:block">
          <div className="flex h-full flex-col">
            <div className="mb-8">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">AstraExam</p>
              <h2 className="font-display mt-3 text-3xl text-slate-950">Control Stack</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Premium orchestration for assessments, live proctoring, AI analytics, and academic operations.
              </p>
            </div>
            <nav className="space-y-2">
              {sidebarLinks.map((group) => (
                <div key={group.label} className="space-y-2">
                  <p className="px-3 text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">{group.label}</p>
                  {group.items.map((item) => {
                    const isActive = location.pathname === item.path
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={clsx(
                          'flex items-center justify-between rounded-2xl px-4 py-3 text-sm transition',
                          isActive
                            ? 'bg-slate-950 text-white shadow-[0_18px_40px_rgba(15,23,42,0.22)]'
                            : 'text-slate-600 hover:bg-white/80 hover:text-slate-950',
                        )}
                      >
                        <span>{item.name}</span>
                        <span className={clsx('text-xs', isActive ? 'text-white/65' : 'text-slate-400')}>{item.tag}</span>
                      </Link>
                    )
                  })}
                </div>
              ))}
            </nav>
            <div className="mt-auto rounded-[28px] bg-slate-950 p-5 text-white shadow-[0_20px_45px_rgba(15,23,42,0.32)]">
              <p className="text-sm text-slate-300">Next milestone</p>
              <p className="mt-2 font-display text-2xl">Global proctoring rollout</p>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Webinar conversion dashboard, AI invigilation insights, and exam risk triage are production ready.
              </p>
            </div>
          </div>
        </GlassCard>

        <main className="min-w-0">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-full border border-white/45 bg-white/75 px-4 py-2 text-sm font-semibold text-slate-700 shadow-[0_12px_24px_rgba(15,23,42,0.08)]"
            >
              <House className="h-4 w-4" />
              Home
            </Link>
            <button
              onClick={() => setTheme((current) => (current === 'light' ? 'dark' : 'light'))}
              className="inline-flex items-center gap-2 rounded-full border border-white/45 bg-white/75 px-4 py-2 text-sm font-semibold text-slate-700 shadow-[0_12px_24px_rgba(15,23,42,0.08)]"
            >
              {theme === 'light' ? <MoonStar className="h-4 w-4" /> : <SunMedium className="h-4 w-4" />}
              {theme === 'light' ? 'Dark theme' : 'Light theme'}
            </button>
          </div>
          <div className="mb-4 xl:hidden">
            <GlassCard className="overflow-x-auto p-3">
              <div className="flex gap-2">
                {sidebarLinks.flatMap((group) => group.items).map((item) => {
                  const isActive = location.pathname === item.path
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={clsx(
                        'shrink-0 rounded-full px-4 py-2 text-sm font-medium transition',
                        isActive
                          ? 'bg-slate-950 text-white shadow-[0_10px_24px_rgba(15,23,42,0.18)]'
                          : 'bg-white/75 text-slate-600',
                      )}
                    >
                      {item.name}
                    </Link>
                  )
                })}
              </div>
            </GlassCard>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="mb-6 rounded-[34px] border border-white/35 bg-white/60 p-6 shadow-[0_28px_90px_rgba(15,23,42,0.1)] backdrop-blur-2xl"
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">{routeConfig.eyebrow}</p>
                <h1 className="font-display mt-3 text-4xl text-slate-950 md:text-5xl">{routeConfig.title}</h1>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 md:text-base">{routeConfig.description}</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                {routeConfig.heroStats.map((stat) => (
                  <div key={stat.label} className="rounded-[24px] border border-white/45 bg-white/75 px-4 py-4 shadow-[0_18px_30px_rgba(15,23,42,0.06)]">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{stat.label}</p>
                    <p className="mt-2 font-display text-2xl text-slate-950">{stat.value}</p>
                    <p className="mt-1 text-xs text-slate-500">{stat.subtext}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
          {children}
        </main>
      </div>
      <div className="fixed inset-x-0 bottom-4 z-30 px-4 xl:hidden">
        <GlassCard className="mx-auto max-w-xl p-2">
          <div className="flex items-center justify-between gap-2 overflow-x-auto">
            <Link
              to="/"
              className="min-w-[68px] rounded-2xl px-3 py-2 text-center text-xs font-semibold text-slate-600 transition"
            >
              Home
            </Link>
            {sidebarLinks[0].items.slice(0, 5).map((item) => {
              const isActive = location.pathname === item.path
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={clsx(
                    'min-w-[68px] rounded-2xl px-3 py-2 text-center text-xs font-semibold transition',
                    isActive ? 'bg-slate-950 text-white' : 'text-slate-600',
                  )}
                >
                  {item.tag}
                </Link>
              )
            })}
          </div>
        </GlassCard>
      </div>
    </div>
  )
}
