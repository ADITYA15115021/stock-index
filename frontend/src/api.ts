import type { IndexConstituent, IndexSnapshot, IndexSummary, SecurityDetail,IndexHistoryPoint} from './types'

const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim()

if (!configuredBaseUrl) {
  console.warn('VITE_API_BASE_URL is not set; using http://localhost:8000 for local development.')
}

export const apiBaseUrl = (configuredBaseUrl || 'http://localhost:8000').replace(/\/$/, '')

console.info(`[API] Using base URL: ${apiBaseUrl}`)

async function getJson<T>(path: string): Promise<T> {
  const response = await fetch(`${apiBaseUrl}${path}`)
  if (!response.ok) {
    throw new Error(`Request failed (${response.status} ${response.statusText})`)
  }
  return response.json() as Promise<T>
}

export const fetchIndices = () => getJson<IndexSummary[]>('/indices')

export const fetchIndexSnapshot = (indexId: number) => getJson<IndexSnapshot>(`/indices/${indexId}`)

export const fetchConstituents = async (indexId: number) => {
  const data = await getJson<IndexConstituent[] | { error?: string }>(`/indices/${indexId}/constituents`)
  if (!Array.isArray(data)) throw new Error(data.error || 'Unable to load constituents.')
  return data
}

export const fetchSecurity = async (securityId: number) => {
  const data = await getJson<SecurityDetail | { error?: string }>(`/securities/${securityId}`)
  if ('error' in data && data.error) throw new Error(data.error)
  return data as SecurityDetail
}

export function getLiveUrl(indexId: number) {
  const url = new URL(apiBaseUrl)
  url.protocol = url.protocol === 'https:' ? 'wss:' : 'ws:'
  url.pathname = `${url.pathname.replace(/\/$/, '')}/indices/${indexId}/live`
  return url.toString()
}


export const fetchIndexHistory = (indexId: number, period: string) =>
  getJson<IndexHistoryPoint[]>(
    `/indices/${indexId}/history?period=${period}`
  )