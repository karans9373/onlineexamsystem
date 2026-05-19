export function ExamPalette({ questions, answers, visited, review, activeQuestion, setActiveQuestion }) {
  const statusFor = (questionId) => {
    const isVisited = visited.includes(questionId)
    const isAnswered = Boolean(answers[String(questionId)])
    const isReview = review.includes(questionId)
    if (isReview && isAnswered) return 'bg-violet-500 text-white'
    if (isReview) return 'bg-amber-500 text-slate-950'
    if (isAnswered) return 'bg-emerald-500 text-white'
    if (isVisited) return 'bg-sky-500 text-white'
    return 'bg-slate-800 text-slate-300'
  }

  return (
    <div className="palette-scroll grid max-h-[460px] grid-cols-5 gap-2 overflow-y-auto pr-1">
      {questions.map((question, index) => (
        <button
          key={question.id}
          onClick={() => setActiveQuestion(index)}
          className={`rounded-2xl border border-white/8 px-3 py-3 text-sm font-semibold transition hover:-translate-y-0.5 ${
            activeQuestion === index ? 'ring-2 ring-cyan-300' : ''
          } ${statusFor(question.id)}`}
        >
          {index + 1}
        </button>
      ))}
    </div>
  )
}
