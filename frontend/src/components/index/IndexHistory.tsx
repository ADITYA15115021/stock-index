import { useEffect, useState } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

import { fetchIndexHistory } from '../../api'
import type { IndexHistoryPoint } from '../../types'

type Period = '1D' | '1W' | '1M' | '3M' | '6M' | '1Y'

export default function IndexHistory({ indexId }: { indexId: number }) {
  const [period, setPeriod] = useState<Period>('1D')
  const [history, setHistory] = useState<IndexHistoryPoint[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)

    fetchIndexHistory(indexId, period)
      .then(setHistory)
      .catch((requestError: unknown) => {
        setError(
          requestError instanceof Error
            ? requestError.message
            : 'Unable to load index history.'
        )
      })
      .finally(() => setLoading(false))
  }, [indexId, period])

  const chartData = history.map((item) => ({
    ...item,
    label: period === '1D' ? item.time : item.date,
  }))

  return (
    <section className="history-card">
      <div className="details-title">
        <p className="eyebrow">Index history</p>
        <h2>Index value</h2>
      </div>

      <div className="history-periods">
        {(['1D', '1W', '1M', '3M', '6M', '1Y'] as Period[]).map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setPeriod(item)}
            className={period === item ? 'active' : ''}
          >
            {item}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="section-state">Loading index history...</div>
      ) : error ? (
        <div className="section-state error">
          <strong>Could not load index history.</strong>
          <span>{error}</span>
        </div>
      ) : history.length === 0 ? (
        <div className="section-state">
          No index history is available for this period.
        </div>
      ) : (
        <div className="index-chart">
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={chartData}>
              <XAxis dataKey="label" />
              <YAxis domain={['auto', 'auto']} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="index_value"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  )
}