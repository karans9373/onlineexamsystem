import { useEffect, useMemo, useState } from 'react'
import { Trophy, BadgeCheck } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { GlassCard } from '../components/GlassCard'
import { apiGet } from '../lib/api'

export function ResultsBoardPage() {
  const [results, setResults] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    apiGet('/results')
      .then((data) => setResults(data))
      .catch(() => setError('Unable to load exam results right now.'))
  }, [])

  const topThree = useMemo(() => results.slice(0, 3), [results])

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-400">Live result center</p>
              <h2 className="font-display mt-3 text-3xl text-slate-950">Mathematics MCQ result board</h2>
            </div>
            <div className="rounded-[24px] bg-slate-950 p-4 text-white">
              <Trophy className="h-6 w-6" />
            </div>
          </div>
          <p className="mt-4 text-sm leading-6 text-slate-600">
            Every student submission lands here instantly. This demo board reads from the backend and shows scores for the same live paper students attempt online.
          </p>

          <div className="mt-6 space-y-3">
            {topThree.map((result, index) => (
              <div key={result.resultId} className="rounded-[24px] bg-slate-950 px-4 py-4 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Rank {index + 1}</p>
                    <p className="mt-2 font-display text-2xl">{result.studentName}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-display text-3xl">{result.score}/{result.total}</p>
                    <p className="text-sm text-slate-300">{result.percentage}%</p>
                  </div>
                </div>
              </div>
            ))}
            {error ? <p className="text-sm text-rose-600">{error}</p> : null}
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-400">Score comparison</p>
              <h3 className="font-display mt-3 text-2xl text-slate-950">Student performance chart</h3>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-800">
              <BadgeCheck className="h-4 w-4" />
              Instant evaluation
            </div>
          </div>

          <div className="mt-6 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={results.slice(0, 8)}>
                <CartesianGrid stroke="rgba(148,163,184,0.14)" vertical={false} />
                <XAxis dataKey="studentName" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="score" fill="#0f172a" radius={[12, 12, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      <GlassCard className="p-6">
        <h3 className="font-display text-2xl text-slate-950">All submitted results</h3>
        <div className="mt-5 overflow-x-auto">
          <table className="min-w-full text-left">
            <thead>
              <tr className="border-b border-slate-200/60">
                {['Student', 'Exam', 'Score', 'Percentage', 'Correct', 'Wrong', 'Submitted'].map((header) => (
                  <th key={header} className="px-3 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {results.map((result) => (
                <tr key={result.resultId} className="border-b border-slate-100/70 last:border-0">
                  <td className="px-3 py-4 text-sm text-slate-700">{result.studentName}</td>
                  <td className="px-3 py-4 text-sm text-slate-600">{result.examTitle}</td>
                  <td className="px-3 py-4 text-sm text-slate-700">{result.score}/{result.total}</td>
                  <td className="px-3 py-4 text-sm text-slate-700">{result.percentage}%</td>
                  <td className="px-3 py-4 text-sm text-emerald-700">{result.correctAnswers}</td>
                  <td className="px-3 py-4 text-sm text-rose-600">{result.wrongAnswers}</td>
                  <td className="px-3 py-4 text-sm text-slate-500">{result.submittedAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  )
}
