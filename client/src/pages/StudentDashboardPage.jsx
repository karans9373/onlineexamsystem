import { useEffect, useState } from 'react'
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts'
import { GlassCard } from '../components/GlassCard'
import { apiGet } from '../lib/api'

export function StudentDashboardPage() {
  const [student, setStudent] = useState(null)
  const [students, setStudents] = useState([])
  const [selectedSlug, setSelectedSlug] = useState('aarav-mehta')
  const [schedule, setSchedule] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([apiGet('/students'), apiGet(`/students/${selectedSlug}`), apiGet('/schedule')])
      .then(([studentsData, studentData, scheduleData]) => {
        setStudents(studentsData)
        setStudent(studentData)
        setSchedule(scheduleData.filter((item) => item.className === studentData.className))
      })
      .catch(() => setError('Unable to load the student dashboard data right now.'))
  }, [selectedSlug])

  useEffect(() => {
    if (!students.length) {
      return
    }
    const exists = students.some((item) => item.slug === selectedSlug)
    if (!exists) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedSlug(students[0].slug)
    }
  }, [students, selectedSlug])

  if (!student) {
    return <GlassCard className="p-6 text-sm text-slate-500">{error || 'Loading personal student dashboard...'}</GlassCard>
  }

  return (
    <div className="space-y-6">
      <GlassCard className="p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-400">Student switcher</p>
            <h2 className="font-display mt-2 text-2xl text-slate-950">View full panel for any registered student</h2>
          </div>
          <div className="grid gap-3 md:grid-cols-[260px_160px]">
            <label className="space-y-2 text-sm text-slate-600">
              Select student
              <select
                value={selectedSlug}
                onChange={(event) => setSelectedSlug(event.target.value)}
                className="w-full rounded-2xl border border-white/45 bg-white/80 px-4 py-3 outline-none"
              >
                {students.map((item) => (
                  <option key={item.slug} value={item.slug}>
                    {item.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-2 text-sm text-slate-600">
              Class
              <input value={student.className} readOnly className="w-full rounded-2xl border border-white/45 bg-white/80 px-4 py-3 outline-none" />
            </label>
          </div>
        </div>
      </GlassCard>

      <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <GlassCard className="p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-400">Student identity</p>
          <div className="mt-4 rounded-[30px] bg-slate-950 p-6 text-white">
            <p className="text-sm text-slate-300">{student.school}</p>
            <h2 className="font-display mt-2 text-3xl">{student.name}</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Class</p>
                <p className="mt-1 text-sm">{student.className}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Roll Number</p>
                <p className="mt-1 text-sm">{student.rollNumber}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Target</p>
                <p className="mt-1 text-sm">{student.targetExam}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Guardian</p>
                <p className="mt-1 text-sm">{student.guardian}</p>
              </div>
            </div>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {[
              ['Readiness score', `${student.stats.readinessScore}%`],
              ['Upcoming exams', student.stats.upcomingExams],
              ['Completed exams', student.stats.completedExams],
              ['Current rank', `#${student.stats.rank}`],
            ].map(([label, value]) => (
              <div key={label} className="rounded-[24px] border border-white/45 bg-white/80 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{label}</p>
                <p className="mt-2 font-display text-3xl text-slate-950">{value}</p>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <h3 className="font-display text-2xl text-slate-950">Full personal student data</h3>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {[
              ['Email', student.email],
              ['Phone', student.phone],
              ['City', student.city],
              ['Joined On', student.joinedOn],
              ['Attendance', student.attendance],
              ['Average Score', student.averageScore],
            ].map(([label, value]) => (
              <div key={label} className="rounded-[24px] border border-white/45 bg-white/80 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{label}</p>
                <p className="mt-2 text-sm font-medium text-slate-900">{value}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="rounded-[24px] border border-white/45 bg-white/80 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Strengths</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {student.strengths.map((item) => (
                  <span key={item} className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">{item}</span>
                ))}
              </div>
            </div>
            <div className="rounded-[24px] border border-white/45 bg-white/80 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Improvement Areas</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {student.improvements.map((item) => (
                  <span key={item} className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">{item}</span>
                ))}
              </div>
            </div>
          </div>
        </GlassCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <GlassCard className="p-6">
          <h3 className="font-display text-2xl text-slate-950">Personal performance trend</h3>
          <div className="mt-5 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={student.performanceHistory}>
                <defs>
                  <linearGradient id="studentArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.45} />
                    <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(148,163,184,0.14)" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip />
                <Area dataKey="score" stroke="#0284c7" strokeWidth={3} fill="url(#studentArea)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <h3 className="font-display text-2xl text-slate-950">Subject split</h3>
          <div className="mt-5 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={student.subjectPerformance} dataKey="value" innerRadius={60} outerRadius={100}>
                  {student.subjectPerformance.map((entry, index) => (
                    <Cell key={entry.name} fill={['#0f172a', '#38bdf8', '#f59e0b', '#d946ef'][index % 4]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <GlassCard className="p-6">
          <h3 className="font-display text-2xl text-slate-950">Scheduled exams for this student</h3>
          <div className="mt-4 space-y-3">
            {schedule.map((item) => (
              <div key={item.id} className="rounded-[22px] border border-white/45 bg-white/80 px-4 py-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-medium text-slate-900">{item.title}</p>
                    <p className="mt-1 text-sm text-slate-500">{item.subject} • {item.className} • {item.examCode}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-900">{item.totalMarks} marks</p>
                    <p className="text-xs uppercase tracking-[0.3em] text-cyan-700">{item.examDate} {item.examTime}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <h3 className="font-display text-2xl text-slate-950">Recent results and notifications</h3>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-left">
              <thead>
                <tr className="border-b border-slate-200/60">
                  {['Exam', 'Subject', 'Score', 'Status', 'Date'].map((header) => (
                    <th key={header} className="px-3 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {student.recentResults.map((result) => (
                  <tr key={`${result.Exam}-${result.Date}`} className="border-b border-slate-100/70 last:border-0">
                    {Object.values(result).map((value) => (
                      <td key={value} className="px-3 py-4 text-sm text-slate-600">{value}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-5 space-y-3">
            {student.notifications.map((item) => (
              <div key={item} className="rounded-[20px] bg-slate-950 px-4 py-3 text-sm text-slate-200">{item}</div>
            ))}
          </div>
        </GlassCard>
      </div>
      </div>
    </div>
  )
}
