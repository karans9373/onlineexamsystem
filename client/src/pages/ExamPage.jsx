import { startTransition, useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { AlertTriangle, ChevronLeft, ChevronRight, Eraser, Flag, Fullscreen, Languages, Save } from 'lucide-react'
import { autosaveExam, logSuspiciousActivity, startExam, submitExam } from '../store/examSlice'
import { GlassPanel } from '../components/GlassPanel'
import { ExamPalette } from '../components/ExamPalette'
import { CountdownBadge } from '../components/CountdownBadge'
import { useAntiCheat } from '../hooks/useAntiCheat'

export default function ExamPage() {
  const { examId } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const activeExam = useSelector((state) => state.exam.activeExam)
  const attemptId = useSelector((state) => state.exam.activeAttempt)
  const user = useSelector((state) => state.auth.user)
  const [activeQuestion, setActiveQuestion] = useState(0)
  const [answers, setAnswers] = useState({})
  const [visited, setVisited] = useState([])
  const [markedForReview, setMarkedForReview] = useState([])
  const [timeSpent, setTimeSpent] = useState({})
  const [secondsLeft, setSecondsLeft] = useState(0)
  const [language, setLanguage] = useState('bilingual')
  const [warningMessage, setWarningMessage] = useState('')
  const [fullscreenViolations, setFullscreenViolations] = useState(0)
  const [tabSwitches, setTabSwitches] = useState(0)
  const [warningsCount, setWarningsCount] = useState(0)
  const [examBooted, setExamBooted] = useState(false)
  const warnedRef = useRef(new Set())

  useEffect(() => {
    setExamBooted(false)
    dispatch(startExam(examId)).then((result) => {
      const exam = result.payload?.exam
      if (exam) {
        setAnswers(result.payload.saved_state || {})
        setSecondsLeft(exam.duration_minutes * 60)
        setLanguage(exam.language_mode || 'bilingual')
        setExamBooted(true)
      }
    })
  }, [dispatch, examId])

  useEffect(() => {
    if (!activeExam?.questions?.length) return
    const currentQuestion = activeExam.questions[activeQuestion]
    if (currentQuestion && !visited.includes(currentQuestion.id)) {
      setVisited((current) => [...current, currentQuestion.id])
    }
  }, [activeExam, activeQuestion, visited])

  useEffect(() => {
    if (!examBooted || secondsLeft <= 0) return undefined
    const timer = window.setInterval(() => {
      setSecondsLeft((current) => current - 1)
    }, 1000)
    return () => window.clearInterval(timer)
  }, [examBooted, secondsLeft])

  useEffect(() => {
    if (!examBooted || !activeExam || !attemptId) return undefined
    const timer = window.setInterval(() => {
      dispatch(
        autosaveExam({
          examId,
          payload: { attempt_id: attemptId, answers, visited, marked_for_review: markedForReview, time_spent: timeSpent, fullscreen_violations: fullscreenViolations, tab_switches: tabSwitches, warnings_count: warningsCount },
        }),
      )
    }, 5000)
    return () => window.clearInterval(timer)
  }, [activeExam, answers, attemptId, dispatch, examBooted, examId, fullscreenViolations, markedForReview, tabSwitches, timeSpent, visited, warningsCount])

  useEffect(() => {
    if (!activeExam?.questions?.[activeQuestion]) return undefined
    const questionId = String(activeExam.questions[activeQuestion].id)
    const timer = window.setInterval(() => {
      setTimeSpent((current) => ({ ...current, [questionId]: (current[questionId] || 0) + 1 }))
    }, 1000)
    return () => window.clearInterval(timer)
  }, [activeExam, activeQuestion])

  useEffect(() => {
    if (!examBooted) return
    const warnings = [
      { threshold: 1800, message: '30 minutes left. Shift to your review strategy now.' },
      { threshold: 600, message: '10 minutes left. Focus on marked questions and do not switch tabs.' },
      { threshold: 60, message: '1 minute left. Your test will auto-submit.' },
    ]
    warnings.forEach(({ threshold, message }) => {
      if (secondsLeft === threshold && !warnedRef.current.has(threshold)) {
        warnedRef.current.add(threshold)
        setWarningMessage(message)
        setWarningsCount((current) => current + 1)
      }
    })
    if (secondsLeft <= 0 && attemptId) {
      handleSubmit(true)
    }
  }, [attemptId, examBooted, secondsLeft])

  const currentQuestion = activeExam?.questions?.[activeQuestion]
  const attemptedCount = useMemo(() => Object.keys(answers).filter((key) => answers[key]).length, [answers])

  const onSuspiciousEvent = (type, detail, severity) => {
    if (!attemptId) return
    dispatch(logSuspiciousActivity({ examId, payload: { attempt_id: attemptId, activity_type: type, detail, severity } }))
  }

  useAntiCheat({
    enabled: Boolean(activeExam && attemptId),
    examId,
    attemptId,
    onEvent: onSuspiciousEvent,
    onFullscreenViolation: () => setFullscreenViolations((current) => current + 1),
    onTabSwitch: () => setTabSwitches((current) => current + 1),
  })

  const requestFullscreen = async () => {
    await document.documentElement.requestFullscreen?.()
  }

  const goToQuestion = (direction) => {
    startTransition(() => {
      setActiveQuestion((current) => Math.min(Math.max(current + direction, 0), activeExam.questions.length - 1))
    })
  }

  const saveAndNext = () => goToQuestion(1)
  const clearResponse = () => setAnswers((current) => ({ ...current, [String(currentQuestion.id)]: '' }))
  const toggleReview = () => {
    setMarkedForReview((current) =>
      current.includes(currentQuestion.id)
        ? current.filter((item) => item !== currentQuestion.id)
        : [...current, currentQuestion.id],
    )
  }

  const handleSubmit = async (autoSubmitted = false) => {
    if (!attemptId) return
    const result = await dispatch(
      submitExam({
        examId,
        payload: {
          attempt_id: attemptId,
          answers,
          visited,
          marked_for_review: markedForReview,
          time_spent: timeSpent,
          fullscreen_violations: fullscreenViolations,
          tab_switches: tabSwitches,
          warnings_count: warningsCount,
          auto_submitted: autoSubmitted,
        },
      }),
    )
    if (result.payload?.attempt_id) {
      navigate(`/results/${result.payload.attempt_id}`)
    }
  }

  if (!activeExam || !currentQuestion) {
    return <div className="text-slate-300">Preparing your secure exam session...</div>
  }

  return (
    <div className="space-y-5 pb-10">
      {warningMessage && (
        <div className="rounded-[24px] border border-amber-400/25 bg-amber-500/10 px-4 py-3 text-amber-100">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5" />
            {warningMessage}
          </div>
        </div>
      )}

      <GlassPanel className="p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-slate-400">{activeExam.subject}</p>
            <h1 className="font-display text-3xl text-white">{activeExam.title}</h1>
            <p className="mt-1 text-sm text-slate-400">Candidate: {user?.full_name} | Questions: {activeExam.total_questions}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <CountdownBadge totalSeconds={Math.max(secondsLeft, 0)} />
            <button onClick={requestFullscreen} className="status-chip rounded-full px-4 py-2 text-sm text-white">
              <Fullscreen className="mr-2 inline h-4 w-4" />
              Fullscreen
            </button>
            <button onClick={() => setLanguage((current) => (current === 'english' ? 'bilingual' : 'english'))} className="status-chip rounded-full px-4 py-2 text-sm text-white">
              <Languages className="mr-2 inline h-4 w-4" />
              {language === 'english' ? 'English only' : 'Hindi + English'}
            </button>
          </div>
        </div>
      </GlassPanel>

      <div className="grid gap-5 xl:grid-cols-[300px_minmax(0,1fr)_310px]">
        <GlassPanel className="p-5">
          <p className="font-display text-2xl text-white">Question Palette</p>
          <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-slate-300">
            <div className="rounded-xl bg-emerald-500/20 px-3 py-2">Answered</div>
            <div className="rounded-xl bg-sky-500/20 px-3 py-2">Visited</div>
            <div className="rounded-xl bg-amber-500/20 px-3 py-2">Review</div>
            <div className="rounded-xl bg-slate-800 px-3 py-2">Not Visited</div>
          </div>
          <div className="mt-4">
            <ExamPalette
              questions={activeExam.questions}
              answers={answers}
              visited={visited}
              review={markedForReview}
              activeQuestion={activeQuestion}
              setActiveQuestion={setActiveQuestion}
            />
          </div>
        </GlassPanel>

        <GlassPanel className="p-6">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Question {activeQuestion + 1}</p>
              <p className="mt-3 text-xl leading-8 text-white">
                {language === 'english' ? currentQuestion.text_en : `${currentQuestion.text_en}${currentQuestion.text_hi ? ` / ${currentQuestion.text_hi}` : ''}`}
              </p>
            </div>
            <div className="rounded-2xl bg-white/5 px-4 py-3 text-sm text-slate-300">{currentQuestion.topic}</div>
          </div>
          {currentQuestion.image_url && <img src={currentQuestion.image_url} alt="Question" className="mb-4 rounded-2xl" />}
          <div className="grid gap-3">
            {currentQuestion.options.map((option) => (
              <button
                key={option.key}
                data-selected={answers[String(currentQuestion.id)] === option.key}
                onClick={() => setAnswers((current) => ({ ...current, [String(currentQuestion.id)]: option.key }))}
                className="question-option rounded-[22px] border border-white/10 bg-white/5 px-5 py-4 text-left text-white transition hover:border-cyan-300/40"
              >
                <span className="mr-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/8 text-sm font-semibold">{option.key}</span>
                {option.label}
              </button>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button onClick={() => goToQuestion(-1)} className="rounded-2xl bg-white/8 px-4 py-3 text-white">
              <ChevronLeft className="mr-2 inline h-4 w-4" />
              Previous
            </button>
            <button onClick={saveAndNext} className="btn-primary rounded-2xl px-4 py-3 font-semibold">
              <Save className="mr-2 inline h-4 w-4" />
              Save & Next
            </button>
            <button onClick={toggleReview} className="rounded-2xl bg-amber-500/15 px-4 py-3 text-amber-100">
              <Flag className="mr-2 inline h-4 w-4" />
              Mark for Review
            </button>
            <button onClick={clearResponse} className="rounded-2xl bg-white/8 px-4 py-3 text-white">
              <Eraser className="mr-2 inline h-4 w-4" />
              Clear Response
            </button>
            <button onClick={() => handleSubmit(false)} className="rounded-2xl bg-rose-500/18 px-4 py-3 font-semibold text-rose-100">
              Submit Test
              <ChevronRight className="ml-2 inline h-4 w-4" />
            </button>
          </div>
        </GlassPanel>

        <GlassPanel className="p-5">
          <p className="font-display text-2xl text-white">Instructions & Progress</p>
          <div className="mt-4 space-y-2 text-sm leading-7 text-slate-300">
            {activeExam.instructions.map((item, index) => (
              <p key={index}>{index + 1}. {item}</p>
            ))}
          </div>
          <div className="mt-6 grid gap-3">
            <div className="rounded-2xl bg-white/5 p-4">
              <p className="text-sm text-slate-400">Attempted</p>
              <p className="mt-1 font-display text-3xl text-white">{attemptedCount}</p>
            </div>
            <div className="rounded-2xl bg-white/5 p-4">
              <p className="text-sm text-slate-400">Marked for review</p>
              <p className="mt-1 font-display text-3xl text-white">{markedForReview.length}</p>
            </div>
            <div className="rounded-2xl bg-white/5 p-4">
              <p className="text-sm text-slate-400">Warnings</p>
              <p className="mt-1 font-display text-3xl text-white">{warningsCount}</p>
            </div>
            <div className="rounded-2xl bg-white/5 p-4">
              <p className="text-sm text-slate-400">Tab switches</p>
              <p className="mt-1 font-display text-3xl text-white">{tabSwitches}</p>
            </div>
          </div>
        </GlassPanel>
      </div>
    </div>
  )
}
