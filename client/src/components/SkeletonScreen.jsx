export function SkeletonScreen() {
  return (
    <div className="grid min-h-[70vh] place-items-center">
      <div className="glass-panel w-full max-w-xl rounded-[32px] p-10 text-center">
        <div className="mx-auto h-14 w-14 animate-pulse rounded-2xl bg-cyan-400/25" />
        <p className="mt-5 font-display text-2xl text-white">Booting exam control stack</p>
        <p className="mt-2 text-slate-400">Loading dashboards, question engine, and security services.</p>
      </div>
    </div>
  )
}
