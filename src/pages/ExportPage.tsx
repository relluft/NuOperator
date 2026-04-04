import { useEffect } from 'react'
import {
  Download,
  FileSpreadsheet,
  FileText,
  FileType2,
  LoaderCircle,
  Sparkles,
} from 'lucide-react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { Button, Eyebrow, Panel, ProgressBar, StatusPill } from '../components/ui'
import { useDemo } from '../context/DemoContext'
import { draftPath } from '../lib/routes'
import { getBranchLabel } from '../lib/workflow'
import type { DemoDocumentType, DemoPageKey, ExportFormat } from '../types/demo'

function resolveExportPageKey(branch: DemoDocumentType): DemoPageKey {
  return branch === 'kp' ? 'kp-export' : 'tz-export'
}

const exportCards: Array<{
  format: ExportFormat
  title: string
  caption: string
  icon: typeof FileText
}> = [
  {
    format: 'DOCX',
    title: 'Word',
    caption: 'Редактируемый шаблон для финальной доработки и печати.',
    icon: FileText,
  },
  {
    format: 'PDF',
    title: 'PDF',
    caption: 'Готовый файл для отправки, согласования и визуального контроля.',
    icon: FileType2,
  },
  {
    format: 'XLSX',
    title: 'Excel',
    caption: 'Табличная выгрузка для расчётов, сметной части и приложений.',
    icon: FileSpreadsheet,
  },
]

function getFormatLabel(format: ExportFormat | null) {
  if (format === 'DOCX') return 'Word'
  if (format === 'PDF') return 'PDF'
  if (format === 'XLSX') return 'Excel'
  return 'документ'
}

