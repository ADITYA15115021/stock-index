import { Link } from "react-router-dom"
import { ConnectionState } from "../types"


export default function Header({ connection }: { connection?: ConnectionState }) {
  return <header className="topbar">
    <Link className="brand" to="/"><span className="brand-mark">F</span><span>FERT<span>MARKET</span></span></Link>
    {connection && <div className="market-status"><span className={`status-dot ${connection}`} />{connection === 'live' ? 'Live feed connected' : connection === 'connecting' ? 'Connecting live feed' : 'Live feed unavailable'}</div>}
  </header>
}