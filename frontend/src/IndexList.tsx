import { useEffect, useMemo, useRef, useState } from 'react'
import Header from "./components/Header"
import { IndexSummary } from './types'
import { fetchIndices } from './api'
import { Link } from "react-router-dom"

export default function IndexList() {
  const [indices, setIndices] = useState<IndexSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchIndices()
      .then(setIndices)
      .catch((requestError: unknown) => setError(requestError instanceof Error ? requestError.message : 'Unable to load indices.'))
      .finally(() => setLoading(false))
  }, [])

  return <main className="shell">
    <Header />
    <section className="intro"><p className="eyebrow">Indian fertilizer sector</p><h1>Market indices</h1><p>Select an index to view its live value and daily market details.</p></section>
    {loading ? <div className="state-card">Loading available indices...</div> : error ? <div className="state-card error"><strong>Could not load the indices.</strong><span>{error}</span></div> : indices.length === 0 ? <div className="state-card">No active indices are available right now.</div> : <nav className="index-tabs" aria-label="Available indices">
      {indices.map((index) => <Link key={index.id} to={`/indices/${encodeURIComponent(index.code)}`}><span>{index.code}</span><small>{index.name}</small></Link>)}
    </nav>}
  </main>
}