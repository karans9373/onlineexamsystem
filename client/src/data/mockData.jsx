import { createStandardPage } from '../components/StandardPage'
import { StudentDashboardPage } from '../pages/StudentDashboardPage'
import { TeacherExamStudio } from '../pages/TeacherExamStudio'
import { ExamPortalPage } from '../pages/ExamPortalPage'
import { ResultsBoardPage } from '../pages/ResultsBoardPage'
import { QuestionBankPage } from '../pages/QuestionBankPage'
import { ExamSchedulePage } from '../pages/ExamSchedulePage'
import { StudentsPage } from '../pages/StudentsPage'
import { AIAssistantPage } from '../pages/AIAssistantPage'

const sharedArea = [
  { name: 'Mon', score: 68 },
  { name: 'Tue', score: 74 },
  { name: 'Wed', score: 79 },
  { name: 'Thu', score: 77 },
  { name: 'Fri', score: 88 },
  { name: 'Sat', score: 91 },
  { name: 'Sun', score: 94 },
]

const sharedPie = [
  { name: 'On track', value: 54 },
  { name: 'Needs review', value: 21 },
  { name: 'High risk', value: 12 },
  { name: 'Completed', value: 13 },
]

const sharedBars = [
  { name: '08:00', value: 22 },
  { name: '10:00', value: 34 },
  { name: '12:00', value: 48 },
  { name: '14:00', value: 41 },
  { name: '16:00', value: 54 },
  { name: '18:00', value: 38 },
]

export const landingHighlights = [
  { title: 'Enterprise uptime', value: '99.98%', copy: 'Multi-region delivery, backup queues, and resilient exam orchestration.' },
  { title: 'Assessments delivered', value: '1.6M+', copy: 'Secure MCQ, subjective, coding, oral, and hybrid exam flows.' },
  { title: 'Institutions onboarded', value: '240+', copy: 'Universities, bootcamps, coaching brands, and certification networks.' },
]

export const quickActions = [
  { title: 'Launch exam command center', metric: '07 queues', copy: 'Switch from planning to invigilation in one click with live room health, seat maps, and anomaly alerts.' },
  { title: 'Review AI recommendations', metric: '13 insights', copy: 'Adaptive recommendations cluster students by readiness, risk, and remediation needs.' },
  { title: 'Export investor-grade analytics', metric: 'PDF / XLSX', copy: 'Generate premium reports for accreditation, operations, revenue, and academic performance.' },
]

export const sidebarLinks = [
  {
    label: 'Experience',
    items: [
      { name: 'Student Dashboard', path: '/student', tag: 'Learner' },
      { name: 'Teacher Dashboard', path: '/teacher', tag: 'Faculty' },
      { name: 'Admin Dashboard', path: '/admin', tag: 'Control' },
      { name: 'Exam Portal', path: '/exam-portal', tag: 'Exam' },
      { name: 'Live Exam', path: '/live-exam', tag: 'Live' },
    ],
  },
  {
    label: 'Operations',
    items: [
      { name: 'Results & Analytics', path: '/results', tag: 'Data' },
      { name: 'Course Management', path: '/courses', tag: 'CMS' },
      { name: 'Question Bank', path: '/question-bank', tag: 'QB' },
      { name: 'Exam Schedule', path: '/schedule', tag: 'Plan' },
      { name: 'Leaderboard', path: '/leaderboard', tag: 'Rank' },
    ],
  },
  {
    label: 'Engagement',
    items: [
      { name: 'Certificates', path: '/certificates', tag: 'Docs' },
      { name: 'AI Assistant', path: '/ai-assistant', tag: 'AI' },
      { name: 'Students', path: '/profile', tag: 'Users' },
      { name: 'Contact & Support', path: '/support', tag: 'Help' },
      { name: 'About System', path: '/about', tag: 'Brand' },
    ],
  },
]

