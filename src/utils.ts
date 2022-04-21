export const kebabize = (s: string): string =>
  s.replace(/\s+/g, '-').toLowerCase()

export const datetimeReviver = (key: string, value: string) =>
  ['createdAt', 'updatedAt'].includes(key) ? new Date(value) : value

export const dateStr = (date: Date): string =>
  date
    .toLocaleDateString('de-de')
    .split('.')
    .map(s => (s.length === 4 ? s : s.padStart(2, '0')))
    .join('.')
