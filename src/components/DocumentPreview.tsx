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
    <div className="document-paper rounded-[32px] border border-[var(--border-soft)] p-6 md:p-8">
      <div className="flex flex-col gap-4 border-b border-[var(--paper-line)] pb-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border-soft)] bg-[var(--surface-muted)] px-3 py-1 text-xs font-semibold text-[var(--ink-700)]">
              <Sparkles size={14} />
              {brandConfig.documentHeader}
            </span>
            <div>
              <h2 className="font-serif text-3xl leading-tight text-[var(--ink-950)]">
                {documentLabels[documentType]}
              </h2>
              <p className="mt-1 max-w-3xl text-sm text-[var(--ink-700)]">
                Пайплайн: <span className="font-semibold text-[var(--ink-950)]">{pipelineName}</span>
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
              <div
                key={field.id}
                className="rounded-2xl border border-[var(--paper-line)] bg-[rgba(18,30,44,0.72)] px-4 py-3"
              >
                <div className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--ink-500)]">
                  {field.label}
                </div>
                <div className="mt-2 text-sm font-semibold text-[var(--ink-950)]">{field.value}</div>
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
              className={`${onSelectSection ? 'cursor-pointer' : 'cursor-default'} rounded-[24px] border bg-[rgba(18,30,44,0.72)] p-5 transition-all ${
                selectedSectionId === section.id
                  ? 'border-[var(--brand-500)] shadow-lg shadow-cyan-950/10'
                  : 'border-[var(--border-soft)]'
              }`}
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[var(--ink-500)]">
                    <FileText size={16} />
                    <span className="text-xs font-semibold uppercase tracking-[0.16em]">
                      {documentLabels[documentType]}
                    </span>
                  </div>
                  <h3 className="font-serif text-2xl text-[var(--ink-950)]">{section.title}</h3>
                  <p className="max-w-3xl text-sm text-[var(--ink-700)]">{section.summary}</p>
                </div>
                {section.stats ? (
                  <div className="grid gap-2 sm:grid-cols-2">
                    {section.stats.map((stat) => (
                      <div
                        key={`${section.id}-${stat.label}`}
                        className="rounded-2xl border border-[var(--paper-line)] bg-[rgba(18,30,44,0.7)] px-4 py-3"
                      >
                        <div className="text-xs text-[var(--ink-500)]">{stat.label}</div>
                        <div className="mt-1 text-sm font-semibold text-[var(--ink-950)]">
                          {renderTemplate(stat.value, fields, { pipelineName })}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>

              <div className="mt-5 space-y-3 text-[15px] leading-7 text-[var(--ink-800)]">
                {section.content.map((paragraph) => (
                  <p key={`${section.id}-${paragraph.slice(0, 12)}`}>
                    {renderTemplate(paragraph, fields, { pipelineName })}
                  </p>
                ))}
              </div>
            </Panel>
          ))
        ) : (
          <Panel className="rounded-[24px] border border-dashed border-[var(--border-strong)] bg-[rgba(18,30,44,0.72)] p-6 text-sm leading-7 text-[var(--ink-700)]">
            Пока пусто.
          </Panel>
        )}
      </div>
    </div>
  )
}
