import { motion } from 'framer-motion'
import { ArrowRight, Boxes, FileStack, MessageSquareText, Ruler, ScrollText } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { flushSync } from 'react-dom'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { Button, Eyebrow, Panel, StatusPill, fieldStyles } from '../components/ui'
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
        Запустить сборку
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

  const isValidBranch = branch === 'kp' || branch === 'tz'
  const activeBranch = (isValidBranch ? branch : 'kp') as DemoDocumentType
  const allowedStages = getWorkflowStages(activeBranch).map((stage) => stage.id)
  const isValidStage =
    !!stageId &&
    allowedStages.includes(stageId as never) &&
    stageId !== 'run' &&
    stageId !== 'editor' &&
    stageId !== 'export'
  const safeStageId = isValidStage ? stageId : activeBranch === 'kp' ? 'need' : 'source'
  const demoCase =
    cases.find((item) => item.id === caseId) ?? cases.find((item) => item.isAnchor) ?? cases[0]
  const pageKey = resolvePageKey(activeBranch, safeStageId)
  const hasDemoVariant = !!demoAppliedByPage[pageKey]
  const currentStage = getWorkflowStage(activeBranch, safeStageId as never)
  const nextStage =
    nextStageMap[activeBranch][safeStageId as keyof (typeof nextStageMap)[typeof activeBranch]]
  const sourceOptions = hasDemoVariant ? getDemoSourceOptions() : []
  const selectedSource = sourceOptions.find((item) => item.id === selectedSourceKpId) ?? null

  useEffect(() => {
    if (
      !isValidBranch ||
      !isValidStage ||
      !kpNeedTextareaRef.current ||
      activeBranch !== 'kp' ||
      safeStageId !== 'need' ||
      !demoCase
    ) {
      return
    }

    const textarea = kpNeedTextareaRef.current
    textarea.style.height = '0px'
    textarea.style.height = `${textarea.scrollHeight}px`
  }, [activeBranch, demoCase, isValidBranch, isValidStage, safeStageId])

  if (!isValidBranch) {
    return <Navigate to="/workspace" replace />
  }

  if (!isValidStage) {
    return (
      <Navigate
        to={
          caseStagePath(
            activeBranch,
            caseId ?? '',
            safeStageId as Extract<ReturnType<typeof getWorkflowStages>[number]['id'], 'source' | 'need' | 'materials' | 'comments'>,
          )
        }
        replace
      />
    )
  }

  if (!demoCase) {
    return <Navigate to="/workspace" replace />
  }

  function completeCurrentStage() {
    flushSync(() => {
      markStageComplete(activeBranch, safeStageId as never)
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
      {activeBranch === 'kp' && safeStageId === 'need' ? (
        <section>
          <Panel tone="highlight" className="rounded-[34px] p-6 md:p-8">
            <Eyebrow>
              {getBranchLabel(activeBranch)} / {currentStage.label}
            </Eyebrow>
            <div className="mt-5">
              <div className="display-section-title text-3xl text-[var(--ink-950)] md:text-[2.2rem]">
                Потребность и контекст
              </div>
              <p className="mt-2 max-w-3xl text-sm leading-7 text-[var(--ink-800)]">
                Зафиксируйте исходную потребность клиента в рабочем пространстве до запуска
                автоматизации.
              </p>
            </div>
            <label className="mt-5 block">
              <textarea
                ref={kpNeedTextareaRef}
                value={demoCase.kpRequestSummary}
                onChange={(event) => updateRequestSummary('kp', event.target.value)}
                rows={9}
                placeholder="Опишите потребность клиента..."
                className={`w-full resize-none overflow-hidden rounded-[28px] px-5 py-5 text-base leading-8 ${fieldStyles}`}
              />
            </label>
            <StageActions
              onDemo={() => applyDemoVariant(pageKey)}
              onNext={moveToNext}
              onGenerate={moveToGeneration}
            />
          </Panel>
        </section>
      ) : null}

      {activeBranch === 'kp' && safeStageId === 'materials' ? (
        <section>
          <Panel className="rounded-[34px] p-6">
            <Eyebrow>
              {getBranchLabel(activeBranch)} / {currentStage.label}
            </Eyebrow>
            <div className="mt-5 flex items-start justify-between gap-4">
              <div>
                <h3 className="display-section-title text-3xl text-[var(--ink-950)]">
                  Фото и материалы
                </h3>
                <p className="mt-2 text-sm leading-7 text-[var(--ink-800)]">
                  Визуальные и файловые материалы представлены как аккуратная галерея без изменения
                  структуры процесса.
                </p>
              </div>
              <StatusPill tone={demoCase.kpMaterials.length ? 'ready' : 'low'}>
                {demoCase.kpMaterials.length ? `${demoCase.kpMaterials.length} материалов` : 'Пусто'}
              </StatusPill>
            </div>

            {demoCase.kpMaterials.length ? (
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {demoCase.kpMaterials.map((asset) => (
                  <motion.div
                    key={asset.id}
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="executive-card overflow-hidden rounded-[28px]">
                      <div className="aspect-[1.18] bg-[linear-gradient(180deg,rgba(214,173,107,0.14),rgba(255,248,234,0.03))]">
                        {asset.previewUrl ? (
                          <img
                            src={asset.previewUrl}
                            alt={asset.title}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-[var(--brand-700)]">
                            {asset.kind === 'chat' ? (
                              <MessageSquareText size={34} />
                            ) : (
                              <FileStack size={34} />
                            )}
                          </div>
                        )}
                      </div>
                      <div className="relative p-4">
                        <div className="font-semibold text-[var(--ink-950)]">{asset.title}</div>
                        <div className="mt-1 text-sm text-[var(--ink-700)]">{asset.subtitle}</div>
                        <div className="mt-3 text-sm leading-7 text-[var(--ink-800)]">
                          {asset.note}
                        </div>
                        <div className="mt-4 text-xs text-[var(--ink-500)]">
                          {formatDateTime(asset.addedAt)}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="surface-dashed mt-6 rounded-[28px] p-8 text-center">
                <div className="accent-icon-block mx-auto flex h-14 w-14 items-center justify-center rounded-2xl">
                  <Boxes size={24} />
                </div>
                <div className="mt-4 text-lg font-semibold text-[var(--ink-950)]">
                  Материалы пока не добавлены
                </div>
              </div>
            )}

            <StageActions
              onDemo={() => applyDemoVariant(pageKey)}
              onNext={moveToNext}
              onGenerate={moveToGeneration}
            />
          </Panel>
        </section>
      ) : null}

      {activeBranch === 'kp' && safeStageId === 'comments' ? (
        <section>
          <Panel className="rounded-[34px] p-6">
            <Eyebrow>
              {getBranchLabel(activeBranch)} / {currentStage.label}
            </Eyebrow>
            <div className="mt-5">
              <h3 className="display-section-title text-3xl text-[var(--ink-950)]">
                Комментарии к контексту
              </h3>
            </div>
            <label className="mt-5 block">
              <textarea
                value={demoCase.kpContextNotes}
                onChange={(event) => updateStageNotes('kp', event.target.value)}
                rows={8}
                placeholder="Дополнительные замечания и комментарии..."
                className={`w-full rounded-[24px] ${fieldStyles}`}
              />
            </label>
            <StageActions
              onDemo={() => applyDemoVariant(pageKey)}
              onNext={moveToNext}
              onGenerate={moveToGeneration}
            />
          </Panel>
        </section>
      ) : null}

      {activeBranch === 'tz' && safeStageId === 'source' ? (
        <section>
          <Panel className="rounded-[34px] p-6">
            <Eyebrow>
              {getBranchLabel(activeBranch)} / {currentStage.label}
            </Eyebrow>
            <div className="mt-5 flex items-start justify-between gap-4">
              <div>
                <h3 className="display-section-title text-3xl text-[var(--ink-950)]">
                  Основа из КП
                </h3>
                <p className="mt-2 text-sm leading-7 text-[var(--ink-800)]">
                  Выберите исходную основу для технической ветки в более премиальной панели
                  отбора.
                </p>
              </div>
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
                      className={`rounded-[28px] p-5 text-left ${isSelected ? 'executive-card executive-highlight' : 'executive-card'}`}
                    >
                      <div className="relative flex items-start justify-between gap-3">
                        <div>
                          <div className="text-lg font-semibold text-[var(--ink-950)]">
                            {item.title}
                          </div>
                          <div className="mt-2 text-sm leading-7 text-[var(--ink-700)]">
                            {item.summary}
                          </div>
                        </div>
                        <StatusPill tone={item.badgeTone}>{item.statusLabel}</StatusPill>
                      </div>
                    </button>
                  )
                })}
              </div>
            ) : (
              <div className="surface-dashed mt-6 rounded-[28px] p-8 text-center">
                <div className="accent-icon-block mx-auto flex h-14 w-14 items-center justify-center rounded-2xl">
                  <ScrollText size={24} />
                </div>
                <div className="mt-4 text-lg font-semibold text-[var(--ink-950)]">
                  Основа пока не выбрана
                </div>
              </div>
            )}

            <div className="surface-note mt-6 rounded-[24px] p-4 text-sm leading-7 text-[var(--ink-800)]">
              {selectedSource ? `${selectedSource.title}` : 'Можно продолжить и без выбранной основы.'}
            </div>
            <Button className="mt-5" variant="ghost" onClick={() => selectSourceKp(null)}>
              Продолжить без основы
            </Button>
            <StageActions
              onDemo={() => applyDemoVariant(pageKey)}
              onNext={moveToNext}
              onGenerate={moveToGeneration}
            />
          </Panel>
        </section>
      ) : null}

      {activeBranch === 'tz' && safeStageId === 'need' ? (
        <section>
          <Panel className="rounded-[34px] p-6">
            <Eyebrow>
              {getBranchLabel(activeBranch)} / {currentStage.label}
            </Eyebrow>
            <label className="mt-5 block">
              <textarea
                value={demoCase.tzRequestSummary}
                onChange={(event) => updateRequestSummary('tz', event.target.value)}
                rows={8}
                placeholder="Опишите техническую цель и ожидаемый результат..."
                className={`w-full rounded-[24px] ${fieldStyles}`}
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
                      className={`mt-3 w-full rounded-[20px] ${fieldStyles}`}
                    />
                  ) : (
                    <input
                      value={field.value}
                      onChange={(event) => updateField(field.id, event.target.value)}
                      className={`mt-3 w-full rounded-[20px] ${fieldStyles}`}
                    />
                  )}
                </label>
              ))}
            </div>

            <StageActions
              onDemo={() => applyDemoVariant(pageKey)}
              onNext={moveToNext}
              onGenerate={moveToGeneration}
            />
          </Panel>
        </section>
      ) : null}

      {activeBranch === 'tz' && safeStageId === 'comments' ? (
        <section>
          <Panel className="rounded-[34px] p-6">
            {demoCase.tzMeasurements.length ? (
              <div className="grid gap-4 md:grid-cols-2">
                {demoCase.tzMeasurements.map((measurement) => (
                  <label key={measurement.id} className="executive-card rounded-[24px] p-4">
                    <div className="relative">
                      <div className="flex items-center gap-2">
                        <Ruler size={16} className="text-[var(--brand-700)]" />
                        <div className="text-sm font-semibold text-[var(--ink-950)]">
                          {measurement.label}
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-[var(--ink-500)]">{measurement.note}</div>
                      <div className="mt-3 flex items-center gap-3">
                        <input
                          value={measurement.value}
                          onChange={(event) =>
                            updateMeasurement(measurement.id, event.target.value)
                          }
                          className={`w-full rounded-[18px] ${fieldStyles}`}
                        />
                        <div className="text-sm text-[var(--ink-700)]">{measurement.unit}</div>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            ) : (
              <div className="surface-dashed rounded-[26px] p-6 text-sm leading-7 text-[var(--ink-700)]">
                Замеры пока не добавлены.
              </div>
            )}

            <label className="mt-6 block">
              <textarea
                value={demoCase.tzTechnicalNotes}
                onChange={(event) => updateStageNotes('tz', event.target.value)}
                rows={6}
                placeholder="Технические комментарии..."
                className={`w-full rounded-[24px] ${fieldStyles}`}
              />
            </label>

            <StageActions
              onDemo={() => applyDemoVariant(pageKey)}
              onNext={moveToNext}
              onGenerate={moveToGeneration}
            />
          </Panel>
        </section>
      ) : null}
    </div>
  )
}
