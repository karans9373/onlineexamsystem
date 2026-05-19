import { Suspense, lazy, useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux'
import { fetchMe } from './store/authSlice'
import { setTheme } from './store/uiSlice'
import { ProtectedRoute } from './components/ProtectedRoute'
import { AppLayout } from './components/AppLayout'
import { SkeletonScreen } from './components/SkeletonScreen'
import { AppErrorBoundary } from './components/AppErrorBoundary'

const LandingPage = lazy(() => import('./pages/LandingPage'))
const AuthPage = lazy(() => import('./pages/AuthPage'))
const RoleDashboard = lazy(() => import('./pages/RoleDashboard'))
const TeacherStudioPage = lazy(() => import('./pages/TeacherStudioPage'))
const ExamPage = lazy(() => import('./pages/ExamPage'))
const ResultPage = lazy(() => import('./pages/ResultPage'))
const AdminUsersPage = lazy(() => import('./pages/AdminUsersPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

function RouteTransition({ children }) {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 16, filter: 'blur(12px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        exit={{ opacity: 0, y: -10, filter: 'blur(10px)' }}
        transition={{ duration: 0.35 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

export default function App() {
  const dispatch = useDispatch()
  const theme = useSelector((state) => state.ui.theme)
  const token = useSelector((state) => state.auth.token)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  useEffect(() => {
    dispatch(setTheme(window.localStorage.getItem('astraexam-theme') || 'dark'))
  }, [dispatch])

  useEffect(() => {
    if (token) {
      dispatch(fetchMe())
    }
  }, [dispatch, token])

  return (
    <AppLayout>
      <AppErrorBoundary>
        <Suspense fallback={<SkeletonScreen />}>
          <RouteTransition>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login/:role" element={<AuthPage mode="login" />} />
              <Route path="/register/:role" element={<AuthPage mode="register" />} />
              <Route
                path="/student/dashboard"
                element={
                  <ProtectedRoute role="student">
                    <RoleDashboard role="student" />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/teacher/dashboard"
                element={
                  <ProtectedRoute role="teacher">
                    <RoleDashboard role="teacher" />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute role="admin">
                    <RoleDashboard role="admin" />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/teacher/studio"
                element={
                  <ProtectedRoute role="teacher">
                    <TeacherStudioPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <ProtectedRoute role="admin">
                    <AdminUsersPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/exam/:examId"
                element={
                  <ProtectedRoute role="student">
                    <ExamPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/results/:attemptId"
                element={
                  <ProtectedRoute>
                    <ResultPage />
                  </ProtectedRoute>
                }
              />
              <Route path="/dashboard" element={<Navigate to="/student/dashboard" replace />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </RouteTransition>
        </Suspense>
      </AppErrorBoundary>
    </AppLayout>
  )
}
