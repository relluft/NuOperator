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
    () => (pendingBranch === 'kp' ? 'Коммерческое предложение' : 'Техническое задание'),
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
        <div className="absolute left-[-8%] top-[-4%] h-72 w-72 rounded-full bg-[rgba(78,149,188,0.2)] blur-3xl" />
        <div className="absolute right-[-6%] top-20 h-80 w-80 rounded-full bg-[rgba(213,159,78,0.14)] blur-3xl" />
        <div className="paper-grid absolute inset-0 opacity-45" />
      </div>

      <div className="relative mx-auto flex min-h-screen w-full max-w-[1600px] gap-4 px-4 py-4 md:px-6">
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
            <div className="mx-auto max-w-3xl text-center">
              <Eyebrow>Экран 1</Eyebrow>
              <h1 className="mt-5 text-4xl font-semibold tracking-tight text-[var(--ink-950)] md:text-6xl">
                С чего начинаем: КП или ТЗ?
              </h1>
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
                onChange={(event) => setPipelineName(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    handleStart()
                  }
                }}
                placeholder="Например: КП для входной зоны"
                className="mt-3 w-full rounded-[20px] border border-[var(--border-soft)] bg-[var(--surface-muted)] px-4 py-3 text-sm text-[var(--ink-950)] outline-none transition focus:border-[var(--brand-500)]"
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
