import type { DemoDocumentType, DemoWorkflowStageId } from '../types/demo'

export const workspaceBasePath = '/workspace'

export function branchSelectionPath() {
  return workspaceBasePath
}

export function branchRootPath(branch: DemoDocumentType) {
  return `${workspaceBasePath}/${branch}`
}

export function caseStagePath(
  branch: DemoDocumentType,
  caseId: string,
  stageId: Extract<DemoWorkflowStageId, 'source' | 'need' | 'materials' | 'comments'>,
) {
  return `${branchRootPath(branch)}/cases/${caseId}/${stageId}`
}

export function runPath(branch: DemoDocumentType, runId: string) {
  return `${branchRootPath(branch)}/runs/${runId}`
}

export function draftPath(branch: DemoDocumentType, draftId: string) {
  return `${branchRootPath(branch)}/drafts/${draftId}`
}

export function exportPath(branch: DemoDocumentType, exportId: string) {
  return `${branchRootPath(branch)}/export/${exportId}`
}

export function defaultCaseStagePath(branch: DemoDocumentType, caseId: string) {
  return caseStagePath(branch, caseId, branch === 'kp' ? 'need' : 'source')
}

export function stagePath(
  branch: DemoDocumentType,
  caseId: string,
  runId: string,
  draftId: string,
  exportId: string,
  stageId: DemoWorkflowStageId,
) {
  if (stageId === 'run') {
    return runPath(branch, runId)
  }

  if (stageId === 'editor') {
    return draftPath(branch, draftId)
  }

  if (stageId === 'export') {
    return exportPath(branch, exportId)
  }

  return caseStagePath(
    branch,
    caseId,
    stageId as Extract<DemoWorkflowStageId, 'source' | 'need' | 'materials' | 'comments'>,
  )
}