const pageTemplates = [
  {
    path: '/student',
    eyebrow: 'Learner intelligence',
    title: 'Student Dashboard',
    description: 'A calm, premium workspace for exam readiness, attempt history, personalized recommendations, certificates, and live performance visibility.',
    heroStats: [
      { label: 'Readiness score', value: '92%', subtext: 'AI adjusted' },
      { label: 'Upcoming exams', value: '04', subtext: 'This week' },
      { label: 'Rank uplift', value: '+11', subtext: 'Since last sprint' },
    ],
    config: {
      stats: [
        { label: 'Learning streak', value: '28 days', caption: 'Daily practice sessions', delta: '+9%' },
        { label: 'Average score', value: '88.4%', caption: 'Across latest 12 exams', delta: '+6.2%' },
        { label: 'Certificates', value: '16', caption: 'Unlocked credentials', delta: '+4' },
        { label: 'Leaderboard rank', value: '#7', caption: 'National mock cohort', delta: 'Top 3%' },
      ],
      areaTitle: 'Performance momentum',
      areaCopy: 'Track mastery improvement across subjects with AI-weighted confidence analysis.',
      areaData: sharedArea,
      pieTitle: 'Readiness split',
      pieCopy: 'Adaptive exam prep status across enrolled courses.',
      pieData: sharedPie,
      insights: [
        { title: 'Smart revision plan', copy: 'Thermodynamics and probability require one short precision round before the weekend simulation.', metricLabel: 'Confidence gain', metricValue: '+12.4%' },
        { title: 'Proctoring posture', copy: 'Webcam framing, tab focus, and fullscreen compliance all remained within safe thresholds in recent attempts.', metricLabel: 'Integrity score', metricValue: '99.1%' },
        { title: 'Placement readiness', copy: 'Your speed profile now matches the top quartile of students selected in the latest internship cycle.', metricLabel: 'Benchmark', metricValue: 'Q1 band' },
      ],
      tableTitle: 'Recent exam history',
      tableCopy: 'Realistic performance records with status, proctoring state, and exam outcomes.',
      tableRows: [
        { Exam: 'Quant Sprint 04', Subject: 'Aptitude', Score: '91/100', Status: 'Passed', Mode: 'AI proctored' },
        { Exam: 'DSA Timed Mock', Subject: 'Coding', Score: '84/100', Status: 'Passed', Mode: 'Fullscreen' },
        { Exam: 'OS Midterm', Subject: 'Systems', Score: '76/100', Status: 'Reviewed', Mode: 'Manual check' },
      ],
      checklistTitle: 'Student feature stack',
      checklist: ['JWT + Google Login UX panels', 'Realtime reminders and notices', 'Downloadable certificates', 'Performance trend recommendations', 'Exam history with filtering'],
      barTitle: 'Focus intensity by session',
      barCopy: 'Time-window engagement from revision and mock participation.',
      barData: sharedBars,
    },
  },
  {
    path: '/teacher',
    eyebrow: 'Faculty workflow',
    title: 'Teacher Dashboard',
    description: 'Create assessments, manage question banks, review subjective answers, monitor classrooms, and publish results through an elegant operational cockpit.',
    heroStats: [
      { label: 'Active classes', value: '18', subtext: 'This semester' },
      { label: 'Pending review', value: '146', subtext: 'Subjective answers' },
      { label: 'Exam completion', value: '96%', subtext: 'Average cohort rate' },
    ],
    config: {
      stats: [
        { label: 'Exams created', value: '74', caption: 'Across 6 subjects', delta: '+8' },
        { label: 'Question bank size', value: '4,820', caption: 'Tagged and searchable', delta: '+420' },
        { label: 'Average review time', value: '11 min', caption: 'Per answer sheet', delta: '-18%' },
        { label: 'Student satisfaction', value: '4.9/5', caption: 'Faculty feedback score', delta: '+0.3' },
      ],
      areaTitle: 'Cohort performance pulse',
      areaCopy: 'Compare section-wise score flow and detect learning gaps before finals.',
      areaData: sharedArea.map((point, index) => ({ ...point, score: point.score + (index % 2 === 0 ? 4 : -2) })),
      pieTitle: 'Review distribution',
      pieCopy: 'Mix of auto-evaluated, flagged, pending, and manually reviewed submissions.',
      pieData: sharedPie,
      insights: [
        { title: 'Question quality signal', copy: 'Two calculus questions are producing abnormal drop-off after 38 seconds, indicating wording friction.', metricLabel: 'Flagged items', metricValue: '02' },
        { title: 'Evaluation accelerator', copy: 'Bulk annotation presets and rubric tagging reduced descriptive answer review effort by nearly a fifth.', metricLabel: 'Time saved', metricValue: '18%' },
        { title: 'Attendance forecast', copy: 'Tomorrow’s Data Structures exam is likely to exceed standard concurrency by 12 percent.', metricLabel: 'Predicted seats', metricValue: '1,420' },
      ],
      tableTitle: 'Exam operations board',
      tableCopy: 'Faculty-level oversight for scheduled tests and review queues.',
      tableRows: [
        { Exam: 'DBMS Assessment', Batch: 'CSE 3A', Review: '42 pending', Schedule: '18 May, 10:00', State: 'Ready' },
        { Exam: 'Physics Mock', Batch: 'XI Science', Review: 'Auto checked', Schedule: '19 May, 08:30', State: 'Scheduled' },
        { Exam: 'Essay Evaluation', Batch: 'Humanities', Review: '31 pending', Schedule: '20 May, 13:00', State: 'Draft' },
      ],
      checklistTitle: 'Teacher tools',
      checklist: ['Bulk upload CSV/XLSX questions', 'Manual rubric review console', 'Randomized exam sets', 'Student analytics drilldown', 'Schedule with seat planning'],
      barTitle: 'Review throughput',
      barCopy: 'Submission review and publication pace through the day.',
      barData: sharedBars,
    },
  },
  {
    path: '/admin',
    eyebrow: 'Executive control',
    title: 'Admin Dashboard',
    description: 'Multi-layer analytics for institutions, finances, users, compliance, exam traffic, and operational governance in a premium enterprise view.',
    heroStats: [
      { label: 'ARR projection', value: '$482K', subtext: 'SaaS ops view' },
      { label: 'Active users', value: '48.2K', subtext: 'Across orgs' },
      { label: 'Risk alerts', value: '09', subtext: 'Open priorities' },
    ],
    config: {
      stats: [
        { label: 'Institutions', value: '240', caption: 'Live across regions', delta: '+18' },
        { label: 'Revenue this month', value: '$38.4K', caption: 'Subscriptions + services', delta: '+14%' },
        { label: 'API health', value: '99.98%', caption: 'Rolling 30-day uptime', delta: '+0.02%' },
        { label: 'Fraud blocks', value: '1,284', caption: 'Suspicious attempts stopped', delta: '+22%' },
      ],
      areaTitle: 'Platform usage curve',
      areaCopy: 'Institution-wide activity, exam concurrency, and policy compliance trends.',
      areaData: sharedArea.map((point, index) => ({ ...point, score: point.score + index * 3 })),
      pieTitle: 'Operational risk mix',
      pieCopy: 'How issues are distributed between access, policy, network, and invigilation incidents.',
      pieData: sharedPie,
      insights: [
        { title: 'Revenue acceleration', copy: 'New enterprise bundles from coaching academies are driving stronger retention and upsell potential.', metricLabel: 'Expansion revenue', metricValue: '+19%' },
        { title: 'Support compression', copy: 'AI-first ticket triage is resolving common exam access issues without human handoff.', metricLabel: 'First response', metricValue: '2m 14s' },
        { title: 'Security posture', copy: 'Tab-switching patterns and webcam exception spikes remain below configured threat envelopes.', metricLabel: 'Threat level', metricValue: 'Low' },
      ],
      tableTitle: 'Operations ledger',
      tableCopy: 'Important admin actions across users, orgs, and schedules.',
      tableRows: [
        { Event: 'NorthStar Univ onboarded', Owner: 'Ops', Outcome: 'Live', Time: 'Today 09:12', Scope: '1,800 seats' },
        { Event: 'Certificate batch export', Owner: 'Reports', Outcome: 'Delivered', Time: 'Today 11:05', Scope: 'PDF + XLSX' },
        { Event: 'Policy update', Owner: 'Security', Outcome: 'Published', Time: 'Today 15:40', Scope: 'Anti-cheat v2' },
      ],
      checklistTitle: 'Admin modules',
      checklist: ['Revenue and usage analytics', 'User, role, and course governance', 'Audit trail and reports export', 'Policy engine for anti-cheat rules', 'Institution-level white-label readiness'],
      barTitle: 'System load windows',
      barCopy: 'Peak platform traffic by time bucket.',
      barData: sharedBars.map((point) => ({ ...point, value: point.value + 12 })),
    },
  },
  {
    path: '/exam-portal',
    eyebrow: 'Secure assessment',
    title: 'Online Exam Portal',
    description: 'An immersive exam lobby with smart readiness checks, randomized question flows, countdown states, and proctoring surface awareness.',
    heroStats: [
      { label: 'Live windows', value: '12', subtext: 'Concurrent' },
      { label: 'Verification', value: 'Face + ID', subtext: 'Enabled' },
      { label: 'Autosave', value: '5 sec', subtext: 'Interval' },
    ],
    config: {
      stats: [
        { label: 'Queued candidates', value: '1,142', caption: 'Ready to launch', delta: '+82' },
        { label: 'Average join time', value: '14 sec', caption: 'From login to seat', delta: '-12%' },
        { label: 'Fullscreen compliance', value: '97.6%', caption: 'Recent exam average', delta: '+2.1%' },
        { label: 'Auto-submits', value: '88', caption: 'Timer-enforced', delta: 'Stable' },
      ],
      areaTitle: 'Portal readiness pulse',
      areaCopy: 'Connection, identity verification, and lobby conversion before exam start.',
      areaData: sharedArea,
      pieTitle: 'Submission behavior',
      pieCopy: 'Question states across saved, answered, flagged, and pending.',
      pieData: sharedPie,
      insights: [
        { title: 'Candidate readiness', copy: 'Most users complete device checks within 35 seconds with strong webcam framing success.', metricLabel: 'Pass rate', metricValue: '96%' },
        { title: 'Question navigation', copy: 'Palette navigation helps reduce panic exits in timed sections and improves completion rate.', metricLabel: 'Usage', metricValue: '83%' },
        { title: 'Compliance monitor', copy: 'Warnings surface gracefully before stricter anti-cheat actions are triggered.', metricLabel: 'Recovery rate', metricValue: '91%' },
      ],
      tableTitle: 'Exam session matrix',
      tableCopy: 'A realistic overview of live and upcoming test windows.',
      tableRows: [
        { Exam: 'National Aptitude Mock', Window: '18 May, 09:00', Duration: '90 min', Type: 'MCQ', Status: 'Live soon' },
        { Exam: 'Essay Round', Window: '18 May, 13:00', Duration: '60 min', Type: 'Subjective', Status: 'Ready' },
        { Exam: 'Coding Sprint', Window: '19 May, 17:00', Duration: '120 min', Type: 'Hybrid', Status: 'Drafted' },
      ],
      checklistTitle: 'Exam engine',
      checklist: ['Timer-based autosubmit', 'Question palette navigation', 'Negative marking support', 'Randomized sets and shuffling', 'Anti-tab switch warnings'],
      barTitle: 'Join velocity',
      barCopy: 'Candidate arrivals through pre-exam windows.',
      barData: sharedBars,
    },
  },
  {
    path: '/results',
    eyebrow: 'Decision intelligence',
    title: 'Results & Analytics',
    description: 'Elegant reporting with animated charts, percentile comparisons, performance clusters, export-ready summaries, and institution-grade insight narratives.',
    heroStats: [
      { label: 'Report exports', value: '362', subtext: 'This week' },
      { label: 'Median score', value: '84%', subtext: 'All cohorts' },
      { label: 'AI narratives', value: 'Live', subtext: 'Auto-generated' },
    ],
    config: {
      stats: [
        { label: 'Result generation', value: '1.8 sec', caption: 'Average pipeline time', delta: '-31%' },
        { label: 'Percentile accuracy', value: '99.2%', caption: 'Model confidence', delta: '+1.4%' },
        { label: 'Pass rate', value: '87%', caption: 'Last 30 days', delta: '+5%' },
        { label: 'Top cohort jump', value: '+13%', caption: 'Against previous cycle', delta: 'Upward' },
      ],
      areaTitle: 'Score trend intelligence',
      areaCopy: 'Observe cohort-level shifts and intervention impact over time.',
      areaData: sharedArea.map((point, index) => ({ ...point, score: point.score + (index > 3 ? 6 : 0) })),
      pieTitle: 'Outcome distribution',
      pieCopy: 'Pass, merit, improvement, and retake segmentation.',
      pieData: sharedPie,
      insights: [
        { title: 'Top performers cluster', copy: 'Students with high speed consistency also maintain strong descriptive completion rates.', metricLabel: 'Cluster size', metricValue: '148' },
        { title: 'Remediation map', copy: 'Analytical reasoning and grammar show the clearest upside from short-form coaching nudges.', metricLabel: 'Projected lift', metricValue: '+8.6%' },
        { title: 'Stakeholder reporting', copy: 'C-suite and academic versions of the same report can be exported instantly.', metricLabel: 'Output modes', metricValue: '06' },
      ],
      tableTitle: 'Results snapshot',
      tableCopy: 'Shareable outputs for students, faculty, and executives.',
      tableRows: [
        { Cohort: 'MBA Entrance', Avg: '86%', Merit: '32%', Status: 'Published', Export: 'PDF ready' },
        { Cohort: 'B.Tech Mock', Avg: '81%', Merit: '26%', Status: 'Under review', Export: 'Queued' },
        { Cohort: 'Design Aptitude', Avg: '89%', Merit: '44%', Status: 'Published', Export: 'Live link' },
      ],
      checklistTitle: 'Analytics pack',
      checklist: ['Heatmaps and trend comparisons', 'Export PDF and spreadsheet flows', 'Merit list generation', 'Percentile and rank engines', 'Narrative summary cards'],
      barTitle: 'Report interaction volume',
      barCopy: 'When result pages get the most user attention.',
      barData: sharedBars,
    },
  },
]

