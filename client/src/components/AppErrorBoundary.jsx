import { Component } from 'react'
import { Link } from 'react-router-dom'

export class AppErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, errorMessage: '' }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, errorMessage: error?.message || 'Unexpected UI error' }
  }

  componentDidCatch(error) {
    console.error('AstraExam UI error:', error)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="grid min-h-[70vh] place-items-center">
          <div className="glass-panel max-w-2xl rounded-[32px] p-8 text-center">
            <p className="text-xs uppercase tracking-[0.35em] text-amber-300">UI Recovery</p>
            <h1 className="mt-3 font-display text-4xl text-white">A page crashed</h1>
            <p className="mt-3 text-slate-300">
              {this.state.errorMessage}
            </p>
            <div className="mt-6 flex items-center justify-center gap-3">
              <button onClick={() => window.location.reload()} className="btn-primary rounded-full px-5 py-3 font-semibold">
                Reload page
              </button>
              <Link to="/" className="rounded-full border border-white/15 px-5 py-3 font-semibold text-white">
                Back home
              </Link>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
