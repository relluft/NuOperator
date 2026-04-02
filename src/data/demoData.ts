import type {
  DemoAsset,
  DemoDocumentType,
  DemoDraft,
  DemoMeasurement,
  DemoRun,
  DemoSourceOption,
  DemoStage,
  DemoState,
  DraftField,
  DraftSection,
  ExportArtifact,
  QAFlag,
  SourceLink,
  StageStatus,
} from '../types/demo'

const runStageBlueprints: Record<DemoDocumentType, DemoStage[]> = {
  kp: [
    {
      id: 'materials',
      title: 'Материалы для КП собраны',
      summary: 'Сводим потребность, материалы и вводные в единый рабочий контур.',
      durationLabel: '3 сек',
      details: 'Проверяем, что все важные вводные для коммерческого предложения собраны в одном месте.',
      durationMs: 3000,
      status: 'pending',
    },
    {
      id: 'norms',
      title: 'Коммерческие ограничения проверены',
      summary: 'Уточняем, что важно учесть в сроках, составе работ и порядке согласования.',
      durationLabel: '4 сек',
      details: 'На этом шаге подсвечиваются только те ограничения, которые влияют на итоговое КП.',
      durationMs: 4200,
      status: 'pending',
    },
    {
      id: 'pricing',
      title: 'Состав предложения собран',
      summary: 'Формируем структуру КП и подготавливаем основу для редактора.',
      durationLabel: '3 сек',
      details: 'Система собирает нейтральный каркас предложения без персональных данных и контрагентов.',
      durationMs: 3400,
      status: 'pending',
    },
    {
      id: 'draft',
      title: 'Черновик КП готов',
      summary: 'Подготавливаем рабочий документ для демонстрации и правок.',
      durationLabel: '4 сек',
      details: 'На выходе появляется черновик, который можно показать в редакторе и на согласовании.',
      durationMs: 4200,
      status: 'pending',
    },
    {
      id: 'qa',
      title: 'Точки для проверки отмечены',
      summary: 'Подсвечиваем, что стоит подтвердить перед финальной отправкой.',
      durationLabel: '3 сек',
      details: 'Сюда попадают только важные уточнения по срокам, условиям и составу работ.',
      durationMs: 3200,
      status: 'pending',
    },
    {
      id: 'ready',
      title: 'КП готово к показу',
      summary: 'Черновик можно открыть в редакторе или передать на согласование.',
      durationLabel: '2 сек',
      details: 'Демонстрационная версия готова, но персональные данные по-прежнему не используются.',
      durationMs: 2200,
      status: 'pending',
    },
  ],
  tz: [
    {
      id: 'materials',
      title: 'Исходные данные для ТЗ собраны',
      summary: 'Берём выбранную основу, измеримые параметры и вводные по проекту.',
      durationLabel: '3 сек',
      details: 'На этом шаге система собирает только технически значимые данные.',
      durationMs: 3000,
      status: 'pending',
    },
    {
      id: 'norms',
      title: 'Технические требования проверены',
      summary: 'Сверяем измеримые параметры и применимые ограничения.',
      durationLabel: '4 сек',
      details: 'Сюда попадают только нейтральные требования, без персональных и клиентских данных.',
      durationMs: 4200,
      status: 'pending',
    },
    {
      id: 'pricing',
      title: 'Техническое решение оформлено',
      summary: 'Собираем структуру ТЗ и подготавливаем её для редактора.',
      durationLabel: '3 сек',
      details: 'Документ формируется как обезличенный рабочий шаблон для дальнейшей доработки.',
      durationMs: 3400,
      status: 'pending',
    },
    {
      id: 'draft',
      title: 'Черновик ТЗ готов',
      summary: 'Подготавливаем нейтральный документ с измеримыми параметрами и вводными.',
      durationLabel: '4 сек',
      details: 'Черновик можно открыть в редакторе, проверить и использовать как основу.',
      durationMs: 4200,
      status: 'pending',
    },
    {
      id: 'qa',
      title: 'Технические уточнения отмечены',
      summary: 'Подсвечиваем, что нужно проверить до финального экспорта.',
      durationLabel: '3 сек',
      details: 'Список остаётся обезличенным и концентрируется только на качестве данных.',
      durationMs: 3200,
      status: 'pending',
    },
    {
      id: 'ready',
      title: 'ТЗ готово к показу',
      summary: 'Документ можно просмотреть, отредактировать и вывести на согласование.',
      durationLabel: '2 сек',
      details: 'Демонстрационная версия остаётся нейтральной и безопасной для показа.',
      durationMs: 2200,
      status: 'pending',
    },
  ],
}

