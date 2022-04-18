export const kebabize = (s: string): string =>
  s.replace(/\s+/g, '-').toLowerCase()

export const datetimeReviver = (key: string, value: string) =>
  ['createdAt', 'updatedAt'].includes(key) ? new Date(value) : value
