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
import { Button, Eyebrow, Panel, ProgressBar, StatusPill, fieldStyles } from '../components/ui'
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
    caption: 'Редактируемый файл для финальной полировки и печати.',
    icon: FileText,
  },
  {
    format: 'PDF',
    title: 'PDF',
    caption: 'Готовый для презентации файл для отправки, согласования и показа.',
    icon: FileType2,
  },
  {
    format: 'XLSX',
    title: 'Excel',
    caption: 'Структурированная выгрузка для расчётов, смет и коммерческих приложений.',
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
    state: { cases, exportForm, exportGeneration, branchLaunch, demoAppliedByPage },
    applyDemoVariant,
    updateExportField,
    startExportGeneration,
    setExportProgress,
    completeExportGeneration,
    showDownloadMessage,
    setBranchStage,
    markStageComplete,
  } = useDemo()

  const isValidBranch = branch === 'kp' || branch === 'tz'
  const activeBranch = (isValidBranch ? branch : 'kp') as DemoDocumentType
  const demoCase = isValidBranch
    ? cases.find((demoCase) => demoCase.exportId === exportId) ?? cases[0]
    : null
  const pageKey = resolveExportPageKey(activeBranch)
  const hasDemoVariant = !!demoAppliedByPage[pageKey]
  const pipelineName = branchLaunch[activeBranch].pipelineName

  useEffect(() => {
    if (!isValidBranch) {
      return
    }

    setBranchStage(activeBranch, 'export')
    markStageComplete(activeBranch, 'editor')
  }, [activeBranch, isValidBranch, markStageComplete, setBranchStage])

  useEffect(() => {
    if (!isValidBranch || exportGeneration.status !== 'ready') {
      return
    }

    markStageComplete(activeBranch, 'export')
  }, [activeBranch, exportGeneration.status, isValidBranch, markStageComplete])

  useEffect(() => {
    if (
      !isValidBranch ||
      exportGeneration.status !== 'generating' ||
      !exportGeneration.selectedFormat
    ) {
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
    isValidBranch,
    setExportProgress,
  ])

  if (!isValidBranch) {
    return <Navigate to="/workspace" replace />
  }

  if (!demoCase || exportId !== demoCase.exportId) {
    return null
  }

  return (
    <div className="space-y-6">
      <Panel tone="gold" className="rounded-[34px] p-6 md:p-8">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr),360px]">
          <div className="space-y-4">
            <Eyebrow>{getBranchLabel(activeBranch)} / Экспорт</Eyebrow>
            <div className="max-w-3xl">
              <h1 className="display-title text-5xl text-[var(--ink-950)] md:text-[4rem]">
                Финальный выпуск документа
              </h1>
              <p className="mt-4 text-sm leading-8 text-[var(--ink-800)] md:text-base">
                Этот экран завершает сценарий: ручные реквизиты, выбор формата и аккуратная
                генерация финального артефакта.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="executive-card rounded-[24px] p-4">
                <div className="relative">
                  <div className="text-xs uppercase tracking-[0.16em] text-[var(--ink-500)]">
                    Пайплайн
                  </div>
                  <div className="mt-2 text-lg font-semibold text-[var(--ink-950)]">
                    {pipelineName || 'Демо-пайплайн'}
                  </div>
                </div>
              </div>
              <div className="executive-card rounded-[24px] p-4">
                <div className="relative">
                  <div className="text-xs uppercase tracking-[0.16em] text-[var(--ink-500)]">
                    Дата документа
                  </div>
                  <div className="mt-2 text-lg font-semibold text-[var(--ink-950)]">
                    {exportForm.documentDate || 'Заполните вручную'}
                  </div>
                </div>
              </div>
              <div className="executive-card gold-highlight rounded-[24px] p-4">
                <div className="relative">
                  <div className="text-xs uppercase tracking-[0.16em] text-[var(--ink-500)]">
                    Статус
                  </div>
                  <div className="mt-2 text-lg font-semibold text-[var(--ink-950)]">
                    {exportGeneration.status === 'idle'
                      ? 'Готово к генерации'
                      : exportGeneration.status === 'generating'
                        ? 'Идёт подготовка файла'
                        : `Подготовлен ${getFormatLabel(exportGeneration.selectedFormat)}`}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="executive-card gold-highlight rounded-[30px] p-5">
            <div className="relative">
              <div className="flex items-center gap-3">
                <div className="accent-icon-block rounded-2xl p-3 text-[var(--accent-amber-strong)]">
                  <Sparkles size={20} />
                </div>
                <div>
                  <div className="font-semibold text-[var(--ink-950)]">Демо-шаг выпуска</div>
                  <div className="text-sm text-[var(--ink-700)]">
                    Заполняет презентационные реквизиты, чтобы экспорт выглядел завершённым на
                    живой встрече.
                  </div>
                </div>
              </div>

              <Button
                className="mt-5 w-full justify-center"
                variant="secondary"
                onClick={() => applyDemoVariant(pageKey)}
              >
                <Sparkles size={16} />
                {hasDemoVariant ? 'Обновить демо-данные' : 'Применить демо-вариант'}
              </Button>
            </div>
          </div>
        </div>
      </Panel>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.05fr),0.95fr]">
        <Panel className="rounded-[32px] p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-xl font-semibold text-[var(--ink-950)]">Ручные реквизиты</div>
              <div className="mt-1 text-sm text-[var(--ink-700)]">
                Эти поля остаются под контролем человека перед финальным экспортом.
              </div>
            </div>
            <StatusPill tone="attention">Ручной ввод</StatusPill>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <label className="block">
              <div className="text-sm font-semibold text-[var(--ink-950)]">Контрагент</div>
              <input
                value={exportForm.counterpartyName}
                onChange={(event) => updateExportField('counterpartyName', event.target.value)}
                placeholder="ООО Пример"
                className={`mt-3 w-full rounded-[22px] ${fieldStyles}`}
              />
            </label>

            <label className="block">
              <div className="text-sm font-semibold text-[var(--ink-950)]">Дата документа</div>
              <input
                type="date"
                value={exportForm.documentDate}
                onChange={(event) => updateExportField('documentDate', event.target.value)}
                className={`mt-3 w-full rounded-[22px] ${fieldStyles}`}
              />
            </label>

            <label className="block md:col-span-2">
              <div className="text-sm font-semibold text-[var(--ink-950)]">Адрес контрагента</div>
              <input
                value={exportForm.counterpartyAddress}
                onChange={(event) => updateExportField('counterpartyAddress', event.target.value)}
                placeholder="Юридический или почтовый адрес"
                className={`mt-3 w-full rounded-[22px] ${fieldStyles}`}
              />
            </label>

            <label className="block md:col-span-2">
              <div className="text-sm font-semibold text-[var(--ink-950)]">Адрес объекта</div>
              <input
                value={exportForm.objectAddress}
                onChange={(event) => updateExportField('objectAddress', event.target.value)}
                placeholder="Где выполняются работы"
                className={`mt-3 w-full rounded-[22px] ${fieldStyles}`}
              />
            </label>

            <label className="block">
              <div className="text-sm font-semibold text-[var(--ink-950)]">Подписант</div>
              <input
                value={exportForm.signatoryName}
                onChange={(event) => updateExportField('signatoryName', event.target.value)}
                placeholder="ФИО"
                className={`mt-3 w-full rounded-[22px] ${fieldStyles}`}
              />
            </label>

            <label className="block">
              <div className="text-sm font-semibold text-[var(--ink-950)]">Комментарий</div>
              <input
                value={exportForm.manualNotes}
                onChange={(event) => updateExportField('manualNotes', event.target.value)}
                placeholder="Короткая служебная пометка"
                className={`mt-3 w-full rounded-[22px] ${fieldStyles}`}
              />
            </label>
          </div>
        </Panel>

        <div className="space-y-6">
          <Panel className="rounded-[32px] p-6">
            <div className="text-xl font-semibold text-[var(--ink-950)]">Выберите формат экспорта</div>
            <div className="mt-2 text-sm leading-7 text-[var(--ink-700)]">
              Выберите тип файла, и система запустит демонстрационный сценарий генерации.
            </div>

            <div className="mt-6 space-y-3">
              {exportCards.map((card) => {
                const Icon = card.icon
                const isActive = exportGeneration.selectedFormat === card.format

                return (
                  <button
                    key={card.format}
                    onClick={() => startExportGeneration(card.format)}
                    className={`w-full rounded-[26px] px-4 py-4 text-left ${
                      isActive ? 'executive-card executive-highlight' : 'executive-card'
                    }`}
                  >
                    <div className="relative flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className="accent-icon-block-soft rounded-2xl p-3">
                          <Icon size={20} />
                        </div>
                        <div>
                          <div className="text-base font-semibold text-[var(--ink-950)]">
                            {card.title}
                          </div>
                          <div className="mt-1 text-sm leading-6 text-[var(--ink-700)]">
                            {card.caption}
                          </div>
                        </div>
                      </div>
                      <StatusPill tone={isActive ? 'progress' : 'ready'}>{card.format}</StatusPill>
                    </div>
                  </button>
                )
              })}
            </div>
          </Panel>

          <Panel tone="gold" className="rounded-[32px] p-6">
            <div className="flex items-center gap-3">
              <div className="accent-icon-block rounded-2xl p-3 text-[var(--accent-amber-strong)]">
                {exportGeneration.status === 'generating' ? (
                  <LoaderCircle size={20} className="animate-spin" />
                ) : (
                  <Download size={20} />
                )}
              </div>
              <div>
                <div className="text-xl font-semibold text-[var(--ink-950)]">Статус генерации</div>
                <div className="text-sm text-[var(--ink-700)]">
                  {exportGeneration.selectedFormat
                    ? `Формат: ${getFormatLabel(exportGeneration.selectedFormat)}`
                    : 'Сначала выберите формат экспорта.'}
                </div>
              </div>
            </div>

            {exportGeneration.status === 'idle' ? (
              <div className="surface-dashed mt-6 rounded-[24px] p-5 text-sm leading-7 text-[var(--ink-700)]">
                Генерация ещё не запускалась. После выбора формата здесь появится экран
                прогресса и выдачи результата.
              </div>
            ) : (
              <div className="mt-6 space-y-5">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm font-medium text-[var(--ink-950)]">
                    {exportGeneration.status === 'generating'
                      ? 'Система заполняет фирменный шаблон и готовит финальный файл.'
                      : 'Файл готов для демонстрационной загрузки.'}
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
                        className="h-full animate-[slow-pulse_1.6s_ease-in-out_infinite] opacity-80"
                        style={{
                          backgroundImage:
                            'linear-gradient(135deg, rgba(255,255,255,0.08) 25%, rgba(255,255,255,0.28) 25%, rgba(255,255,255,0.28) 50%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.08) 75%, rgba(255,255,255,0.28) 75%, rgba(255,255,255,0.28) 100%)',
                          backgroundSize: '20px 20px',
                        }}
                      />
                    </div>
                  ) : null}
                </div>

                {exportGeneration.status === 'ready' &&
                exportGeneration.generatedArtifact ? (
                  <div className="space-y-4 rounded-[26px] border border-emerald-500/24 bg-[linear-gradient(180deg,rgba(36,96,73,0.28),rgba(20,48,37,0.18))] p-5">
                    <div>
                      <div className="text-base font-semibold text-[var(--ink-950)]">
                        Документ {getFormatLabel(exportGeneration.generatedArtifact.format)} готов
                      </div>
                      <div className="mt-1 text-sm leading-6 text-[var(--ink-700)]">
                        Файл сформирован из демонстрационного шаблона и ждёт скачивания в интерфейсе.
                      </div>
                      <div className="mt-3 text-xs uppercase tracking-[0.16em] text-[var(--ink-500)]">
                        {exportGeneration.generatedArtifact.fileName}
                      </div>
                    </div>

                    <Button
                      className="w-full justify-center py-3 text-base"
                      onClick={showDownloadMessage}
                    >
                      <Download size={18} />
                      Скачать документ
                    </Button>

                    {exportGeneration.downloadMessage ? (
                      <div className="surface-note rounded-[20px] px-4 py-3 text-sm text-[var(--ink-950)]">
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
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[var(--border-soft)] bg-[rgba(255,248,234,0.02)] px-4 py-3 text-sm font-semibold text-[var(--ink-950)] transition hover:-translate-y-0.5 hover:border-[var(--border-strong)] hover:bg-[var(--surface-muted)]"
          >
            Назад в редактор
          </Link>
        </div>
      </section>
    </div>
  )
}