const blankDraftFields: DraftField[] = [
  {
    id: 'dueDate',
    label: 'Срок выполнения',
    value: '',
    hint: 'Заполняется вручную на финальном этапе или через демонстрационный вариант.',
  },
  {
    id: 'specialTerms',
    label: 'Особые условия',
    value: '',
    hint: 'Свободная формулировка важных условий без персональных данных.',
  },
]

const demoFieldDefaults = {
  dueDate: 'до 10 рабочих дней после подтверждения сценария',
  specialTerms: 'работы планируются по согласованному окну без раскрытия персональных данных',
}

const emptyDraft: DemoDraft = {
  id: 'draft-main',
  caseId: 'case-main',
  documentType: 'kp',
  sections: [],
  fields: blankDraftFields,
  issues: [],
  sources: [],
  approvalState: 'needs_review',
}

export const totalRunDurationMs = runStageBlueprints.kp.reduce(
  (accumulator, stage) => accumulator + stage.durationMs,
  0,
)

export function getRunStageBlueprints(branch: DemoDocumentType) {
  return JSON.parse(JSON.stringify(runStageBlueprints[branch])) as DemoStage[]
}

export function getDefaultSectionId(branch: DemoDocumentType) {
  return branch === 'kp' ? 'kp-overview' : 'tz-overview'
}

export function getDemoNeedText(branch: DemoDocumentType, pipelineName: string) {
  if (branch === 'kp') {
    return `Для пайплайна «${pipelineName}» нужно собрать понятное коммерческое предложение: зафиксировать задачу, обозначить ожидаемый результат и подготовить основу для последующей упаковки.`
  }

  return `Для пайплайна «${pipelineName}» нужно сформулировать техническую задачу, определить измеримые параметры и подготовить структуру будущего ТЗ в нейтральном виде.`
}

export function getDemoNotes(branch: DemoDocumentType) {
  if (branch === 'kp') {
    return 'При генерации важно учесть рабочее окно, требования к безопасному проходу и необходимость оставить итоговый пакет обезличенным.'
  }

  return 'При подготовке ТЗ важно учесть измеримые параметры, рабочее окно монтажа и обязательность нейтральных формулировок без персональных ссылок.'
}

export function getDemoMaterials(): DemoAsset[] {
  return [
    {
      id: 'asset-photo-entrance',
      title: 'Фото входной группы',
      subtitle: 'Общий ракурс объекта',
      kind: 'photo',
      source: 'upload',
      note: 'Помогает визуально показать конфигурацию зоны входа на демонстрации.',
      addedAt: '2026-04-02T09:02:00.000Z',
      previewUrl: '/demo/clinic-entrance.svg',
    },
    {
      id: 'asset-photo-slope',
      title: 'Фото перепада высот',
      subtitle: 'Опорный ракурс для проектной оценки',
      kind: 'photo',
      source: 'upload',
      note: 'Используется как иллюстрация к измеримым параметрам будущего решения.',
      addedAt: '2026-04-02T09:05:00.000Z',
      previewUrl: '/demo/ramp-angle.svg',
    },
    {
      id: 'asset-note-measure',
      title: 'Лист измерений',
      subtitle: 'Демонстрационный файл',
      kind: 'file',
      source: 'office',
      note: 'Содержит пример нейтральных замеров без адресов, ФИО и контрагентов.',
      addedAt: '2026-04-02T09:11:00.000Z',
      previewUrl: '/demo/plan-sheet.svg',
      fileExtension: 'pdf',
    },
    {
      id: 'asset-photo-detail',
      title: 'Конструктивный узел',
      subtitle: 'Пример детализации для презентации',
      kind: 'photo',
      source: 'system',
      note: 'Показывает, как программа может учитывать важный фрагмент объекта в пакете материалов.',
      addedAt: '2026-04-02T09:16:00.000Z',
      previewUrl: '/demo/handrail-detail.svg',
    },
  ]
}

