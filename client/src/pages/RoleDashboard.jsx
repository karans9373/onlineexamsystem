import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Link } from 'react-router-dom'
import { fetchDashboard, fetchExams } from '../store/examSlice'
import { ChartCard } from '../components/ChartCard'
import { GlassPanel } from '../components/GlassPanel'
import { StatCard } from '../components/StatCard'

export default function RoleDashboard({ role }) {
  const dispatch = useDispatch()
  const dashboard = useSelector((state) => state.exam.dashboards[role])
  const exams = useSelector((state) => state.exam.exams)

  useEffect(() => {
    dispatch(fetchDashboard(role))
    dispatch(fetchExams(role === 'student' ? 'live' : ''))
  }, [dispatch, role])

  const statCards = useMemo(() => {
    if (!dashboard) return []
    if (role === 'student') {
      return [
        { label: 'Completed Exams', value: dashboard.stats.completed_exams, meta: 'All published results' },
        { label: 'Upcoming', value: dashboard.stats.upcoming_exams, meta: 'Live and scheduled assessments' },
        { label: 'Average Score', value: `${dashboard.stats.average_percentage}%`, meta: 'Performance momentum' },
        { label: 'Best Rank', value: dashboard.stats.best_rank || 'NA', meta: 'Leaderboard position' },
      ]
    }
    if (role === 'teacher') {
      return [
        { label: 'Exams Created', value: dashboard.stats.exams_created, meta: 'Across your subject portfolio' },
        { label: 'Live Students', value: dashboard.stats.live_students, meta: 'Currently in active attempts' },
        { label: 'Submissions', value: dashboard.stats.submissions, meta: 'Completed attempts' },
        { label: 'Cheating Alerts', value: dashboard.stats.cheating_alerts, meta: 'Need attention' },
      ]
    }
    return [
      { label: 'Total Users', value: dashboard.stats.total_users, meta: 'Across all roles' },
      { label: 'Active Exams', value: dashboard.stats.active_exams, meta: 'Published assessments' },
      { label: 'Live Students', value: dashboard.stats.live_students, meta: 'Current concurrency' },
      { label: 'Revenue', value: `₹${dashboard.stats.revenue_estimate?.toLocaleString?.() || dashboard.stats.revenue_estimate}`, meta: 'Commercial visibility' },
    ]
  }, [dashboard, role])

  if (!dashboard) {
    return <div className="text-slate-300">Loading dashboard...</div>
  }

  const upcomingExams = dashboard.upcoming_exams || []
  const ownExams = dashboard.own_exams || []
  const systemHealth = dashboard.system_health || []
  const liveAlerts = dashboard.live_alerts || []
  const topTeachers = dashboard.top_teachers || []
  const subjectBreakdown = dashboard.subject_breakdown || []
  const examHistory = dashboard.exam_history || []
  const performanceData =
    dashboard.performance_trend ||
    dashboard.subject_performance ||
    dashboard.revenue_series ||
    [{ name: 'No data', value: 0, score: 0, avg: 0 }]
  const pieData =
    (subjectBreakdown.length ? subjectBreakdown.map((item) => ({ name: item.topic, value: item.correct + item.wrong })) : null) ||
    (systemHealth.length ? systemHealth.map((item, index) => ({ name: item.label, value: index + 1 })) : null) ||
    [{ name: 'No data', value: 1 }]

  return (
    <div className="space-y-6 pb-10">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {statCards.map((item, index) => (
          <StatCard key={item.label} index={index} {...item} />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <ChartCard title="Performance Radar" subtitle="Fast insight panels with smooth rendering for large exam cohorts.">
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={performanceData}>
              <defs>
                <linearGradient id="scoreFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.85} />
                  <stop offset="100%" stopColor="#22d3ee" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(148,163,184,0.16)" />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip />
              <Area type="monotone" dataKey={role === 'admin' ? 'value' : role === 'teacher' ? 'avg' : 'score'} stroke="#22d3ee" fill="url(#scoreFill)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Distribution" subtitle="Subject, health, or activity split based on your role context.">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={pieData} innerRadius={54} outerRadius={92} dataKey="value" fill="#38bdf8" />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <ChartCard title={role === 'student' ? 'Upcoming Exams' : role === 'teacher' ? 'Exam Portfolio' : 'System Health'} subtitle="Premium cards tuned for responsive operations.">
          <div className="space-y-3">
            {(upcomingExams.length ? upcomingExams : ownExams.length ? ownExams : systemHealth).map((item, index) => (
              <GlassPanel key={item.id || item.label || index} className="p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-white">{item.title || item.label}</p>
                    <p className="mt-1 text-sm text-slate-400">{item.subject || item.value || item.description || 'Real-time dashboard item'}</p>
                  </div>
                  {item.id && role === 'student' && (
                    <Link to={`/exam/${item.id}`} className="rounded-full bg-cyan-400/15 px-4 py-2 text-sm font-semibold text-cyan-200">
                      Start Exam
                    </Link>
                  )}
                </div>
              </GlassPanel>
            ))}
          </div>
        </ChartCard>

        <ChartCard title={role === 'teacher' ? 'Live Alerts' : role === 'admin' ? 'Top Teachers' : 'Performance Topics'} subtitle="Decision-friendly lists for continuous action.">
          <div className="space-y-3">
            {(liveAlerts.length ? liveAlerts : topTeachers.length ? topTeachers : subjectBreakdown).map((item, index) => (
              <GlassPanel key={index} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-white">{item.student || item.name || item.topic}</p>
                    <p className="mt-1 text-sm text-slate-400">
                      {item.detail || item.subject || `Correct ${item.correct || 0} | Wrong ${item.wrong || 0}`}
                    </p>
                  </div>
                  <div className="rounded-full bg-white/5 px-3 py-1 text-xs text-cyan-200">{item.severity || item.exams || 'Insight'}</div>
                </div>
              </GlassPanel>
            ))}
          </div>
        </ChartCard>
      </section>

      {role === 'student' && (
        <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <ChartCard title="Recent Exam History" subtitle="Instant result review with rank and percentage context.">
            <div className="space-y-3">
              {examHistory.length ? examHistory.map((item) => (
                <GlassPanel key={item.attempt_id} className="p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-white">{item.exam_title}</p>
                      <p className="text-sm text-slate-400">{item.subject}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-display text-2xl text-white">{item.percentage}%</p>
                      <Link to={`/results/${item.attempt_id}`} className="text-sm text-cyan-300">
                        View analysis
                      </Link>
                    </div>
                  </div>
                </GlassPanel>
              )) : (
                <GlassPanel className="p-5 text-slate-300">
                  No exam history yet. Start the demo mock from the upcoming exams section.
                </GlassPanel>
              )}
            </div>
          </ChartCard>
          <ChartCard title="Live Exam Pool" subtitle="Government CBT-style launch cards for available tests.">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={exams.slice(0, 6).map((exam) => ({ name: exam.subject.slice(0, 10), value: exam.total_questions }))}>
                <CartesianGrid stroke="rgba(148,163,184,0.16)" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Bar dataKey="value" fill="#38bdf8" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </section>
      )}
    </div>
  )
}
