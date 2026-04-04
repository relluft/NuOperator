import type {
  DraftCellAnnotation,
  DraftCellId,
  DemoAsset,
  DemoDocumentType,
  DemoDraft,
  DemoOfferTable,
  DemoOfferTableItem,
  DemoOfferTableTotal,
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

const defaultOfferServiceTotals: DemoOfferTableTotal[] = [
  {
    id: 'offer-transport',
    label: 'РўР РђРќРЎРџРћР РўРќР«Р• Р РђРЎРҐРћР”Р«',
    grandTotal: 83605.29,
    tone: 'service',
  },
  {
    id: 'offer-setup',
    label: 'РћР Р“РђРќРР—РђР¦РРЇ Р РђР‘РћРў РќРђ РћР‘РЄР•РљРўР•',
    grandTotal: 12480,
    tone: 'service',
  },
]

function sumOfferAmounts(items: DemoOfferTableItem[]) {
  return items.reduce(
    (accumulator, item) => {
      const productTotal = item.quantity * item.unitPrice
      const installationTotal = item.quantity * item.installationUnitPrice

      return {
        productTotal: accumulator.productTotal + productTotal,
        installationTotal: accumulator.installationTotal + installationTotal,
        grandTotal: accumulator.grandTotal + productTotal + installationTotal,
      }
    },
    {
      productTotal: 0,
      installationTotal: 0,
      grandTotal: 0,
    },
  )
}

function buildOfferTotals(
  items: DemoOfferTableItem[],
  serviceTotals: DemoOfferTableTotal[] = defaultOfferServiceTotals,
): DemoOfferTableTotal[] {
  const subtotal = sumOfferAmounts(items)
  const serviceGrandTotal = serviceTotals.reduce((accumulator, total) => accumulator + total.grandTotal, 0)

  return [
    {
      id: 'offer-subtotal',
      label: 'РРўРћР“Рћ',
      productTotal: subtotal.productTotal,
      installationTotal: subtotal.installationTotal,
      grandTotal: subtotal.grandTotal,
      tone: 'subtotal',
    },
    ...serviceTotals.map((total) => ({ ...total })),
    {
      id: 'offer-final',
      label: 'РРўРћР“Рћ, Р’РљР›Р®Р§РђРЇ Р”РћРЎРўРђР’РљРЈ Р РњРћРќРўРђР–',
      grandTotal: subtotal.grandTotal + serviceGrandTotal,
      tone: 'final',
    },
  ]
}

export function createEmptyOfferTable(): DemoOfferTable {
  return {
    items: [],
    totals: buildOfferTotals([]),
  }
}

export function recalculateOfferTable(offerTable: DemoOfferTable): DemoOfferTable {
  const serviceTotals = offerTable.totals
    .filter((total) => total.tone === 'service')
    .map((total) => ({
      id: total.id,
      label: total.label,
      grandTotal: total.grandTotal,
      tone: 'service' as const,
    }))

  return {
    ...offerTable,
    totals: buildOfferTotals(offerTable.items, serviceTotals.length ? serviceTotals : defaultOfferServiceTotals),
  }
}

export function getDemoOfferTable(): DemoOfferTable {
  const items: DemoOfferTableItem[] = [
    {
      id: 'offer-mnemo',
      description:
        'Мнемосхема тактильная полноцветная с рельефом и дублированием шрифтом Брайля, защитное покрытие, формат 610x470 мм.',
      quantity: 1,
      unitPrice: 18640,
      installationUnitPrice: 1650,
    },
    {
      id: 'offer-sign-set',
      description:
        'Комплект тактильных пиктограмм для входной группы и основных точек маршрута: вход, направление движения, кнопка вызова, зона ожидания.',
      quantity: 4,
      unitPrice: 742.35,
      installationUnitPrice: 315,
    },
    {
      id: 'offer-contrast-tape',
      description:
        'Лента контрастная для маркировки ступеней и дверных проемов, самоклеящаяся, желтая, ширина 100 мм.',
      quantity: 18,
      unitPrice: 684.1,
      installationUnitPrice: 420,
    },
    {
      id: 'offer-tactile-tile',
      description:
        'Плитка тактильная предупреждающая, полиуретановая, наружное исполнение, размер 300x300 мм.',
      quantity: 24,
      unitPrice: 1952.75,
      installationUnitPrice: 735,
    },
    {
      id: 'offer-nosing',
      description:
        'Накладка на ступень противоскользящая в алюминиевом профиле с контрастной вставкой, длина 1000 мм.',
      quantity: 11,
      unitPrice: 1909.95,
      installationUnitPrice: 682.5,
    },
    {
      id: 'offer-call-button',
      description:
        'Антивандальная кнопка вызова со стойкой крепления и базовой индикацией для входной зоны.',
      quantity: 1,
      unitPrice: 4875.9,
      installationUnitPrice: 1260,
    },
    {
      id: 'offer-loop',
      description:
        'Переносная индукционная система для обслуживания посетителей с нарушением слуха, портативный комплект.',
      quantity: 1,
      unitPrice: 23184.55,
      installationUnitPrice: 0,
    },
    {
      id: 'offer-handrail',
      description:
        'Ограждение с двухуровневыми поручнями, нержавеющая сталь, напольное исполнение, основной марш и площадка.',
      quantity: 12.5,
      unitPrice: 18900,
      installationUnitPrice: 8400,
    },
    {
      id: 'offer-dismantle-rail',
      description: 'Демонтаж существующих металлических ограждений по линии прохода.',
      quantity: 8,
      unitPrice: 0,
      installationUnitPrice: 500,
    },
    {
      id: 'offer-dismantle-tile',
      description: 'Демонтаж существующей тактильной плитки на проблемных участках маршрута.',
      quantity: 1.62,
      unitPrice: 0,
      installationUnitPrice: 500,
    },
    {
      id: 'offer-dismantle-step',
      description: 'Демонтаж существующих накладок на ступени с подготовкой основания под новый монтаж.',
      quantity: 4.5,
      unitPrice: 0,
      installationUnitPrice: 150,
    },
  ]

  const subtotal = sumOfferAmounts(items)
  const transportTotal = 83605.29
  const setupTotal = 12480

  return {
    items,
    totals: [
      {
        id: 'offer-subtotal',
        label: 'ИТОГО',
        productTotal: subtotal.productTotal,
        installationTotal: subtotal.installationTotal,
        grandTotal: subtotal.grandTotal,
        tone: 'subtotal',
      },
      {
        id: 'offer-transport',
        label: 'ТРАНСПОРТНЫЕ РАСХОДЫ',
        grandTotal: transportTotal,
        tone: 'service',
      },
      {
        id: 'offer-setup',
        label: 'ОРГАНИЗАЦИЯ РАБОТ НА ОБЪЕКТЕ',
        grandTotal: setupTotal,
        tone: 'service',
      },
      {
        id: 'offer-final',
        label: 'ИТОГО, ВКЛЮЧАЯ ДОСТАВКУ И МОНТАЖ',
        grandTotal: subtotal.grandTotal + transportTotal + setupTotal,
        tone: 'final',
      },
    ],
  }
}

function makeCellSource(label: string, sourceType: 'norm' | 'price' | 'photo' | 'note', excerpt: string) {
  return {
    label,
    sourceType,
    excerpt,
    confidence: sourceType === 'price' || sourceType === 'norm' ? ('medium' as const) : ('high' as const),
  }
}

function makeCellAnnotation(
  cellId: DraftCellId,
  sources: ReturnType<typeof makeCellSource>[],
  issue?: DraftCellAnnotation['issue'],
): DraftCellAnnotation {
  return {
    cellId,
    sources,
    issue,
  }
}

export function getDemoDraftCellAnnotations(
  branch: DemoDocumentType,
): Partial<Record<DraftCellId, DraftCellAnnotation>> {
  if (branch !== 'kp') {
    return {}
  }

  const offerTable = getDemoOfferTable()
  const annotations: Partial<Record<DraftCellId, DraftCellAnnotation>> = {}

  offerTable.items.forEach((item, index) => {
    const baseNote = `Позиция ${index + 1} собрана из демонстрационного набора материалов и монтажных работ.`
    const descriptionId = `kp-item:${item.id}:description` as DraftCellId
    const quantityId = `kp-item:${item.id}:quantity` as DraftCellId
    const unitPriceId = `kp-item:${item.id}:unitPrice` as DraftCellId
    const installationPriceId = `kp-item:${item.id}:installationUnitPrice` as DraftCellId
    const productTotalId = `kp-item:${item.id}:productTotal` as DraftCellId
    const installationTotalId = `kp-item:${item.id}:installationTotal` as DraftCellId
    const grandTotalId = `kp-item:${item.id}:grandTotal` as DraftCellId

    annotations[descriptionId] = makeCellAnnotation(descriptionId, [
      makeCellSource('Демо-позиция', 'note', baseNote),
      makeCellSource('Фото и замеры', 'photo', 'Описание опирается на нейтральные фото зоны и лист замеров.'),
    ])

    annotations[quantityId] = makeCellAnnotation(quantityId, [
      makeCellSource('Ведомость объёмов', 'note', `Количество ${item.quantity} зафиксировано как стартовый объём для демонстрации.`),
    ])

    annotations[unitPriceId] = makeCellAnnotation(
      unitPriceId,
      [
        makeCellSource('Демо-прайс', 'price', 'Цена товара взята из демонстрационного прайс-листа и требует ручной сверки.'),
      ],
      item.id === 'offer-loop'
        ? {
            severity: 'high',
            title: 'Проверить цену поставщика',
            summary: 'По этой позиции цена чувствительна к наличию и бренду, нужна ручная перепроверка.',
          }
        : undefined,
    )

    annotations[installationPriceId] = makeCellAnnotation(
      installationPriceId,
      [
        makeCellSource('Монтажная оценка', 'note', 'Стоимость монтажа собрана из типового окна работ и логистики бригады.'),
      ],
      item.id === 'offer-handrail'
        ? {
            severity: 'medium',
            title: 'Уточнить сложность монтажа',
            summary: 'Монтаж может измениться после уточнения основания и узлов крепления.',
          }
        : undefined,
    )

    annotations[productTotalId] = makeCellAnnotation(productTotalId, [
      makeCellSource('Авторасчёт', 'note', 'Сумма товара считается автоматически: количество × цена товара.'),
    ])

    annotations[installationTotalId] = makeCellAnnotation(installationTotalId, [
      makeCellSource('Авторасчёт', 'note', 'Сумма монтажа считается автоматически: количество × цена монтажа.'),
    ])

    annotations[grandTotalId] = makeCellAnnotation(grandTotalId, [
      makeCellSource('Авторасчёт', 'note', 'Итог по строке складывается из суммы товара и суммы монтажа.'),
    ])
  })

  offerTable.totals.forEach((total) => {
    const cellId = `kp-total:${total.id}` as DraftCellId
    annotations[cellId] = makeCellAnnotation(cellId, [
      makeCellSource(
        total.tone === 'service' ? 'Служебная надбавка' : 'Авторасчёт',
        'note',
        total.tone === 'service'
          ? 'Значение заведено как отдельная сервисная строка и проверяется вручную.'
          : 'Итоговый блок считается автоматически на основе строк таблицы.',
      ),
    ])
  })

  const dueDateId = 'kp-field:dueDate' as DraftCellId
  annotations[dueDateId] = makeCellAnnotation(
    dueDateId,
    [
      makeCellSource('Коммерческие вводные', 'note', 'Срок берётся из рабочего окна проекта и подтверждается вручную перед отправкой.'),
    ],
    {
      severity: 'medium',
      title: 'Подтвердить рабочее окно',
      summary: 'Перед финальной отправкой нужно сверить срок с фактическим графиком объекта.',
    },
  )

  const specialTermsId = 'kp-field:specialTerms' as DraftCellId
  annotations[specialTermsId] = makeCellAnnotation(
    specialTermsId,
    [
      makeCellSource('Свободные вводные', 'note', 'Формулировка собирается из заметок менеджера и обычно дорабатывается вручную.'),
    ],
    {
      severity: 'low',
      title: 'Упростить формулировку',
      summary: 'Текст лучше держать коротким и однозначным перед экспортом.',
    },
  )

  return annotations
}

const emptyDraft: DemoDraft = {
  id: 'draft-main',
  caseId: 'case-main',
  documentType: 'kp',
  sections: [],
  offerTable: createEmptyOfferTable(),
  fields: blankDraftFields,
  cellAnnotations: {},
  issues: [],
  sources: [],
}

function getTodayLocalDate() {
  const now = new Date()
  const timezoneOffsetMs = now.getTimezoneOffset() * 60 * 1000
  return new Date(now.getTime() - timezoneOffsetMs).toISOString().slice(0, 10)
}

export function createEmptyExportForm() {
  return {
    counterpartyName: '',
    counterpartyAddress: '',
    objectAddress: '',
    documentDate: getTodayLocalDate(),
    signatoryName: '',
    manualNotes: '',
  } satisfies DemoState['exportForm']
}

export function createDemoExportForm() {
  return {
    counterpartyName: 'ООО "Городская среда"',
    counterpartyAddress: 'Москва, ул. Новая Басманная, д. 14, стр. 2',
    objectAddress: 'Москва, Ленинский проспект, д. 52, входная группа поликлиники',
    documentDate: getTodayLocalDate(),
    signatoryName: 'Иванов Сергей Петрович',
    manualNotes:
      'Демо-реквизиты для финального экспорта. В реальном сценарии эти данные сотрудник уточняет перед выпуском документа.',
  } satisfies DemoState['exportForm']
}

export function createEmptyExportGeneration() {
  return {
    selectedFormat: null,
    status: 'idle',
    progressPercent: 0,
    generatedArtifact: null,
    downloadMessage: null,
  } satisfies DemoState['exportGeneration']
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

export function getDemoNeedText(branch: DemoDocumentType, _pipelineName: string) {
  if (branch === 'kp') {
    return `Нужно привести входную группу в рабочее и понятное состояние для маломобильных посетителей. Сейчас на входе слишком крутой подъём, неудобный подход к двери, старое металлическое ограждение и скользкое покрытие перед входом. Заказчик хочет решить вопрос без полной перестройки крыльца, но так, чтобы объект выглядел аккуратно и им можно было пользоваться в обычном режиме.

Нужно предусмотреть демонтаж того, что сейчас мешает нормальному проходу: старого ограждения, повреждённых участков покрытия и элементов, которые сужают проход. Далее предложить новый узел входа: нормальный пандус или более удобное решение по подъёму, новые поручни с двух сторон, нескользящее покрытие, понятную организацию подхода к двери и безопасный заезд без резких перепадов.

Также нужно заложить закупку основных позиций: металлоконструкции для поручней и ограждений, покрытие для наружного применения, крепёж, доборные элементы, при необходимости тактильные обозначения и таблички. Если где-то требуется подливка, выравнивание основания, локальный ремонт ступеней или площадки перед входом, это тоже нужно включить в состав работ.

Важно, чтобы решение было без избыточной сложности: объект действующий, работы нужно выполнить поэтапно, без долгого перекрытия входа. Нужен понятный перечень того, что демонтируем, что изготавливаем или закупаем, что монтируем на месте и какой итоговый результат должен получить заказчик.`
  }

  return `Нужно зафиксировать состав работ по входной группе и маршруту прохода. Требуется убрать мешающие элементы, привести основание и подход к двери в рабочее состояние, предусмотреть безопасное перемещение маломобильных посетителей и исключить резкие перепады по высоте на основном пути движения.

В составе решения нужно отразить демонтаж старых ограждений и повреждённых участков, выравнивание проблемных зон, устройство нового узла прохода, монтаж поручней, обновление покрытия и все сопутствующие работы, без которых результат не будет рабочим. Отдельно нужно учесть материалы и элементы, которые должны быть закуплены для монтажа.

Также нужно обозначить ограничения по объекту: вход действующий, работы желательно выполнять поэтапно, без длительной остановки эксплуатации. Формулировки должны быть прикладными: какие элементы меняем, что именно выполняем на площадке, что должно быть смонтировано в итоге и каким требованиям должен соответствовать готовый результат.`
}

export function getDemoNotes(branch: DemoDocumentType) {
  if (branch === 'kp') {
    return 'Клиент рассматривает предложение как ориентир для первого согласования, поэтому стоимость лучше держать в нижней рабочей границе без лишних запасов и необязательных позиций. Если возможны разные варианты исполнения, в основу ставить надежное и аккуратное решение без избыточного удорожания, а улучшения при необходимости выносить отдельно. Сроки показывать стандартные, без ускоренного монтажа, но с учетом того, что вход действующий и работы желательно выполнять поэтапно.'
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
        table: {
          title: 'Сводная таблица',
          columns: ['Позиция', 'Что входит', 'Ед.', 'Кол-во', 'Комментарий'],
          rows: [
            ['Подготовка зоны', 'Демонтаж старых элементов и расчистка подхода', 'этап', '1', 'Стартовый блок перед монтажом'],
            ['Пандусный узел', 'Каркас, настил и примыкание к входной площадке', 'комплект', '1', 'Базовое решение для демо-сборки'],
            ['Поручни', 'Двусторонние поручни с крепежом', 'линия', '2', 'Полный контур сопровождения'],
            ['Покрытие', 'Нескользящее наружное покрытие', 'зона', '1', 'Для основной траектории движения'],
            ['Сопутствующие работы', 'Подгонка основания и финишная сборка', 'этап', '1', 'Закрывает демонстрационный объем'],
          ],
        },
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
      table: {
        title: 'Контрольные параметры',
        columns: ['Параметр', 'Текущее значение', 'Целевое состояние', 'Примечание'],
        rows: [
          ['Ширина прохода', '1,24 м', 'не уже 1,20 м', 'Оставляем безопасный запас'],
          ['Высота подъема', '0,42 м', 'с плавным набором', 'Без резкого перелома по траектории'],
          ['Площадка перед входом', '1,56 x 1,68 м', 'достаточно для разворота', 'Используется как опорная зона'],
          ['Поручни', 'отсутствуют', 'с двух сторон', 'Закладывается в базовое решение'],
        ],
      },
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

export function createInitialDemoState(): DemoState {
  return {
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
        exportId: 'export-main',
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
    draft: JSON.parse(JSON.stringify(emptyDraft)) as DemoDraft,
    nextPipelineNumber: 1,
    selectedDocumentType: 'kp',
    selectedSectionId: getDefaultSectionId('kp'),
    focusedIssueId: null,
    exportForm: createEmptyExportForm(),
    exportGeneration: createEmptyExportGeneration(),
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
  } satisfies DemoState
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

    if (run.status !== 'idle' && run.status !== 'aborted' && elapsed >= stageEnd) {
      status = 'completed'
      progress = 1
    } else if (run.status !== 'idle' && run.status !== 'aborted' && elapsed >= stageStart) {
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
    activeStage: stages.find((stage) => stage.status === 'in_progress') ?? null,
    isComplete: stages.every((stage) => stage.status === 'completed'),
  }
}

export function createExportArtifact(format: ExportArtifact['format']) {
  const timestamp = new Date().toISOString()
  const stamp = timestamp.replace(/[:.]/g, '-')
  const extension = format === 'XLSX' ? 'xlsx' : format.toLowerCase()

  return {
    id: `export-${format.toLowerCase()}-${stamp}`,
    format,
    fileName: `NuOperator-${format.toLowerCase()}-${stamp}.${extension}`,
    createdAt: timestamp,
    status: 'generated',
  } satisfies ExportArtifact
}
