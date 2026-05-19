import { useMemo } from 'react'

function formatTime(totalSeconds) {
  const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0')
  const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0')
  const seconds = String(totalSeconds % 60).padStart(2, '0')
  return `${hours}:${minutes}:${seconds}`
}

export function CountdownBadge({ totalSeconds }) {
  const tone = useMemo(() => {
    if (totalSeconds <= 60) return 'text-rose-300 border-rose-400/30 bg-rose-500/10'
    if (totalSeconds <= 600) return 'text-amber-200 border-amber-400/30 bg-amber-500/10'
    return 'text-cyan-200 border-cyan-400/30 bg-cyan-500/10'
  }, [totalSeconds])

  return <div className={`rounded-full border px-4 py-2 font-display text-xl ${tone}`}>{formatTime(totalSeconds)}</div>
}
