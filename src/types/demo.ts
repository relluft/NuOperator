export type StageStatus = 'pending' | 'in_progress' | 'completed'
export type DemoDocumentType = 'kp' | 'tz'
export type ApprovalState = 'needs_review' | 'ready' | 'approved'
export type ExportFormat = 'DOCX' | 'PDF'
export type QASeverity = 'high' | 'medium' | 'low'
export type CaseBadgeTone = 'ready' | 'progress' | 'attention'
export type DemoWorkflowStageId =
  | 'source'
  | 'need'
  | 'materials'
  | 'comments'
  | 'run'
  | 'editor'

export type DemoPageKey =
  | 'kp-need'
  | 'kp-materials'
  | 'kp-comments'
  | 'kp-run'
  | 'kp-draft'
  | 'kp-approve'
  | 'tz-source'
  | 'tz-need'
  | 'tz-comments'
  | 'tz-run'
  | 'tz-draft'
  | 'tz-approve'

export interface DemoAsset {
  id: string
  title: string
  subtitle: string
  kind: 'photo' | 'file' | 'chat'
  source: 'upload' | 'office' | 'system'
  note: string
  addedAt: string
  previewUrl?: string
  fileExtension?: string
}

export interface DemoMeasurement {
  id: string
  label: string
  value: string
  unit: string
  note: string
}

export interface DemoSourceOption {
  id: string
  title: string
  summary: string
  statusLabel: string
  badgeTone: CaseBadgeTone
}

export interface DemoCase {
  id: string
  kpRequestSummary: string
  kpContextNotes: string
  kpMaterials: DemoAsset[]
  tzRequestSummary: string
  tzTechnicalNotes: string
  tzMeasurements: DemoMeasurement[]
  runId: string
  draftId: string
  approvalId: string
  isAnchor?: boolean
}

export interface DemoStage {
  id: string
  title: string
  summary: string
  durationLabel: string
  details: string
  durationMs: number
  status: StageStatus
  progress?: number
}

export interface DemoRun {
  id: string
  caseId: string
  status: 'idle' | 'running' | 'completed'
  startedAt: number | null
  completedAt: number | null
  stages: DemoStage[]
}

export interface DraftField {
  id: 'dueDate' | 'specialTerms'
  label: string
  value: string
  hint: string
}

export interface DraftSection {
  id: string
  title: string
  summary: string
  documentType: DemoDocumentType
  content: string[]
  stats?: Array<{ label: string; value: string }>
}

export interface SourceLink {
  id: string
  label: string
  sourceType: 'norm' | 'price' | 'photo' | 'note'
  excerpt: string
  relatedSectionId: string
  confidence: 'high' | 'medium'
}

export interface QAFlag {
  id: string
  title: string
  severity: QASeverity
  summary: string
  relatedSectionId: string
}

export interface ExportArtifact {
  id: string
  format: ExportFormat
  fileName: string
  createdAt: string
  status: 'generated'
}

export interface DemoDraft {
  id: string
  caseId: string
  documentType: DemoDocumentType
  sections: DraftSection[]
  fields: DraftField[]
  issues: QAFlag[]
  sources: SourceLink[]
  approvalState: ApprovalState
}

export interface RecentOperation {
  id: string
  branch: DemoDocumentType
  title: string
  description: string
  createdAt: string
}

export interface BranchProgress {
  currentStageId: DemoWorkflowStageId
  completedStageIds: DemoWorkflowStageId[]
}

export interface PipelineLaunchState {
  started: boolean
  pipelineName: string
}

export interface DemoState {
  cases: DemoCase[]
  run: DemoRun
  draft: DemoDraft
  selectedDocumentType: DemoDocumentType
  selectedSectionId: string
  focusedIssueId: string | null
  exportArtifacts: ExportArtifact[]
  previewArtifact: ExportArtifact | null
  approvalSent: boolean
  recentOperations: RecentOperation[]
  currentBranchStage: Record<DemoDocumentType, DemoWorkflowStageId>
  branchProgress: Record<DemoDocumentType, BranchProgress>
  selectedSourceKpId: string | null
  branchLaunch: Record<DemoDocumentType, PipelineLaunchState>
  demoAppliedByPage: Partial<Record<DemoPageKey, boolean>>
}