const extraTemplates = [
  {
    path: '/profile',
    eyebrow: 'Student registry',
    title: 'Students Section',
    description: 'Register students quickly, keep a live roster, and make them available across dashboards, exams, and results.',
  },
  { path: '/courses', eyebrow: 'Content operations', title: 'Course Management', description: 'Structure programs, modules, cohorts, pricing, and exam mapping with a modern course command center.' },
  { path: '/question-bank', eyebrow: 'Assessment authoring', title: 'Question Bank', description: 'Searchable, tagged, difficulty-aware question inventory with versioning and AI-assisted authoring.' },
  { path: '/schedule', eyebrow: 'Time orchestration', title: 'Exam Schedule', description: 'A visually rich planner for live exams, invigilators, seat pools, cohorts, and notifications.' },
  { path: '/live-exam', eyebrow: 'Invigilation cockpit', title: 'Live Exam Interface', description: 'Realtime seat maps, webcam tiles, focus status, timer control, warnings, and emergency action surfaces.' },
  { path: '/leaderboard', eyebrow: 'Competition engine', title: 'Leaderboard', description: 'Fast-moving ranking views with filters, streak highlights, regional segmentation, and reward tiers.' },
  { path: '/certificates', eyebrow: 'Credential experience', title: 'Certificates Page', description: 'Premium digital certificates, verification states, downloadable assets, and brand-safe credential designs.' },
  { path: '/ai-assistant', eyebrow: 'Intelligence workspace', title: 'AI Assistant Page', description: 'Study guidance, exam support, remediation suggestions, analytics Q&A, and institution-facing smart workflows.' },
  { path: '/support', eyebrow: 'Trust and care', title: 'Contact & Support', description: 'Unified support center for tickets, live chat, institutional onboarding, and urgent exam recovery.' },
  { path: '/about', eyebrow: 'Platform story', title: 'About System', description: 'The product narrative, architecture, trust posture, and commercial value behind AstraExam Cloud.' },
]

