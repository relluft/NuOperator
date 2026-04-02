import { BadgeCheck, Download, FileCheck2, FileSpreadsheet, FileText, PenSquare, Sparkles } from 'lucide-react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { DocumentPreview } from '../components/DocumentPreview'
import { ExportPreviewModal } from '../components/ExportPreviewModal'
import { brandConfig } from '../config/brand'
import { Button, Eyebrow, Panel, StatusPill } from '../components/ui'
import { useDemo } from '../context/DemoContext'
import { draftPath } from '../lib/routes'
import { getBranchLabel } from '../lib/workflow'
import type { DemoDocumentType, DemoPageKey } from '../types/demo'

function resolveApprovePageKey(branch: DemoDocumentType): DemoPageKey {
  return branch === 'kp' ? 'kp-approve' : 'tz-approve'
}

export function ApprovePage() {
  const { branch, approvalId } = useParams()
  const {
    state: {
      cases,
      draft,
      run,
      exportArtifacts,
      previewArtifact,
      approvalSent,
      selectedSourceKpId,
      branchLaunch,
      demoAppliedByPage,
    },
    applyDemoVariant,
    registerExport,
    closeExportPreview,
    sendForSignature,
  } = useDemo()

  if (branch !== 'kp' && branch !== 'tz') {
    return <Navigate to="/workspace" replace />
  }

  const activeBranch = branch as DemoDocumentType
  const demoCase = cases.find((demoCase) => demoCase.approvalId === approvalId) ?? cases[0]
  const pageKey = resolveApprovePageKey(activeBranch)
  const hasDemoVariant = !!demoAppliedByPage[pageKey]
  const pipelineName = branchLaunch[activeBranch].pipelineName
  const previewSections = hasDemoVariant
    ? draft.sections.filter((section) => section.documentType === activeBranch)
    : []

  if (!demoCase || approvalId !== demoCase.approvalId) {
    return null
  }

  return (
    <>
      <div className="space-y-6">
        <Panel className="rounded-[34px] p-6 md:p-8">
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr),360px]">
            <div className="space-y-5">
              <Eyebrow>{getBranchLabel(activeBranch)} / Согласование</Eyebrow>
              <div>
                <h2 className="text-4xl font-semibold tracking-tight text-[var(--ink-950)]">{pipelineName}</h2>
                <p className="mt-3 max-w-3xl text-base leading-8 text-[var(--ink-800)]">
                  {hasDemoVariant
                    ? activeBranch === 'kp'
                      ? 'На этом экране руководитель видит обезличенный итог по коммерческому сценарию, историю экспорта и может показать финальный шаг без раскрытия чувствительных данных.'
                      : selectedSourceKpId
                        ? 'На этом экране руководитель видит обезличенный итог по техническому сценарию, собранному на базе нейтральной основы.'
                        : 'На этом экране руководитель видит обезличенный итог по техническому сценарию без выбранной основы.'
                    : 'Экран согласования больше не открывается сразу с готовым наполненным результатом. Сначала пользователь видит нейтральное состояние и только потом по кнопке показывает демонстрационный итог.'}
                </p>
              </div>

              {approvalSent ? (
                <div className="rounded-[26px] border border-emerald-500/30 bg-emerald-500/12 p-5 text-sm leading-7 text-emerald-200">
                  Финальный пакет передан в статус согласования. При необходимости можно вернуться к любому
                  предыдущему шагу и скорректировать обезличенные вводные.
                </div>
              ) : null}

              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-[24px] border border-[var(--border-soft)] bg-[var(--surface-muted)] p-4">
                  <div className="text-xs uppercase tracking-[0.16em] text-[var(--ink-500)]">Пайплайн</div>
                  <div className="mt-2 text-lg font-semibold text-[var(--ink-950)]">{pipelineName}</div>
                </div>
                <div className="rounded-[24px] border border-[var(--border-soft)] bg-[var(--surface-muted)] p-4">
                  <div className="text-xs uppercase tracking-[0.16em] text-[var(--ink-500)]">Срок</div>
                  <div className="mt-2 text-lg font-semibold text-[var(--ink-950)]">
                    {draft.fields.find((field) => field.id === 'dueDate')?.value || 'Заполняется позже'}
                  </div>
                </div>
                <div className="rounded-[24px] border border-[var(--border-soft)] bg-[var(--surface-muted)] p-4">
                  <div className="text-xs uppercase tracking-[0.16em] text-[var(--ink-500)]">Готовность</div>
                  <div className="mt-2 text-lg font-semibold text-[var(--ink-950)]">
                    {hasDemoVariant
                      ? run.status === 'completed'
                        ? 'Можно выгружать'
                        : 'Демо открыто'
                      : 'Ожидает демонстрации'}
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[30px] border border-[var(--border-soft)] bg-[var(--surface-strong)] p-5">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-[rgba(78,149,188,0.12)] p-3 text-[var(--brand-700)]">
                  <Sparkles size={20} />
                </div>
                <div>
                  <div className="font-semibold text-[var(--ink-950)]">Демо финального шага</div>
                  <div className="text-sm text-[var(--ink-700)]">Включается отдельно и только на этом экране</div>
                </div>
              </div>

              <div className="mt-5 rounded-[22px] border border-dashed border-[var(--border-strong)] bg-[var(--surface-muted)] px-4 py-4 text-sm leading-7 text-[var(--ink-700)]">
                После нажатия на кнопку появятся обезличенное summary, превью документа и пример истории
                экспорта.
              </div>

              <Button className="mt-5 w-full justify-center" variant="secondary" onClick={() => applyDemoVariant(pageKey)}>
                <Sparkles size={16} />
                Демонстрационный вариант
              </Button>
            </div>
          </div>
        </Panel>

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr),360px]">
          <DocumentPreview
            documentType={activeBranch}
            sections={previewSections}
            fields={draft.fields}
            pipelineName={pipelineName}
            selectedSectionId={previewSections[0]?.id ?? ''}
            readOnly
          />

          <div className="space-y-6">
            <Panel className="rounded-[32px] p-5">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-[rgba(208,154,58,0.14)] p-3 text-[var(--surface-dark)]">
                  <BadgeCheck size={20} />
                </div>
                <div>
                  <div className="font-semibold text-[var(--ink-950)]">Что здесь решает пользователь</div>
                  <div className="text-sm text-[var(--ink-700)]">Без провала в лишние детали</div>
                </div>
              </div>

              <div className="mt-5 space-y-3 text-sm leading-7 text-[var(--ink-800)]">
                <div className="rounded-2xl border border-[var(--border-soft)] bg-[var(--surface-muted)] px-4 py-3">
                  Подтвердить, что структура документа подходит для демонстрации и дальнейшей ручной доработки.
                </div>
                <div className="rounded-2xl border border-[var(--border-soft)] bg-[var(--surface-muted)] px-4 py-3">
                  Выгрузить PDF или DOCX без автоматического добавления контрагентов и персональных данных.
                </div>
                <div className="rounded-2xl border border-[var(--border-soft)] bg-[var(--surface-muted)] px-4 py-3">
                  Вернуться к любому предыдущему шагу и поправить обезличенные вводные, если это необходимо.
                </div>
              </div>
            </Panel>

            <Panel className="rounded-[32px] p-5">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-[rgba(208,154,58,0.14)] p-3 text-[var(--surface-dark)]">
                  <Download size={20} />
                </div>
                <div>
                  <div className="font-semibold text-[var(--ink-950)]">Экспорт и подпись</div>
                  <div className="text-sm text-[var(--ink-700)]">Финальные действия прямо в интерфейсе</div>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                <Button className="w-full" onClick={() => registerExport('PDF', activeBranch)}>
                  <FileText size={16} />
                  Выгрузить PDF
                </Button>
                <Button className="w-full" variant="secondary" onClick={() => registerExport('DOCX', activeBranch)}>
                  <FileSpreadsheet size={16} />
                  Выгрузить DOCX
                </Button>
                <Button className="w-full" variant="ghost" onClick={() => sendForSignature(activeBranch)}>
                  <PenSquare size={16} />
                  Отправить на подпись
                </Button>
              </div>
            </Panel>

            <Panel className="rounded-[32px] p-5">
              <div className="flex items-center gap-2">
                <FileCheck2 size={17} className="text-[var(--brand-700)]" />
                <div className="font-semibold text-[var(--ink-950)]">История экспортов</div>
              </div>
              <div className="mt-4 space-y-3">
                {hasDemoVariant && exportArtifacts.length ? (
                  exportArtifacts.map((artifact) => (
                    <div
                      key={artifact.id}
                      className="rounded-[22px] border border-[var(--border-soft)] bg-[var(--surface-muted)] px-4 py-4"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="font-semibold text-[var(--ink-950)]">{artifact.fileName}</div>
                        <StatusPill tone="ready">{artifact.format}</StatusPill>
                      </div>
                      <div className="mt-2 text-sm text-[var(--ink-700)]">
                        Сформирован через demo-export в интерфейсе {brandConfig.companyName}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-[22px] border border-dashed border-[var(--border-strong)] bg-[var(--surface-muted)] px-4 py-4 text-sm text-[var(--ink-700)]">
                    История экспортов появится после включения демонстрационного варианта или ручной выгрузки.
                  </div>
                )}
              </div>
            </Panel>

            <Link
              to={draftPath(activeBranch, demoCase.draftId)}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[var(--border-soft)] bg-[var(--surface-muted)] px-4 py-3 text-sm font-semibold text-[var(--ink-950)]"
            >
              Вернуться в редактор
            </Link>
          </div>
        </section>
      </div>

      <ExportPreviewModal artifact={previewArtifact} onClose={closeExportPreview} />
    </>
  )
}
