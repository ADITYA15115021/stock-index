import { useEffect, useState } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

import { fetchSecurityHistory } from '../../api'
import type { SecurityHistoryPoint } from '../../types'

type Period = '1D' | '1W' | '1M' | '3M' | '6M' | '1Y'

export default function SecurityHistory({ securityId }: { securityId: number }) {
  const [period, setPeriod] = useState<Period>('1D')
  const [history, setHistory] = useState<SecurityHistoryPoint[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)

    fetchSecurityHistory(securityId, period)
      .then(setHistory)
      .catch((requestError: unknown) => {
        setError(
          requestError instanceof Error
            ? requestError.message
            : 'Unable to load price history.'
        )
      })
      .finally(() => setLoading(false))
  }, [securityId, period])

  const chartData = history.map((item) => ({
    ...item,
    label: period === '1D' ? item.time : item.date,
  }))

  return (
    <section className="history-card">
      <div className="history-header">
        <div className="history-title">
          <p className="eyebrow">Price history</p>
        </div>

        <div className="history-periods" role="tablist" aria-label="Select time period">
          {(['1D', '1W', '1M', '3M', '6M', '1Y'] as Period[]).map((item) => (
            <button
              key={item}
              type="button"
              role="tab"
              aria-selected={period === item}
              onClick={() => setPeriod(item)}
              className={`period-btn ${period === item ? 'active' : ''}`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="section-state">Loading price history...</div>
      ) : error ? (
        <div className="section-state error">
          <strong>Could not load price history.</strong>
          <span>{error}</span>
        </div>
      ) : history.length === 0 ? (
        <div className="section-state">
          No price history is available for this period.
        </div>
      ) : (
        <div className="index-chart">
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={chartData} margin={{ top: 12, right: 12, left: -20, bottom: 0 }}>
              <XAxis
                dataKey="label"
                stroke="var(--text-muted)"
                tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
                tickLine={false}
                axisLine={{ stroke: 'var(--border-color)' }}
              />
              <YAxis
                domain={['auto', 'auto']}
                stroke="var(--text-muted)"
                tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
                tickLine={false}
                axisLine={{ stroke: 'var(--border-color)' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--card-bg)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)',
                  borderRadius: '10px',
                  boxShadow: 'var(--shadow)',
                  fontSize: '13px'
                }}
                itemStyle={{ color: 'var(--text-primary)' }}
                labelStyle={{ color: 'var(--text-muted)', fontWeight: 600, marginBottom: '4px' }}
                formatter={(value: unknown) => [typeof value === 'number' ? `₹${value.toFixed(2)}` : String(value), 'Price']}
              />
              <Line
                type="monotone"
                dataKey="last_price"
                stroke="var(--text-primary)"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 5, fill: 'var(--text-primary)', stroke: 'var(--card-bg)', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  )
}
