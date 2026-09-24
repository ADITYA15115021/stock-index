import { useEffect, useMemo, useState } from 'react'
import { IndexConstituent } from '../../types'
import { fetchConstituents } from '../../api'
import { formatNumber, percentFormat } from '../../utils/format'
import { useNavigate } from 'react-router-dom'

export default function Constituents({ indexId }: { indexId: number }) {
  const navigate = useNavigate()
  const [constituents, setConstituents] = useState<IndexConstituent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sort, setSort] = useState<{ key: 'market_cap' | 'free_float_market_cap' | 'weight', direction: 'asc' | 'desc' }>({ key: 'weight', direction: 'desc' })

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    fetchConstituents(indexId)
      .then((result) => !cancelled && setConstituents(result))
      .catch((requestError: unknown) => !cancelled && setError(requestError instanceof Error ? requestError.message : 'Unable to load constituents.'))
      .finally(() => !cancelled && setLoading(false))
    return () => { cancelled = true }
  }, [indexId])

  const sortedConstituents = useMemo(() => [...constituents].sort((left, right) => {
    const leftValue = left[sort.key]
    const rightValue = right[sort.key]
    const leftNumber = typeof leftValue === 'number' && Number.isFinite(leftValue) ? leftValue : null
    const rightNumber = typeof rightValue === 'number' && Number.isFinite(rightValue) ? rightValue : null
    if (leftNumber === null && rightNumber === null) return 0
    if (leftNumber === null) return 1
    if (rightNumber === null) return -1
    return (leftNumber - rightNumber) * (sort.direction === 'asc' ? 1 : -1)
  }), [constituents, sort])

  const toggleSort = (key: typeof sort.key) => setSort((current) => ({ key, direction: current.key === key && current.direction === 'desc' ? 'asc' : 'desc' }))
  const sortLabel = (key: typeof sort.key) => sort.key === key ? sort.direction === 'asc' ? ' ▲' : ' ▼' : ''

  return (
    <section className="constituents-card">
      <div className="details-title">
        <p className="eyebrow">Index composition</p>
      </div>

      {loading ? (
        <div className="section-state">Loading constituents...</div>
      ) : error ? (
        <div className="section-state error">
          <strong>Could not load constituents.</strong>
          <span>{error}</span>
        </div>
      ) : constituents.length === 0 ? (
        <div className="section-state">No constituents are available for this index.</div>
      ) : (
        <div className="constituents-table-wrap">
          <table className="constituents-table">
            <thead>
              <tr>
                <th>Symbol</th>
                <th>Company name</th>
                <th>
                  <button type="button" onClick={() => toggleSort('market_cap')}>
                    Market cap{sortLabel('market_cap')}
                  </button>
                </th>
                <th>
                  <button type="button" onClick={() => toggleSort('free_float_market_cap')}>
                    Free-float market cap{sortLabel('free_float_market_cap')}
                  </button>
                </th>
                <th>
                  <button type="button" onClick={() => toggleSort('weight')}>
                    Weight{sortLabel('weight')}
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedConstituents.map((constituent) => (
                <tr
                  key={constituent.security_id}
                  onClick={() => navigate(`/securities/${constituent.security_id}`)}
                  className="clickable-row"
                  title={`View details for ${constituent.name || constituent.symbol}`}
                >
                  <td>{constituent.symbol || 'Missing'}</td>
                  <td>
                    <span className="constituent-name-link">{constituent.name || 'Missing'}</span>
                  </td>
                  <td>{formatNumber(constituent.market_cap)}</td>
                  <td>{formatNumber(constituent.free_float_market_cap)}</td>
                  <td>
                    {typeof constituent.weight === 'number' && Number.isFinite(constituent.weight)
                      ? `${percentFormat.format(constituent.weight)}%`
                      : 'Not available'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}