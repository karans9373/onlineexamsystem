import { MoonStar, SunMedium } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { toggleTheme } from '../store/uiSlice'

export function ThemeToggle() {
  const dispatch = useDispatch()
  const theme = useSelector((state) => state.ui.theme)

  return (
    <button
      onClick={() => dispatch(toggleTheme())}
      className="status-chip inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-slate-200 transition hover:-translate-y-0.5 hover:bg-white/10"
    >
      {theme === 'dark' ? <SunMedium className="h-4 w-4" /> : <MoonStar className="h-4 w-4" />}
      {theme === 'dark' ? 'Light mode' : 'Dark mode'}
    </button>
  )
}
