import { Link, Route, Routes, useParams } from 'react-router-dom'
import IndexList from "./IndexList"
import IndexDetail from './IndexDetail'
import SecurityPage from './SecurityPage'

const numberFormat = new Intl.NumberFormat('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const percentFormat = new Intl.NumberFormat('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

function formatNumber(value: number | null | undefined) {
  return typeof value === 'number' && Number.isFinite(value) ? numberFormat.format(value) : 'Missing'
}

function formatTimestamp(timestamp: string | null | undefined) {
  if (!timestamp) return 'Missing'
  const hasTimezone = /(?:Z|[+-]\d{2}:?\d{2})$/i.test(timestamp)
  const date = new Date(hasTimezone ? timestamp : `${timestamp}Z`)
  return Number.isNaN(date.valueOf()) ? timestamp : `${date.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'medium', timeZone: 'Asia/Kolkata' })} IST`
}



export default function App() {
  return (
    <Routes>
      <Route path="/" element={<IndexList />} />
      <Route path="/indices/:indexCode" element={<IndexDetail />} />
      <Route path="/securities/:securityId" element={<SecurityPage />} />
      <Route path="*" element={<IndexList />} />
    </Routes>
  )
}














