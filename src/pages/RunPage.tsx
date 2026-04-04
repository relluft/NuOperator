import { useEffect, useMemo, useState } from 'react'
import { AlertTriangle, ArrowRight, CheckCircle2, Square } from 'lucide-react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { resolveRunStages } from '../data/demoData'
import { Button, Eyebrow, Panel, ProgressBar, StatusPill, buttonStyles } from '../components/ui'
import { useDemo } from '../context/DemoContext'
import { draftPath } from '../lib/routes'
import { getWorkflowStages } from '../lib/workflow'
import type { DemoDocumentType, DemoPageKey, DemoStage } from '../types/demo'

function resolveRunPageKey(branch: DemoDocumentType): DemoPageKey {
  return branch === 'kp' ? 'kp-run' : 'tz-run'
}

function hasText(value: string | null | undefined) {
  return Boolean(value?.trim())
}

const stageDisplayByBranch: Record<
  DemoDocumentType,
  Array<{ title: string; summary: string; details: string }>
> = {
  kp: [
    {
      title: 'Запуск и очередь',
      summary: 'Создаём run и передаём задачу оркестратору.',
      details: 'Система фиксирует запуск, проверяет комплект входных данных и готовит пайплайн к выполнению.',
    },
    {
      title: 'Нормализация контекста',
      summary: 'Сводим потребность, фото и комментарии в общий контекст кейса.',
      details: 'Это соответствует этапу context merge из MVP: входные становятся единым набором данных для агентов.',
    },
    {
      title: 'Поиск нормативов',
      summary: 'RAG подбирает применимые нормы и фрагменты с источниками.',
      details: 'Нормативный слой ищет опору для дальнейших выводов и оставляет только пригодные для использования основания.',
    },
    {
      title: 'Цены и номенклатура',
      summary: 'Собираем товарную часть для коммерческого предложения.',
      details: 'Подтягиваются позиции и ценовая логика, чтобы КП собиралось уже с коммерческой основой.',
    },
    {
      title: 'Генерация черновика',
      summary: 'Собираем рабочий draft КП по секциям.',
      details: 'Документогенерация формирует обезличенный черновик, который потом откроется в редакторе.',
    },
    {
      title: 'QA и контроль',
      summary: 'Проверяем конфликты, пробелы и подозрительные места.',
      details: 'Перед показом пользователю пайплайн отмечает зоны, где нужен human review.',
    },
  ],
  tz: [
    {
      title: 'Запуск и очередь',
      summary: 'Создаём run и передаём задачу оркестратору.',
      details: 'Система фиксирует запуск, проверяет комплект входных данных и готовит пайплайн к выполнению.',
    },
    {
      title: 'Анализ фото и замеров',
      summary: 'Собираем измеримые признаки объекта.',
      details: 'Vision-часть и технические вводные извлекают из материалов всё, что влияет на draft ТЗ.',
    },
    {
      title: 'Нормализация контекста',
      summary: 'Собираем основу, адаптацию и параметры в единый контекст.',
      details: 'Это соответствует этапу context merge из MVP: входные становятся структурой для следующих шагов.',
    },
    {
      title: 'Поиск нормативов',
      summary: 'RAG подбирает применимые нормы и фрагменты с источниками.',
      details: 'Нормативный слой ищет опору для технических требований и будущих формулировок.',
    },
    {
      title: 'Генерация черновика',
      summary: 'Собираем рабочий draft ТЗ по секциям.',
      details: 'Документогенерация формирует обезличенный черновик, который потом откроется в редакторе.',
    },
    {
      title: 'QA и контроль',
      summary: 'Проверяем пробелы, конфликты и сомнительные места.',
      details: 'Перед показом пользователю пайплайн отмечает зоны, где нужен human review.',
    },
  ],
}

