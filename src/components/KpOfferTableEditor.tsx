import { Info, PencilLine } from 'lucide-react'
import { useState } from 'react'
import type {
  DemoOfferTable,
  DraftCellAnnotation,
  DraftCellId,
  DraftField,
  OfferItemEditableField,
} from '../types/demo'
import { cn } from '../lib/utils'

const kpOfferColumns = [
  '№ п/п',
  'Наименование/описание товара',
  'Кол-во, шт',
  'Цена за единицу товара, руб.',
  'Цена монтажа за единицу, руб.',
  'Сумма товара, руб.',
  'Сумма монтажа, руб.',
  'Сумма с учетом монтажа, руб.',
] as const

function formatAmount(value: number) {
  return new Intl.NumberFormat('ru-RU', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

function formatQuantity(value: number) {
  return new Intl.NumberFormat('ru-RU', {
    minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(value)
}

function resolveRiskClasses(annotation?: DraftCellAnnotation) {
  if (!annotation?.issue) {
    return 'border-[rgba(122,146,176,0.55)] bg-[rgba(15,26,38,0.92)]'
  }

  if (annotation.issue.severity === 'high') {
    return 'border-rose-400/45 bg-[rgba(118,34,34,0.28)]'
  }

  if (annotation.issue.severity === 'medium') {
    return 'border-orange-400/45 bg-[rgba(130,71,24,0.26)]'
  }

  return 'border-amber-400/45 bg-[rgba(138,109,26,0.22)]'
}

function resolveInfoButtonClasses(annotation?: DraftCellAnnotation) {
  if (!annotation?.issue) {
    return 'text-[var(--ink-500)] hover:bg-white/8 hover:text-[var(--ink-200)]'
  }

  if (annotation.issue.severity === 'high') {
    return 'text-rose-200 hover:bg-rose-500/15'
  }

  if (annotation.issue.severity === 'medium') {
    return 'text-orange-200 hover:bg-orange-500/15'
  }

  return 'text-amber-200 hover:bg-amber-500/15'
}

function resolveIssueLabel(annotation?: DraftCellAnnotation) {
  if (!annotation?.issue) {
    return null
  }

  if (annotation.issue.severity === 'high') {
    return 'Высокий риск'
  }

  if (annotation.issue.severity === 'medium') {
    return 'Нужно подтвердить'
  }

  return 'Низкий риск'
}

function resolveFieldLabel(fieldId: DraftField['id']) {
  return fieldId === 'dueDate' ? 'Срок выполнения' : 'Особые условия'
}

function resolveEditableFieldCellId(itemId: string, field: OfferItemEditableField): DraftCellId {
  return `kp-item:${itemId}:${field}`
}

function resolveComputedCellId(
  itemId: string,
  field: 'productTotal' | 'installationTotal' | 'grandTotal',
): DraftCellId {
  return `kp-item:${itemId}:${field}`
}

function resolveTotalCellId(totalId: string): DraftCellId {
  return `kp-total:${totalId}`
}

function resolveDraftFieldCellId(fieldId: DraftField['id']): DraftCellId {
  return `kp-field:${fieldId}`
}

interface KpOfferTableEditorProps {
  offerTable: DemoOfferTable | null
  fields: DraftField[]
  cellAnnotations: Partial<Record<DraftCellId, DraftCellAnnotation>>
  editable?: boolean
  onUpdateOfferItem?: (itemId: string, field: OfferItemEditableField, value: string) => void
  onUpdateField?: (fieldId: DraftField['id'], value: string) => void
}

export function KpOfferTableEditor({
  offerTable,
  fields,
  cellAnnotations,
  editable = false,
  onUpdateOfferItem,
  onUpdateField,
}: KpOfferTableEditorProps) {
  const [editingCellId, setEditingCellId] = useState<DraftCellId | null>(null)
  const [editingValue, setEditingValue] = useState('')
  const [openPopoverId, setOpenPopoverId] = useState<DraftCellId | null>(null)

  const items = offerTable?.items ?? []
  const totals = offerTable?.totals ?? []

  const startEditing = (cellId: DraftCellId, value: string) => {
    if (!editable) {
      return
    }

    setOpenPopoverId((current) => (current === cellId ? null : current))
    setEditingCellId(cellId)
    setEditingValue(value)
  }

  const stopEditing = () => {
    setEditingCellId(null)
    setEditingValue('')
  }

  const commitEditing = (commit?: (value: string) => void) => {
    commit?.(editingValue)
    stopEditing()
  }

  const renderPopover = (cellId: DraftCellId, annotation?: DraftCellAnnotation) => {
    if (!annotation || openPopoverId !== cellId) {
      return null
    }

    const issueLabel = resolveIssueLabel(annotation)

    return (
      <div className="absolute right-2 bottom-9 z-30 w-64 rounded-2xl border border-[var(--border-strong)] bg-[rgba(9,18,29,0.98)] p-3 shadow-2xl shadow-slate-950/40">
        {annotation.sources.map((source) => (
          <div key={`${cellId}-${source.label}`} className="mb-2 last:mb-0">
            <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--ink-500)]">
              {source.label}
            </div>
            <div className="mt-1 text-xs leading-5 text-[var(--ink-200)]">{source.excerpt}</div>
          </div>
        ))}

        {annotation.issue ? (
          <div className="mt-3 rounded-xl border border-white/10 bg-white/4 px-3 py-2">
            <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--ink-500)]">
              {issueLabel}
            </div>
            <div className="mt-1 text-xs font-semibold text-[var(--ink-100)]">{annotation.issue.title}</div>
            <div className="mt-1 text-xs leading-5 text-[var(--ink-300)]">{annotation.issue.summary}</div>
          </div>
        ) : null}
      </div>
    )
  }

  const renderMetaButton = (cellId: DraftCellId, annotation?: DraftCellAnnotation) => {
    if (!annotation) {
      return null
    }

    return (
      <>
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation()
            setOpenPopoverId((current) => (current === cellId ? null : cellId))
          }}
          className={cn(
            'absolute right-1.5 bottom-1.5 rounded-full p-1 opacity-75 transition',
            resolveInfoButtonClasses(annotation),
          )}
          aria-label="Показать обоснование"
        >
          <Info size={12} />
        </button>
        {renderPopover(cellId, annotation)}
      </>
    )
  }

  const renderEditableCell = ({
    cellId,
    value,
    displayValue,
    multiline = false,
    align = 'left',
    annotation,
    onCommit,
    placeholder,
    colSpan,
  }: {
    cellId: DraftCellId
    value: string
    displayValue: string
    multiline?: boolean
    align?: 'left' | 'right'
    annotation?: DraftCellAnnotation
    onCommit: (value: string) => void
    placeholder?: string
    colSpan?: number
  }) => {
    const isEditing = editingCellId === cellId
    const isRightAligned = align === 'right'

    return (
      <td
        colSpan={colSpan}
        onClick={() => startEditing(cellId, value)}
        className={cn(
          'group relative border px-3 py-3 align-top transition',
          resolveRiskClasses(annotation),
          editable ? 'cursor-text' : 'cursor-default',
          isRightAligned ? 'text-right tabular-nums' : 'text-left',
        )}
      >
        {isEditing ? (
          multiline ? (
            <textarea
              autoFocus
              rows={3}
              value={editingValue}
              onChange={(event) => setEditingValue(event.target.value)}
              onBlur={() => commitEditing(onCommit)}
              onKeyDown={(event) => {
                if (event.key === 'Escape') {
                  event.preventDefault()
                  stopEditing()
                }

                if (event.key === 'Enter') {
                  event.preventDefault()
                  commitEditing(onCommit)
                }
              }}
              className="min-h-[88px] w-full resize-none rounded-xl border border-[var(--brand-500)] bg-[rgba(11,20,30,0.96)] px-3 py-2 text-sm leading-6 text-[var(--ink-100)] outline-none"
            />
          ) : (
            <input
              autoFocus
              value={editingValue}
              onChange={(event) => setEditingValue(event.target.value)}
              onBlur={() => commitEditing(onCommit)}
              onKeyDown={(event) => {
                if (event.key === 'Escape') {
                  event.preventDefault()
                  stopEditing()
                }

                if (event.key === 'Enter') {
                  event.preventDefault()
                  commitEditing(onCommit)
                }
              }}
              className={cn(
                'w-full rounded-xl border border-[var(--brand-500)] bg-[rgba(11,20,30,0.96)] px-3 py-2 text-sm text-[var(--ink-100)] outline-none',
                isRightAligned ? 'text-right tabular-nums' : 'text-left',
              )}
            />
          )
        ) : (
          <div
            className={cn(
              'min-h-[24px] whitespace-pre-wrap pr-6 text-sm leading-6 text-[var(--ink-100)]',
              !displayValue && 'text-[var(--ink-500)]',
            )}
          >
            {displayValue || placeholder || (editable ? 'Нажмите, чтобы заполнить' : '—')}
          </div>
        )}

        {renderMetaButton(cellId, annotation)}
      </td>
    )
  }

  return (
    <div className="document-paper rounded-[32px] border border-[var(--border-soft)] p-3 md:p-4">
      <div className="overflow-x-auto">
        <table className="min-w-[1180px] w-full border-collapse text-left text-sm text-[var(--ink-900)]">
          <thead>
            <tr className="bg-[rgba(10,20,32,0.92)] text-[var(--ink-500)]">
              {kpOfferColumns.map((column) => (
                <th
                  key={column}
                  className="border border-[rgba(122,146,176,0.55)] px-3 py-3 align-top text-[12px] font-semibold leading-5"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {items.length ? (
              items.map((item, index) => {
                const productTotal = item.quantity * item.unitPrice
                const installationTotal = item.quantity * item.installationUnitPrice
                const grandTotal = productTotal + installationTotal
                const productTotalCellId = resolveComputedCellId(item.id, 'productTotal')
                const installationTotalCellId = resolveComputedCellId(item.id, 'installationTotal')
                const grandTotalCellId = resolveComputedCellId(item.id, 'grandTotal')

                return (
                  <tr key={item.id} className="align-top">
                    <td className="border border-[rgba(122,146,176,0.55)] bg-[rgba(15,26,38,0.92)] px-3 py-4 text-center font-semibold">
                      {index + 1}
                    </td>

                    {renderEditableCell({
                      cellId: resolveEditableFieldCellId(item.id, 'description'),
                      value: item.description,
                      displayValue: item.description,
                      multiline: true,
                      annotation: cellAnnotations[resolveEditableFieldCellId(item.id, 'description')],
                      onCommit: (value) => onUpdateOfferItem?.(item.id, 'description', value),
                    })}

                    {renderEditableCell({
                      cellId: resolveEditableFieldCellId(item.id, 'quantity'),
                      value: String(item.quantity),
                      displayValue: formatQuantity(item.quantity),
                      align: 'right',
                      annotation: cellAnnotations[resolveEditableFieldCellId(item.id, 'quantity')],
                      onCommit: (value) => onUpdateOfferItem?.(item.id, 'quantity', value),
                    })}

                    {renderEditableCell({
                      cellId: resolveEditableFieldCellId(item.id, 'unitPrice'),
                      value: String(item.unitPrice),
                      displayValue: formatAmount(item.unitPrice),
                      align: 'right',
                      annotation: cellAnnotations[resolveEditableFieldCellId(item.id, 'unitPrice')],
                      onCommit: (value) => onUpdateOfferItem?.(item.id, 'unitPrice', value),
                    })}

                    {renderEditableCell({
                      cellId: resolveEditableFieldCellId(item.id, 'installationUnitPrice'),
                      value: String(item.installationUnitPrice),
                      displayValue: formatAmount(item.installationUnitPrice),
                      align: 'right',
                      annotation: cellAnnotations[resolveEditableFieldCellId(item.id, 'installationUnitPrice')],
                      onCommit: (value) => onUpdateOfferItem?.(item.id, 'installationUnitPrice', value),
                    })}

                    <td
                      className={cn(
                        'relative border px-3 py-4 text-right tabular-nums',
                        resolveRiskClasses(cellAnnotations[productTotalCellId]),
                      )}
                    >
                      {formatAmount(productTotal)}
                      {renderMetaButton(productTotalCellId, cellAnnotations[productTotalCellId])}
                    </td>

                    <td
                      className={cn(
                        'relative border px-3 py-4 text-right tabular-nums',
                        resolveRiskClasses(cellAnnotations[installationTotalCellId]),
                      )}
                    >
                      {formatAmount(installationTotal)}
                      {renderMetaButton(installationTotalCellId, cellAnnotations[installationTotalCellId])}
                    </td>

                    <td
                      className={cn(
                        'relative border px-3 py-4 text-right font-semibold tabular-nums',
                        resolveRiskClasses(cellAnnotations[grandTotalCellId]),
                      )}
                    >
                      {formatAmount(grandTotal)}
                      {renderMetaButton(grandTotalCellId, cellAnnotations[grandTotalCellId])}
                    </td>
                  </tr>
                )
              })
            ) : (
              <tr>
                <td
                  colSpan={8}
                  className="border border-[rgba(122,146,176,0.55)] bg-[rgba(15,26,38,0.92)] px-5 py-6 text-sm leading-7 text-[var(--ink-500)]"
                >
                  Таблица готова к редактированию. Демо-заполнение можно включить кнопкой справа сверху.
                </td>
              </tr>
            )}

            {totals.map((total) => {
              const totalCellId = resolveTotalCellId(total.id)
              const annotation = cellAnnotations[totalCellId]

              return (
                <tr
                  key={total.id}
                  className={
                    total.tone === 'final'
                      ? 'bg-[rgba(28,44,62,0.98)]'
                      : total.tone === 'subtotal'
                        ? 'bg-[rgba(22,34,48,0.96)]'
                        : 'bg-[rgba(18,30,44,0.88)]'
                  }
                >
                  <td
                    colSpan={5}
                    className="border border-[rgba(122,146,176,0.55)] px-3 py-3 text-right text-[12px] font-semibold uppercase tracking-[0.08em]"
                  >
                    {total.label}
                  </td>
                  <td className="border border-[rgba(122,146,176,0.55)] px-3 py-3 text-right font-semibold tabular-nums">
                    {total.productTotal === undefined ? '' : formatAmount(total.productTotal)}
                  </td>
                  <td className="border border-[rgba(122,146,176,0.55)] px-3 py-3 text-right font-semibold tabular-nums">
                    {total.installationTotal === undefined ? '' : formatAmount(total.installationTotal)}
                  </td>
                  <td
                    className={cn(
                      'relative border px-3 py-3 text-right font-semibold tabular-nums',
                      resolveRiskClasses(annotation),
                    )}
                  >
                    {formatAmount(total.grandTotal)}
                    {renderMetaButton(totalCellId, annotation)}
                  </td>
                </tr>
              )
            })}

            {fields.map((field) => {
              const fieldCellId = resolveDraftFieldCellId(field.id)

              return (
                <tr key={field.id}>
                  <td
                    colSpan={2}
                    className="border border-[rgba(122,146,176,0.55)] bg-[rgba(12,23,35,0.96)] px-3 py-3 text-sm font-semibold text-[var(--ink-200)]"
                  >
                    <div className="flex items-center gap-2">
                      <PencilLine size={15} className="text-[var(--brand-700)]" />
                      {resolveFieldLabel(field.id)}
                    </div>
                  </td>
                  {renderEditableCell({
                    cellId: fieldCellId,
                    value: field.value,
                    displayValue: field.value,
                    multiline: field.id === 'specialTerms',
                    annotation: cellAnnotations[fieldCellId],
                    onCommit: (value) => onUpdateField?.(field.id, value),
                    placeholder: field.hint,
                    colSpan: 6,
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
