export const kebabize = (s: string): string => {
    return s.replace(/\s+/g, '-').toLowerCase()
}
