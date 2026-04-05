import { AnimatePresence, motion } from 'framer-motion'
import { Download, FileText, X } from 'lucide-react'
import { brandConfig } from '../config/brand'
import { formatDateTime } from '../lib/utils'
import type { ExportArtifact } from '../types/demo'
import { Button } from './ui'

export function ExportPreviewModal({
  artifact,
  onClose,
}: {
  artifact: ExportArtifact | null
  onClose: () => void
}) {
  return (
    <AnimatePresence>
      {artifact ? (
        <motion.div
          className="modal-backdrop fixed inset-0 z-50 flex items-center justify-center px-4 py-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.97 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="document-paper w-full max-w-3xl rounded-[34px] border border-[var(--border-soft)] p-6 md:p-8"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <span className="metal-pill inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold text-[var(--ink-700)]">
                  <Download size={14} className="text-[var(--accent-amber-strong)]" />
                  Предпросмотр выгрузки
                </span>
                <h2 className="display-section-title text-4xl text-[var(--ink-950)]">
                  {artifact.format} готов к показу
                </h2>
              </div>

              <button
                onClick={onClose}
                className="rounded-full border border-[var(--border-soft)] bg-[rgba(255,248,234,0.03)] p-2 text-[var(--ink-700)] transition hover:border-[var(--border-strong)] hover:bg-[var(--surface-strong)]"
                aria-label="Закрыть"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-6 rounded-[24px] border border-[var(--paper-line)] bg-[rgba(17,14,12,0.76)] p-5">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="space-y-1">
                  <div className="text-xs uppercase tracking-[0.18em] text-[var(--ink-500)]">
                    {brandConfig.companyName}
                  </div>
                  <div className="flex items-center gap-3 text-[var(--ink-950)]">
                    <FileText size={18} />
                    <span className="font-semibold">{artifact.fileName}</span>
                  </div>
                </div>
                <div className="text-sm text-[var(--ink-700)]">
                  Сформировано: {formatDateTime(artifact.createdAt)}
                </div>
              </div>

              <div className="mt-6 grid gap-3 md:grid-cols-3">
                <div className="executive-card rounded-[20px] px-4 py-3">
                  <div className="relative">
                    <div className="text-xs text-[var(--ink-500)]">Формат</div>
                    <div className="mt-1 text-sm font-semibold text-[var(--ink-950)]">
                      {artifact.format}
                    </div>
                  </div>
                </div>
                <div className="executive-card rounded-[20px] px-4 py-3">
                  <div className="relative">
                    <div className="text-xs text-[var(--ink-500)]">Шаблон</div>
                    <div className="mt-1 text-sm font-semibold text-[var(--ink-950)]">
                      Фирменный демо-макет
                    </div>
                  </div>
                </div>
                <div className="executive-card executive-highlight rounded-[20px] px-4 py-3">
                  <div className="relative">
                    <div className="text-xs text-[var(--ink-500)]">Стадия</div>
                    <div className="mt-1 text-sm font-semibold text-[var(--ink-950)]">
                      Готово к показу
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap justify-end gap-3">
              <Button variant="ghost" onClick={onClose}>
                Закрыть
              </Button>
              <Button onClick={onClose}>Показать следующий экран</Button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
