import { Link } from 'react-router-dom'
import { stagePath } from '../lib/routes'
import { cn } from '../lib/utils'
import { getWorkflowStages } from '../lib/workflow'
import type { DemoDocumentType, DemoWorkflowStageId } from '../types/demo'

export function ProgressStepper({
  branch,
  caseId,
  runId,
  draftId,
  currentStageId,
  completedStageIds,
}: {
  branch: DemoDocumentType
  caseId: string
  runId: string
  draftId: string
  currentStageId: DemoWorkflowStageId
  completedStageIds: DemoWorkflowStageId[]
}) {
  const stages = getWorkflowStages(branch)

  return (
    <div className="frosted rounded-[30px] border border-[var(--border-soft)] px-4 py-4 md:px-5">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--ink-500)]">
            Прогресс по этапам
          </div>
          <div className="mt-1 text-lg font-semibold text-[var(--ink-950)]">
            Можно вернуться к любому шагу и внести изменения
          </div>
        </div>
        <div className="rounded-full border border-[var(--border-soft)] bg-[var(--surface-muted)] px-3 py-1.5 text-xs font-semibold text-[var(--ink-700)]">
          {completedStageIds.length} из {stages.length} этапов отмечены
        </div>
      </div>

      <div className="grid gap-3 lg:grid-cols-5">
        {stages.map((stage, index) => {
          const isActive = currentStageId === stage.id
          const isCompleted = completedStageIds.includes(stage.id)
          const Icon = stage.icon

          return (
            <Link
              key={stage.id}
              to={stagePath(branch, caseId, runId, draftId, stage.id)}
              className={cn(
                'rounded-[24px] border px-4 py-4 transition-all hover:-translate-y-0.5',
                isActive
                  ? 'border-[var(--brand-500)] bg-[rgba(78,149,188,0.16)] shadow-lg shadow-cyan-950/10'
                  : 'border-[var(--border-soft)] bg-[var(--surface-muted)]',
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="rounded-2xl bg-[rgba(255,255,255,0.04)] p-2 text-[var(--brand-700)]">
                  <Icon size={18} />
                </div>
                <div
                  className={cn(
                    'flex h-8 min-w-8 items-center justify-center rounded-full border px-2 text-xs font-semibold',
                    isCompleted
                      ? 'border-emerald-500/30 bg-emerald-500/12 text-emerald-200'
                      : isActive
                        ? 'border-sky-500/30 bg-sky-500/12 text-sky-200'
                        : 'border-[var(--border-soft)] text-[var(--ink-500)]',
                  )}
                >
                  {index + 1}
                </div>
              </div>
              <div className="mt-4 text-sm font-semibold text-[var(--ink-950)]">{stage.label}</div>
              <div className="mt-2 text-sm leading-6 text-[var(--ink-700)]">{stage.description}</div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
