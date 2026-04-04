import { BrowserRouter, Navigate, Route, Routes, useParams } from 'react-router-dom'
import { AppLayout } from './components/AppLayout'
import { DemoProvider } from './context/DemoContext'
import { branchSelectionPath, workspaceBasePath } from './lib/routes'
import { CasePage } from './pages/CasePage'
import { DashboardPage } from './pages/DashboardPage'
import { DraftPage } from './pages/DraftPage'
import { ExportPage } from './pages/ExportPage'
import { LandingPage } from './pages/LandingPage'
import { RunPage } from './pages/RunPage'

function LegacyWorkspaceRedirect() {
  return <Navigate to={branchSelectionPath()} replace />
}

function BranchGuard() {
  const { branch } = useParams()

  if (branch !== 'kp' && branch !== 'tz') {
    return <Navigate to={branchSelectionPath()} replace />
  }

  return <AppLayout />
}

function App() {
  return (
    <DemoProvider>
      <BrowserRouter>
        <Routes>
          <Route index element={<LandingPage />} />
          <Route path={workspaceBasePath} element={<DashboardPage />} />

          <Route path={`${workspaceBasePath}/:branch`} element={<BranchGuard />}>
            <Route path="cases/:caseId/:stageId" element={<CasePage />} />
            <Route path="runs/:runId" element={<RunPage />} />
            <Route path="drafts/:draftId" element={<DraftPage />} />
            <Route path="export/:exportId" element={<ExportPage />} />
          </Route>

          <Route path="/cases/:caseId" element={<Navigate to={branchSelectionPath()} replace />} />
          <Route path="/runs/:runId" element={<Navigate to={branchSelectionPath()} replace />} />
          <Route path="/drafts/:draftId" element={<Navigate to={branchSelectionPath()} replace />} />
          <Route path="/export/:exportId" element={<Navigate to={branchSelectionPath()} replace />} />
          <Route path={`${workspaceBasePath}/cases/:caseId`} element={<LegacyWorkspaceRedirect />} />
          <Route path={`${workspaceBasePath}/runs/:runId`} element={<LegacyWorkspaceRedirect />} />
          <Route path={`${workspaceBasePath}/drafts/:draftId`} element={<LegacyWorkspaceRedirect />} />
          <Route path={`${workspaceBasePath}/export/:exportId`} element={<LegacyWorkspaceRedirect />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </DemoProvider>
  )
}

export default App
