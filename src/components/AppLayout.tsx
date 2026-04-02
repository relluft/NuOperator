import { Navigate, Outlet, useLocation, useParams } from 'react-router-dom'
import { useDemo } from '../context/DemoContext'
import { branchSelectionPath } from '../lib/routes'
import { type DemoDocumentType, type DemoWorkflowStageId } from '../types/demo'
import { ProgressStepper } from './ProgressStepper'
import { WorkspaceSidebar } from './WorkspaceSidebar'

function resolveStageId(pathname: string): DemoWorkflowStageId {
  if (pathname.includes('/runs/')) {
    return 'run'
  }

  if (pathname.includes('/drafts/') || pathname.includes('/approve/')) {
    return 'editor'
  }

  const lastSegment = pathname.split('/').at(-1)
  if (lastSegment === 'source' || lastSegment === 'need' || lastSegment === 'materials' || lastSegment === 'comments') {
    return lastSegment
  }

  return 'need'
}

export function AppLayout() {
  const location = useLocation()
  const { branch, caseId, runId, draftId, approvalId } = useParams()
  const {
    state: { cases, run, draft, branchProgress, recentOperations, branchLaunch },
    resetDemo,
  } = useDemo()

  const isValidBranch = branch === 'kp' || branch === 'tz'
  const activeBranch = (isValidBranch ? branch : 'kp') as DemoDocumentType
  const activeCase =
    cases.find((demoCase) => demoCase.id === caseId) ??
    cases.find((demoCase) => demoCase.runId === runId) ??
    cases.find((demoCase) => demoCase.draftId === draftId) ??
    cases.find((demoCase) => demoCase.approvalId === approvalId) ??
    cases.find((demoCase) => demoCase.isAnchor) ??
    cases[0]
  const activeLocationStage = resolveStageId(location.pathname)

  if (!isValidBranch) {
    return <Navigate to={branchSelectionPath()} replace />
  }

  if (!branchLaunch[activeBranch].started) {
    return <Navigate to={branchSelectionPath()} replace />
  }

  if (!activeCase) {
    return <Navigate to={branchSelectionPath()} replace />
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
            branch={activeBranch}
            pipelineName={branchLaunch[activeBranch].pipelineName}
            operations={recentOperations}
            onReset={resetDemo}
          />
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <ProgressStepper
            branch={activeBranch}
            caseId={activeCase.id}
            runId={run.id}
            draftId={draft.id}
            currentStageId={activeLocationStage}
            completedStageIds={branchProgress[activeBranch].completedStageIds}
          />

          <main key={location.pathname} className="relative flex-1 pb-6">
            <Outlet key={location.pathname} />
          </main>
        </div>
      </div>
    </div>
  )
}
