import { SecurityDetail } from '../../types'
import { formatNumber, formatTimestamp } from '../../utils/format'
import SecurityHistory from './SecurityHistory'

export function SecurityDashboard({ security }: { security: SecurityDetail }) {
  return (
    <section className="security-page">
      <article className="hero-card security-hero">
        <p className="eyebrow">Company / security</p>
        <h1>{security.name || 'Missing'}</h1>
        <div className="security-identifiers">
          <span className="ticker">{security.symbol || 'Missing'}</span>
          <span>{security.exchange || 'Missing'}</span>
          <span>{security.series || 'Missing'}</span>
        </div>
        <div className="value-block">
          <p>Latest stock price</p>
          <strong>{formatNumber(security.last_price)}</strong>
          <span>Latest market-data observation: {formatTimestamp(security.timestamp)}</span>
        </div>
      </article>

      <aside className="details-card security-details">
        <div className="details-title">
          <p className="eyebrow">Company information</p>
          <h2>Market metrics</h2>
        </div>
        <dl>
          {[
            ['Total market capitalization', security.total_market_cap],
            ['Free-float market capitalization', security.free_float_market_cap],
            ['Impact cost', security.impact_cost],
            ['Issued size', security.issued_size],
            ['Exchange', security.exchange],
            ['Series', security.series]
          ].map(([label, value]) => (
            <div key={label as string}>
              <dt>{label}</dt>
              <dd>
                {typeof value === 'string'
                  ? value || 'Missing'
                  : formatNumber(value as number | null | undefined)}
              </dd>
            </div>
          ))}
        </dl>
      </aside>

      <SecurityHistory securityId={security.security_id} />
    </section>
  )
}
