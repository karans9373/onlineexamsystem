import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Trash2, WandSparkles } from 'lucide-react'
import { aiGenerateQuestions, clearTeacherActionMessage, createExam, deleteExam, fetchDashboard, publishExam } from '../store/examSlice'
import { GlassPanel } from '../components/GlassPanel'

const emptyQuestion = {
  text_en: '',
  text_hi: '',
  correct_option: 'A',
  explanation: '',
  difficulty: 'medium',
  topic: 'General',
  marks: 1,
  options: [
    { key: 'A', label: '' },
    { key: 'B', label: '' },
    { key: 'C', label: '' },
    { key: 'D', label: '' },
  ],
}

export default function TeacherStudioPage() {
  const dispatch = useDispatch()
  const dashboard = useSelector((state) => state.exam.dashboards.teacher)
  const aiQuestions = useSelector((state) => state.exam.aiQuestions)
  const teacherActionMessage = useSelector((state) => state.exam.teacherActionMessage)
  const examError = useSelector((state) => state.exam.error)
  const [form, setForm] = useState({
    title: 'Class 12 Quantitative Aptitude Practice Set',
    description: 'Premium mock with bilingual questions and negative marking.',
    subject: 'Quantitative Aptitude',
    duration_minutes: 60,
    negative_marking: 0.25,
    language_mode: 'bilingual',
    instructions: ['Read all instructions carefully', 'Each correct answer carries 1 mark', '0.25 marks are deducted for each wrong answer'],
    questions: [structuredClone(emptyQuestion)],
  })
  const [aiPrompt, setAiPrompt] = useState('Create a Class 9 Maths paper of 10 MCQs on Algebra and Mensuration')

  useEffect(() => {
    dispatch(fetchDashboard('teacher'))
  }, [dispatch])

  useEffect(() => {
    return () => {
      dispatch(clearTeacherActionMessage())
    }
  }, [dispatch])

  const questionCount = useMemo(() => form.questions.length, [form.questions.length])

  const updateQuestion = (index, key, value) => {
    setForm((current) => ({
      ...current,
      questions: current.questions.map((question, questionIndex) =>
        questionIndex === index ? { ...question, [key]: value } : question,
      ),
    }))
  }

  const updateOption = (questionIndex, optionIndex, value) => {
    setForm((current) => ({
      ...current,
      questions: current.questions.map((question, qIndex) =>
        qIndex === questionIndex
          ? {
              ...question,
              options: question.options.map((option, oIndex) =>
                oIndex === optionIndex ? { ...option, label: value } : option,
              ),
            }
          : question,
      ),
    }))
  }

  const handleCreateExam = async () => {
    const result = await dispatch(createExam(form))
    if (result.payload?.id) {
      await dispatch(fetchDashboard('teacher'))
    }
  }

  const handlePublishExam = async (examId) => {
    const result = await dispatch(publishExam(examId))
    if (result.meta.requestStatus === 'fulfilled') {
      await dispatch(fetchDashboard('teacher'))
    }
  }

  const handleDeleteExam = async (examId) => {
    const result = await dispatch(deleteExam(examId))
    if (result.meta.requestStatus === 'fulfilled') {
      await dispatch(fetchDashboard('teacher'))
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
      <GlassPanel className="p-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-cyan-300">Teacher control room</p>
            <h1 className="mt-2 font-display text-4xl text-white">Exam studio</h1>
          </div>
          <div className="rounded-full bg-cyan-500/12 px-4 py-2 text-sm text-cyan-200">{questionCount} questions drafted</div>
        </div>
        {(teacherActionMessage || examError) && (
          <div className={`mt-5 rounded-2xl border px-4 py-3 text-sm ${examError ? 'border-rose-400/20 bg-rose-500/10 text-rose-200' : 'border-emerald-400/20 bg-emerald-500/10 text-emerald-200'}`}>
            {examError || teacherActionMessage}
          </div>
        )}
        <div className="mt-6 grid gap-4">
          <input className="rounded-2xl bg-white/6 px-4 py-3 text-white outline-none" value={form.title} onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))} />
          <textarea className="rounded-2xl bg-white/6 px-4 py-3 text-white outline-none" rows="3" value={form.description} onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))} />
          <div className="grid gap-4 md:grid-cols-4">
            <input className="rounded-2xl bg-white/6 px-4 py-3 text-white outline-none" value={form.subject} onChange={(e) => setForm((s) => ({ ...s, subject: e.target.value }))} />
            <input className="rounded-2xl bg-white/6 px-4 py-3 text-white outline-none" type="number" value={form.duration_minutes} onChange={(e) => setForm((s) => ({ ...s, duration_minutes: Number(e.target.value) }))} />
            <input className="rounded-2xl bg-white/6 px-4 py-3 text-white outline-none" type="number" step="0.25" value={form.negative_marking} onChange={(e) => setForm((s) => ({ ...s, negative_marking: Number(e.target.value) }))} />
            <select className="rounded-2xl bg-white/6 px-4 py-3 text-white outline-none" value={form.language_mode} onChange={(e) => setForm((s) => ({ ...s, language_mode: e.target.value }))}>
              <option value="bilingual">Hindi + English</option>
              <option value="english">English</option>
            </select>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {form.questions.map((question, questionIndex) => (
            <div key={questionIndex} className="rounded-[28px] border border-white/8 bg-white/5 p-5">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-white">Question {questionIndex + 1}</p>
                <button
                  onClick={() => setForm((current) => ({ ...current, questions: current.questions.filter((_, index) => index !== questionIndex) }))}
                  className="text-sm text-rose-300"
                >
                  Delete
                </button>
              </div>
              <div className="mt-4 grid gap-3">
                <textarea className="rounded-2xl bg-white/6 px-4 py-3 text-white outline-none" rows="3" placeholder="Question in English" value={question.text_en} onChange={(e) => updateQuestion(questionIndex, 'text_en', e.target.value)} />
                <textarea className="rounded-2xl bg-white/6 px-4 py-3 text-white outline-none" rows="2" placeholder="Question in Hindi" value={question.text_hi} onChange={(e) => updateQuestion(questionIndex, 'text_hi', e.target.value)} />
                <div className="grid gap-3 md:grid-cols-2">
                  {question.options.map((option, optionIndex) => (
                    <input
                      key={option.key}
                      className="rounded-2xl bg-white/6 px-4 py-3 text-white outline-none"
                      placeholder={`Option ${option.key}`}
                      value={option.label}
                      onChange={(e) => updateOption(questionIndex, optionIndex, e.target.value)}
                    />
                  ))}
                </div>
                <div className="grid gap-3 md:grid-cols-4">
                  <select className="rounded-2xl bg-white/6 px-4 py-3 text-white outline-none" value={question.correct_option} onChange={(e) => updateQuestion(questionIndex, 'correct_option', e.target.value)}>
                    <option value="A">Answer A</option>
                    <option value="B">Answer B</option>
                    <option value="C">Answer C</option>
                    <option value="D">Answer D</option>
                  </select>
                  <input className="rounded-2xl bg-white/6 px-4 py-3 text-white outline-none" placeholder="Topic" value={question.topic} onChange={(e) => updateQuestion(questionIndex, 'topic', e.target.value)} />
                  <select className="rounded-2xl bg-white/6 px-4 py-3 text-white outline-none" value={question.difficulty} onChange={(e) => updateQuestion(questionIndex, 'difficulty', e.target.value)}>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                  <input className="rounded-2xl bg-white/6 px-4 py-3 text-white outline-none" type="number" value={question.marks} onChange={(e) => updateQuestion(questionIndex, 'marks', Number(e.target.value))} />
                </div>
              </div>
            </div>
          ))}
          <div className="flex flex-wrap gap-3">
            <button onClick={() => setForm((current) => ({ ...current, questions: [...current.questions, structuredClone(emptyQuestion)] }))} className="rounded-2xl bg-white/8 px-4 py-3 text-white">
              Add Question
            </button>
            <button onClick={handleCreateExam} className="btn-primary rounded-2xl px-4 py-3 font-semibold">
              Save Exam
            </button>
          </div>
        </div>
      </GlassPanel>

      <div className="space-y-6">
        <GlassPanel className="p-6">
          <div className="flex items-center gap-3">
            <WandSparkles className="h-6 w-6 text-violet-300" />
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-violet-300">OpenAI generator</p>
              <h2 className="font-display text-3xl text-white">AI Question Paper Generator</h2>
            </div>
          </div>
          <textarea className="mt-5 w-full rounded-2xl bg-white/6 px-4 py-3 text-white outline-none" rows="5" value={aiPrompt} onChange={(e) => setAiPrompt(e.target.value)} />
          <p className="mt-3 text-sm leading-6 text-slate-400">
            The generator now uses structured topic-based question banks when no OpenAI API key is configured, so the paper stays academically coherent instead of random filler.
          </p>
          <button
            onClick={() => dispatch(aiGenerateQuestions({ prompt: aiPrompt, question_count: 10, subject: form.subject, language_mode: form.language_mode }))}
            className="mt-4 rounded-2xl bg-violet-500/20 px-4 py-3 font-semibold text-violet-200"
          >
            Generate AI questions
          </button>
          <div className="mt-5 space-y-3">
            {aiQuestions.slice(0, 5).map((question, index) => (
              <div key={index} className="rounded-2xl border border-white/8 bg-white/5 p-4">
                <p className="font-semibold text-white">{question.text_en}</p>
                <p className="mt-2 text-sm text-slate-400">Answer: {question.correct_option} | Difficulty: {question.difficulty}</p>
                <button
                  onClick={() => setForm((current) => ({ ...current, questions: [...current.questions, question] }))}
                  className="mt-3 rounded-xl bg-emerald-500/20 px-3 py-2 text-sm text-emerald-200"
                >
                  Add to exam
                </button>
              </div>
            ))}
          </div>
        </GlassPanel>

        <GlassPanel className="p-6">
          <p className="text-xs uppercase tracking-[0.35em] text-cyan-300">Published exams</p>
          <h2 className="mt-2 font-display text-3xl text-white">Teacher dashboard sync</h2>
          <div className="mt-5 space-y-3">
            {(dashboard?.own_exams || []).map((exam) => (
              <div key={exam.id} className="rounded-2xl border border-white/8 bg-white/5 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-white">{exam.title}</p>
                    <p className="text-sm text-slate-400">{exam.subject} | {exam.total_questions} questions | {exam.is_published ? 'Published' : 'Draft'}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {!exam.is_published && (
                      <button onClick={() => handlePublishExam(exam.id)} className="rounded-xl bg-cyan-500/20 px-3 py-2 text-sm text-cyan-200">
                        Publish
                      </button>
                    )}
                    <button onClick={() => handleDeleteExam(exam.id)} className="rounded-xl bg-rose-500/20 px-3 py-2 text-sm text-rose-200">
                      <Trash2 className="mr-1 inline h-4 w-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </GlassPanel>
      </div>
    </div>
  )
}
