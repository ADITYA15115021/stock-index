import { useEffect, useState } from 'react'
import Header from "./components/Header"
import { IndexSummary } from './types'
import { fetchIndices } from './api'
import { Link } from "react-router-dom"

export default function IndexList() {
  const [indices, setIndices] = useState<IndexSummary[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchIndices()
      .then(setIndices)
      .catch((requestError: unknown) =>
        setError(requestError instanceof Error ? requestError.message : 'Unable to load market indices.')
      )
      .finally(() => setLoading(false))
  }, [])

  const filteredIndices = indices.filter(
    (index) =>
      index.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      index.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <main className="shell">
      <Header />

      <section className="hero-landing">
        <div className="hero-content">
          <p className="eyebrow">Market Intelligence & Benchmarks</p>
          <h1>Market Indices & Analytics</h1>
          <p>
            Explore real-time sector indices, track benchmark performance, and analyze constituent equity movements across markets.
          </p>
        </div>

        <div className="hero-stats">
          <div className="stat-badge">
            <span className="stat-label">Tracked Indices</span>
            <strong className="stat-value">{loading ? '...' : indices.length}</strong>
          </div>
          <div className="stat-badge">
            <span className="stat-label">Feed Status</span>
            <strong className="stat-value live-text">● Live Sync</strong>
          </div>
          <div className="stat-badge">
            <span className="stat-label">Data Frequency</span>
            <strong className="stat-value">Real-Time</strong>
          </div>
        </div>
      </section>

      <section className="indices-section">
        <div className="section-header">
          <h2>Available Market Indices</h2>
          <p className="section-subtitle">Select an index below to view detailed price history and constituent weights</p>
          <div className="search-box">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              placeholder="Search by index code or name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            {searchQuery && (
              <button type="button" className="clear-search" onClick={() => setSearchQuery('')}>
                ✕
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="state-card">Loading available market indices...</div>
        ) : error ? (
          <div className="state-card error">
            <strong>Could not load market indices.</strong>
            <span>{error}</span>
          </div>
        ) : indices.length === 0 ? (
          <div className="state-card">No active market indices are available right now.</div>
        ) : filteredIndices.length === 0 ? (
          <div className="state-card">
            No indices found matching "<strong>{searchQuery}</strong>".
          </div>
        ) : (
          <div className="index-grid" aria-label="Available indices">
            {filteredIndices.map((index) => (
              <Link key={index.id} to={`/indices/${encodeURIComponent(index.code)}`} className="index-card">
                <div className="index-card-header">
                  <span className="index-code-badge">{index.code}</span>
                  <span className="index-status-pill">{index.status || 'Active'}</span>
                </div>
                <h3 className="index-card-title">{index.name}</h3>
                <div className="index-card-footer">
                  <span>View Benchmark & Constituents</span>
                  <span className="arrow-icon">→</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="platform-features">
        <div className="feature-card">
          <div className="feature-icon">⚡</div>
          <h3>Real-Time Streaming</h3>
          <p>Instant WebSocket streaming for continuous market index value calculations and live price feeds.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">📊</div>
          <h3>Constituent Weighting</h3>
          <p>Comprehensive market-cap and free-float breakdown for every security in the benchmark.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">📈</div>
          <h3>Multi-Period Analytics</h3>
          <p>Flexible historical chart analysis ranging from 1-day intraday views to 1-year trend tracking.</p>
        </div>
      </section>
    </main>
  )
}