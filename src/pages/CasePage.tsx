import { motion } from 'framer-motion'
import { ArrowRight, Boxes, FileStack, MessageSquareText, Ruler, ScrollText } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { flushSync } from 'react-dom'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { Button, Eyebrow, Panel, StatusPill } from '../components/ui'
import { getDemoSourceOptions } from '../data/demoData'
import { useDemo } from '../context/DemoContext'
import { caseStagePath, runPath } from '../lib/routes'
import { formatDateTime } from '../lib/utils'
import { getBranchLabel, getWorkflowStage, getWorkflowStages } from '../lib/workflow'
import type { DemoDocumentType, DemoPageKey } from '../types/demo'

const nextStageMap = {
  kp: {
    need: 'materials',
    materials: 'comments',
    comments: 'run',
  },
  tz: {
    source: 'need',
    need: 'comments',
    comments: 'run',
  },
} as const

function resolvePageKey(branch: DemoDocumentType, stageId: string): DemoPageKey {
  if (branch === 'kp') {
    if (stageId === 'need') return 'kp-need'
    if (stageId === 'materials') return 'kp-materials'
    return 'kp-comments'
  }

  if (stageId === 'source') return 'tz-source'
  if (stageId === 'need') return 'tz-need'
  return 'tz-comments'
}

function DemoVariantButton({
  onClick,
  className = '',
}: {
  onClick: () => void
  className?: string
}) {
  return (
    <Button
      variant="ghost"
      className={`rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] ${className}`}
      onClick={onClick}
    >
      Демо
    </Button>
  )
}

function StageActions({
  onDemo,
  onNext,
  onGenerate,
}: {
  onDemo: () => void
  onNext: () => void
  onGenerate: () => void
}) {
  return (
    <div className="mt-6 flex flex-wrap items-center gap-3">
      <DemoVariantButton onClick={onDemo} />
      <Button variant="secondary" onClick={onNext}>
        Далее
        <ArrowRight size={16} />
      </Button>
      <Button onClick={onGenerate}>
        Генерация
        <ArrowRight size={16} />
      </Button>
    </div>
  )
}

