import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, FileCog, FileSpreadsheet, FileText, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button, Eyebrow, Panel, buttonStyles } from '../components/ui'
import { brandConfig } from '../config/brand'
import { useDemo } from '../context/DemoContext'
import { defaultCaseStagePath } from '../lib/routes'
import type { DemoDocumentType } from '../types/demo'

export function DashboardPage() {
  const navigate = useNavigate()
  const [pendingBranch, setPendingBranch] = useState<DemoDocumentType | null>(null)
  const [pipelineName, setPipelineName] = useState('')
  const [showError, setShowError] = useState(false)
  const {
    state: { cases, branchLaunch },
    startPipeline,
  } = useDemo()

  const anchorCase = cases.find((demoCase) => demoCase.isAnchor) ?? cases[0]
  const activeBranchLabel = useMemo(
    () => (pendingBranch === 'kp' ? 'Коммерческое предложение' : 'Техническое задание'),
    [pendingBranch],
  )

  function openStartModal(branch: DemoDocumentType) {
    setPendingBranch(branch)
    setPipelineName('')
    setShowError(false)
  }

  function closeStartModal() {
    setPendingBranch(null)
    setPipelineName('')
    setShowError(false)
  }

  function handleStart() {
    if (!pendingBranch || !anchorCase) {
      return
    }

    if (!pipelineName.trim()) {
      setShowError(true)
      return
    }

    startPipeline(pendingBranch, pipelineName)
    closeStartModal()
    navigate(defaultCaseStagePath(pendingBranch, anchorCase.id))
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-8%] top-[-4%] h-72 w-72 rounded-full bg-[rgba(78,149,188,0.2)] blur-3xl" />
        <div className="absolute right-[-6%] top-20 h-80 w-80 rounded-full bg-[rgba(213,159,78,0.14)] blur-3xl" />
        <div className="paper-grid absolute inset-0 opacity-45" />
      </div>

      <div className="relative mx-auto flex min-h-screen w-full max-w-[1520px] flex-col px-4 py-4 md:px-6">
        <header className="flex items-center gap-4 py-4 md:py-6">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--brand-600)] text-lg font-semibold text-slate-950 shadow-lg shadow-cyan-950/20">
            {brandConfig.logo}
          </div>
          <div>
            <div className="text-2xl font-semibold tracking-tight text-[var(--ink-950)]">
              {brandConfig.companyName}
            </div>
            <div className="text-sm text-[var(--ink-700)]">Выберите формат работы</div>
          </div>
        </header>

        <main className="flex flex-1 items-center justify-center py-8 md:py-12">
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="w-full space-y-8"
          >
            <div className="mx-auto max-w-3xl text-center">
              <Eyebrow>Экран 1</Eyebrow>
              <h1 className="mt-5 text-4xl font-semibold tracking-tight text-[var(--ink-950)] md:text-6xl">
                С чего начинаем: КП или ТЗ?
              </h1>
              <p className="mt-5 text-base leading-8 text-[var(--ink-800)] md:text-xl">
                Перед входом в сценарий пользователь даёт название пайплайну, после чего проходит по шагам
                сверху вниз: потребность, материалы, вводные, сборка и финальная проверка.
              </p>
            </div>

            <div className="grid gap-6 xl:grid-cols-2">
              <Panel className="rounded-[36px] p-7 md:p-8">
                <div className="flex items-start justify-between gap-4">
                  <div className="rounded-[24px] bg-[rgba(78,149,188,0.16)] p-4 text-[var(--brand-700)]">
                    <FileSpreadsheet size={30} />
                  </div>
                  <div className="rounded-full border border-[var(--border-soft)] bg-[var(--surface-muted)] px-4 py-2 text-sm text-[var(--ink-700)]">
                    Ветка для коммерции
                  </div>
                </div>

                <h2 className="mt-6 text-3xl font-semibold text-[var(--ink-950)]">
                  Коммерческое предложение
                </h2>
                <p className="mt-4 max-w-2xl text-base leading-8 text-[var(--ink-800)]">
                  Подходит, когда нужно собрать понятное КП с фокусом на задаче проекта, входных материалах
                  и свободных вводных для последующей генерации.
                </p>

                <div className="mt-6 space-y-3 text-sm leading-7 text-[var(--ink-800)]">
                  <div className="rounded-[24px] border border-[var(--border-soft)] bg-[var(--surface-muted)] px-4 py-4">
                    1. Сначала пользователь называет пайплайн и фиксирует потребность проекта.
                  </div>
                  <div className="rounded-[24px] border border-[var(--border-soft)] bg-[var(--surface-muted)] px-4 py-4">
                    2. Затем добавляет материалы и свободные вводные без привязки к персональным данным.
                  </div>
                  <div className="rounded-[24px] border border-[var(--border-soft)] bg-[var(--surface-muted)] px-4 py-4">
                    3. На выходе получает обезличенный черновик, который можно показать в демо.
                  </div>
                </div>

                {branchLaunch.kp.started ? (
                  <div className="mt-5 rounded-[22px] border border-[var(--border-soft)] bg-[var(--surface-muted)] px-4 py-3 text-sm text-[var(--ink-700)]">
                    Текущий пайплайн: <span className="font-semibold text-[var(--ink-950)]">{branchLaunch.kp.pipelineName}</span>
                  </div>
                ) : null}

                <button
                  onClick={() => openStartModal('kp')}
                  className={`mt-8 inline-flex ${buttonStyles('primary')} px-6 py-3 text-base`}
                >
                  Начать работу над КП
                  <ArrowRight size={18} />
                </button>
              </Panel>

              <Panel className="rounded-[36px] p-7 md:p-8">
                <div className="flex items-start justify-between gap-4">
                  <div className="rounded-[24px] bg-[rgba(213,159,78,0.16)] p-4 text-[var(--accent-amber-strong)]">
                    <FileText size={30} />
                  </div>
                  <div className="rounded-full border border-[var(--border-soft)] bg-[var(--surface-muted)] px-4 py-2 text-sm text-[var(--ink-700)]">
                    Ветка для техзадания
                  </div>
                </div>

                <h2 className="mt-6 text-3xl font-semibold text-[var(--ink-950)]">
                  Техническое задание
                </h2>
                <p className="mt-4 max-w-2xl text-base leading-8 text-[var(--ink-800)]">
                  Подходит, когда нужно показать переход от нейтральной основы к ТЗ с измеримыми параметрами,
                  технической целью и итоговым обезличенным черновиком.
                </p>

                <div className="mt-6 space-y-3 text-sm leading-7 text-[var(--ink-800)]">
                  <div className="rounded-[24px] border border-[var(--border-soft)] bg-[var(--surface-muted)] px-4 py-4">
                    1. Сначала пользователь называет пайплайн и при необходимости выбирает основу из КП.
                  </div>
                  <div className="rounded-[24px] border border-[var(--border-soft)] bg-[var(--surface-muted)] px-4 py-4">
                    2. Затем адаптирует цель и добавляет измеримые параметры с техническими вводными.
                  </div>
                  <div className="rounded-[24px] border border-[var(--border-soft)] bg-[var(--surface-muted)] px-4 py-4">
                    3. На выходе получает демонстрационный черновик ТЗ без чувствительных данных.
                  </div>
                </div>

                {branchLaunch.tz.started ? (
                  <div className="mt-5 rounded-[22px] border border-[var(--border-soft)] bg-[var(--surface-muted)] px-4 py-3 text-sm text-[var(--ink-700)]">
                    Текущий пайплайн: <span className="font-semibold text-[var(--ink-950)]">{branchLaunch.tz.pipelineName}</span>
                  </div>
                ) : null}

                <button
                  onClick={() => openStartModal('tz')}
                  className={`mt-8 inline-flex ${buttonStyles('secondary')} px-6 py-3 text-base`}
                >
                  Начать работу над ТЗ
                  <ArrowRight size={18} />
                </button>
              </Panel>
            </div>

            <Panel className="rounded-[34px] p-6">
              <div className="flex items-start gap-4">
                <div className="rounded-[22px] bg-[rgba(78,149,188,0.16)] p-3 text-[var(--brand-700)]">
                  <FileCog size={22} />
                </div>
                <div>
                  <div className="text-lg font-semibold text-[var(--ink-950)]">
                    Интерфейс ведёт по шагам без лишней перегрузки
                  </div>
                  <div className="mt-2 max-w-4xl text-sm leading-7 text-[var(--ink-800)]">
                    Сверху остаётся шкала прогресса, слева история действий, а на каждом экране виден только
                    тот блок данных, который нужен именно на текущем шаге. Демонстрационные заглушки
                    подставляются только по отдельной маленькой кнопке.
                  </div>
                </div>
              </div>
            </Panel>
          </motion.section>
        </main>
      </div>

      {pendingBranch ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(4,10,15,0.72)] px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[28px] border border-[var(--border-soft)] bg-[var(--surface-strong)] p-6 shadow-[var(--shadow-soft)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--ink-500)]">
                  Новый пайплайн
                </div>
                <h3 className="mt-2 text-2xl font-semibold text-[var(--ink-950)]">{activeBranchLabel}</h3>
                <p className="mt-3 text-sm leading-7 text-[var(--ink-800)]">
                  Перед стартом укажите название пайплайна. Оно будет использоваться на всех следующих экранах.
                </p>
              </div>
              <button
                onClick={closeStartModal}
                className="rounded-full border border-[var(--border-soft)] p-2 text-[var(--ink-700)] transition hover:bg-[var(--surface-muted)]"
                aria-label="Закрыть окно"
              >
                <X size={16} />
              </button>
            </div>

            <label className="mt-6 block">
              <div className="text-sm font-semibold text-[var(--ink-950)]">Название пайплайна</div>
              <input
                autoFocus
                value={pipelineName}
                onChange={(event) => {
                  setPipelineName(event.target.value)
                  if (showError && event.target.value.trim()) {
                    setShowError(false)
                  }
                }}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    handleStart()
                  }
                }}
                placeholder="Например: КП для входной зоны"
                className="mt-3 w-full rounded-[20px] border border-[var(--border-soft)] bg-[var(--surface-muted)] px-4 py-3 text-sm text-[var(--ink-950)] outline-none transition focus:border-[var(--brand-500)]"
              />
            </label>

            {showError ? (
              <div className="mt-3 text-sm text-[var(--accent-amber-strong)]">
                Укажите название пайплайна, чтобы продолжить.
              </div>
            ) : null}

            <div className="mt-6 flex items-center justify-end gap-3">
              <Button variant="ghost" onClick={closeStartModal}>
                Отмена
              </Button>
              <Button onClick={handleStart}>
                Запустить пайплайн
                <ArrowRight size={16} />
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
