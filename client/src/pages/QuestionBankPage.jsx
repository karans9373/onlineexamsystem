import { useEffect, useState } from 'react'
import { BookOpen, PlusCircle } from 'lucide-react'
import { GlassCard } from '../components/GlassCard'
import { apiGet, apiPost } from '../lib/api'

const initialForm = {
  prompt: '',
  subject: 'Mathematics',
  className: 'Class 10 A',
  difficulty: 'Easy',
  marks: 1,
  options: ['', '', '', ''],
  correctAnswer: '',
  createdBy: 'Dr. Naina Kapoor',
}

export function QuestionBankPage() {
  const [questions, setQuestions] = useState([])
  const [form, setForm] = useState(initialForm)
  const [message, setMessage] = useState('')

  async function loadQuestions() {
    const data = await apiGet('/questions')
    setQuestions(data)
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadQuestions().catch(() => setMessage('Unable to load the question bank right now.'))
  }, [])

  function updateOption(index, value) {
    const nextOptions = [...form.options]
    nextOptions[index] = value
    setForm((current) => ({ ...current, options: nextOptions }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setMessage('')
    try {
      await apiPost('/questions', {
        ...form,
        marks: Number(form.marks),
        options: form.options.map((option) => Number(option)),
        correctAnswer: Number(form.correctAnswer),
      })
      setForm(initialForm)
      setMessage('Question bank updated and ready for scheduling.')
      await loadQuestions()
    } catch (error) {
      setMessage(error.message)
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
      <GlassCard className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-400">Real question bank</p>
            <h2 className="font-display mt-3 text-3xl text-slate-950">Create and save live questions</h2>
          </div>
          <div className="rounded-[24px] bg-slate-950 p-4 text-white">
            <BookOpen className="h-6 w-6" />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="space-y-2 text-sm text-slate-600">
            Question prompt
            <input value={form.prompt} onChange={(e) => setForm((c) => ({ ...c, prompt: e.target.value }))} className="w-full rounded-2xl border border-white/45 bg-white/80 px-4 py-3 outline-none" />
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
              Difficulty
              <input value={form.difficulty} onChange={(e) => setForm((c) => ({ ...c, difficulty: e.target.value }))} className="w-full rounded-2xl border border-white/45 bg-white/80 px-4 py-3 outline-none" />
            </label>
            <label className="space-y-2 text-sm text-slate-600">
              Marks
              <input value={form.marks} onChange={(e) => setForm((c) => ({ ...c, marks: e.target.value }))} className="w-full rounded-2xl border border-white/45 bg-white/80 px-4 py-3 outline-none" />
            </label>
            <label className="space-y-2 text-sm text-slate-600">
              Created By
              <input value={form.createdBy} onChange={(e) => setForm((c) => ({ ...c, createdBy: e.target.value }))} className="w-full rounded-2xl border border-white/45 bg-white/80 px-4 py-3 outline-none" />
            </label>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {form.options.map((option, index) => (
              <label key={index} className="space-y-2 text-sm text-slate-600">
                Option {index + 1}
                <input value={option} onChange={(e) => updateOption(index, e.target.value)} className="w-full rounded-2xl border border-white/45 bg-white/80 px-4 py-3 outline-none" />
              </label>
            ))}
          </div>
          <label className="space-y-2 text-sm text-slate-600">
            Correct answer
            <input value={form.correctAnswer} onChange={(e) => setForm((c) => ({ ...c, correctAnswer: e.target.value }))} className="w-full rounded-2xl border border-white/45 bg-white/80 px-4 py-3 outline-none" />
          </label>
          <div className="flex flex-wrap items-center gap-4">
            <button className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white">
              <PlusCircle className="h-4 w-4" />
              Save to Question Bank
            </button>
            {message ? <p className="text-sm text-cyan-700">{message}</p> : null}
          </div>
        </form>
      </GlassCard>

      <GlassCard className="p-6">
        <h3 className="font-display text-2xl text-slate-950">Banked questions</h3>
        <div className="mt-5 space-y-3">
          {questions.map((question) => (
            <div key={question.id} className="rounded-[22px] border border-white/45 bg-white/80 p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-medium text-slate-900">{question.prompt}</p>
                  <p className="mt-1 text-sm text-slate-500">{question.subject || 'Mathematics'} • {question.className || 'Class 10 A'} • {question.difficulty || 'Easy'}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-slate-900">{question.marks} mark</p>
                  <p className="text-xs uppercase tracking-[0.3em] text-emerald-600">{question.id}</p>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {question.options.map((option) => (
                  <span key={`${question.id}-${option}`} className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-600">{option}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  )
}