export function ExportPage() {
  const { branch, exportId } = useParams()
  const {
    state: {
      cases,
      exportForm,
      exportGeneration,
      branchLaunch,
      demoAppliedByPage,
    },
    applyDemoVariant,
    updateExportField,
    startExportGeneration,
    setExportProgress,
    completeExportGeneration,
    showDownloadMessage,
    setBranchStage,
    markStageComplete,
  } = useDemo()

  if (branch !== 'kp' && branch !== 'tz') {
    return <Navigate to="/workspace" replace />
  }

  const activeBranch = branch as DemoDocumentType
  const demoCase = cases.find((demoCase) => demoCase.exportId === exportId) ?? cases[0]
  const pageKey = resolveExportPageKey(activeBranch)
  const hasDemoVariant = !!demoAppliedByPage[pageKey]
  const pipelineName = branchLaunch[activeBranch].pipelineName

  useEffect(() => {
    setBranchStage(activeBranch, 'export')
    markStageComplete(activeBranch, 'editor')
  }, [activeBranch, markStageComplete, setBranchStage])

  useEffect(() => {
    if (exportGeneration.status !== 'ready') {
      return
    }

    markStageComplete(activeBranch, 'export')
  }, [activeBranch, exportGeneration.status, markStageComplete])

  useEffect(() => {
    if (exportGeneration.status !== 'generating' || !exportGeneration.selectedFormat) {
      return
    }

    const startedAt = Date.now()
    const durationMs = 3500

    const timer = window.setInterval(() => {
      const elapsed = Date.now() - startedAt
      const nextPercent = Math.min((elapsed / durationMs) * 100, 100)

      setExportProgress(nextPercent)

      if (nextPercent >= 100) {
        window.clearInterval(timer)
        completeExportGeneration(activeBranch)
      }
    }, 220)

    return () => window.clearInterval(timer)
  }, [
    activeBranch,
    completeExportGeneration,
    exportGeneration.selectedFormat,
    exportGeneration.status,
    setExportProgress,
  ])

  if (!demoCase || exportId !== demoCase.exportId) {
    return null
  }

  return (
    <div className="space-y-6">
      <Panel className="rounded-[34px] p-6 md:p-8">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr),360px]">
          <div className="space-y-4">
            <Eyebrow>{getBranchLabel(activeBranch)} / Экспорт</Eyebrow>
            <div className="max-w-3xl">
              <h1 className="text-3xl font-semibold text-[var(--ink-950)] md:text-[2.4rem]">
                Финальный выпуск документа
              </h1>
              <p className="mt-3 text-sm leading-7 text-[var(--ink-700)] md:text-base">
                Здесь сотрудник вручную добавляет реквизиты, адреса и дату перед выпуском документа по шаблону
                компании. После выбора формата запускается демонстрационная генерация финального файла.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-[24px] border border-[var(--border-soft)] bg-[var(--surface-muted)] p-4">
                <div className="text-xs uppercase tracking-[0.16em] text-[var(--ink-500)]">Пайплайн</div>
                <div className="mt-2 text-lg font-semibold text-[var(--ink-950)]">
                  {pipelineName || 'Демо-пайплайн'}
                </div>
              </div>
              <div className="rounded-[24px] border border-[var(--border-soft)] bg-[var(--surface-muted)] p-4">
                <div className="text-xs uppercase tracking-[0.16em] text-[var(--ink-500)]">Дата документа</div>
                <div className="mt-2 text-lg font-semibold text-[var(--ink-950)]">
                  {exportForm.documentDate || 'Заполните вручную'}
                </div>
              </div>
              <div className="rounded-[24px] border border-[var(--border-soft)] bg-[var(--surface-muted)] p-4">
                <div className="text-xs uppercase tracking-[0.16em] text-[var(--ink-500)]">Статус</div>
                <div className="mt-2 text-lg font-semibold text-[var(--ink-950)]">
                  {exportGeneration.status === 'idle'
                    ? 'Готово к запуску'
                    : exportGeneration.status === 'generating'
                      ? 'Генерация документа'
                      : `Подготовлен ${getFormatLabel(exportGeneration.selectedFormat)}`}
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
                <div className="text-sm text-[var(--ink-700)]">
                  Подставит пример реквизитов для презентации экрана экспорта.
                </div>
              </div>
            </div>

            <Button className="mt-5 w-full justify-center" variant="secondary" onClick={() => applyDemoVariant(pageKey)}>
              <Sparkles size={16} />
              {hasDemoVariant ? 'Обновить демо-данные' : 'Демонстрационный вариант'}
            </Button>
          </div>
        </div>
      </Panel>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.05fr),0.95fr]">
        <Panel className="rounded-[32px] p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-xl font-semibold text-[var(--ink-950)]">Ручные реквизиты</div>
              <div className="mt-1 text-sm text-[var(--ink-700)]">
                Эти поля человек заполняет вручную перед финальным экспортом.
              </div>
            </div>
            <StatusPill tone="attention">Manual input</StatusPill>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <label className="block">
              <div className="text-sm font-semibold text-[var(--ink-950)]">Контрагент</div>
              <input
                value={exportForm.counterpartyName}
                onChange={(event) => updateExportField('counterpartyName', event.target.value)}
                placeholder="ООО Ромашка"
                className="mt-3 w-full rounded-[22px] border border-[var(--border-soft)] bg-[var(--surface-muted)] px-4 py-3.5 text-sm text-[var(--ink-950)] outline-none transition focus:border-[var(--brand-500)]"
              />
            </label>

            <label className="block">
              <div className="text-sm font-semibold text-[var(--ink-950)]">Дата документа</div>
              <input
                type="date"
                value={exportForm.documentDate}
                onChange={(event) => updateExportField('documentDate', event.target.value)}
                className="mt-3 w-full rounded-[22px] border border-[var(--border-soft)] bg-[var(--surface-muted)] px-4 py-3.5 text-sm text-[var(--ink-950)] outline-none transition focus:border-[var(--brand-500)]"
              />
            </label>

            <label className="block md:col-span-2">
              <div className="text-sm font-semibold text-[var(--ink-950)]">Адрес контрагента</div>
              <input
                value={exportForm.counterpartyAddress}
                onChange={(event) => updateExportField('counterpartyAddress', event.target.value)}
                placeholder="Юридический или почтовый адрес"
                className="mt-3 w-full rounded-[22px] border border-[var(--border-soft)] bg-[var(--surface-muted)] px-4 py-3.5 text-sm text-[var(--ink-950)] outline-none transition focus:border-[var(--brand-500)]"
              />
            </label>

            <label className="block md:col-span-2">
              <div className="text-sm font-semibold text-[var(--ink-950)]">Адрес объекта</div>
              <input
                value={exportForm.objectAddress}
                onChange={(event) => updateExportField('objectAddress', event.target.value)}
                placeholder="Где выполняются работы"
                className="mt-3 w-full rounded-[22px] border border-[var(--border-soft)] bg-[var(--surface-muted)] px-4 py-3.5 text-sm text-[var(--ink-950)] outline-none transition focus:border-[var(--brand-500)]"
              />
            </label>

            <label className="block">
              <div className="text-sm font-semibold text-[var(--ink-950)]">Подписант</div>
              <input
                value={exportForm.signatoryName}
                onChange={(event) => updateExportField('signatoryName', event.target.value)}
                placeholder="ФИО ответственного"
                className="mt-3 w-full rounded-[22px] border border-[var(--border-soft)] bg-[var(--surface-muted)] px-4 py-3.5 text-sm text-[var(--ink-950)] outline-none transition focus:border-[var(--brand-500)]"
              />
            </label>

            <label className="block">
              <div className="text-sm font-semibold text-[var(--ink-950)]">Комментарий</div>
              <input
                value={exportForm.manualNotes}
                onChange={(event) => updateExportField('manualNotes', event.target.value)}
                placeholder="Короткое примечание к выпуску"
                className="mt-3 w-full rounded-[22px] border border-[var(--border-soft)] bg-[var(--surface-muted)] px-4 py-3.5 text-sm text-[var(--ink-950)] outline-none transition focus:border-[var(--brand-500)]"
              />
            </label>
          </div>
        </Panel>

        <div className="space-y-6">
          <Panel className="rounded-[32px] p-6">
            <div className="text-xl font-semibold text-[var(--ink-950)]">Выберите формат выгрузки</div>
            <div className="mt-2 text-sm leading-7 text-[var(--ink-700)]">
              Нажмите на нужный формат, и система запустит демонстрационную генерацию документа по шаблону.
            </div>

            <div className="mt-6 space-y-3">
              {exportCards.map((card) => {
                const Icon = card.icon
                const isActive = exportGeneration.selectedFormat === card.format

                return (
                  <button
                    key={card.format}
                    onClick={() => startExportGeneration(card.format)}
                    className={`w-full rounded-[26px] border px-4 py-4 text-left transition ${
                      isActive
                        ? 'border-[var(--brand-500)] bg-[rgba(78,149,188,0.16)] shadow-lg shadow-cyan-950/10'
                        : 'border-[var(--border-soft)] bg-[var(--surface-muted)] hover:border-[var(--border-strong)]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className="rounded-2xl bg-[rgba(255,255,255,0.04)] p-3 text-[var(--brand-700)]">
                          <Icon size={20} />
                        </div>
                        <div>
                          <div className="text-base font-semibold text-[var(--ink-950)]">{card.title}</div>
                          <div className="mt-1 text-sm leading-6 text-[var(--ink-700)]">{card.caption}</div>
                        </div>
                      </div>
                      <StatusPill tone={isActive ? 'progress' : 'ready'}>{card.format}</StatusPill>
                    </div>
                  </button>
                )
              })}
            </div>
          </Panel>

          <Panel className="rounded-[32px] p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-[rgba(208,154,58,0.14)] p-3 text-[var(--surface-dark)]">
                {exportGeneration.status === 'generating' ? <LoaderCircle size={20} className="animate-spin" /> : <Download size={20} />}
              </div>
              <div>
                <div className="text-xl font-semibold text-[var(--ink-950)]">Генерация документа</div>
                <div className="text-sm text-[var(--ink-700)]">
                  {exportGeneration.selectedFormat
                    ? `Формат: ${getFormatLabel(exportGeneration.selectedFormat)}`
                    : 'Сначала выберите формат экспорта.'}
                </div>
              </div>
            </div>

            {exportGeneration.status === 'idle' ? (
              <div className="mt-6 rounded-[24px] border border-dashed border-[var(--border-strong)] bg-[var(--surface-muted)] p-5 text-sm leading-7 text-[var(--ink-700)]">
                Пока генерация не запущена. После выбора Word, PDF или Excel здесь появится прогресс с процентами и кнопка скачивания.
              </div>
            ) : (
              <div className="mt-6 space-y-5">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm font-medium text-[var(--ink-950)]">
                    {exportGeneration.status === 'generating'
                      ? 'Нейросеть заполняет шаблон и собирает финальный файл'
                      : 'Файл успешно подготовлен для демонстрационного скачивания'}
                  </div>
                  <div className="text-sm font-semibold text-[var(--brand-700)]">
                    {exportGeneration.progressPercent}%
                  </div>
                </div>

                <div className="relative">
                  <ProgressBar value={exportGeneration.progressPercent / 100} />
                  {exportGeneration.status === 'generating' ? (
                    <div
                      className="pointer-events-none absolute inset-y-0 left-0 overflow-hidden rounded-full"
                      style={{ width: `${exportGeneration.progressPercent}%` }}
                    >
                      <div
                        className="h-full animate-[pulse_1.1s_ease-in-out_infinite] opacity-70"
                        style={{
                          backgroundImage:
                            'linear-gradient(135deg, rgba(255,255,255,0.08) 25%, rgba(255,255,255,0.3) 25%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.08) 75%, rgba(255,255,255,0.3) 75%, rgba(255,255,255,0.3) 100%)',
                          backgroundSize: '20px 20px',
                        }}
                      />
                    </div>
                  ) : null}
                </div>

                {exportGeneration.status === 'ready' && exportGeneration.generatedArtifact ? (
                  <div className="space-y-4 rounded-[26px] border border-emerald-500/30 bg-emerald-500/12 p-5">
                    <div>
                      <div className="text-base font-semibold text-[var(--ink-950)]">
                        {getFormatLabel(exportGeneration.generatedArtifact.format)}-документ готов
                      </div>
                      <div className="mt-1 text-sm leading-6 text-[var(--ink-700)]">
                        Файл собран по демо-шаблону и ожидает скачивания в интерфейсе.
                      </div>
                      <div className="mt-3 text-xs uppercase tracking-[0.16em] text-[var(--ink-500)]">
                        {exportGeneration.generatedArtifact.fileName}
                      </div>
                    </div>

                    <Button className="w-full justify-center py-3 text-base" onClick={showDownloadMessage}>
                      <Download size={18} />
                      Скачать документ
                    </Button>

                    {exportGeneration.downloadMessage ? (
                      <div className="rounded-[20px] border border-[var(--border-soft)] bg-[rgba(18,30,44,0.54)] px-4 py-3 text-sm text-[var(--ink-950)]">
                        {exportGeneration.downloadMessage}
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </div>
            )}
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
  )
}
