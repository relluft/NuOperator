import { type ClassValue, clsx } from 'clsx'
import type { DraftField } from '../types/demo'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export function formatDateTime(value: string) {
  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}

export function fieldMap(fields: DraftField[], extraValues: Record<string, string> = {}) {
  return fields.reduce<Record<string, string>>((accumulator, field) => {
    accumulator[field.id] = field.value
    return accumulator
  }, { ...extraValues })
}

export function renderTemplate(
  template: string,
  fields: DraftField[],
  extraValues: Record<string, string> = {},
) {
  const values = fieldMap(fields, extraValues)

  return template.replace(/\{\{(.*?)\}\}/g, (_, key: string) => {
    const normalizedKey = key.trim()
    return values[normalizedKey] ?? ''
  })
}
