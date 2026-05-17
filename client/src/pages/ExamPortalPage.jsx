import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TimerReset, ShieldCheck } from 'lucide-react'
import { GlassCard } from '../components/GlassCard'
import { apiGet, apiPost } from '../lib/api'

export function ExamPortalPage() {
  const [exam, setExam] = useState(null)
  const [students, setStudents] = useState([])
  const [selectedStudent, setSelectedStudent] = useState('')
  const [answers, setAnswers] = useState({})
  const [joined, setJoined] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    Promise.all([apiGet('/exams/demo-paper'), apiGet('/students')])
      .then(([data, studentsData]) => {
        setExam(data)
        setStudents(studentsData)
        setSelectedStudent(studentsData[0]?.name ?? '')
      })
      .catch(() => setError('Unable to fetch the live mathematics paper.'))
  }, [])

  const answeredCount = useMemo(() => Object.keys(answers).length, [answers])

  async function handleSubmit() {
    if (!exam) {
      return
    }

    setSubmitting(true)
    setError('')
    try {
      await apiPost('/results', {
        studentName: selectedStudent,
        answers,
        submittedAt: new Date().toLocaleString(),
      })
      navigate('/results')
    } catch (submissionError) {
      setError(submissionError.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (!exam) {
    return (
      <GlassCard className="p-8">
        <p className="text-sm text-slate-500">{error || 'Loading live exam experience...'}</p>
      </GlassCard>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <GlassCard className="p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-400">Exam join panel</p>
          <h2 className="font-display mt-3 text-3xl text-slate-950">{exam.title}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Students join online, fetch the latest teacher-published questions from the portal, and receive instant MCQ scoring.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-[24px] bg-slate-950 p-4 text-white">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Exam code</p>
              <p className="mt-2 font-display text-2xl">{exam.code}</p>
            </div>
            <div className="rounded-[24px] border border-white/45 bg-white/80 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Duration</p>
              <p className="mt-2 font-display text-2xl text-slate-950">{exam.durationMinutes} mins</p>
            </div>
          </div>

          <label className="mt-6 block space-y-2 text-sm text-slate-600">
            Select student
            <select
              value={selectedStudent}
              onChange={(event) => setSelectedStudent(event.target.value)}
              className="w-full rounded-2xl border border-white/45 bg-white/80 px-4 py-3 outline-none"
            >
              {students.map((student) => (
                <option key={student.slug} value={student.name}>
                  {student.name} - {student.className}
                </option>
              ))}
            </select>
          </label>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => setJoined(Boolean(selectedStudent))}
              className="rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white"
            >
              Join Exam Now
            </button>
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm text-cyan-900">
              <ShieldCheck className="h-4 w-4" />
              API-backed live paper
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {exam.instructions.map((item) => (
              <div key={item} className="rounded-[22px] border border-white/45 bg-white/80 px-4 py-3 text-sm text-slate-600">
                {item}
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-400">Live question navigator</p>
              <h3 className="font-display mt-3 text-2xl text-slate-950">{answeredCount} / {exam.questions.length} answered</h3>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-3 text-sm font-semibold text-white">
              <TimerReset className="h-4 w-4" />
              Auto score on submit
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {exam.questions.map((question, index) => (
              <span
                key={question.id}
                className={`flex h-10 w-10 items-center justify-center rounded-2xl text-sm font-semibold ${
                  answers[question.id] !== undefined ? 'bg-slate-950 text-white' : 'bg-slate-100 text-slate-500'
                }`}
              >
                {index + 1}
              </span>
            ))}
          </div>
        </GlassCard>
      </div>

      {joined ? (
        <GlassCard className="p-6">
          <div className="space-y-5">
            {exam.questions.map((question, index) => (
              <div key={question.id} className="rounded-[28px] border border-white/45 bg-white/80 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Question {index + 1}</p>
                <h3 className="mt-2 text-lg font-semibold text-slate-950">{question.prompt}</h3>
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  {question.options.map((option) => {
                    const active = answers[question.id] === option
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setAnswers((current) => ({ ...current, [question.id]: option }))}
                        className={`rounded-[22px] border px-4 py-3 text-left text-sm transition ${
                          active
                            ? 'border-slate-950 bg-slate-950 text-white'
                            : 'border-white/50 bg-white/70 text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        {option}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white"
            >
              {submitting ? 'Submitting...' : 'Submit Exam'}
            </button>
            {error ? <p className="text-sm text-rose-600">{error}</p> : null}
          </div>
        </GlassCard>
      ) : null}
    </div>
  )
}
