import { CircleHelp, FolderHeart, RotateCcw, Settings2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { brandConfig } from '../config/brand'
import { branchSelectionPath } from '../lib/routes'
import { formatDateTime } from '../lib/utils'
import { getBranchLabel, getBranchShortLabel } from '../lib/workflow'
import type { DemoDocumentType, RecentOperation } from '../types/demo'
import { Button } from './ui'

export function WorkspaceSidebar({
  branch,
  pipelineName,
  operations,
  onReset,
}: {
  branch: DemoDocumentType
  pipelineName: string
  operations: RecentOperation[]
  onReset: () => void
}) {
  return (
    <aside className="frosted flex h-full flex-col rounded-[32px] border border-[var(--border-soft)] p-5">
      <Link to="/" className="flex items-start gap-4 rounded-[24px] p-1">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--brand-600)] text-lg font-semibold text-slate-950 shadow-lg shadow-cyan-950/20">
          {brandConfig.logo}
        </div>
        <div>
          <div className="text-lg font-semibold text-[var(--ink-950)]">{brandConfig.companyName}</div>
          <div className="mt-1 text-sm text-[var(--ink-700)]">Guided workspace</div>
        </div>
      </Link>

      <div className="mt-6 rounded-[26px] border border-[var(--border-soft)] bg-[var(--surface-muted)] p-4">
        <div className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--ink-500)]">
          Активная ветка
        </div>
        <div className="mt-2 text-lg font-semibold text-[var(--ink-950)]">{getBranchLabel(branch)}</div>
        <div className="mt-3 inline-flex rounded-full border border-[var(--border-soft)] px-3 py-1 text-xs font-semibold text-[var(--brand-700)]">
          {getBranchShortLabel(branch)}
        </div>
        <div className="mt-4 rounded-[20px] border border-[var(--border-soft)] bg-[rgba(255,255,255,0.02)] px-4 py-3">
          <div className="text-xs uppercase tracking-[0.14em] text-[var(--ink-500)]">Пайплайн</div>
          <div className="mt-2 text-sm font-semibold text-[var(--ink-950)]">
            {pipelineName || 'Название будет задано при старте'}
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        <Link
          to={branchSelectionPath()}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[var(--border-soft)] bg-[var(--surface-muted)] px-4 py-2.5 text-sm font-semibold text-[var(--ink-950)]"
        >
          <FolderHeart size={16} />
          Выбор режима
        </Link>
        <Button variant="ghost" className="w-full justify-center">
          <Settings2 size={16} />
          Настройки
        </Button>
        <Button variant="ghost" className="w-full justify-center">
          <CircleHelp size={16} />
          Помощь
        </Button>
        <Button variant="secondary" className="w-full justify-center" onClick={onReset}>
          <RotateCcw size={16} />
          Сброс демо
        </Button>
      </div>

      <div className="mt-8 flex-1">
        <div className="flex items-center justify-between gap-3">
          <div className="text-sm font-semibold text-[var(--ink-950)]">Последние операции</div>
          <div className="text-xs text-[var(--ink-500)]">{operations.length} событий</div>
        </div>
        <div className="mt-4 space-y-3">
          {operations.length ? (
            operations.map((operation) => (
              <div
                key={operation.id}
                className="rounded-[22px] border border-[var(--border-soft)] bg-[var(--surface-muted)] px-4 py-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm font-semibold text-[var(--ink-950)]">{operation.title}</div>
                  <span className="rounded-full border border-[var(--border-soft)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--brand-700)]">
                    {getBranchShortLabel(operation.branch)}
                  </span>
                </div>
                <div className="mt-2 text-sm leading-6 text-[var(--ink-700)]">{operation.description}</div>
                <div className="mt-3 text-xs text-[var(--ink-500)]">{formatDateTime(operation.createdAt)}</div>
              </div>
            ))
          ) : (
            <div className="rounded-[22px] border border-dashed border-[var(--border-strong)] bg-[var(--surface-muted)] px-4 py-4 text-sm leading-6 text-[var(--ink-700)]">
              История появится после старта пайплайна и действий пользователя.
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}
