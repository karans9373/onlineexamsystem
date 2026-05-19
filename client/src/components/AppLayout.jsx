import { Bell, Cpu, GraduationCap, LogOut, ShieldCheck } from 'lucide-react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { ThemeToggle } from './ThemeToggle'
import { logout } from '../store/authSlice'

const navMap = {
  guest: [
    { label: 'Student Login', path: '/login/student' },
    { label: 'Teacher Login', path: '/login/teacher' },
    { label: 'Admin Login', path: '/login/admin' },
  ],
  student: [
    { label: 'Student Dashboard', path: '/student/dashboard' },
  ],
  teacher: [
    { label: 'Teacher Dashboard', path: '/teacher/dashboard' },
    { label: 'Teacher Studio', path: '/teacher/studio' },
  ],
  admin: [
    { label: 'Admin Dashboard', path: '/admin/dashboard' },
    { label: 'User Governance', path: '/admin/users' },
  ],
}

export function AppLayout({ children }) {
  const location = useLocation()
  const dispatch = useDispatch()
  const user = useSelector((state) => state.auth.user)
  const currentRole = user?.role || 'guest'
  const navItems = navMap[currentRole] || navMap.guest

  return (
    <div className="app-shell premium-grid">
      <div className="mx-auto max-w-[1600px] px-4 py-4 md:px-6">
        <header className="glass-panel mb-6 rounded-full px-4 py-3">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="pulse-glow rounded-2xl bg-cyan-400/12 p-3 text-cyan-300">
                <GraduationCap className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-slate-400">AstraExam Pro</p>
                <p className="font-display text-xl text-white">Government CBT Examination OS</p>
              </div>
            </Link>
            <nav className="hidden items-center gap-2 xl:flex">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `rounded-full px-4 py-2 text-sm font-medium transition ${
                      isActive ? 'bg-cyan-400/15 text-cyan-200' : 'text-slate-300 hover:bg-white/8'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
            <div className="flex items-center gap-3">
              <div className="status-chip hidden items-center gap-2 rounded-full px-4 py-2 text-sm text-slate-200 md:flex">
                <Cpu className="h-4 w-4 text-cyan-300" />
                Ultra low-latency exam delivery
              </div>
              <div className="status-chip hidden items-center gap-2 rounded-full px-4 py-2 text-sm text-slate-200 md:flex">
                <ShieldCheck className="h-4 w-4 text-emerald-300" />
                Anti-cheat active
              </div>
              <div className="status-chip flex items-center gap-2 rounded-full px-3 py-2 text-sm text-slate-200">
                <Bell className="h-4 w-4 text-amber-300" />
                {user?.full_name || 'Guest'}
              </div>
              {user && (
                <button
                  onClick={() => dispatch(logout())}
                  className="status-chip inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
                >
                  <LogOut className="h-4 w-4 text-rose-300" />
                  Logout
                </button>
              )}
              <ThemeToggle />
            </div>
          </div>
        </header>
        {location.pathname !== '/' && (
          <div className="mb-5 flex flex-wrap items-center gap-2 xl:hidden">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `status-chip rounded-full px-4 py-2 text-sm ${isActive ? 'text-cyan-300' : 'text-slate-300'}`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        )}
        {children}
      </div>
    </div>
  )
}
