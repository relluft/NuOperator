import { AlertCircle, ArrowRight, Link2, PencilLine, Sparkles } from 'lucide-react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { DocumentPreview } from '../components/DocumentPreview'
import { Button, Eyebrow, Panel, StatusPill } from '../components/ui'
import { useDemo } from '../context/DemoContext'
import { exportPath } from '../lib/routes'
import { getBranchLabel } from '../lib/workflow'
import type { DemoDocumentType, DemoPageKey } from '../types/demo'

function resolveDraftPageKey(branch: DemoDocumentType): DemoPageKey {
  return branch === 'kp' ? 'kp-draft' : 'tz-draft'
}

function formatConfidence(confidence: 'high' | 'medium') {
  return confidence === 'high' ? 'Высокая' : 'Средняя'
}

export function DraftPage() {
  const { branch, draftId } = useParams()
  const {
    state: {
      cases,
      draft,
      selectedSectionId,
      focusedIssueId,
      branchLaunch,
      demoAppliedByPage,
    },
    applyDemoVariant,
    updateField,
    updateOfferItem,
    selectSection,
    focusIssue,
    openSectionFromSource,
  } = useDemo()

  if (branch !== 'kp' && branch !== 'tz') {
    return <Navigate to="/workspace" replace />
  }

  const activeBranch = branch as DemoDocumentType
  const demoCase = cases.find((demoCase) => demoCase.id === draft.caseId) ?? cases[0]
  const pageKey = resolveDraftPageKey(activeBranch)
  const hasDemoVariant = !!demoAppliedByPage[pageKey]
  const pipelineName = branchLaunch[activeBranch].pipelineName
  const visibleSections = hasDemoVariant
    ? draft.sections.filter((section) => section.documentType === activeBranch)
    : []

  if (!demoCase || draftId !== draft.id) {
    return null
  }

  if (activeBranch === 'kp') {
    return (
      <div className="space-y-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <Eyebrow>{getBranchLabel(activeBranch)} / Редактор</Eyebrow>

          <div className="flex flex-wrap items-center justify-end gap-3">
            <Link
              to={exportPath(activeBranch, demoCase.exportId)}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--brand-600)] px-4 py-2.5 text-sm font-semibold text-slate-950"
            >
              Перейти к экспорту
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        <DocumentPreview
          documentType={activeBranch}
          sections={visibleSections}
          offerTable={draft.offerTable}
          fields={draft.fields}
          cellAnnotations={draft.cellAnnotations}
          pipelineName={pipelineName}
          selectedSectionId={selectedSectionId}
          onUpdateOfferItem={updateOfferItem}
          onUpdateField={updateField}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Panel className="rounded-[34px] p-6 md:p-8">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr),320px]">
          <div>
            <Eyebrow>{getBranchLabel(activeBranch)} / Редактор</Eyebrow>
          </div>

          <div className="rounded-[30px] border border-[var(--border-soft)] bg-[var(--surface-strong)] p-5">
            <div className="text-sm text-[var(--ink-700)]">Состояние редактора</div>
            <div className="mt-2 text-2xl font-semibold text-[var(--ink-950)]">
              {hasDemoVariant ? 'Демонстрационный черновик' : 'Пустая рабочая оболочка'}
            </div>
            <Button className="mt-5 w-full justify-center" variant="secondary" onClick={() => applyDemoVariant(pageKey)}>
              <Sparkles size={16} />
              Демонстрационный вариант
            </Button>
          </div>
        </div>
      </Panel>

      <section className="grid gap-6 xl:grid-cols-[240px,minmax(0,1fr),340px]">
        <Panel className="rounded-[32px] p-4">
          <div className="flex items-center gap-2">
            <PencilLine size={17} className="text-[var(--brand-700)]" />
            <div className="font-semibold text-[var(--ink-950)]">Структура документа</div>
          </div>
          {visibleSections.length ? (
            <div className="mt-4 space-y-2">
              {visibleSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => selectSection(section.id)}
                  className={`w-full rounded-[20px] border px-4 py-3 text-left transition ${
                    selectedSectionId === section.id
                      ? 'border-[var(--brand-500)] bg-[var(--surface-strong)] text-[var(--ink-950)] shadow-sm'
                      : 'border-[var(--border-soft)] bg-[var(--surface-muted)] text-[var(--ink-700)]'
                  }`}
                >
                  <div className="font-semibold">{section.title}</div>
                  <div className="mt-1 text-sm leading-6">{section.summary}</div>
                </button>
              ))}
            </div>
          ) : (
            <div className="mt-4 rounded-[22px] border border-dashed border-[var(--border-strong)] bg-[var(--surface-muted)] p-4 text-sm leading-7 text-[var(--ink-700)]">
              Пока пусто.
            </div>
          )}
        </Panel>

        <DocumentPreview
          documentType={activeBranch}
          sections={visibleSections}
          offerTable={null}
          fields={draft.fields}
          pipelineName={pipelineName}
          selectedSectionId={selectedSectionId}
          onSelectSection={visibleSections.length ? selectSection : undefined}
        />

        <div className="space-y-6">
          <Panel className="rounded-[32px] p-5">
            <div className="font-semibold text-[var(--ink-950)]">Редактируемые поля</div>
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
                      className="mt-3 w-full rounded-2xl border border-[var(--border-soft)] bg-[var(--surface-muted)] px-4 py-3 text-sm text-[var(--ink-950)] outline-none transition focus:border-[var(--brand-500)]"
                    />
                  ) : (
                    <input
                      value={field.value}
                      onChange={(event) => updateField(field.id, event.target.value)}
                      className="mt-3 w-full rounded-2xl border border-[var(--border-soft)] bg-[var(--surface-muted)] px-4 py-3 text-sm text-[var(--ink-950)] outline-none transition focus:border-[var(--brand-500)]"
                    />
                  )}
                </label>
              ))}
            </div>
          </Panel>

          <Panel className="rounded-[32px] p-5">
            <div className="flex items-center gap-2">
              <AlertCircle size={17} className="text-[var(--brand-700)]" />
              <div className="font-semibold text-[var(--ink-950)]">Замечания QA</div>
            </div>
            <div className="mt-4 space-y-3">
              {hasDemoVariant ? (
                draft.issues
                  .filter((issue) => issue.relatedSectionId.startsWith(activeBranch))
                  .map((issue) => (
                    <button
                      key={issue.id}
                      onClick={() => focusIssue(issue)}
                      className={`w-full rounded-[22px] border px-4 py-4 text-left transition ${
                        focusedIssueId === issue.id
                          ? 'border-[var(--brand-500)] bg-[var(--surface-strong)] text-[var(--ink-950)]'
                          : 'border-[var(--border-soft)] bg-[var(--surface-muted)] text-[var(--ink-800)]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="font-semibold">{issue.title}</div>
                        <StatusPill tone={issue.severity}>
                          {issue.severity === 'low' ? 'Низкий' : 'Нужно подтвердить'}
                        </StatusPill>
                      </div>
                      <div className="mt-2 text-sm leading-7">{issue.summary}</div>
                    </button>
                  ))
              ) : (
                <div className="rounded-[22px] border border-dashed border-[var(--border-strong)] bg-[var(--surface-muted)] px-4 py-4 text-sm text-[var(--ink-700)]">
                  Пока пусто.
                </div>
              )}
            </div>
          </Panel>

          <Panel className="rounded-[32px] p-5">
            <div className="flex items-center gap-2">
              <Link2 size={17} className="text-[var(--brand-700)]" />
              <div className="font-semibold text-[var(--ink-950)]">Источники и обоснования</div>
            </div>
            <div className="mt-4 space-y-3">
              {hasDemoVariant ? (
                draft.sources
                  .filter((source) => source.relatedSectionId.startsWith(activeBranch))
                  .map((source) => (
                    <button
                      key={source.id}
                      onClick={() => openSectionFromSource(source.relatedSectionId)}
                      className="w-full rounded-[22px] border border-[var(--border-soft)] bg-[var(--surface-muted)] px-4 py-4 text-left transition hover:border-[var(--border-strong)]"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="font-semibold text-[var(--ink-950)]">{source.label}</div>
                        <StatusPill tone={source.confidence === 'high' ? 'ready' : 'attention'}>
                          {formatConfidence(source.confidence)}
                        </StatusPill>
                      </div>
                      <div className="mt-2 text-sm leading-7 text-[var(--ink-800)]">{source.excerpt}</div>
                    </button>
                  ))
              ) : (
                <div className="rounded-[22px] border border-dashed border-[var(--border-strong)] bg-[var(--surface-muted)] px-4 py-4 text-sm text-[var(--ink-700)]">
                  Пока пусто.
                </div>
              )}
            </div>
          </Panel>

          <Link
            to={exportPath(activeBranch, demoCase.exportId)}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--brand-600)] px-4 py-3 text-sm font-semibold text-slate-950"
          >
            Перейти к экспорту
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  )
}
