import { Link } from 'react-router-dom'
import { GlassPanel } from '../components/GlassPanel'

export default function NotFoundPage() {
  return (
    <div className="grid min-h-[60vh] place-items-center">
      <GlassPanel className="max-w-xl p-10 text-center">
        <p className="text-xs uppercase tracking-[0.35em] text-slate-400">404</p>
        <h1 className="mt-3 font-display text-4xl text-white">Route not found</h1>
        <p className="mt-3 text-slate-400">The requested module does not exist in the current examination workspace.</p>
        <Link to="/" className="btn-primary mt-6 inline-flex rounded-full px-5 py-3 font-semibold">
          Back to home
        </Link>
      </GlassPanel>
    </div>
  )
}
