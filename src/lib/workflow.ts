import {
  Boxes,
  ClipboardPenLine,
  FileCog,
  FileOutput,
  MessageSquareQuote,
  ScanSearch,
  ScrollText,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { DemoDocumentType, DemoWorkflowStageId } from '../types/demo'

export interface WorkflowStageDefinition {
  id: DemoWorkflowStageId
  label: string
  shortLabel: string
  description: string
  icon: LucideIcon
}

const workflowDefinitions: Record<DemoDocumentType, WorkflowStageDefinition[]> = {
  kp: [
    {
      id: 'need',
      label: 'Потребность',
      shortLabel: 'Потребность',
      description: 'Фиксируем базовую потребность проекта и главную цель будущего КП.',
      icon: ClipboardPenLine,
    },
    {
      id: 'materials',
      label: 'Фото и материалы',
      shortLabel: 'Материалы',
      description: 'Добавляем только те материалы, которые реально влияют на состав предложения.',
      icon: Boxes,
    },
    {
      id: 'comments',
      label: 'Комментарии',
      shortLabel: 'Вводные',
      description:
        'Сохраняем свободные важные условия, не относящиеся напрямую к потребности и материалам.',
      icon: MessageSquareQuote,
    },
    {
      id: 'run',
      label: 'Сборка КП',
      shortLabel: 'Сборка',
      description: 'Показываем, как из введённых данных собирается обезличенный черновик КП.',
      icon: ScanSearch,
    },
    {
      id: 'editor',
      label: 'Редактор',
      shortLabel: 'Редактор',
      description: 'Просматриваем черновик, вносим правки и готовим пакет к показу.',
      icon: FileCog,
    },
    {
      id: 'export',
      label: 'Экспорт',
      shortLabel: 'Экспорт',
      description:
        'Вносим ручные реквизиты, выбираем формат и подготавливаем финальный документ.',
      icon: FileOutput,
    },
  ],
  tz: [
    {
      id: 'source',
      label: 'Основа из КП',
      shortLabel: 'Основа',
      description: 'Выбираем демонстрационную основу для будущего технического задания.',
      icon: ScrollText,
    },
    {
      id: 'need',
      label: 'Потребность и адаптация',
      shortLabel: 'Адаптация',
      description:
        'Переводим задачу в формат технического сценария и уточняем цель проекта.',
      icon: ClipboardPenLine,
    },
    {
      id: 'comments',
      label: 'Замеры и вводные',
      shortLabel: 'Замеры',
      description: 'Фиксируем измеримые параметры и свободные технические вводные.',
      icon: MessageSquareQuote,
    },
    {
      id: 'run',
      label: 'Сборка ТЗ',
      shortLabel: 'Сборка',
      description: 'Показываем, как из введённых данных формируется обезличенный черновик ТЗ.',
      icon: ScanSearch,
    },
    {
      id: 'editor',
      label: 'Редактор',
      shortLabel: 'Редактор',
      description: 'Проверяем черновик, уточняем формулировки и готовим итоговый пакет.',
      icon: FileCog,
    },
    {
      id: 'export',
      label: 'Экспорт',
      shortLabel: 'Экспорт',
      description: 'Добавляем финальные реквизиты и запускаем демо-генерацию в нужном формате.',
      icon: FileOutput,
    },
  ],
}

export function getWorkflowStages(branch: DemoDocumentType) {
  return workflowDefinitions[branch]
}

export function getWorkflowStage(branch: DemoDocumentType, stageId: DemoWorkflowStageId) {
  return workflowDefinitions[branch].find((stage) => stage.id === stageId) ?? workflowDefinitions[branch][0]
}

export function getBranchLabel(branch: DemoDocumentType) {
  return branch === 'kp' ? 'Коммерческое предложение' : 'Техническое задание'
}

export function getBranchShortLabel(branch: DemoDocumentType) {
  return branch === 'kp' ? 'КП' : 'ТЗ'
}