export function getDemoMeasurements(): DemoMeasurement[] {
  return [
    {
      id: 'measure-height',
      label: 'Перепад высот',
      value: '620',
      unit: 'мм',
      note: 'Ключевой параметр для расчёта конфигурации решения.',
    },
    {
      id: 'measure-width',
      label: 'Ширина прохода',
      value: '1820',
      unit: 'мм',
      note: 'Показывает доступную рабочую ширину зоны.',
    },
    {
      id: 'measure-door',
      label: 'Ширина проёма',
      value: '960',
      unit: 'мм',
      note: 'Нужна для проверки итоговой компоновки.',
    },
    {
      id: 'measure-platform',
      label: 'Длина площадки',
      value: '1480',
      unit: 'мм',
      note: 'Используется для описания зоны маневрирования.',
    },
  ]
}

export function getDemoSourceOptions(): DemoSourceOption[] {
  return [
    {
      id: 'source-route',
      title: 'Базовый сценарий входного маршрута',
      summary: 'Готовый пример КП, на базе которого можно показать переход к техническому заданию.',
      statusLabel: 'Подходит как основа',
      badgeTone: 'ready',
    },
    {
      id: 'source-campus',
      title: 'Пайплайн по общественной входной зоне',
      summary: 'Нейтральный демонстрационный кейс с акцентом на измеримые параметры и структуру решения.',
      statusLabel: 'Демонстрационный шаблон',
      badgeTone: 'progress',
    },
  ]
}

export function getDemoDraftFields() {
  return blankDraftFields.map((field) => {
    if (field.id === 'dueDate') {
      return { ...field, value: demoFieldDefaults.dueDate }
    }

    return { ...field, value: demoFieldDefaults.specialTerms }
  })
}

export function getDemoDraftSections(
  branch: DemoDocumentType,
  pipelineName: string,
): DraftSection[] {
  if (branch === 'kp') {
    return [
      {
        id: 'kp-overview',
        title: '1. Потребность проекта',
        summary: 'Коротко фиксируем, зачем запускается пайплайн и какой результат ожидается.',
        documentType: 'kp',
        content: [
          `Пайплайн «${pipelineName}» запускается для подготовки обезличенного коммерческого предложения по объекту.`,
          'В документе фиксируются цель проекта, ожидаемый результат и границы будущей коммерческой упаковки.',
          'Финальные реквизиты, контрагенты и персональные данные будут добавлены человеком на завершающем этапе.',
        ],
      },
      {
        id: 'kp-materials',
        title: '2. Материалы и опорные данные',
        summary: 'Отмечаем, какие входные данные использовались при подготовке черновика.',
        documentType: 'kp',
        stats: [
          { label: 'Материалы', value: '4 демонстрационных источника' },
          { label: 'Формат', value: 'обезличенный рабочий пакет' },
        ],
        content: [
          'В основу предложения вошли фотографии зоны, лист измерений и примеры конструктивных узлов.',
          'Все материалы используются только как безопасные демонстрационные входные данные без привязки к персоналиям.',
        ],
      },
      {
        id: 'kp-conditions',
        title: '3. Коммерческие вводные',
        summary: 'Свободные вводные, которые нужно учесть при генерации и согласовании.',
        documentType: 'kp',
        stats: [
          { label: 'Срок', value: '{{dueDate}}' },
          { label: 'Условия', value: '{{specialTerms}}' },
        ],
        content: [
          'Коммерческая часть собирается в нейтральной форме и ориентируется на внутреннее согласование.',
          'До финального экспорта человек вручную добавляет реквизиты и другие чувствительные данные.',
        ],
      },
    ]
  }

  return [
    {
      id: 'tz-overview',
      title: '1. Основа и техническая цель',
      summary: 'Показываем, из каких вводных строится техническое задание.',
      documentType: 'tz',
      content: [
        `Пайплайн «${pipelineName}» переводится в формат технического задания на базе нейтральной проектной основы.`,
        'Документ описывает цель, измеримые параметры и требования к структуре итогового решения.',
      ],
    },
    {
      id: 'tz-parameters',
      title: '2. Измеримые параметры',
      summary: 'Собираем ключевые значения, которые влияют на проектное решение.',
      documentType: 'tz',
      stats: [
        { label: 'Замеры', value: '4 контрольных параметра' },
        { label: 'Формат', value: 'структурированный черновик ТЗ' },
      ],
      content: [
        'В рабочую версию ТЗ включены ключевые размеры, необходимые для проектной проработки.',
        'Значения остаются обезличенными и используются как пример структуры будущего документа.',
      ],
    },
    {
      id: 'tz-conditions',
      title: '3. Ограничения и вводные',
      summary: 'Фиксируем условия, которые влияют на подготовку и последующую реализацию.',
      documentType: 'tz',
      stats: [
        { label: 'Срок', value: '{{dueDate}}' },
        { label: 'Условия', value: '{{specialTerms}}' },
      ],
      content: [
        'Документ формулируется без упоминания заказчика, контрагента и иных персональных атрибутов.',
        'Чувствительные данные добавляются человеком только после внутренней проверки черновика.',
      ],
    },
  ]
}

