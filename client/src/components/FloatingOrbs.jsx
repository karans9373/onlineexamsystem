export function FloatingOrbs() {
  return (
    <>
      <div className="pointer-events-none absolute left-[4%] top-16 h-64 w-64 animate-float rounded-full bg-cyan-300/20 blur-3xl" />
      <div className="pointer-events-none absolute right-[8%] top-44 h-72 w-72 animate-float-delayed rounded-full bg-fuchsia-300/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-16 left-1/3 h-56 w-56 animate-float rounded-full bg-amber-300/20 blur-3xl" />
    </>
  )
}
