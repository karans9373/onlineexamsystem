import { useEffect, useState } from 'react'
import { UserPlus } from 'lucide-react'
import { GlassCard } from '../components/GlassCard'
import { apiGet, apiPost } from '../lib/api'

const initialForm = {
  name: '',
  className: 'Class 10 A',
}

export function StudentsPage() {
  const [students, setStudents] = useState([])
  const [form, setForm] = useState(initialForm)
  const [message, setMessage] = useState('')

  async function loadStudents() {
    const data = await apiGet('/students')
    setStudents(data)
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadStudents().catch(() => setMessage('Unable to load students right now.'))
  }, [])

  async function handleSubmit(event) {
    event.preventDefault()
    setMessage('')
    try {
      await apiPost('/students', form)
      setForm(initialForm)
      setMessage('Student registered successfully and now visible across the portal.')
      await loadStudents()
    } catch (error) {
      setMessage(error.message)
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
      <GlassCard className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-400">Student registration</p>
            <h2 className="font-display mt-3 text-3xl text-slate-950">Add a student in one step</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Just enter student name and class. The student will then appear in the dashboard selector, exam portal, and records panel.
            </p>
          </div>
          <div className="rounded-[24px] bg-slate-950 p-4 text-white">
            <UserPlus className="h-6 w-6" />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="space-y-2 text-sm text-slate-600">
            Student name
            <input
              value={form.name}
              onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
              className="w-full rounded-2xl border border-white/45 bg-white/80 px-4 py-3 outline-none"
            />
          </label>
          <label className="space-y-2 text-sm text-slate-600">
            Class
            <input
              value={form.className}
              onChange={(event) => setForm((current) => ({ ...current, className: event.target.value }))}
              className="w-full rounded-2xl border border-white/45 bg-white/80 px-4 py-3 outline-none"
            />
          </label>
          <div className="flex flex-wrap items-center gap-4">
            <button className="rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white">Register Student</button>
            {message ? <p className="text-sm text-cyan-700">{message}</p> : null}
          </div>
        </form>
      </GlassCard>

      <GlassCard className="p-6">
        <h3 className="font-display text-2xl text-slate-950">Registered students</h3>
        <div className="mt-5 space-y-3">
          {students.map((student) => (
            <div key={student.slug} className="rounded-[22px] border border-white/45 bg-white/80 px-4 py-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-medium text-slate-900">{student.name}</p>
                  <p className="mt-1 text-sm text-slate-500">{student.className}</p>
                </div>
                <div className="rounded-full bg-slate-950 px-3 py-1 text-xs font-semibold text-white">{student.slug}</div>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  )
}