export function CasePage() {
  const navigate = useNavigate()
  const kpNeedTextareaRef = useRef<HTMLTextAreaElement | null>(null)
  const { branch, caseId, stageId } = useParams()
  const {
    state: { cases, draft, selectedSourceKpId, demoAppliedByPage },
    applyDemoVariant,
    markStageComplete,
    selectSourceKp,
    updateField,
    updateMeasurement,
    updateRequestSummary,
    updateStageNotes,
  } = useDemo()

  if (branch !== 'kp' && branch !== 'tz') {
    return <Navigate to="/workspace" replace />
  }

  const activeBranch = branch as DemoDocumentType
  const allowedStages = getWorkflowStages(activeBranch).map((stage) => stage.id)

  if (
    !stageId ||
    !allowedStages.includes(stageId as never) ||
    stageId === 'run' ||
    stageId === 'editor' ||
    stageId === 'export'
  ) {
    return <Navigate to={caseStagePath(activeBranch, caseId ?? '', activeBranch === 'kp' ? 'need' : 'source')} replace />
  }

  const demoCase = cases.find((item) => item.id === caseId) ?? cases.find((item) => item.isAnchor) ?? cases[0]

  if (!demoCase) {
    return <Navigate to="/workspace" replace />
  }

  const pageKey = resolvePageKey(activeBranch, stageId)
  const hasDemoVariant = !!demoAppliedByPage[pageKey]
  const currentStage = getWorkflowStage(activeBranch, stageId as never)
  const nextStage = nextStageMap[activeBranch][stageId as keyof (typeof nextStageMap)[typeof activeBranch]]
  const sourceOptions = hasDemoVariant ? getDemoSourceOptions() : []
  const selectedSource = sourceOptions.find((item) => item.id === selectedSourceKpId) ?? null

  useEffect(() => {
    if (activeBranch !== 'kp' || stageId !== 'need' || !kpNeedTextareaRef.current) {
      return
    }

    const textarea = kpNeedTextareaRef.current
    textarea.style.height = '0px'
    textarea.style.height = `${textarea.scrollHeight}px`
  }, [activeBranch, stageId, demoCase.kpRequestSummary])

  function completeCurrentStage() {
    flushSync(() => {
      markStageComplete(activeBranch, stageId as never)
    })
  }

  function moveToNext() {
    completeCurrentStage()

    if (nextStage === 'run') {
      navigate(runPath(activeBranch, demoCase.runId))
      return
    }

    navigate(caseStagePath(activeBranch, demoCase.id, nextStage))
  }

  function moveToGeneration() {
    completeCurrentStage()
    navigate(runPath(activeBranch, demoCase.runId))
  }

  return (
    <div className="space-y-6">
      {activeBranch === 'kp' && stageId === 'need' ? (
        <section>
          <Panel className="rounded-[34px] p-6 md:p-8">
            <Eyebrow>
              {getBranchLabel(activeBranch)} / {currentStage.label}
            </Eyebrow>
            <label className="block">
              <textarea
                ref={kpNeedTextareaRef}
                value={demoCase.kpRequestSummary}
                onChange={(event) => updateRequestSummary('kp', event.target.value)}
                rows={9}
                placeholder="Введите базовую потребность заказчика..."
                className="w-full resize-none overflow-hidden rounded-[28px] border border-[var(--border-soft)] bg-[var(--surface-muted)] px-5 py-5 text-base leading-8 text-[var(--ink-950)] outline-none transition focus:border-[var(--brand-500)]"
              />
            </label>
            <StageActions onDemo={() => applyDemoVariant(pageKey)} onNext={moveToNext} onGenerate={moveToGeneration} />
          </Panel>
        </section>
      ) : null}

      {activeBranch === 'kp' && stageId === 'materials' ? (
        <section>
          <Panel className="rounded-[34px] p-6">
            <Eyebrow>{getBranchLabel(activeBranch)} / {currentStage.label}</Eyebrow>
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-2xl font-semibold text-[var(--ink-950)]">Фото и материалы</h3>
              <StatusPill tone={demoCase.kpMaterials.length ? 'ready' : 'low'}>
                {demoCase.kpMaterials.length ? `${demoCase.kpMaterials.length} материалов` : 'Пока пусто'}
              </StatusPill>
            </div>

            {demoCase.kpMaterials.length ? (
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {demoCase.kpMaterials.map((asset) => (
                  <motion.div key={asset.id} whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
                    <div className="overflow-hidden rounded-[28px] border border-[var(--border-soft)] bg-[var(--surface-muted)]">
                      <div className="aspect-[1.18] bg-[rgba(78,149,188,0.1)]">
                        {asset.previewUrl ? (
                          <img src={asset.previewUrl} alt={asset.title} className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full items-center justify-center text-[var(--brand-700)]">
                            {asset.kind === 'chat' ? <MessageSquareText size={34} /> : <FileStack size={34} />}
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <div className="font-semibold text-[var(--ink-950)]">{asset.title}</div>
                        <div className="mt-1 text-sm text-[var(--ink-700)]">{asset.subtitle}</div>
                        <div className="mt-3 text-sm leading-7 text-[var(--ink-800)]">{asset.note}</div>
                        <div className="mt-4 text-xs text-[var(--ink-500)]">{formatDateTime(asset.addedAt)}</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="mt-6 rounded-[28px] border border-dashed border-[var(--border-strong)] bg-[var(--surface-muted)] p-8 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[rgba(78,149,188,0.12)] text-[var(--brand-700)]">
                  <Boxes size={24} />
                </div>
                <div className="mt-4 text-lg font-semibold text-[var(--ink-950)]">Материалы ещё не добавлены</div>
              </div>
            )}

            <StageActions onDemo={() => applyDemoVariant(pageKey)} onNext={moveToNext} onGenerate={moveToGeneration} />
          </Panel>
        </section>
      ) : null}

      {activeBranch === 'kp' && stageId === 'comments' ? (
        <section>
          <Panel className="rounded-[34px] p-6">
            <Eyebrow>{getBranchLabel(activeBranch)} / {currentStage.label}</Eyebrow>
            <label className="block">
              <textarea
                value={demoCase.kpContextNotes}
                onChange={(event) => updateStageNotes('kp', event.target.value)}
                rows={8}
                placeholder="Комментарии и вводные..."
                className="w-full rounded-[24px] border border-[var(--border-soft)] bg-[var(--surface-muted)] px-4 py-4 text-sm leading-7 text-[var(--ink-950)] outline-none transition focus:border-[var(--brand-500)]"
              />
            </label>
            <StageActions onDemo={() => applyDemoVariant(pageKey)} onNext={moveToNext} onGenerate={moveToGeneration} />
          </Panel>
        </section>
      ) : null}

      {activeBranch === 'tz' && stageId === 'source' ? (
        <section>
          <Panel className="rounded-[34px] p-6">
            <Eyebrow>{getBranchLabel(activeBranch)} / {currentStage.label}</Eyebrow>
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-2xl font-semibold text-[var(--ink-950)]">Основа из КП</h3>
              <DemoVariantButton onClick={() => applyDemoVariant(pageKey)} />
            </div>

            {sourceOptions.length ? (
              <div className="mt-6 grid gap-4 lg:grid-cols-2">
                {sourceOptions.map((item) => {
                  const isSelected = selectedSourceKpId === item.id

                  return (
                    <button
                      key={item.id}
                      onClick={() => selectSourceKp(item.id)}
                      className={`rounded-[28px] border p-5 text-left transition ${
                        isSelected
                          ? 'border-[var(--brand-500)] bg-[rgba(78,149,188,0.14)]'
                          : 'border-[var(--border-soft)] bg-[var(--surface-muted)]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-lg font-semibold text-[var(--ink-950)]">{item.title}</div>
                          <div className="mt-2 text-sm leading-7 text-[var(--ink-700)]">{item.summary}</div>
                        </div>
                        <StatusPill tone={item.badgeTone}>{item.statusLabel}</StatusPill>
                      </div>
                    </button>
                  )
                })}
              </div>
            ) : (
              <div className="mt-6 rounded-[28px] border border-dashed border-[var(--border-strong)] bg-[var(--surface-muted)] p-8 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[rgba(78,149,188,0.12)] text-[var(--brand-700)]">
                  <ScrollText size={24} />
                </div>
                <div className="mt-4 text-lg font-semibold text-[var(--ink-950)]">Основа пока не выбрана</div>
              </div>
            )}

            <div className="mt-6 rounded-[24px] border border-[var(--border-soft)] bg-[var(--surface-muted)] p-4 text-sm leading-7 text-[var(--ink-800)]">
              {selectedSource ? `${selectedSource.title}` : 'Можно продолжить и без основы.'}
            </div>
            <Button className="mt-5" variant="ghost" onClick={() => selectSourceKp(null)}>
              Продолжить без основы
            </Button>
            <StageActions onDemo={() => applyDemoVariant(pageKey)} onNext={moveToNext} onGenerate={moveToGeneration} />
          </Panel>
        </section>
      ) : null}

      {activeBranch === 'tz' && stageId === 'need' ? (
        <section>
          <Panel className="rounded-[34px] p-6">
            <Eyebrow>{getBranchLabel(activeBranch)} / {currentStage.label}</Eyebrow>
            <label className="block">
              <textarea
                value={demoCase.tzRequestSummary}
                onChange={(event) => updateRequestSummary('tz', event.target.value)}
                rows={8}
                placeholder="Опишите техническую цель и ожидаемый результат..."
                className="w-full rounded-[24px] border border-[var(--border-soft)] bg-[var(--surface-muted)] px-4 py-4 text-sm leading-7 text-[var(--ink-950)] outline-none transition focus:border-[var(--brand-500)]"
              />
            </label>

            <div className="mt-4 space-y-4">
              {draft.fields.map((field) => (
                <label key={field.id} className="block">
                  <div className="text-sm font-semibold text-[var(--ink-950)]">{field.label}</div>
                  <div className="mt-1 text-xs text-[var(--ink-500)]">{field.hint}</div>
                  {field.id === 'specialTerms' ? (
                    <textarea
                      value={field.value}
                      onChange={(event) => updateField(field.id, event.target.value)}
                      rows={3}
                      className="mt-3 w-full rounded-[20px] border border-[var(--border-soft)] bg-[var(--surface-muted)] px-4 py-3 text-sm text-[var(--ink-950)] outline-none transition focus:border-[var(--brand-500)]"
                    />
                  ) : (
                    <input
                      value={field.value}
                      onChange={(event) => updateField(field.id, event.target.value)}
                      className="mt-3 w-full rounded-[20px] border border-[var(--border-soft)] bg-[var(--surface-muted)] px-4 py-3 text-sm text-[var(--ink-950)] outline-none transition focus:border-[var(--brand-500)]"
                    />
                  )}
                </label>
              ))}
            </div>

            <StageActions onDemo={() => applyDemoVariant(pageKey)} onNext={moveToNext} onGenerate={moveToGeneration} />
          </Panel>
        </section>
      ) : null}

      {activeBranch === 'tz' && stageId === 'comments' ? (
        <section>
          <Panel className="rounded-[34px] p-6">
            {demoCase.tzMeasurements.length ? (
              <div className="grid gap-4 md:grid-cols-2">
                {demoCase.tzMeasurements.map((measurement) => (
                  <label
                    key={measurement.id}
                    className="rounded-[24px] border border-[var(--border-soft)] bg-[var(--surface-muted)] p-4"
                  >
                    <div className="flex items-center gap-2">
                      <Ruler size={16} className="text-[var(--brand-700)]" />
                      <div className="text-sm font-semibold text-[var(--ink-950)]">{measurement.label}</div>
                    </div>
                    <div className="mt-2 text-xs text-[var(--ink-500)]">{measurement.note}</div>
                    <div className="mt-3 flex items-center gap-3">
                      <input
                        value={measurement.value}
                        onChange={(event) => updateMeasurement(measurement.id, event.target.value)}
                        className="w-full rounded-[18px] border border-[var(--border-soft)] bg-[rgba(255,255,255,0.03)] px-4 py-3 text-sm text-[var(--ink-950)] outline-none transition focus:border-[var(--brand-500)]"
                      />
                      <div className="text-sm text-[var(--ink-700)]">{measurement.unit}</div>
                    </div>
                  </label>
                ))}
              </div>
            ) : (
              <div className="rounded-[26px] border border-dashed border-[var(--border-strong)] bg-[var(--surface-muted)] p-6 text-sm leading-7 text-[var(--ink-700)]">
                Замеры пока не добавлены.
              </div>
            )}

            <label className="mt-6 block">
              <textarea
                value={demoCase.tzTechnicalNotes}
                onChange={(event) => updateStageNotes('tz', event.target.value)}
                rows={6}
                placeholder="Технические вводные..."
                className="w-full rounded-[24px] border border-[var(--border-soft)] bg-[var(--surface-muted)] px-4 py-4 text-sm leading-7 text-[var(--ink-950)] outline-none transition focus:border-[var(--brand-500)]"
              />
            </label>

            <StageActions onDemo={() => applyDemoVariant(pageKey)} onNext={moveToNext} onGenerate={moveToGeneration} />
          </Panel>
        </section>
      ) : null}
    </div>
  )
}