export function getDemoDraftIssues(branch: DemoDocumentType): QAFlag[] {
  if (branch === 'kp') {
    return [
      {
        id: 'issue-window',
        title: 'Подтвердить рабочее окно',
        severity: 'medium',
        summary: 'Стоит ещё раз проверить, что временной слот для работ согласуется с внутренним графиком объекта.',
        relatedSectionId: 'kp-conditions',
      },
      {
        id: 'issue-terms',
        title: 'Проверить формулировку условий',
        severity: 'low',
        summary: 'Финальный текст лучше сократить до одной ясной формулировки перед экспортом.',
        relatedSectionId: 'kp-conditions',
      },
    ]
  }

  return [
    {
      id: 'issue-measurements',
      title: 'Сверить измеримые параметры',
      severity: 'medium',
      summary: 'Перед экспортом ТЗ стоит ещё раз подтвердить комплект контрольных значений.',
      relatedSectionId: 'tz-parameters',
    },
    {
      id: 'issue-limits',
      title: 'Проверить ограничения монтажа',
      severity: 'low',
      summary: 'Рекомендуется перепроверить формулировки условий, влияющих на реализацию проекта.',
      relatedSectionId: 'tz-conditions',
    },
  ]
}

export function getDemoDraftSources(branch: DemoDocumentType): SourceLink[] {
  if (branch === 'kp') {
    return [
      {
        id: 'source-material-photo',
        label: 'Фото зоны проекта',
        sourceType: 'photo',
        excerpt: 'Визуальный материал помогает быстро показать исходную конфигурацию объекта.',
        relatedSectionId: 'kp-materials',
        confidence: 'high',
      },
      {
        id: 'source-material-sheet',
        label: 'Лист измерений',
        sourceType: 'note',
        excerpt: 'Нейтральный файл с основными параметрами использован как демонстрационная опора.',
        relatedSectionId: 'kp-materials',
        confidence: 'high',
      },
      {
        id: 'source-terms',
        label: 'Вводные по условиям',
        sourceType: 'note',
        excerpt: 'Свободная заметка пользователя учитывается в коммерческой части и согласовании.',
        relatedSectionId: 'kp-conditions',
        confidence: 'medium',
      },
    ]
  }

  return [
    {
      id: 'source-base',
      label: 'Демонстрационная основа из КП',
      sourceType: 'note',
      excerpt: 'Используется как нейтральная проектная база для формирования ТЗ.',
      relatedSectionId: 'tz-overview',
      confidence: 'high',
    },
    {
      id: 'source-measurements',
      label: 'Контрольные параметры',
      sourceType: 'photo',
      excerpt: 'Замеры и материалы собраны как пример структуры будущего технического пакета.',
      relatedSectionId: 'tz-parameters',
      confidence: 'high',
    },
    {
      id: 'source-limits',
      label: 'Рабочие вводные',
      sourceType: 'norm',
      excerpt: 'Свободные условия помогают показать, как дополнительные ограничения влияют на текст ТЗ.',
      relatedSectionId: 'tz-conditions',
      confidence: 'medium',
    },
  ]
}

