import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Bar, BarChart } from 'recharts'
import { fetchResult } from '../store/examSlice'
import { ChartCard } from '../components/ChartCard'
import { GlassPanel } from '../components/GlassPanel'
import { StatCard } from '../components/StatCard'

export default function ResultPage() {
  const { attemptId } = useParams()
  const dispatch = useDispatch()
  const result = useSelector((state) => state.exam.result)

  useEffect(() => {
    dispatch(fetchResult(attemptId))
  }, [attemptId, dispatch])

  if (!result) {
    return <div className="text-slate-300">Loading result analysis...</div>
  }

  const topicSeries = Object.entries(result.subject_breakdown || {}).map(([topic, stats]) => ({
    name: topic,
    correct: stats.correct,
    wrong: stats.wrong,
    total: stats.total,
  }))

  return (
    <div className="space-y-6 pb-10">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Score" value={result.score} meta={`${result.correct} correct | ${result.wrong} wrong`} />
        <StatCard label="Percentage" value={`${result.percentage}%`} meta="Instant evaluation" />
        <StatCard label="Accuracy" value={`${result.accuracy}%`} meta="Attempt quality" />
        <StatCard label="Rank / Percentile" value={`${result.rank || '-'} / ${result.percentile || 0}`} meta="Leaderboard output" />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <ChartCard title="Subject-wise Analysis" subtitle="Topic heatmap for weak-area diagnosis.">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topicSeries}>
              <CartesianGrid stroke="rgba(148,163,184,0.16)" />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip />
              <Bar dataKey="correct" fill="#22c55e" radius={[8, 8, 0, 0]} />
              <Bar dataKey="wrong" fill="#f87171" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Time Spent Flow" subtitle="Question-level time behavior across the exam.">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={(result.review || []).map((item, index) => ({ name: `Q${index + 1}`, value: item.time_spent_seconds }))}>
              <defs>
                <linearGradient id="timeFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#a78bfa" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#a78bfa" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(148,163,184,0.16)" />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip />
              <Area dataKey="value" stroke="#a78bfa" fill="url(#timeFill)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <GlassPanel className="p-6">
          <p className="font-display text-3xl text-white">AI Improvement Suggestions</p>
          <div className="mt-4 space-y-3">
            {result.suggestions.map((item, index) => (
              <div key={index} className="rounded-2xl bg-white/5 p-4 text-slate-300">
                {item}
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-2xl bg-amber-500/10 p-4 text-amber-100">
            Weak topics: {(result.weak_topics || []).join(', ') || 'No major weaknesses detected'}
          </div>
        </GlassPanel>

        <GlassPanel className="p-6">
          <p className="font-display text-3xl text-white">Question Review</p>
          <div className="thin-scroll mt-4 max-h-[480px] space-y-3 overflow-y-auto pr-1">
            {(result.review || []).map((item, index) => (
              <div key={item.question_id} className="question-option rounded-[24px] border border-white/8 bg-white/5 p-4" data-correct={item.is_correct} data-wrong={!item.is_correct && item.selected}>
                <p className="font-semibold text-white">Q{index + 1}. {item.question}</p>
                <p className="mt-2 text-sm text-slate-300">Selected: {item.selected || 'Not answered'} | Correct: {item.correct}</p>
                <p className="mt-1 text-sm text-slate-400">Time spent: {item.time_spent_seconds}s | Topic: {item.topic}</p>
              </div>
            ))}
          </div>
        </GlassPanel>
      </section>
    </div>
  )
}
