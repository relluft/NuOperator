import { CircleHelp, FolderHeart, RotateCcw, Settings2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { brandConfig } from '../config/brand'
import { branchSelectionPath } from '../lib/routes'
import { formatDateTime } from '../lib/utils'
import { getBranchLabel, getBranchShortLabel } from '../lib/workflow'
import type { DemoDocumentType, RecentOperation } from '../types/demo'
import { Button } from './ui'

interface PipelineShortcut {
  branch: DemoDocumentType
  pipelineName: string
  to: string
}

export function WorkspaceSidebar({
  branch,
  pipelineName,
  operations,
  pipelineLinks = [],
  onReset,
}: {
  branch: DemoDocumentType
  pipelineName: string
  operations: RecentOperation[]
  pipelineLinks?: PipelineShortcut[]
  onReset: () => void
}) {
  return (
    <aside className="frosted panel-outline sticky top-4 flex h-[calc(100vh-2rem)] w-full flex-col self-start overflow-hidden rounded-[30px] p-4">
      <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(255,235,201,0.24),transparent)]" />

      <Link to="/" className="executive-card rounded-[24px] p-3">
        <div className="relative flex items-start gap-3">
          <div className="brand-mark flex h-12 w-12 items-center justify-center rounded-[20px] text-base font-semibold">
            {brandConfig.logo}
          </div>
          <div className="min-w-0">
            <div className="text-base font-semibold text-[var(--ink-950)]">
              {brandConfig.companyName}
            </div>
            <div className="mt-1 text-[11px] uppercase tracking-[0.18em] text-[var(--ink-500)]">
              Приватное ИИ-рабочее пространство
            </div>
          </div>
        </div>
      </Link>

      <div className="mt-4 executive-card executive-highlight rounded-[24px] p-4">
        <div className="relative">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--ink-500)]">
            Активная ветка
          </div>
          <div className="mt-3 text-lg font-semibold text-[var(--ink-950)]">
            {getBranchLabel(branch)}
          </div>
          <div className="metal-pill mt-3 inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--brand-700)]">
            {getBranchShortLabel(branch)}
          </div>
          <div className="surface-note mt-4 rounded-[18px] px-3 py-3">
            <div className="text-[11px] uppercase tracking-[0.16em] text-[var(--ink-500)]">
              Пайплайн
            </div>
            <div className="mt-2 text-sm font-semibold leading-6 text-[var(--ink-950)]">
              {pipelineName || 'Название будет задано при старте'}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 space-y-2.5">
        <Link
          to={branchSelectionPath()}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[var(--border-soft)] bg-[rgba(255,248,234,0.02)] px-4 py-2.5 text-sm font-semibold text-[var(--ink-950)] transition hover:-translate-y-0.5 hover:border-[var(--border-strong)] hover:bg-[var(--surface-muted)]"
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

      <div className="mt-6">
        <div className="flex items-center justify-between gap-3">
          <div className="text-sm font-semibold text-[var(--ink-950)]">
            Предыдущие пайплайны
          </div>
          <div className="text-xs text-[var(--ink-500)]">{pipelineLinks.length} активных</div>
        </div>
        <div className="mt-3 space-y-2.5">
          {pipelineLinks.length ? (
            pipelineLinks.map((pipeline) => (
              <Link
                key={`${pipeline.branch}-${pipeline.to}`}
                to={pipeline.to}
                className="executive-card rounded-[22px] px-3.5 py-3.5"
              >
                <div className="relative">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-sm font-semibold text-[var(--ink-950)]">
                      {getBranchLabel(pipeline.branch)}
                    </div>
                    <span className="metal-pill rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--brand-700)]">
                      {getBranchShortLabel(pipeline.branch)}
                    </span>
                  </div>
                  <div className="mt-2 text-sm leading-6 text-[var(--ink-700)]">
                    {pipeline.pipelineName}
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="surface-dashed rounded-[22px] px-4 py-4 text-sm leading-6 text-[var(--ink-700)]">
              Пока пусто.
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 flex-1 overflow-hidden">
        <div className="flex items-center justify-between gap-3">
          <div className="text-sm font-semibold text-[var(--ink-950)]">
            Последние операции
          </div>
          <div className="text-xs text-[var(--ink-500)]">{operations.length} событий</div>
        </div>
        <div className="mt-3 space-y-2.5 overflow-y-auto pr-1">
          {operations.length ? (
            operations.map((operation) => (
              <div key={operation.id} className="executive-card rounded-[22px] px-3.5 py-3.5">
                <div className="relative">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-sm font-semibold text-[var(--ink-950)]">
                      {operation.title}
                    </div>
                    <span className="metal-pill rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--brand-700)]">
                      {getBranchShortLabel(operation.branch)}
                    </span>
                  </div>
                  <div className="mt-2 text-sm leading-6 text-[var(--ink-700)]">
                    {operation.description}
                  </div>
                  <div className="mt-3 text-xs text-[var(--ink-500)]">
                    {formatDateTime(operation.createdAt)}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="surface-dashed rounded-[22px] px-4 py-4 text-sm leading-6 text-[var(--ink-700)]">
              Пока пусто.
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}
