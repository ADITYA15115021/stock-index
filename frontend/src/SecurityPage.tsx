import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { SecurityDetail } from './types'
import { fetchSecurity } from './api'
import Header from './components/Header'
import { SecurityDashboard } from './components/security/SecurityDashboard'

export default function SecurityPage() {
  const { securityId } = useParams()
  const parsedSecurityId = Number(securityId)
  const [security, setSecurity] = useState<SecurityDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!Number.isInteger(parsedSecurityId) || parsedSecurityId <= 0) {
      setError('Invalid security ID.')
      setLoading(false)
      return
    }
    let cancelled = false
    setLoading(true)
    setError(null)
    fetchSecurity(parsedSecurityId)
      .then((result) => !cancelled && setSecurity(result))
      .catch((requestError: unknown) => !cancelled && setError(requestError instanceof Error ? requestError.message : 'Unable to load security.'))
      .finally(() => !cancelled && setLoading(false))
    return () => { cancelled = true }
  }, [parsedSecurityId])

  return <main className="shell">
    <Header />
    <div className="detail-actions"><Link to="/">← All indices</Link></div>
    {loading ? <div className="state-card">Loading company market data...</div> : error ? <div className="state-card error"><strong>Could not load this security.</strong><span>{error}</span></div> : security ? <SecurityDashboard security={security} /> : null}
  </main>
}

