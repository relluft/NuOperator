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
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4 py-8 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.97 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="document-paper w-full max-w-3xl rounded-[30px] border border-[var(--border-soft)] p-6 md:p-8"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border-soft)] bg-[var(--surface-muted)] px-3 py-1 text-xs font-semibold text-[var(--ink-700)]">
                  <Download size={14} />
                  Предпросмотр выгрузки
                </span>
                <h2 className="font-serif text-3xl text-[var(--ink-950)]">{artifact.format} готов к показу</h2>
                <p className="text-sm text-[var(--ink-700)]">
                  Интерфейс не создаёт реальный файл, а демонстрирует финальный шаг сценария и то, как будет
                  выглядеть подтверждение экспорта.
                </p>
              </div>

              <button
                onClick={onClose}
                className="rounded-full border border-[var(--border-soft)] bg-[var(--surface-muted)] p-2 text-[var(--ink-700)] transition hover:bg-[var(--surface-strong)]"
                aria-label="Закрыть"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-6 rounded-[24px] border border-[var(--paper-line)] bg-[rgba(18,30,44,0.72)] p-5">
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
                <div className="text-sm text-[var(--ink-700)]">Сформировано: {formatDateTime(artifact.createdAt)}</div>
              </div>

              <div className="mt-6 grid gap-3 md:grid-cols-3">
                <div className="rounded-2xl border border-[var(--paper-line)] bg-[rgba(18,30,44,0.72)] px-4 py-3">
                  <div className="text-xs text-[var(--ink-500)]">Формат</div>
                  <div className="mt-1 text-sm font-semibold text-[var(--ink-950)]">{artifact.format}</div>
                </div>
                <div className="rounded-2xl border border-[var(--paper-line)] bg-[rgba(18,30,44,0.72)] px-4 py-3">
                  <div className="text-xs text-[var(--ink-500)]">Шаблон</div>
                  <div className="mt-1 text-sm font-semibold text-[var(--ink-950)]">Фирменный demo-layout</div>
                </div>
                <div className="rounded-2xl border border-[var(--paper-line)] bg-[rgba(18,30,44,0.72)] px-4 py-3">
                  <div className="text-xs text-[var(--ink-500)]">Стадия</div>
                  <div className="mt-1 text-sm font-semibold text-[var(--ink-950)]">Готово к показу</div>
                </div>
              </div>

              <div className="mt-6 rounded-[22px] border border-dashed border-[var(--border-strong)] bg-[rgba(11,19,28,0.88)] p-5 text-sm leading-7 text-[var(--ink-800)]">
                В финальной версии здесь будет реальный экспортируемый документ по шаблону компании. Для демо
                мы показываем ту же логику согласования: документ собран, проверен и готов к дальнейшему
                ручному заполнению чувствительных данных.
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