const extraConfig = {
  stats: [
    { label: 'Experience score', value: '94%', caption: 'Across premium UX flows', delta: '+7%' },
    { label: 'Automation depth', value: '26', caption: 'Smart workflow triggers', delta: '+3' },
    { label: 'Average response', value: '1.8 sec', caption: 'Across active modules', delta: '-11%' },
    { label: 'Satisfaction', value: '4.9/5', caption: 'Stakeholder feedback', delta: '+0.2' },
  ],
  areaTitle: 'Usage performance curve',
  areaCopy: 'A clean trend view reusable across management surfaces.',
  areaData: sharedArea,
  pieTitle: 'Module distribution',
  pieCopy: 'Adoption, attention, and workflow completion across product areas.',
  pieData: sharedPie,
  insights: [
    { title: 'Premium interaction model', copy: 'Transitions, spacing, and micro-feedback keep the system feeling calm and expensive.', metricLabel: 'Polish signal', metricValue: 'High' },
    { title: 'Operational clarity', copy: 'All major actions surface in modular cards, reports, and decision panels rather than raw forms.', metricLabel: 'Workflow fit', metricValue: '92%' },
    { title: 'Commercial readiness', copy: 'This concept supports white-labeling, SaaS packaging, and role-based expansion without redesigning the core.', metricLabel: 'Scalability', metricValue: 'Enterprise' },
  ],
  tableTitle: 'Module activity snapshot',
  tableCopy: 'Representative operational records for the current surface.',
  tableRows: [
    { Item: 'Smart sync', Owner: 'System', Status: 'Healthy', Updated: 'Just now', Scope: 'Global' },
    { Item: 'Content refresh', Owner: 'Faculty', Status: 'Queued', Updated: '14:25', Scope: 'Course layer' },
    { Item: 'User signal', Owner: 'Analytics', Status: 'Processed', Updated: '17:05', Scope: 'Insight engine' },
  ],
  checklistTitle: 'Module capabilities',
  checklist: ['Search and filtering system', 'Animated cards and overlays', 'Realtime notifications ready', 'Dark/light mode aware styling', 'Responsive multi-device layout'],
  barTitle: 'Interaction cadence',
  barCopy: 'Representative product activity across the day.',
  barData: sharedBars,
}

export const appRoutes = [
  ...pageTemplates.map((page) => {
    const specialComponentMap = {
      '/student': StudentDashboardPage,
      '/teacher': TeacherExamStudio,
      '/exam-portal': ExamPortalPage,
      '/results': ResultsBoardPage,
      '/question-bank': QuestionBankPage,
      '/schedule': ExamSchedulePage,
      '/profile': StudentsPage,
      '/ai-assistant': AIAssistantPage,
    }
    return { ...page, component: specialComponentMap[page.path] ?? createStandardPage(page.config) }
  }),
  ...extraTemplates.map((page) => ({
    ...page,
    heroStats: [
      { label: 'Active workflows', value: '12', subtext: 'Live now' },
      { label: 'AI assists', value: '24', subtext: 'This week' },
      { label: 'Automation status', value: 'Ready', subtext: 'Deployment safe' },
    ],
    component: createStandardPage(extraConfig),
  })),
]
