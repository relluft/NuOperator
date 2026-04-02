import { motion } from 'framer-motion'
import {
  ArrowRight,
  Boxes,
  ClipboardList,
  FileStack,
  MessageSquareText,
  PackagePlus,
  Ruler,
  ScrollText,
} from 'lucide-react'
import { flushSync } from 'react-dom'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { getDemoSourceOptions } from '../data/demoData'
import { Button, Eyebrow, Panel, StatusPill } from '../components/ui'
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
      className={`rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--ink-700)] ${className}`}
      onClick={onClick}
    >
      Демонстрационный вариант
    </Button>
  )
}

export function CasePage() {
  const navigate = useNavigate()
  const { branch, caseId, stageId } = useParams()
  const {
    state: { cases, draft, branchLaunch, selectedSourceKpId, demoAppliedByPage },
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

  if (!stageId || !allowedStages.includes(stageId as never) || stageId === 'run' || stageId === 'editor') {
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
  const pipelineName = branchLaunch[activeBranch].pipelineName
  const sourceOptions = hasDemoVariant ? getDemoSourceOptions() : []
  const selectedSource = sourceOptions.find((item) => item.id === selectedSourceKpId) ?? null

  function moveToNext() {
    if (nextStage === 'run') {
      flushSync(() => {
        markStageComplete(activeBranch, stageId as never)
      })
      navigate(runPath(activeBranch, demoCase.runId))
      return
    }

    flushSync(() => {
      markStageComplete(activeBranch, stageId as never)
    })
    navigate(caseStagePath(activeBranch, demoCase.id, nextStage))
  }

  return (
    <div className="space-y-6">
      <Panel className="rounded-[34px] p-6 md:p-8">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr),320px]">
          <div className="space-y-5">
            <Eyebrow>
              {getBranchLabel(activeBranch)} / {currentStage.label}
            </Eyebrow>
            <div className="space-y-4">
              <h2 className="text-4xl font-semibold tracking-tight text-[var(--ink-950)]">{pipelineName}</h2>
              <p className="max-w-3xl text-base leading-8 text-[var(--ink-800)]">
                {activeBranch === 'kp'
                  ? 'Сценарий КП начинается с пустой рабочей формы: пользователь формулирует потребность, при необходимости подставляет демонстрационные материалы и только потом переходит к сборке.'
                  : 'Сценарий ТЗ также начинается с пустых шагов: сначала выбирается обезличенная основа, затем уточняется задача и только после этого можно показать демонстрационную сборку.'}
              </p>
            </div>
          </div>

          <div className="rounded-[30px] border border-[var(--border-soft)] bg-[var(--surface-strong)] p-5">
            <div className="text-sm text-[var(--ink-700)]">Сейчас заполняем</div>
            <div className="mt-2 text-2xl font-semibold text-[var(--ink-950)]">{currentStage.label}</div>
            <div className="mt-3 text-sm leading-7 text-[var(--ink-800)]">{currentStage.description}</div>

            <div className="mt-5 rounded-[22px] border border-[var(--border-soft)] bg-[var(--surface-muted)] px-4 py-4">
              <div className="text-xs uppercase tracking-[0.16em] text-[var(--ink-500)]">Следующий шаг</div>
              <div className="mt-2 text-sm font-semibold text-[var(--ink-950)]">
                {nextStage === 'run'
                  ? activeBranch === 'kp'
                    ? 'Сборка КП'
                    : 'Сборка ТЗ'
                  : getWorkflowStage(activeBranch, nextStage).label}
              </div>
            </div>

            <Button className="mt-5 w-full justify-center" onClick={moveToNext}>
              {nextStage === 'run'
                ? activeBranch === 'kp'
                  ? 'Перейти к сборке КП'
                  : 'Перейти к сборке ТЗ'
                : 'Сохранить и перейти дальше'}
              <ArrowRight size={16} />
            </Button>
          </div>
        </div>
      </Panel>

      {activeBranch === 'kp' && stageId === 'need' ? (
        <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr),320px]">
          <Panel className="rounded-[34px] p-6 md:p-8">
            <div className="text-center">
              <Eyebrow>Основной ввод</Eyebrow>
              <h3 className="mt-5 text-3xl font-semibold text-[var(--ink-950)]">Потребность заказчика</h3>
              <p className="mx-auto mt-3 max-w-3xl text-sm leading-7 text-[var(--ink-800)]">
                Это главный рабочий блок для демонстрации. Здесь пользователь своими словами описывает, что
                нужно подготовить в рамках данного пайплайна.
              </p>
            </div>

            <label className="mt-8 block">
              <textarea
                value={demoCase.kpRequestSummary}
                onChange={(event) => updateRequestSummary('kp', event.target.value)}
                rows={9}
                placeholder="Введите потребность заказчика..."
                className="w-full rounded-[28px] border border-[var(--border-soft)] bg-[var(--surface-muted)] px-5 py-5 text-base leading-8 text-[var(--ink-950)] outline-none transition focus:border-[var(--brand-500)]"
              />
            </label>
          </Panel>

          <Panel className="rounded-[30px] p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-[rgba(78,149,188,0.12)] p-3 text-[var(--brand-700)]">
                <ClipboardList size={20} />
              </div>
              <div>
                <div className="font-semibold text-[var(--ink-950)]">Демо для показа</div>
                <div className="text-sm text-[var(--ink-700)]">Подставляется только по отдельной кнопке</div>
              </div>
            </div>
            <div className="mt-4 rounded-[22px] border border-dashed border-[var(--border-strong)] bg-[var(--surface-muted)] p-4 text-sm leading-7 text-[var(--ink-700)]">
              На свежем старте поле остаётся пустым. Для демонстрации можно один раз подставить нейтральный
              пример текста без персональных данных.
            </div>
            <DemoVariantButton className="mt-4 w-full justify-center" onClick={() => applyDemoVariant(pageKey)} />
          </Panel>
        </section>
      ) : null}

      {activeBranch === 'kp' && stageId === 'materials' ? (
        <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr),320px]">
          <Panel className="rounded-[34px] p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-2xl font-semibold text-[var(--ink-950)]">Фото и материалы</h3>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--ink-800)]">
                  Здесь появляются только те материалы, которые действительно нужны для подготовки КП. По
                  умолчанию экран пустой и не показывает заглушки без явного действия пользователя.
                </p>
              </div>
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
                <div className="mx-auto mt-2 max-w-2xl text-sm leading-7 text-[var(--ink-700)]">
                  В реальном сценарии сюда попадут фотографии, PDF и другие входные файлы. Для демо можно
                  показать готовый обезличенный набор через маленькую кнопку справа.
                </div>
              </div>
            )}
          </Panel>

          <Panel className="rounded-[30px] p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-[rgba(208,154,58,0.14)] p-3 text-[var(--surface-dark)]">
                <PackagePlus size={20} />
              </div>
              <div>
                <div className="font-semibold text-[var(--ink-950)]">Демо для материалов</div>
                <div className="text-sm text-[var(--ink-700)]">Без автоподстановки при первом открытии</div>
              </div>
            </div>
            <div className="mt-4 rounded-[22px] border border-dashed border-[var(--border-strong)] bg-[var(--surface-muted)] p-4 text-sm leading-7 text-[var(--ink-700)]">
              Кнопка подставляет только текущий шаг: фотографии, файл измерений и демонстрационный пример
              конструктивного узла.
            </div>
            <DemoVariantButton className="mt-4 w-full justify-center" onClick={() => applyDemoVariant(pageKey)} />
          </Panel>
        </section>
      ) : null}

      {activeBranch === 'kp' && stageId === 'comments' ? (
        <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr),320px]">
          <Panel className="rounded-[34px] p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-2xl font-semibold text-[var(--ink-950)]">Комментарии и вводные</h3>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--ink-800)]">
                  Здесь фиксируется свободная информация, которая имеет значение для этого конкретного пайплайна,
                  но не относится напрямую к потребности и блоку материалов.
                </p>
              </div>
              <DemoVariantButton onClick={() => applyDemoVariant(pageKey)} />
            </div>

            <label className="mt-6 block">
              <div className="text-sm font-semibold text-[var(--ink-950)]">Свободные вводные</div>
              <textarea
                value={demoCase.kpContextNotes}
                onChange={(event) => updateStageNotes('kp', event.target.value)}
                rows={8}
                placeholder="Напишите важные условия, ограничения или пожелания к генерации..."
                className="mt-3 w-full rounded-[24px] border border-[var(--border-soft)] bg-[var(--surface-muted)] px-4 py-4 text-sm leading-7 text-[var(--ink-950)] outline-none transition focus:border-[var(--brand-500)]"
              />
            </label>
          </Panel>

          <Panel className="rounded-[30px] p-5">
            <div className="font-semibold text-[var(--ink-950)]">Что важно на этом шаге</div>
            <div className="mt-4 rounded-[22px] border border-[var(--border-soft)] bg-[var(--surface-muted)] p-4 text-sm leading-7 text-[var(--ink-800)]">
              В этом разделе больше нет отдельных комментариев монтажников. Пользователь пишет один
              консолидированный текст, который программа потом учитывает при генерации.
            </div>
          </Panel>
        </section>
      ) : null}

      {activeBranch === 'tz' && stageId === 'source' ? (
        <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr),320px]">
          <Panel className="rounded-[34px] p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-2xl font-semibold text-[var(--ink-950)]">Основа из КП</h3>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--ink-800)]">
                  По умолчанию экран пустой. Для демонстрации можно отдельно открыть обезличенные варианты
                  готовой базы, на которой затем будет строиться ТЗ.
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
                <div className="mx-auto mt-2 max-w-2xl text-sm leading-7 text-[var(--ink-700)]">
                  Нажмите на маленькую кнопку «Демонстрационный вариант», чтобы показать типовые обезличенные
                  карточки базы для ТЗ.
                </div>
              </div>
            )}
          </Panel>

          <Panel className="rounded-[30px] p-5">
            <div className="font-semibold text-[var(--ink-950)]">Выбранная основа</div>
            <div className="mt-4 rounded-[24px] border border-[var(--border-soft)] bg-[var(--surface-muted)] p-4 text-sm leading-7 text-[var(--ink-800)]">
              {selectedSource
                ? `${selectedSource.title}. Эту основу можно использовать как демонстрационный старт для ТЗ.`
                : 'Основа пока не выбрана. При необходимости можно продолжить сценарий и без неё.'}
            </div>
            <Button className="mt-5 w-full justify-center" variant="secondary" onClick={() => selectSourceKp(null)}>
              Продолжить без основы
            </Button>
          </Panel>
        </section>
      ) : null}

      {activeBranch === 'tz' && stageId === 'need' ? (
        <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr),320px]">
          <Panel className="rounded-[34px] p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-2xl font-semibold text-[var(--ink-950)]">Потребность и адаптация под ТЗ</h3>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--ink-800)]">
                  Здесь пользователь переводит задачу в технический формат: что именно должно быть реализовано
                  и какие результаты считаются корректными для будущего ТЗ.
                </p>
              </div>
              <DemoVariantButton onClick={() => applyDemoVariant(pageKey)} />
            </div>

            <label className="mt-6 block">
              <div className="text-sm font-semibold text-[var(--ink-950)]">Формулировка задачи для ТЗ</div>
              <textarea
                value={demoCase.tzRequestSummary}
                onChange={(event) => updateRequestSummary('tz', event.target.value)}
                rows={8}
                placeholder="Опишите техническую цель и ожидаемый результат..."
                className="mt-3 w-full rounded-[24px] border border-[var(--border-soft)] bg-[var(--surface-muted)] px-4 py-4 text-sm leading-7 text-[var(--ink-950)] outline-none transition focus:border-[var(--brand-500)]"
              />
            </label>
          </Panel>

          <Panel className="rounded-[30px] p-5">
            <div className="font-semibold text-[var(--ink-950)]">Поля финальной упаковки</div>
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
          </Panel>
        </section>
      ) : null}

      {activeBranch === 'tz' && stageId === 'comments' ? (
        <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr),320px]">
          <Panel className="rounded-[34px] p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-2xl font-semibold text-[var(--ink-950)]">Замеры и вводные</h3>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--ink-800)]">
                  На этом шаге фиксируются измеримые параметры и свободные технические вводные, которые
                  нужно учесть при сборке ТЗ.
                </p>
              </div>
              <DemoVariantButton onClick={() => applyDemoVariant(pageKey)} />
            </div>

            {demoCase.tzMeasurements.length ? (
              <div className="mt-6 grid gap-4 md:grid-cols-2">
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
              <div className="mt-6 rounded-[26px] border border-dashed border-[var(--border-strong)] bg-[var(--surface-muted)] p-6 text-sm leading-7 text-[var(--ink-700)]">
                Измеримые параметры пока не добавлены. Для демонстрации можно подставить типовой набор замеров
                через маленькую кнопку «Демонстрационный вариант».
              </div>
            )}

            <label className="mt-6 block">
              <div className="text-sm font-semibold text-[var(--ink-950)]">Технические вводные</div>
              <textarea
                value={demoCase.tzTechnicalNotes}
                onChange={(event) => updateStageNotes('tz', event.target.value)}
                rows={6}
                placeholder="Опишите дополнительные технические ограничения и условия..."
                className="mt-3 w-full rounded-[24px] border border-[var(--border-soft)] bg-[var(--surface-muted)] px-4 py-4 text-sm leading-7 text-[var(--ink-950)] outline-none transition focus:border-[var(--brand-500)]"
              />
            </label>
          </Panel>

          <Panel className="rounded-[30px] p-5">
            <div className="font-semibold text-[var(--ink-950)]">Что учитывается в ТЗ</div>
            <div className="mt-4 rounded-[24px] border border-[var(--border-soft)] bg-[var(--surface-muted)] p-4 text-sm leading-7 text-[var(--ink-800)]">
              Здесь нет персональных комментариев сотрудников. Пользователь вносит только проектно значимые
              измерения и свободные технические вводные.
            </div>
          </Panel>
        </section>
      ) : null}
    </div>
  )
}
