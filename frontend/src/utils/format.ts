
export const numberFormat = new Intl.NumberFormat('en-IN', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
})

export const percentFormat = new Intl.NumberFormat('en-IN', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
})

export function formatNumber(value: number | null | undefined) {
  return typeof value === 'number' && Number.isFinite(value)
    ? numberFormat.format(value)
    : 'Missing'
}

export function formatTimestamp(timestamp: string | null | undefined) {
  if (!timestamp) return 'Missing'

  const hasTimezone = /(?:Z|[+-]\d{2}:?\d{2})$/i.test(timestamp)
  const date = new Date(hasTimezone ? timestamp : `${timestamp}Z`)

  return Number.isNaN(date.valueOf())
    ? timestamp
    : `${date.toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'medium',
        timeZone: 'Asia/Kolkata'
      })} IST`
}