function mapStagesForDisplay(branch: DemoDocumentType, stages: DemoStage[]) {
  const displayStages = stageDisplayByBranch[branch]

  return stages.map((stage, index) => ({
    ...stage,
    title: displayStages[index]?.title ?? stage.title,
    summary: displayStages[index]?.summary ?? stage.summary,
    details: displayStages[index]?.details ?? stage.details,
  }))
}

export function RunPage() {
  const { branch, runId } = useParams()
  const [now, setNow] = useState(() => Date.now())
  const [launchWarning, setLaunchWarning] = useState<string | null>(null)
  const {
    state: { cases, run, selectedSourceKpId, demoAppliedByPage },
    applyDemoVariant,
    startRun,
    abortRun,
    completeRun,
  } = useDemo()

  const isValidBranch = branch === 'kp' || branch === 'tz'
  const activeBranch = (isValidBranch ? branch : 'kp') as DemoDocumentType
  const demoCase = cases.find((item) => item.id === run.caseId) ?? cases[0]
  const pageKey = resolveRunPageKey(activeBranch)
  const hasDemoVariant = !!demoAppliedByPage[pageKey]
  const resolved = useMemo(() => resolveRunStages(run, activeBranch, now), [activeBranch, now, run])
  const displayStages = useMemo(
    () => mapStagesForDisplay(activeBranch, resolved.stages),
    [activeBranch, resolved.stages],
  )

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(Date.now())
    }, 250)

    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    if (!isValidBranch || !hasDemoVariant) {
      return
    }

    if (run.status === 'running' && resolved.isComplete) {
      completeRun(activeBranch)
    }
  }, [activeBranch, completeRun, hasDemoVariant, isValidBranch, resolved.isComplete, run.status])

  if (!isValidBranch) {
    return <Navigate to="/workspace" replace />
  }

  if (!demoCase || runId !== run.id) {
    return null
  }

  const preRunStages = getWorkflowStages(activeBranch).filter(
    (stage) => stage.id !== 'run' && stage.id !== 'editor' && stage.id !== 'export',
  )
  const stageCompletion = preRunStages.map((stage) => {
    let isFilled = false

    if (activeBranch === 'kp') {
      if (stage.id === 'need') isFilled = hasText(demoCase.kpRequestSummary)
      if (stage.id === 'materials') isFilled = demoCase.kpMaterials.length > 0
      if (stage.id === 'comments') isFilled = hasText(demoCase.kpContextNotes)
    } else {
      if (stage.id === 'source') isFilled = Boolean(selectedSourceKpId)
      if (stage.id === 'need') isFilled = hasText(demoCase.tzRequestSummary)
      if (stage.id === 'comments') {
        isFilled =
          hasText(demoCase.tzTechnicalNotes) ||
          demoCase.tzMeasurements.some((measurement) => hasText(measurement.value))
      }
    }

    return {
      ...stage,
      isFilled,
    }
  })

  const completedInputCount = stageCompletion.filter((stage) => stage.isFilled).length
  const needStage = stageCompletion.find((stage) => stage.id === 'need')
  const activeStage = displayStages.find((stage) => stage.status === 'in_progress') ?? null
  const isRunning = run.status === 'running'
  const isAborted = run.status === 'aborted'
  const totalPercent = Math.round(resolved.totalProgress * 100)

  const stagePercents = displayStages.map((stage) => ({
    ...stage,
    percent:
      stage.status === 'completed'
        ? 100
        : stage.status === 'in_progress'
          ? Math.round((stage.progress ?? 0) * 100)
          : 0,
  }))

  function handleRunConfirmation() {
    if (!needStage?.isFilled) {
      setLaunchWarning('Заполните раздел «Потребность», чтобы запустить сборку.')
      return
    }

    setLaunchWarning(null)

    if (!hasDemoVariant) {
      applyDemoVariant(pageKey)
    }

    startRun(run.id, activeBranch)
  }

  const statusTitle = resolved.isComplete
    ? 'Черновик собран'
    : isAborted
      ? 'Сборка остановлена'
      : activeStage?.title ?? 'Готово к запуску'

  return (
    <div className="space-y-5">
      <Panel className="rounded-[34px] p-5 md:p-6">
        <div className="space-y-4">
          <Eyebrow>{activeBranch === 'kp' ? 'Сборка КП' : 'Сборка ТЗ'}</Eyebrow>

          <div className="rounded-[24px] border border-[var(--border-soft)] bg-[var(--surface-strong)] p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="text-sm font-semibold text-[var(--ink-950)]">Проверка заполнения</div>
              <StatusPill tone={completedInputCount > 0 ? 'ready' : 'low'}>
                {completedInputCount} из {stageCompletion.length}
              </StatusPill>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {stageCompletion.map((stage) => (
                <div
                  key={stage.id}
                  className={
                    stage.isFilled
                      ? 'inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1.5 text-sm text-[var(--ink-950)]'
                      : 'inline-flex items-center gap-2 rounded-full border border-amber-500/25 bg-amber-500/10 px-3 py-1.5 text-sm text-[var(--ink-950)]'
                  }
                >
                  {stage.isFilled ? (
                    <CheckCircle2 size={14} className="text-emerald-300" />
                  ) : (
                    <AlertTriangle size={14} className="text-amber-300" />
                  )}
                  {stage.label}
                </div>
              ))}
            </div>

            {launchWarning ? (
              <div className="mt-3 rounded-[18px] border border-amber-500/25 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
                {launchWarning}
              </div>
            ) : null}
          </div>

          <div className="rounded-[28px] border border-[var(--border-soft)] bg-[var(--surface-strong)] p-4 md:p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="text-sm text-[var(--ink-700)]">Текущий статус</div>
                <div className="mt-1 text-xl font-semibold text-[var(--ink-950)] md:text-2xl">
                  {statusTitle}
                </div>
              </div>
              <StatusPill
                tone={resolved.isComplete ? 'ready' : isAborted ? 'attention' : 'progress'}
              >
                {resolved.isComplete ? 'Готово' : isAborted ? 'Прервано' : 'Идёт сборка'}
              </StatusPill>
            </div>

            <div className="mt-4">
              <ProgressBar value={resolved.totalProgress} />
            </div>

            <div className="mt-3 grid gap-2 lg:grid-cols-2 2xl:grid-cols-3">
              {stagePercents.map((stage) => (
                <div
                  key={stage.id}
                  className="rounded-[20px] border border-[var(--border-soft)] bg-[var(--surface-muted)] px-3 py-3"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-sm font-medium text-[var(--ink-950)]">{stage.title}</div>
                    <div className="text-sm font-semibold text-[var(--brand-700)]">{stage.percent}%</div>
                  </div>
                  <div className="mt-2">
                    <ProgressBar value={stage.percent / 100} />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <div className="rounded-full border border-[var(--border-soft)] bg-[var(--surface-muted)] px-4 py-2 text-sm text-[var(--ink-700)]">
                Общий прогресс: {totalPercent}%
              </div>

              {isRunning ? (
                <>
                  <Button variant="secondary" onClick={() => abortRun(activeBranch)}>
                    <Square size={14} />
                    {'Прервать'}
                  </Button>
                  <Button
                    variant="ghost"
                    className="px-3 py-2 text-xs"
                    onClick={() => completeRun(activeBranch)}
                  >
                    {'Пропустить загрузку'}
                  </Button>
                </>
              ) : (
                <Button onClick={handleRunConfirmation}>
                  <CheckCircle2 size={16} />
                  {isAborted
                    ? 'Запустить снова'
                    : hasDemoVariant
                      ? 'Запустить'
                      : 'Подтвердить'}
                </Button>
              )}

              {resolved.isComplete ? (
                <Link
                  to={draftPath(activeBranch, demoCase.draftId)}
                  className={buttonStyles()}
                >
                  {'Перейти в редактор'}
                  <ArrowRight size={15} />
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      </Panel>

    </div>
  )
}
