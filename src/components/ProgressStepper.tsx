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
  exportId,
  currentStageId,
  completedStageIds,
}: {
  branch: DemoDocumentType
  caseId: string
  runId: string
  draftId: string
  exportId: string
  currentStageId: DemoWorkflowStageId
  completedStageIds: DemoWorkflowStageId[]
}) {
  const stages = getWorkflowStages(branch)

  return (
    <div className="frosted panel-outline rounded-[28px] px-4 py-4 md:px-5">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--ink-500)]">
          Прогресс по этапам
        </div>
        <div className="metal-pill rounded-full px-3 py-1.5 text-[11px] font-semibold text-[var(--ink-700)]">
          {completedStageIds.length} из {stages.length} этапов отмечены
        </div>
      </div>

      <div className="grid gap-3 lg:grid-cols-6">
        {stages.map((stage, index) => {
          const isActive = currentStageId === stage.id
          const isCompleted = completedStageIds.includes(stage.id)
          const Icon = stage.icon

          return (
            <Link
              key={stage.id}
              to={stagePath(branch, caseId, runId, draftId, exportId, stage.id)}
              className={cn(
                'executive-card rounded-[22px] px-3 py-3',
                isActive && 'executive-highlight',
                isCompleted && !isActive && 'border-emerald-500/20',
              )}
            >
              <div className="relative">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div
                      className={cn(
                        'rounded-[18px] border p-2',
                        isActive
                          ? 'border-[rgba(214,173,107,0.24)] bg-[rgba(214,173,107,0.12)] text-[var(--brand-700)]'
                          : isCompleted
                            ? 'border-emerald-500/22 bg-emerald-500/10 text-emerald-100'
                            : 'border-[var(--border-soft)] bg-[rgba(255,248,234,0.03)] text-[var(--ink-700)]',
                      )}
                    >
                      <Icon size={16} />
                    </div>
                    <div className="truncate text-sm font-semibold text-[var(--ink-950)]">
                      {stage.label}
                    </div>
                  </div>
                  <div
                    className={cn(
                      'flex h-7 min-w-7 items-center justify-center rounded-full border px-2 text-[11px] font-semibold',
                      isCompleted
                        ? 'border-emerald-500/24 bg-emerald-500/10 text-emerald-100'
                        : isActive
                          ? 'border-[rgba(214,173,107,0.26)] bg-[rgba(214,173,107,0.12)] text-[var(--brand-700)]'
                          : 'border-[var(--border-soft)] bg-[rgba(255,248,234,0.02)] text-[var(--ink-500)]',
                    )}
                  >
                    {index + 1}
                  </div>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
