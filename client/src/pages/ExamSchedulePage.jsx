import { useEffect, useState } from 'react'
import { CalendarClock, Send } from 'lucide-react'
import { GlassCard } from '../components/GlassCard'
import { apiGet, apiPost } from '../lib/api'

const initialForm = {
  title: '',
  className: 'Class 10 A',
  subject: 'Mathematics',
  totalMarks: 30,
  examDate: '',
  examTime: '',
  durationMinutes: 20,
  examCode: '',
  teacher: 'Dr. Naina Kapoor',
  status: 'Published',
}

export function ExamSchedulePage() {
  const [schedule, setSchedule] = useState([])
  const [form, setForm] = useState(initialForm)
  const [message, setMessage] = useState('')

  async function loadSchedule() {
    const data = await apiGet('/schedule')
    setSchedule(data)
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadSchedule().catch(() => setMessage('Unable to load scheduled exams right now.'))
  }, [])

  async function handleSubmit(event) {
    event.preventDefault()
    setMessage('')
    try {
      await apiPost('/schedule', {
        ...form,
        totalMarks: Number(form.totalMarks),
        durationMinutes: Number(form.durationMinutes),
      })
      setForm(initialForm)
      setMessage('Exam pushed to schedule and visible for students.')
      await loadSchedule()
    } catch (error) {
      setMessage(error.message)
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <GlassCard className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-400">Push exam schedule</p>
            <h2 className="font-display mt-3 text-3xl text-slate-950">Create a real scheduled exam</h2>
          </div>
          <div className="rounded-[24px] bg-slate-950 p-4 text-white">
            <CalendarClock className="h-6 w-6" />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="space-y-2 text-sm text-slate-600">
            Title
            <input value={form.title} onChange={(e) => setForm((c) => ({ ...c, title: e.target.value }))} className="w-full rounded-2xl border border-white/45 bg-white/80 px-4 py-3 outline-none" />
          </label>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2 text-sm text-slate-600">
              Class
              <input value={form.className} onChange={(e) => setForm((c) => ({ ...c, className: e.target.value }))} className="w-full rounded-2xl border border-white/45 bg-white/80 px-4 py-3 outline-none" />
            </label>
            <label className="space-y-2 text-sm text-slate-600">
              Subject
              <input value={form.subject} onChange={(e) => setForm((c) => ({ ...c, subject: e.target.value }))} className="w-full rounded-2xl border border-white/45 bg-white/80 px-4 py-3 outline-none" />
            </label>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <label className="space-y-2 text-sm text-slate-600">
              Total Marks
              <input value={form.totalMarks} onChange={(e) => setForm((c) => ({ ...c, totalMarks: e.target.value }))} className="w-full rounded-2xl border border-white/45 bg-white/80 px-4 py-3 outline-none" />
            </label>
            <label className="space-y-2 text-sm text-slate-600">
              Date
              <input type="date" value={form.examDate} onChange={(e) => setForm((c) => ({ ...c, examDate: e.target.value }))} className="w-full rounded-2xl border border-white/45 bg-white/80 px-4 py-3 outline-none" />
            </label>
            <label className="space-y-2 text-sm text-slate-600">
              Time
              <input type="time" value={form.examTime} onChange={(e) => setForm((c) => ({ ...c, examTime: e.target.value }))} className="w-full rounded-2xl border border-white/45 bg-white/80 px-4 py-3 outline-none" />
            </label>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <label className="space-y-2 text-sm text-slate-600">
              Duration
              <input value={form.durationMinutes} onChange={(e) => setForm((c) => ({ ...c, durationMinutes: e.target.value }))} className="w-full rounded-2xl border border-white/45 bg-white/80 px-4 py-3 outline-none" />
            </label>
            <label className="space-y-2 text-sm text-slate-600">
              Exam Code
              <input value={form.examCode} onChange={(e) => setForm((c) => ({ ...c, examCode: e.target.value }))} className="w-full rounded-2xl border border-white/45 bg-white/80 px-4 py-3 outline-none" />
            </label>
            <label className="space-y-2 text-sm text-slate-600">
              Teacher
              <input value={form.teacher} onChange={(e) => setForm((c) => ({ ...c, teacher: e.target.value }))} className="w-full rounded-2xl border border-white/45 bg-white/80 px-4 py-3 outline-none" />
            </label>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <button className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white">
              <Send className="h-4 w-4" />
              Push Schedule
            </button>
            {message ? <p className="text-sm text-cyan-700">{message}</p> : null}
          </div>
        </form>
      </GlassCard>

      <GlassCard className="p-6">
        <h3 className="font-display text-2xl text-slate-950">Scheduled exams list</h3>
        <div className="mt-5 space-y-3">
          {schedule.map((item) => (
            <div key={item.id} className="rounded-[24px] border border-white/45 bg-white/80 p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-medium text-slate-900">{item.title}</p>
                  <p className="mt-1 text-sm text-slate-500">{item.className} • {item.subject} • {item.teacher}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-slate-900">{item.totalMarks} marks</p>
                  <p className="text-xs uppercase tracking-[0.3em] text-cyan-700">{item.examDate} {item.examTime}</p>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-semibold text-white">{item.examCode}</span>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">{item.status}</span>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">{item.durationMinutes} mins</span>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  )
}
