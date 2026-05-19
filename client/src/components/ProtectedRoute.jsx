import { Link, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

export function ProtectedRoute({ children, role }) {
  const user = useSelector((state) => state.auth.user)
  const token = useSelector((state) => state.auth.token)

  if (!token || !user) {
    return <Navigate to={`/login/${role || 'student'}`} replace />
  }

  if (role && user.role !== role) {
    return (
      <div className="grid min-h-[65vh] place-items-center">
        <div className="glass-panel max-w-2xl rounded-[32px] p-8 text-center">
          <p className="text-xs uppercase tracking-[0.35em] text-amber-300">Restricted Module</p>
          <h1 className="mt-3 font-display text-4xl text-white">This page needs {role} access</h1>
          <p className="mt-3 text-slate-300">
            You are logged in as <span className="font-semibold capitalize text-cyan-200">{user.role}</span>. Use the matching demo login or switch to the correct role to open this module.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link to={`/${user.role}/dashboard`} className="btn-primary rounded-full px-5 py-3 font-semibold">
              Go to my dashboard
            </Link>
            <Link to={`/login/${role}`} className="rounded-full border border-white/15 px-5 py-3 font-semibold text-white">
              Login as {role}
            </Link>
            <Link to="/" className="rounded-full border border-white/15 px-5 py-3 font-semibold text-white">
              Back home
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return children
}
