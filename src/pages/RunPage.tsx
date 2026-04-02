import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Clock3, LoaderCircle, Sparkles, TimerOff } from 'lucide-react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { resolveRunStages } from '../data/demoData'
import { Button, Eyebrow, Panel, ProgressBar, StatusPill } from '../components/ui'
import { useDemo } from '../context/DemoContext'
import { approvePath, draftPath } from '../lib/routes'
import type { DemoDocumentType, DemoPageKey } from '../types/demo'

function resolveRunPageKey(branch: DemoDocumentType): DemoPageKey {
  return branch === 'kp' ? 'kp-run' : 'tz-run'
}

export function RunPage() {
  const { branch, runId } = useParams()
  const [now, setNow] = useState(() => Date.now())
  const {
    state: { cases, run, selectedSourceKpId, branchLaunch, demoAppliedByPage },
    applyDemoVariant,
    startRun,
    skipRun,
    completeRun,
  } = useDemo()

  const isValidBranch = branch === 'kp' || branch === 'tz'
  const activeBranch = (isValidBranch ? branch : 'kp') as DemoDocumentType
  const demoCase = cases.find((demoCase) => demoCase.id === run.caseId) ?? cases[0]
  const pageKey = resolveRunPageKey(activeBranch)
  const hasDemoVariant = !!demoAppliedByPage[pageKey]
  const pipelineName = branchLaunch[activeBranch].pipelineName
  const resolved = useMemo(() => resolveRunStages(run, activeBranch, now), [activeBranch, now, run])

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

    if (run.status !== 'completed' && resolved.isComplete) {
      completeRun(activeBranch)
    }
  }, [activeBranch, completeRun, hasDemoVariant, isValidBranch, resolved.isComplete, run.status])

  if (!isValidBranch) {
    return <Navigate to="/workspace" replace />
  }

  if (!demoCase || runId !== run.id) {
    return null
  }

  const selectedSourceLabel = selectedSourceKpId ? 'Выбрана демонстрационная основа' : 'Основа не выбрана'
  const activeStage = resolved.activeStage

  function handleDemoActivation() {
    applyDemoVariant(pageKey)
    startRun(run.id, activeBranch)
  }

  return (
    <div className="space-y-6">
      <Panel className="rounded-[34px] p-6 md:p-8">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr),340px]">
          <div className="space-y-5">
            <Eyebrow>{activeBranch === 'kp' ? 'Сборка КП' : 'Сборка ТЗ'}</Eyebrow>
            <div>
              <h2 className="text-4xl font-semibold tracking-tight text-[var(--ink-950)]">
                {pipelineName}
              </h2>
              <p className="mt-3 max-w-3xl text-base leading-8 text-[var(--ink-800)]">
                {activeBranch === 'kp'
                  ? 'Экран сборки теперь не показывает готовый наполненный результат сразу. Пользователь видит нейтральное состояние и сам решает, когда показать демонстрационный пример процесса.'
                  : 'Для ТЗ экран сборки тоже стартует пустым: только после отдельного демо-клика появляется пример прогресса и итогового сценария.'}
              </p>
            </div>

            {hasDemoVariant ? (
              <div className="rounded-[28px] border border-[var(--border-soft)] bg-[var(--surface-strong)] p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="text-sm text-[var(--ink-700)]">Текущий статус</div>
                    <div className="mt-1 text-2xl font-semibold text-[var(--ink-950)]">
                      {activeStage?.title ?? 'Подготовка сценария'}
                    </div>
                  </div>
                  <StatusPill tone={resolved.isComplete ? 'ready' : 'progress'}>
                    {resolved.isComplete ? 'Готово' : 'Идёт сборка'}
                  </StatusPill>
                </div>

                <div className="mt-4">
                  <ProgressBar value={resolved.totalProgress} />
                </div>

                <div className="mt-4 flex flex-wrap gap-3">
                  <Button variant="secondary" onClick={() => skipRun(activeBranch)}>
                    <TimerOff size={16} />
                    Пропустить анимацию
                  </Button>
                  <Link
                    to={draftPath(activeBranch, demoCase.draftId)}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--brand-700)]"
                  >
                    Открыть редактор
                    <ArrowRight size={15} />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="rounded-[28px] border border-dashed border-[var(--border-strong)] bg-[var(--surface-strong)] p-6">
                <div className="text-lg font-semibold text-[var(--ink-950)]">Сборка ещё не показана в демо</div>
                <div className="mt-2 max-w-3xl text-sm leading-7 text-[var(--ink-700)]">
                  В рабочем продукте здесь будет идти сборка черновика по введённым данным. Для демонстрации
                  можно отдельной кнопкой запустить безопасный пример процесса без подстановки персональных данных.
                </div>
                <Button className="mt-5" variant="secondary" onClick={handleDemoActivation}>
                  <Sparkles size={16} />
                  Демонстрационный вариант
                </Button>
              </div>
            )}
          </div>

          <div className="rounded-[30px] border border-[var(--border-soft)] bg-[var(--surface-strong)] p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-[rgba(78,149,188,0.12)] p-3 text-[var(--brand-700)]">
                <Sparkles size={20} />
              </div>
              <div>
                <div className="font-semibold text-[var(--ink-950)]">Что появится на выходе</div>
                <div className="text-sm text-[var(--ink-700)]">
                  {activeBranch === 'kp'
                    ? 'Обезличенный черновик коммерческого предложения'
                    : 'Обезличенный черновик технического задания'}
                </div>
              </div>
            </div>

            <div className="mt-5 space-y-3 text-sm leading-7 text-[var(--ink-800)]">
              <div className="rounded-2xl border border-[var(--border-soft)] bg-[var(--surface-muted)] px-4 py-3">
                Пайплайн: <span className="font-semibold text-[var(--ink-950)]">{pipelineName}</span>
              </div>
              <div className="rounded-2xl border border-[var(--border-soft)] bg-[var(--surface-muted)] px-4 py-3">
                Ветка: <span className="font-semibold text-[var(--ink-950)]">{activeBranch === 'kp' ? 'КП' : 'ТЗ'}</span>
              </div>
              {activeBranch === 'tz' ? (
                <div className="rounded-2xl border border-[var(--border-soft)] bg-[var(--surface-muted)] px-4 py-3">
                  Основа: <span className="font-semibold text-[var(--ink-950)]">{selectedSourceLabel}</span>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </Panel>

      {hasDemoVariant ? (
        <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr),360px]">
          <Panel className="rounded-[34px] p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <Eyebrow>Pipeline monitor</Eyebrow>
                <h3 className="mt-3 text-2xl font-semibold text-[var(--ink-950)]">
                  {activeBranch === 'kp'
                    ? 'Видно, как коммерческий черновик собирается шаг за шагом'
                    : 'Видно, как черновик ТЗ формируется из обезличённых данных'}
                </h3>
              </div>
              <div className="rounded-full border border-[var(--border-soft)] bg-[var(--surface-muted)] px-4 py-2 text-sm text-[var(--ink-700)]">
                Возврат к любому этапу доступен через stepper сверху
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {resolved.stages.map((stage, index) => (
                <motion.div
                  key={stage.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04 }}
                  className="rounded-[28px] border border-[var(--border-soft)] bg-[var(--surface-muted)] p-5"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[rgba(78,149,188,0.14)] text-sm font-semibold text-[var(--brand-700)]">
                          {index + 1}
                        </span>
                        <div>
                          <div className="font-semibold text-[var(--ink-950)]">{stage.title}</div>
                          <div className="text-sm text-[var(--ink-700)]">{stage.summary}</div>
                        </div>
                      </div>
                      <p className="text-sm leading-7 text-[var(--ink-800)]">{stage.details}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="rounded-full border border-[var(--border-soft)] bg-[var(--surface-strong)] px-3 py-1 text-xs font-semibold text-[var(--ink-700)]">
                        {stage.durationLabel}
                      </div>
                      <StatusPill
                        tone={
                          stage.status === 'completed'
                            ? 'ready'
                            : stage.status === 'in_progress'
                              ? 'progress'
                              : 'low'
                        }
                      >
                        {stage.status === 'completed'
                          ? 'Готово'
                          : stage.status === 'in_progress'
                            ? 'В работе'
                            : 'Ожидает'}
                      </StatusPill>
                    </div>
                  </div>

                  <div className="mt-4">
                    <ProgressBar
                      value={
                        stage.status === 'completed'
                          ? 1
                          : stage.status === 'in_progress'
                            ? resolved.stages.find((item) => item.id === stage.id)?.progress ?? 0.25
                            : 0
                      }
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </Panel>

          <div className="space-y-6">
            <Panel className="rounded-[30px] p-5">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-[rgba(208,154,58,0.14)] p-3 text-[var(--surface-dark)]">
                  <Clock3 size={20} />
                </div>
                <div>
                  <div className="font-semibold text-[var(--ink-950)]">Как это показать в демо</div>
                  <div className="text-sm text-[var(--ink-700)]">
                    {activeBranch === 'kp'
                      ? 'Сценарий ведёт к черновику КП без мгновенной подстановки кейса'
                      : 'Сценарий демонстрирует путь от вводных к черновику ТЗ'}
                  </div>
                </div>
              </div>
              <ul className="mt-4 space-y-3 text-sm leading-7 text-[var(--ink-800)]">
                <li>1. Сначала пользователь проходит пустые этапы и при желании включает локальные демо-заглушки.</li>
                <li>2. Затем на этом экране вручную запускает демонстрацию процесса сборки.</li>
                <li>3. После сборки можно сразу открыть редактор или перейти к экрану согласования.</li>
              </ul>
            </Panel>

            <Panel className="rounded-[30px] p-5">
              <div className="flex items-center gap-3">
                <LoaderCircle size={18} className="text-[var(--brand-700)]" />
                <div className="font-semibold text-[var(--ink-950)]">Что делать дальше</div>
              </div>
              <div className="mt-4 flex flex-col gap-3">
                <Link
                  to={draftPath(activeBranch, demoCase.draftId)}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-[var(--border-soft)] bg-[var(--surface-muted)] px-4 py-2.5 text-sm font-semibold text-[var(--ink-950)]"
                >
                  Открыть редактор
                  <ArrowRight size={15} />
                </Link>
                <Link
                  to={approvePath(activeBranch, demoCase.approvalId)}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-[var(--border-soft)] bg-transparent px-4 py-2.5 text-sm font-semibold text-[var(--ink-700)]"
                >
                  Сразу показать итог на согласовании
                </Link>
              </div>
            </Panel>
          </div>
        </section>
      ) : (
        <Panel className="rounded-[34px] p-8">
          <div className="max-w-3xl">
            <div className="text-2xl font-semibold text-[var(--ink-950)]">Нейтральное состояние экрана сборки</div>
            <p className="mt-3 text-base leading-8 text-[var(--ink-800)]">
              Здесь пока нет заранее подставленного таймлайна, готового документа или реального кейса. После
              нажатия на «Демонстрационный вариант» можно показать пример прогресса и затем перейти в редактор.
            </p>
          </div>
        </Panel>
      )}
    </div>
  )
}
