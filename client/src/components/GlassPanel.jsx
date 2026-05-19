import clsx from 'clsx'

export function GlassPanel({ children, className = '' }) {
  return <div className={clsx('glass-panel rounded-[28px]', className)}>{children}</div>
}
