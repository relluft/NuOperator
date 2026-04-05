import { FileText, Sparkles } from 'lucide-react'
import { brandConfig } from '../config/brand'
import { renderTemplate } from '../lib/utils'
import type {
  DemoDocumentType,
  DemoOfferTable,
  DraftCellAnnotation,
  DraftCellId,
  DraftField,
  DraftSection,
  OfferItemEditableField,
} from '../types/demo'
import { KpOfferTableEditor } from './KpOfferTableEditor'
import { Panel, StatusPill } from './ui'

const documentLabels: Record<DemoDocumentType, string> = {
  kp: 'Коммерческое предложение',
  tz: 'Техническое задание',
}

export function DocumentPreview({
  documentType,
  sections,
  offerTable,
  fields,
  cellAnnotations = {},
  pipelineName,
  selectedSectionId,
  onSelectSection,
  onUpdateOfferItem,
  onUpdateField,
  readOnly = false,
}: {
  documentType: DemoDocumentType
  sections: DraftSection[]
  offerTable?: DemoOfferTable | null
  fields: DraftField[]
  cellAnnotations?: Partial<Record<DraftCellId, DraftCellAnnotation>>
  pipelineName: string
  selectedSectionId: string
  onSelectSection?: (sectionId: string) => void
  onUpdateOfferItem?: (itemId: string, field: OfferItemEditableField, value: string) => void
  onUpdateField?: (fieldId: DraftField['id'], value: string) => void
  readOnly?: boolean
}) {
  if (documentType === 'kp') {
    return (
      <KpOfferTableEditor
        offerTable={offerTable ?? null}
        fields={fields}
        cellAnnotations={cellAnnotations}
        editable={!readOnly}
        onUpdateOfferItem={onUpdateOfferItem}
        onUpdateField={onUpdateField}
      />
    )
  }

  const filledFields = fields.filter((field) => field.value.trim())

  return (
    <div className="document-paper rounded-[34px] border border-[var(--border-soft)] p-6 md:p-8">
      <div className="relative flex flex-col gap-4 border-b border-[var(--paper-line)] pb-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div className="space-y-2">
            <span className="metal-pill inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold text-[var(--ink-700)]">
              <Sparkles size={14} className="text-[var(--accent-amber-strong)]" />
              {brandConfig.documentHeader}
            </span>
            <div>
              <h2 className="display-section-title text-4xl text-[var(--ink-950)] md:text-[2.6rem]">
                {documentLabels[documentType]}
              </h2>
              <p className="mt-2 max-w-3xl text-sm leading-7 text-[var(--ink-700)]">
                Пайплайн:{' '}
                <span className="font-semibold text-[var(--ink-950)]">{pipelineName}</span>
              </p>
            </div>
          </div>
          <StatusPill tone={readOnly ? 'ready' : 'progress'}>
            {readOnly ? 'Режим согласования' : 'Редактируемый черновик'}
          </StatusPill>
        </div>

        {filledFields.length ? (
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {filledFields.map((field) => (
              <div key={field.id} className="executive-card rounded-[22px] px-4 py-3">
                <div className="relative">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--ink-500)]">
                    {field.label}
                  </div>
                  <div className="mt-2 text-sm font-semibold text-[var(--ink-950)]">
                    {field.value}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>

      <div className="mt-6 space-y-5">
        {sections.length ? (
          sections.map((section) => (
            <Panel
              key={section.id}
              onClick={() => onSelectSection?.(section.id)}
              tone={selectedSectionId === section.id ? 'highlight' : 'default'}
              className={`${onSelectSection ? 'cursor-pointer' : 'cursor-default'} rounded-[28px] bg-[rgba(17,14,12,0.78)] p-5 transition-all`}
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[var(--ink-500)]">
                    <FileText size={16} />
                    <span className="text-xs font-semibold uppercase tracking-[0.18em]">
                      {documentLabels[documentType]}
                    </span>
                  </div>
                  <h3 className="display-section-title text-3xl text-[var(--ink-950)]">
                    {section.title}
                  </h3>
                  <p className="max-w-3xl text-sm leading-7 text-[var(--ink-700)]">
                    {section.summary}
                  </p>
                </div>
                {section.stats ? (
                  <div className="grid gap-2 sm:grid-cols-2">
                    {section.stats.map((stat) => (
                      <div
                        key={`${section.id}-${stat.label}`}
                        className="executive-card rounded-[20px] px-4 py-3"
                      >
                        <div className="relative">
                          <div className="text-xs text-[var(--ink-500)]">{stat.label}</div>
                          <div className="mt-1 text-sm font-semibold text-[var(--ink-950)]">
                            {renderTemplate(stat.value, fields, { pipelineName })}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>

              <div className="mt-5 space-y-3 text-[15px] leading-8 text-[var(--ink-800)]">
                {section.content.map((paragraph) => (
                  <p key={`${section.id}-${paragraph.slice(0, 12)}`}>
                    {renderTemplate(paragraph, fields, { pipelineName })}
                  </p>
                ))}
              </div>
            </Panel>
          ))
        ) : (
          <Panel className="surface-dashed rounded-[24px] p-6 text-sm leading-7 text-[var(--ink-700)]">
            Пока пусто.
          </Panel>
        )}
      </div>
    </div>
  )
}