export function createDemoExportArtifacts(): ExportArtifact[] {
  return [
    {
      id: 'export-demo-pdf',
      format: 'PDF',
      fileName: 'NuOperator-demo-pipeline.pdf',
      createdAt: '2026-04-02T10:12:00.000Z',
      status: 'generated',
    },
    {
      id: 'export-demo-docx',
      format: 'DOCX',
      fileName: 'NuOperator-demo-pipeline.docx',
      createdAt: '2026-04-02T10:14:00.000Z',
      status: 'generated',
    },
  ]
}

export const initialDemoState: DemoState = {
  cases: [
    {
      id: 'case-main',
      kpRequestSummary: '',
      kpContextNotes: '',
      kpMaterials: [],
      tzRequestSummary: '',
      tzTechnicalNotes: '',
      tzMeasurements: [],
      runId: 'run-main',
      draftId: 'draft-main',
      approvalId: 'approval-main',
      isAnchor: true,
    },
  ],
  run: {
    id: 'run-main',
    caseId: 'case-main',
    status: 'idle',
    startedAt: null,
    completedAt: null,
    stages: getRunStageBlueprints('kp'),
  },
  draft: emptyDraft,
  selectedDocumentType: 'kp',
  selectedSectionId: getDefaultSectionId('kp'),
  focusedIssueId: null,
  exportArtifacts: [],
  previewArtifact: null,
  approvalSent: false,
  recentOperations: [],
  currentBranchStage: {
    kp: 'need',
    tz: 'source',
  },
  branchProgress: {
    kp: {
      currentStageId: 'need',
      completedStageIds: [],
    },
    tz: {
      currentStageId: 'source',
      completedStageIds: [],
    },
  },
  selectedSourceKpId: null,
  branchLaunch: {
    kp: {
      started: false,
      pipelineName: '',
    },
    tz: {
      started: false,
      pipelineName: '',
    },
  },
  demoAppliedByPage: {},
}

export function createInitialDemoState() {
  return JSON.parse(JSON.stringify(initialDemoState)) as DemoState
}

export function resolveRunStages(run: DemoRun, branch: DemoDocumentType, now = Date.now()) {
  const elapsed =
    run.status === 'completed' || run.completedAt
      ? totalRunDurationMs
      : run.startedAt
        ? Math.max(now - run.startedAt, 0)
        : 0

  let cursor = 0
  const stages = getRunStageBlueprints(branch).map((stage) => {
    const stageStart = cursor
    const stageEnd = stageStart + stage.durationMs
    let status: StageStatus = 'pending'
    let progress = 0

    if (run.status !== 'idle' && elapsed >= stageEnd) {
      status = 'completed'
      progress = 1
    } else if (run.status !== 'idle' && elapsed >= stageStart) {
      status = 'in_progress'
      progress = Math.min((elapsed - stageStart) / stage.durationMs, 1)
    }

    cursor = stageEnd

    return {
      ...stage,
      status,
      progress,
    }
  })

  return {
    stages,
    totalProgress: Math.min(elapsed / totalRunDurationMs, 1),
    activeStage: stages.find((stage) => stage.status === 'in_progress') ?? stages.at(-1) ?? null,
    isComplete: stages.every((stage) => stage.status === 'completed'),
  }
}

export function createExportArtifact(format: ExportArtifact['format']) {
  const timestamp = new Date().toISOString()
  const stamp = timestamp.replace(/[:.]/g, '-')

  return {
    id: `export-${format.toLowerCase()}-${stamp}`,
    format,
    fileName: `NuOperator-${format.toLowerCase()}-${stamp}.${format.toLowerCase()}`,
    createdAt: timestamp,
    status: 'generated',
  } satisfies ExportArtifact
}
