import { useEffect, useRef, useState} from 'react'
import { Link, useParams } from 'react-router-dom'
import { IndexSummary, IndexSnapshot, ConnectionState } from './types'
import { fetchIndices, fetchIndexSnapshot, getLiveUrl } from './api'
import Header from './components/Header'
import Dashboard from './components/index/Dashboard'
import { formatNumber, formatTimestamp } from './utils/format'

export default function IndexDetail() {
  const { indexCode } = useParams()
  const [index, setIndex] = useState<IndexSummary | null>(null)
  const [snapshot, setSnapshot] = useState<IndexSnapshot | null>(null)
  const [loadingIndex, setLoadingIndex] = useState(true)
  const [loadingSnapshot, setLoadingSnapshot] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [connection, setConnection] = useState<ConnectionState>('offline')
  const socketRef = useRef<WebSocket | null>(null)
  const requestedCode = indexCode?.toUpperCase()

  useEffect(() => {
    setLoadingIndex(true)
    setError(null)
    fetchIndices()
      .then((indices) => {
        const found = indices.find((item) => item.code.toUpperCase() === requestedCode)
        if (!found) throw new Error(`Index ${requestedCode ?? ''} was not found.`)
        setIndex(found)
      })
      .catch((requestError: unknown) => setError(requestError instanceof Error ? requestError.message : 'Unable to load index.'))
      .finally(() => setLoadingIndex(false))
  }, [requestedCode])

  useEffect(() => {
    if (!index) return
    setSnapshot(null)
    setLoadingSnapshot(true)
    fetchIndexSnapshot(index.id)
      .then(setSnapshot)
      .catch((requestError: unknown) => setError(requestError instanceof Error ? requestError.message : 'Unable to load market data.'))
      .finally(() => setLoadingSnapshot(false))
  }, [index])

  useEffect(() => {
    if (!index) return
    let socket: WebSocket | null = null
    const connectTimer = window.setTimeout(() => {
      try {
        socket = new WebSocket(getLiveUrl(index.id))
        socketRef.current = socket
        setConnection('connecting')
        socket.onopen = () => socketRef.current === socket && setConnection('live')
        socket.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data) as Record<string, unknown>
            const rawValue = message.index_value ?? message.value
            const value = typeof rawValue === 'number' ? rawValue : Number(rawValue)
            if (Number.isFinite(value)) setSnapshot((current) => current ? { ...current, index_value: value, timestamp: typeof message.timestamp === 'string' ? message.timestamp : current.timestamp } : current)
          } catch {
            const value = Number(event.data)
            if (Number.isFinite(value)) setSnapshot((current) => current ? { ...current, index_value: value } : current)
          }
        }
        socket.onerror = () => socketRef.current === socket && setConnection('offline')
        socket.onclose = () => socketRef.current === socket && setConnection('offline')
      } catch {
        setConnection('offline')
      }
    }, 0)
    return () => {
      window.clearTimeout(connectTimer)
      if (socketRef.current === socket) socketRef.current = null
      socket?.close()
    }
  }, [index])

  return <main className="shell">
    <Header connection={connection} />
    <div className="detail-actions"><Link to="/">← All indices</Link></div>
    {loadingIndex || loadingSnapshot ? <div className="state-card">Loading {requestedCode ?? 'index'} market data...</div> : error ? <div className="state-card error"><strong>Could not load this index.</strong><span>{error}</span></div> : index && snapshot ? <Dashboard index={index} snapshot={snapshot} /> : null}
  </main>
}
