/* eslint-disable react-refresh/only-export-components */
import type { ButtonHTMLAttributes, HTMLAttributes, PropsWithChildren } from 'react'
import { cn } from '../lib/utils'

export function buttonStyles(variant: 'primary' | 'secondary' | 'ghost' = 'primary') {
  return cn(
    'relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full px-4 py-2.5 text-sm font-semibold tracking-[-0.01em] transition-all duration-300 ease-[var(--ease-premium)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(199,155,88,0.24)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--page-bg)]',
    variant === 'primary' &&
      'border border-[rgba(216,175,110,0.3)] bg-[linear-gradient(180deg,rgba(255,238,205,0.95),rgba(215,176,111,0.84)_26%,rgba(124,86,41,0.98)_100%)] text-[#171009] shadow-[0_22px_54px_rgba(130,91,44,0.28)] hover:-translate-y-0.5 hover:border-[rgba(231,192,126,0.36)] hover:shadow-[0_28px_66px_rgba(130,91,44,0.34)] active:translate-y-0',
    variant === 'secondary' &&
      'border border-[rgba(201,166,112,0.22)] bg-[linear-gradient(180deg,rgba(255,248,234,0.05),transparent_20%),rgba(18,15,12,0.96)] text-[var(--ink-950)] shadow-[0_16px_40px_rgba(199,155,88,0.08)] hover:-translate-y-0.5 hover:border-[rgba(214,173,107,0.32)] hover:bg-[linear-gradient(180deg,rgba(255,248,234,0.06),transparent_18%),rgba(20,17,14,0.98)] active:translate-y-0',
    variant === 'ghost' &&
      'border border-[var(--border-soft)] bg-[rgba(255,248,234,0.015)] text-[var(--ink-800)] hover:-translate-y-0.5 hover:border-[var(--border-strong)] hover:bg-[rgba(18,15,12,0.9)] hover:text-[var(--ink-950)] active:translate-y-0',
  )
}

export const fieldStyles =
  'executive-input px-4 py-3 text-sm leading-7 text-[var(--ink-950)]'

export const interactiveCardStyles =
  'executive-card panel-outline rounded-[28px] p-5 text-left'

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
  tone = 'default',
  className,
  ...props
}: HTMLAttributes<HTMLDivElement> & { tone?: 'default' | 'highlight' | 'gold' }) {
  const toneClasses = {
    default: '',
    highlight: 'executive-highlight',
    gold: 'gold-highlight',
  }[tone]

  return (
    <div
      className={cn(
        'frosted panel-outline rounded-[30px] p-5 text-[var(--ink-800)]',
        toneClasses,
        className,
      )}
      {...props}
    />
  )
}

export function Eyebrow({ children }: PropsWithChildren) {
  return (
    <span className="metal-pill inline-flex items-center rounded-full px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--brand-700)] shadow-[0_10px_24px_rgba(0,0,0,0.16)]">
      {children}
    </span>
  )
}

export function StatusPill({
  tone,
  children,
}: PropsWithChildren<{ tone: 'ready' | 'progress' | 'attention' | 'high' | 'medium' | 'low' }>) {
  const toneClasses = {
    ready:
      'border-emerald-500/22 bg-[linear-gradient(180deg,rgba(44,107,84,0.28),rgba(22,50,40,0.18))] text-emerald-100',
    progress:
      'border-[rgba(214,173,107,0.24)] bg-[linear-gradient(180deg,rgba(214,173,107,0.12),rgba(214,173,107,0.04))] text-[var(--brand-700)]',
    attention:
      'border-[rgba(214,173,107,0.28)] bg-[linear-gradient(180deg,rgba(214,173,107,0.16),rgba(214,173,107,0.05))] text-[var(--brand-700)]',
    high:
      'border-rose-500/24 bg-[linear-gradient(180deg,rgba(122,40,49,0.28),rgba(82,22,31,0.18))] text-rose-100',
    medium:
      'border-[rgba(196,145,73,0.26)] bg-[linear-gradient(180deg,rgba(138,87,32,0.26),rgba(99,61,21,0.18))] text-amber-100',
    low: 'border-[var(--border-soft)] bg-[rgba(255,248,234,0.025)] text-[var(--ink-800)]',
  }[tone]

  return (
    <span
      className={cn(
        'inline-flex rounded-full border px-3 py-1.5 text-[11px] font-semibold tracking-[0.02em] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]',
        toneClasses,
      )}
    >
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
    <Panel className={cn('rounded-[28px] px-5 py-5', className)}>
      <div className="flex min-h-[126px] flex-col justify-between gap-4">
        <span className="text-sm text-[var(--ink-700)]">{label}</span>
        <div className="text-xl font-semibold leading-tight text-[var(--ink-950)]">{value}</div>
      </div>
    </Panel>
  )
}

export function ProgressBar({ value }: { value: number }) {
  return (
    <div className="h-2.5 overflow-hidden rounded-full border border-[rgba(255,248,234,0.05)] bg-[rgba(255,248,234,0.05)] shadow-[inset_0_1px_2px_rgba(0,0,0,0.3)]">
      <div
        className="progress-sheen h-full rounded-full bg-[linear-gradient(90deg,#7d562c,var(--brand-500),var(--brand-600),#f0d7ab)] transition-all duration-500 ease-[var(--ease-premium)]"
        style={{ width: `${Math.max(0, Math.min(value, 1)) * 100}%` }}
      />
    </div>
  )
}
