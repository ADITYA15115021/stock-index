export type IndexSummary = {
  id: number
  code: string
  name: string
  status?: string
  base_date?: string
  base_value?: number
}

export type IndexSnapshot = {
  index_value?: number | null
  timestamp?: string | null
  open?: number | null
  close?: number | null
  previous_close?: number | null
  high?: number | null
  low?: number | null
  change?: number | null
  change_percent?: number | null
}

export type ConnectionState = 'connecting' | 'live' | 'offline'

export type IndexConstituent = {
  security_id: number
  symbol?: string | null
  name?: string | null
  market_cap?: number | null
  free_float_market_cap?: number | null
  weight?: number | null
}

export type SecurityDetail = {
  security_id: number
  symbol?: string | null
  name?: string | null
  exchange?: string | null
  series?: string | null
  last_price?: number | null
  total_market_cap?: number | null
  free_float_market_cap?: number | null
  impact_cost?: number | null
  issued_size?: number | null
  timestamp?: string | null
  market_data?: null
}


export type IndexHistoryPoint = {
  date: string
  time: string
  index_value: number
}