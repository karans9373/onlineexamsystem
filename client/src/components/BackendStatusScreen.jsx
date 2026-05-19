export function BackendStatusScreen({ status, onRetry, apiBaseUrl }) {
  const isLoading = status === 'checking'
  const isOffline = status === 'offline'

  return (
    <div className="grid min-h-[75vh] place-items-center">
      <div className="glass-panel max-w-2xl rounded-[36px] p-10 text-center">
        <div className="mx-auto h-16 w-16 rounded-3xl bg-cyan-400/15 p-4">
          <div className={`h-full w-full rounded-2xl ${isLoading ? 'animate-pulse bg-cyan-300/50' : 'bg-amber-300/60'}`} />
        </div>
        <p className="mt-5 text-xs uppercase tracking-[0.35em] text-cyan-300">Service Sync</p>
        <h1 className="mt-3 font-display text-4xl text-white">
          {isLoading ? 'Connecting frontend to backend' : 'Backend is not ready yet'}
        </h1>
        <p className="mt-4 text-sm leading-7 text-slate-300">
          {isLoading
            ? 'Please wait while AstraExam checks the FastAPI API health. This is expected while Netlify and Render are still syncing.'
            : 'The React frontend is live, but the API is not reachable yet. Finish the Render deploy, set the Netlify API URL, then retry.'}
        </p>
        <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4 text-left text-sm text-slate-300">
          <p className="font-semibold text-white">Expected API base URL</p>
          <p className="mt-2 break-all">{apiBaseUrl}</p>
        </div>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button onClick={onRetry} className="btn-primary rounded-full px-5 py-3 font-semibold">
            Retry Connection
          </button>
          {isOffline && (
            <button
              onClick={() => window.location.reload()}
              className="rounded-full border border-white/15 px-5 py-3 font-semibold text-white"
            >
              Refresh App
            </button>
          )}
          <a href="/" className="rounded-full border border-white/15 px-5 py-3 font-semibold text-white">
            Back to Home
          </a>
        </div>
      </div>
    </div>
  )
}
