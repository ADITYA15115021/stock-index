import { Link } from "react-router-dom"
import { ConnectionState } from "../types"
import { useTheme } from "../utils/useTheme"

export default function Header({ connection }: { connection?: ConnectionState }) {
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="topbar">
      <Link className="brand" to="/">
        <span className="brand-mark">M</span>
        <span>MARKET<span>INDEX</span></span>
      </Link>
      <div className="header-right">
        {connection && (
          <div className="market-status">
            <span className={`status-dot ${connection}`} />
            {connection === 'live'
              ? 'Live feed connected'
              : connection === 'connecting'
              ? 'Connecting live feed'
              : 'Live feed unavailable'}
          </div>
        )}
        <button
          onClick={toggleTheme}
          className="theme-toggle"
          type="button"
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
        >
          <span className="theme-toggle-icon">
            {theme === 'light' ? (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
            ) : (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
            )}
          </span>
          <span className="theme-toggle-label">{theme === 'light' ? 'Dark' : 'Light'}</span>
        </button>
      </div>
    </header>
  )
}