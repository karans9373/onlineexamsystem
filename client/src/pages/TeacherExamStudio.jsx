import { useEffect, useState } from 'react'
import { Upload, PlusCircle } from 'lucide-react'
import { GlassCard } from '../components/GlassCard'
import { apiGet, apiPost, apiUpload } from '../lib/api'

const initialForm = {
  teacher: 'Dr. Naina Kapoor',
  topic: 'Mathematics Demo Extension',
  prompt: '',
  options: ['', '', '', ''],
  correctAnswer: '',
}

export function TeacherExamStudio() {
  const [questions, setQuestions] = useState([])
  const [uploads, setUploads] = useState([])
  const [form, setForm] = useState(initialForm)
  const [message, setMessage] = useState('')
  const [saving, setSaving] = useState(false)
  const [importFile, setImportFile] = useState(null)
  const [importMeta, setImportMeta] = useState({
    topic: 'Imported Mathematics Paper',
    teacher: 'Dr. Naina Kapoor',
    subject: 'Mathematics',
    className: 'Class 10 A',
  })
  const [importMessage, setImportMessage] = useState('')
  const [importing, setImporting] = useState(false)

  async function loadData() {
    const [questionData, uploadData] = await Promise.all([apiGet('/questions'), apiGet('/teacher/uploads')])
    setQuestions(questionData)
    setUploads(uploadData)
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData().catch(() => setMessage('Unable to load teacher question studio right now.'))
  }, [])

  function updateOption(index, value) {
    const next = [...form.options]
    next[index] = value
    setForm((current) => ({ ...current, options: next }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSaving(true)
    setMessage('')
    try {
      await apiPost('/teacher/questions', {
        ...form,
        options: form.options.map((item) => Number(item)),
        correctAnswer: Number(form.correctAnswer),
        uploadedAt: new Date().toLocaleString(),
      })
      setForm(initialForm)
      setMessage('Question published successfully. The student portal now receives the updated paper.')
      await loadData()
    } catch (error) {
      setMessage(error.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleImport(event) {
    event.preventDefault()
    if (!importFile) {
      setImportMessage('Please choose a PDF, DOCX, DOC, or TXT file first.')
      return
    }

    setImporting(true)
    setImportMessage('')
    const data = new FormData()
    data.append('file', importFile)
    data.append('topic', importMeta.topic)
    data.append('teacher', importMeta.teacher)
    data.append('subject', importMeta.subject)
    data.append('className', importMeta.className)

    try {
      const response = await apiUpload('/teacher/import-question-file', data)
      setImportMessage(response.message)
      setImportFile(null)
      await loadData()
    } catch (error) {
      setImportMessage(error.message)
    } finally {
      setImporting(false)
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
      <div className="space-y-6">
        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-400">Teacher upload studio</p>
              <h2 className="font-display mt-3 text-3xl text-slate-950">Publish MCQ questions to the live exam</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Add new demo mathematics questions here. Students joining the portal will fetch the latest paper from the API.
              </p>
            </div>
            <div className="rounded-[24px] bg-slate-950 p-4 text-white">
              <Upload className="h-6 w-6" />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2 text-sm text-slate-600">
                Topic
                <input
                  value={form.topic}
                  onChange={(event) => setForm((current) => ({ ...current, topic: event.target.value }))}
                  className="w-full rounded-2xl border border-white/45 bg-white/80 px-4 py-3 outline-none"
                />
              </label>
              <label className="space-y-2 text-sm text-slate-600">
                Teacher
                <input
                  value={form.teacher}
                  onChange={(event) => setForm((current) => ({ ...current, teacher: event.target.value }))}
                  className="w-full rounded-2xl border border-white/45 bg-white/80 px-4 py-3 outline-none"
                />
              </label>
            </div>

            <label className="space-y-2 text-sm text-slate-600">
              Question prompt
              <input
                value={form.prompt}
                onChange={(event) => setForm((current) => ({ ...current, prompt: event.target.value }))}
                placeholder="What is 4 + 9?"
                className="w-full rounded-2xl border border-white/45 bg-white/80 px-4 py-3 outline-none"
              />
            </label>

            <div className="grid gap-4 md:grid-cols-2">
              {form.options.map((option, index) => (
                <label key={index} className="space-y-2 text-sm text-slate-600">
                  Option {index + 1}
                  <input
                    value={option}
                    onChange={(event) => updateOption(index, event.target.value)}
                    placeholder={`Option ${index + 1}`}
                    className="w-full rounded-2xl border border-white/45 bg-white/80 px-4 py-3 outline-none"
                  />
                </label>
              ))}
            </div>

            <label className="space-y-2 text-sm text-slate-600">
              Correct answer
              <input
                value={form.correctAnswer}
                onChange={(event) => setForm((current) => ({ ...current, correctAnswer: event.target.value }))}
                placeholder="13"
                className="w-full rounded-2xl border border-white/45 bg-white/80 px-4 py-3 outline-none"
              />
            </label>

            <div className="flex flex-wrap items-center gap-4">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white"
              >
                <PlusCircle className="h-4 w-4" />
                {saving ? 'Publishing...' : 'Publish Question'}
              </button>
              {message ? <p className="text-sm text-cyan-700">{message}</p> : null}
            </div>
          </form>
        </GlassCard>

        <GlassCard className="p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-400">Document to question paper</p>
          <h3 className="font-display mt-3 text-2xl text-slate-950">Import PDF or DOCX and auto-build questions</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Upload a PDF, DOCX, DOC, or TXT file. The system will extract structured MCQs or arithmetic-style lines and convert them into a question paper ready for the portal.
          </p>

          <form onSubmit={handleImport} className="mt-6 space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2 text-sm text-slate-600">
                Topic
                <input
                  value={importMeta.topic}
                  onChange={(event) => setImportMeta((current) => ({ ...current, topic: event.target.value }))}
                  className="w-full rounded-2xl border border-white/45 bg-white/80 px-4 py-3 outline-none"
                />
              </label>
              <label className="space-y-2 text-sm text-slate-600">
                Teacher
                <input
                  value={importMeta.teacher}
                  onChange={(event) => setImportMeta((current) => ({ ...current, teacher: event.target.value }))}
                  className="w-full rounded-2xl border border-white/45 bg-white/80 px-4 py-3 outline-none"
                />
              </label>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2 text-sm text-slate-600">
                Subject
                <input
                  value={importMeta.subject}
                  onChange={(event) => setImportMeta((current) => ({ ...current, subject: event.target.value }))}
                  className="w-full rounded-2xl border border-white/45 bg-white/80 px-4 py-3 outline-none"
                />
              </label>
              <label className="space-y-2 text-sm text-slate-600">
                Class
                <input
                  value={importMeta.className}
                  onChange={(event) => setImportMeta((current) => ({ ...current, className: event.target.value }))}
                  className="w-full rounded-2xl border border-white/45 bg-white/80 px-4 py-3 outline-none"
                />
              </label>
            </div>
            <label className="block space-y-2 text-sm text-slate-600">
              Question file
              <input
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                onChange={(event) => setImportFile(event.target.files?.[0] ?? null)}
                className="w-full rounded-2xl border border-white/45 bg-white/80 px-4 py-3 text-sm outline-none file:mr-4 file:rounded-full file:border-0 file:bg-slate-950 file:px-4 file:py-2 file:text-white"
              />
            </label>
            <div className="flex flex-wrap items-center gap-4">
              <button
                type="submit"
                disabled={importing}
                className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white"
              >
                <Upload className="h-4 w-4" />
                {importing ? 'Importing...' : 'Import Document'}
              </button>
              {importMessage ? <p className="text-sm text-cyan-700">{importMessage}</p> : null}
            </div>
          </form>
        </GlassCard>
      </div>

      <div className="space-y-6">
        <GlassCard className="p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-400">Live paper summary</p>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <div className="rounded-[24px] bg-slate-950 p-4 text-white">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Questions</p>
              <p className="mt-2 font-display text-4xl">{questions.length}</p>
            </div>
            <div className="rounded-[24px] border border-white/45 bg-white/80 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Exam code</p>
              <p className="mt-2 font-display text-2xl text-slate-950">MATH-DEMO-30</p>
            </div>
            <div className="rounded-[24px] border border-white/45 bg-white/80 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Mode</p>
              <p className="mt-2 font-display text-2xl text-slate-950">MCQ only</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <h3 className="font-display text-2xl text-slate-950">Recent uploads</h3>
          <div className="mt-4 space-y-3">
            {uploads.map((upload) => (
              <div key={upload.id} className="rounded-[22px] border border-white/45 bg-white/80 px-4 py-3">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-medium text-slate-900">{upload.topic}</p>
                    <p className="mt-1 text-sm text-slate-500">{upload.teacher} • {upload.uploadedAt}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-900">{upload.count} questions</p>
                    <p className="text-xs uppercase tracking-[0.3em] text-emerald-600">{upload.status}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <h3 className="font-display text-2xl text-slate-950">Question preview</h3>
          <div className="mt-4 space-y-3">
            {questions.slice(0, 5).map((question) => (
              <div key={question.id} className="rounded-[22px] bg-slate-950 px-4 py-4 text-white">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{question.id}</p>
                <p className="mt-2 font-medium">{question.prompt}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {question.options.map((option) => (
                    <span key={option} className="rounded-full border border-white/15 px-3 py-1 text-xs text-slate-300">
                      {option}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  )
}
