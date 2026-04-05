import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, FileSpreadsheet, FileText, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { WorkspaceSidebar } from '../components/WorkspaceSidebar'
import { Button, Eyebrow, Panel, buttonStyles } from '../components/ui'
import { useDemo } from '../context/DemoContext'
import { defaultCaseStagePath } from '../lib/routes'
import type { DemoDocumentType } from '../types/demo'

export function DashboardPage() {
  const navigate = useNavigate()
  const [pendingBranch, setPendingBranch] = useState<DemoDocumentType | null>(null)
  const [pipelineName, setPipelineName] = useState('')
  const {
    state: { cases, branchLaunch, recentOperations, selectedDocumentType },
    startPipeline,
    resetDemo,
  } = useDemo()

  const anchorCase = cases.find((demoCase) => demoCase.isAnchor) ?? cases[0]
  const activeBranchLabel = useMemo(
    () =>
      pendingBranch === 'kp' ? 'Коммерческое предложение' : 'Техническое задание',
    [pendingBranch],
  )
  const sidebarBranch = branchLaunch[selectedDocumentType].started
    ? selectedDocumentType
    : branchLaunch.kp.started
      ? 'kp'
      : 'tz'
  const pipelineLinks = (['kp', 'tz'] as const)
    .filter((branch) => branchLaunch[branch].started && anchorCase)
    .map((branch) => ({
      branch,
      pipelineName: branchLaunch[branch].pipelineName,
      to: defaultCaseStagePath(branch, anchorCase.id),
    }))

  function openStartModal(branch: DemoDocumentType) {
    setPendingBranch(branch)
    setPipelineName('')
  }

  function closeStartModal() {
    setPendingBranch(null)
    setPipelineName('')
  }

  function handleStart() {
    if (!pendingBranch || !anchorCase) {
      return
    }

    startPipeline(pendingBranch, pipelineName)
    closeStartModal()
    navigate(defaultCaseStagePath(pendingBranch, anchorCase.id))
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="ambient-orb ambient-orb-cyan absolute left-[-8%] top-[-4%] h-[22rem] w-[22rem] animate-[ambient-float_14s_ease-in-out_infinite]" />
        <div className="ambient-orb ambient-orb-gold absolute right-[-6%] top-20 h-[24rem] w-[24rem] animate-[ambient-float_16s_ease-in-out_infinite]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(199,155,88,0.08),transparent_34%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,248,234,0.04),transparent_20%,transparent_84%,rgba(255,248,234,0.018))]" />
        <div className="paper-grid absolute inset-0 opacity-35" />
      </div>

      <div className="relative mx-auto flex min-h-screen w-full max-w-[1600px] gap-5 px-4 py-4 md:px-6">
        <div className="hidden w-[332px] shrink-0 xl:block">
          <WorkspaceSidebar
            branch={sidebarBranch}
            pipelineName={branchLaunch[sidebarBranch].pipelineName}
            operations={recentOperations}
            pipelineLinks={pipelineLinks}
            onReset={resetDemo}
          />
        </div>

        <main className="flex min-w-0 flex-1 items-start justify-center py-8 md:py-12">
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="w-full space-y-8"
          >
            <div className="mx-auto max-w-4xl text-center">
              <Eyebrow>Экран 1</Eyebrow>
              <h1 className="display-title mt-5 text-5xl text-[var(--ink-950)] md:text-7xl">
                С чего начинаем: КП или ТЗ?
              </h1>
              <p className="mt-5 text-base leading-8 text-[var(--ink-800)] md:text-lg">
                Выберите ветку работы и запустите демонстрационный пайплайн в оформлении
                приватного ИИ-рабочего пространства.
              </p>
            </div>

            <div className="grid gap-6 xl:grid-cols-2">
              <Panel tone="highlight" className="rounded-[36px] p-7 md:p-8">
                <div className="flex items-start justify-between gap-4">
                  <div className="accent-icon-block rounded-[24px] p-4">
                    <FileSpreadsheet size={30} />
                  </div>
                  <div className="metal-pill rounded-full px-4 py-2 text-sm text-[var(--ink-700)]">
                    Ветка для коммерции
                  </div>
                </div>

                <h2 className="display-section-title mt-6 text-4xl text-[var(--ink-950)]">
                  Коммерческое предложение
                </h2>
                <p className="mt-3 max-w-xl text-sm leading-7 text-[var(--ink-800)]">
                  Витрина для коммерческого сценария с номенклатурой, ценами и премиальной
                  подачей финального результата.
                </p>

                {branchLaunch.kp.started ? (
                  <div className="surface-note mt-5 rounded-[22px] px-4 py-3 text-sm text-[var(--ink-700)]">
                    Текущий пайплайн:{' '}
                    <span className="font-semibold text-[var(--ink-950)]">
                      {branchLaunch.kp.pipelineName}
                    </span>
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

              <Panel tone="gold" className="rounded-[36px] p-7 md:p-8">
                <div className="flex items-start justify-between gap-4">
                  <div className="accent-icon-block rounded-[24px] p-4 text-[var(--accent-amber-strong)]">
                    <FileText size={30} />
                  </div>
                  <div className="metal-pill rounded-full px-4 py-2 text-sm text-[var(--ink-700)]">
                    Ветка для техзадания
                  </div>
                </div>

                <h2 className="display-section-title mt-6 text-4xl text-[var(--ink-950)]">
                  Техническое задание
                </h2>
                <p className="mt-3 max-w-xl text-sm leading-7 text-[var(--ink-800)]">
                  Инженерная ветка с нормами, измерениями и строгой документной логикой для
                  демонстрации зрелости решения.
                </p>

                {branchLaunch.tz.started ? (
                  <div className="surface-note mt-5 rounded-[22px] px-4 py-3 text-sm text-[var(--ink-700)]">
                    Текущий пайплайн:{' '}
                    <span className="font-semibold text-[var(--ink-950)]">
                      {branchLaunch.tz.pipelineName}
                    </span>
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
          </motion.section>
        </main>
      </div>

      {pendingBranch ? (
        <div className="modal-backdrop fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="frosted panel-outline w-full max-w-md rounded-[30px] p-6 shadow-[var(--shadow-soft)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--ink-500)]">
                  Новый пайплайн
                </div>
                <h3 className="display-section-title mt-2 text-3xl text-[var(--ink-950)]">
                  {activeBranchLabel}
                </h3>
              </div>
              <button
                onClick={closeStartModal}
                className="rounded-full border border-[var(--border-soft)] bg-[rgba(255,248,234,0.02)] p-2 text-[var(--ink-700)] transition hover:border-[var(--border-strong)] hover:bg-[var(--surface-muted)]"
                aria-label="Закрыть окно"
              >
                <X size={16} />
              </button>
            </div>

            <label className="mt-6 block">
              <div className="text-sm font-semibold text-[var(--ink-950)]">
                Название пайплайна
              </div>
              <input
                autoFocus
                value={pipelineName}
                onChange={(event) => setPipelineName(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    handleStart()
                  }
                }}
                placeholder="Например: КП для входной зоны"
                className="executive-input mt-3 w-full px-4 py-3 text-sm text-[var(--ink-950)]"
              />
            </label>

            <div className="mt-6 flex items-center justify-end gap-3">
              <Button variant="ghost" onClick={closeStartModal}>
                Отмена
              </Button>
              <Button onClick={handleStart}>
                Создать
                <ArrowRight size={16} />
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
