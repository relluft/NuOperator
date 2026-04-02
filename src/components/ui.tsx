/* eslint-disable react-refresh/only-export-components */
import type { ButtonHTMLAttributes, HTMLAttributes, PropsWithChildren } from 'react'
import { cn } from '../lib/utils'

export function buttonStyles(variant: 'primary' | 'secondary' | 'ghost' = 'primary') {
  return cn(
    'inline-flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition-all duration-200',
    variant === 'primary' &&
      'bg-[var(--brand-600)] text-slate-950 shadow-lg shadow-cyan-950/20 hover:-translate-y-0.5 hover:bg-[var(--brand-700)]',
    variant === 'secondary' &&
      'border border-[var(--border-strong)] bg-[var(--surface-muted)] text-[var(--ink-950)] hover:-translate-y-0.5 hover:bg-[rgba(25,40,58,0.96)]',
    variant === 'ghost' &&
      'border border-[var(--border-soft)] bg-transparent text-[var(--ink-800)] hover:bg-[rgba(18,30,44,0.64)]',
  )
}

export function Button({
  className,
  variant = 'primary',
  type = 'button',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost'
}) {
  return <button type={type} className={cn(buttonStyles(variant), className)} {...props} />
}

export function Panel({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'frosted rounded-[28px] border border-[var(--border-soft)] p-5 text-[var(--ink-800)]',
        className,
      )}
      {...props}
    />
  )
}

export function Eyebrow({ children }: PropsWithChildren) {
  return (
    <span className="inline-flex items-center rounded-full border border-[var(--border-strong)] bg-[var(--surface-muted)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--brand-700)]">
      {children}
    </span>
  )
}

export function StatusPill({
  tone,
  children,
}: PropsWithChildren<{ tone: 'ready' | 'progress' | 'attention' | 'high' | 'medium' | 'low' }>) {
  const toneClasses = {
    ready: 'border-emerald-500/30 bg-emerald-500/12 text-emerald-200',
    progress: 'border-sky-500/30 bg-sky-500/12 text-sky-200',
    attention: 'border-amber-500/30 bg-amber-500/12 text-amber-200',
    high: 'border-rose-500/30 bg-rose-500/12 text-rose-200',
    medium: 'border-amber-500/30 bg-amber-500/12 text-amber-200',
    low: 'border-slate-400/20 bg-slate-400/10 text-slate-200',
  }[tone]

  return (
    <span className={cn('inline-flex rounded-full border px-3 py-1 text-xs font-semibold', toneClasses)}>
      {children}
    </span>
  )
}

export function MetricCard({
  label,
  value,
  className,
}: {
  label: string
  value: string
  className?: string
}) {
  return (
    <Panel className={cn('flex min-h-[126px] flex-col justify-between gap-4', className)}>
      <span className="text-sm text-[var(--ink-700)]">{label}</span>
      <div className="text-xl font-semibold leading-tight text-[var(--ink-950)]">{value}</div>
    </Panel>
  )
}

export function ProgressBar({ value }: { value: number }) {
  return (
    <div className="h-2 overflow-hidden rounded-full bg-[rgba(255,255,255,0.08)]">
      <div
        className="h-full rounded-full bg-[var(--brand-600)] transition-all duration-500"
        style={{ width: `${Math.max(0, Math.min(value, 1)) * 100}%` }}
      />
    </div>
  )
}
