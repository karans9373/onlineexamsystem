import { useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { clearAuthMessage, forgotPassword, loginUser, registerUser, resetPassword } from '../store/authSlice'
import { GlassPanel } from '../components/GlassPanel'

export default function AuthPage({ mode }) {
  const { role = 'student' } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { error, helperMessage, devOtp } = useSelector((state) => state.auth)
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    password: '',
    class_name: '',
    school_name: '',
    subject_specialization: '',
    otp: '',
    new_password: '',
  })

  const roleTitle = useMemo(() => `${role.charAt(0).toUpperCase()}${role.slice(1)} Portal`, [role])
  const demos = {
    student: { email: 'student@astraexam.com', password: 'Student@123' },
    teacher: { email: 'teacher@astraexam.com', password: 'Teacher@123' },
    admin: { email: 'admin@astraexam.com', password: 'Admin@123' },
  }

  const onChange = (event) => {
    dispatch(clearAuthMessage())
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (mode === 'login') {
      const result = await dispatch(loginUser({ email: form.email, password: form.password, role }))
      if (result.meta.requestStatus === 'fulfilled') {
        navigate(`/${role}/dashboard`)
      }
      return
    }
    await dispatch(
      registerUser({
        full_name: form.full_name,
        email: form.email,
        password: form.password,
        role,
        class_name: form.class_name,
        school_name: form.school_name,
        subject_specialization: form.subject_specialization,
      }),
    )
    if (mode === 'register') {
      setTimeout(() => navigate(`/login/${role}`), 500)
    }
  }

  const loginWithDemo = async () => {
    const demo = demos[role] || demos.student
    setForm((current) => ({ ...current, email: demo.email, password: demo.password }))
    const result = await dispatch(loginUser({ email: demo.email, password: demo.password, role }))
    if (result.meta.requestStatus === 'fulfilled') {
      navigate(`/${role}/dashboard`)
    }
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-6 xl:grid-cols-[0.92fr_1.08fr]">
      <GlassPanel className="p-8">
        <p className="text-xs uppercase tracking-[0.35em] text-cyan-300">Secure access</p>
        <h1 className="mt-4 font-display text-4xl text-white">{roleTitle}</h1>
        <p className="mt-3 max-w-md text-sm leading-7 text-slate-400">
          Separate role-based authentication with direct login, password recovery, and protected dashboards.
        </p>
        <div className="mt-8 space-y-4 text-sm text-slate-300">
          <div className="rounded-2xl bg-white/5 p-4">Demo student: `student@astraexam.com` / `Student@123`</div>
          <div className="rounded-2xl bg-white/5 p-4">Demo teacher: `teacher@astraexam.com` / `Teacher@123`</div>
          <div className="rounded-2xl bg-white/5 p-4">Demo admin: `admin@astraexam.com` / `Admin@123`</div>
        </div>
      </GlassPanel>

      <GlassPanel className="p-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-slate-400">{mode === 'login' ? 'Role login' : 'Role signup'}</p>
            <h2 className="mt-2 font-display text-3xl text-white">{mode === 'login' ? `Login as ${role}` : `Create ${role} account`}</h2>
          </div>
          <Link to={mode === 'login' ? `/register/${role}` : `/login/${role}`} className="text-sm text-cyan-300">
            {mode === 'login' ? 'Need an account?' : 'Already registered?'}
          </Link>
        </div>

        <div className="mb-5 rounded-[24px] border border-cyan-400/15 bg-cyan-500/8 p-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="font-semibold text-cyan-200">Demo credential</p>
              <p className="mt-1 text-sm text-slate-300">
                {demos[role]?.email} / {demos[role]?.password}
              </p>
            </div>
            <button type="button" onClick={loginWithDemo} className="rounded-full bg-cyan-500/20 px-4 py-2 text-sm font-semibold text-cyan-100">
              Login with demo
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-4">
          {mode === 'register' && (
            <input className="rounded-2xl bg-white/6 px-4 py-3 text-white outline-none" placeholder="Full name" name="full_name" onChange={onChange} value={form.full_name} />
          )}
          <input className="rounded-2xl bg-white/6 px-4 py-3 text-white outline-none" placeholder="Email address" name="email" onChange={onChange} value={form.email} />
          <input className="rounded-2xl bg-white/6 px-4 py-3 text-white outline-none" placeholder="Password" name="password" type="password" onChange={onChange} value={form.password} />
          {mode === 'register' && role === 'student' && (
            <>
              <input className="rounded-2xl bg-white/6 px-4 py-3 text-white outline-none" placeholder="Class" name="class_name" onChange={onChange} value={form.class_name} />
              <input className="rounded-2xl bg-white/6 px-4 py-3 text-white outline-none" placeholder="School name" name="school_name" onChange={onChange} value={form.school_name} />
            </>
          )}
          {mode === 'register' && role === 'teacher' && (
            <input className="rounded-2xl bg-white/6 px-4 py-3 text-white outline-none" placeholder="Subject specialization" name="subject_specialization" onChange={onChange} value={form.subject_specialization} />
          )}
          <button className="btn-primary rounded-2xl px-4 py-3 font-semibold">{mode === 'login' ? 'Login securely' : 'Create account'}</button>
        </form>

        <div className="mt-6 rounded-[24px] border border-white/8 bg-white/5 p-4">
          <p className="font-semibold text-white">Forgot Password</p>
          <div className="mt-3 flex flex-col gap-3 md:flex-row">
            <button type="button" onClick={() => dispatch(forgotPassword({ email: form.email }))} className="rounded-xl bg-amber-500/20 px-3 py-2 text-amber-200">
              Send OTP
            </button>
            <input className="min-w-0 flex-1 rounded-xl bg-white/6 px-3 py-2 text-white outline-none" placeholder="OTP" name="otp" onChange={onChange} value={form.otp} />
            <input className="min-w-0 flex-1 rounded-xl bg-white/6 px-3 py-2 text-white outline-none" placeholder="New password" name="new_password" onChange={onChange} value={form.new_password} />
            <button
              type="button"
              onClick={() => dispatch(resetPassword({ email: form.email, otp: form.otp, new_password: form.new_password }))}
              className="rounded-xl bg-emerald-500/20 px-3 py-2 text-emerald-200"
            >
              Reset
            </button>
          </div>
        </div>

        {(helperMessage || error || devOtp) && (
          <div className="mt-6 rounded-2xl border border-white/8 bg-white/5 p-4 text-sm">
            {helperMessage && <p className="text-emerald-300">{helperMessage}</p>}
            {error && <p className="text-rose-300">{error}</p>}
            {devOtp && <p className="mt-2 text-amber-200">Development OTP: {devOtp}</p>}
          </div>
        )}
      </GlassPanel>
    </div>
  )
}
