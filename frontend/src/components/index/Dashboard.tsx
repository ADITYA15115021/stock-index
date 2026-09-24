import { useEffect, useMemo, useRef, useState } from 'react'
import { IndexSummary } from '../../types'
import { IndexSnapshot } from '../../types'
import Constituents from "./Constituents"
import { formatNumber, formatTimestamp, percentFormat } from '../../utils/format'
import IndexHistory from './IndexHistory'

export default function Dashboard({ index, snapshot }: { index: IndexSummary, snapshot: IndexSnapshot }) {
  const change = snapshot.change
  const hasChange = typeof change === 'number' && Number.isFinite(change)
  const positive = hasChange && change >= 0
  const sign = hasChange && change > 0 ? '+' : ''
  return <>
  <section className="dashboard">
    <article className="hero-card">
      <div className="hero-head">
        <div>
          <p className="eyebrow">Selected index</p>
          <h2>{index.name}</h2><span className="ticker">{index.code}</span>
        </div>

        <div className={`movement ${hasChange ? positive ? 'positive' : 'negative' : ''}`}>
          <span>Change</span>
          <strong>{sign}{formatNumber(snapshot.change)}</strong>

          <span>Change %</span>
          <strong>
            {hasChange && typeof snapshot.change_percent === 'number' && Number.isFinite(snapshot.change_percent)
              ? `${sign}${percentFormat.format(snapshot.change_percent)}%`
              : 'Missing'}
          </strong>
        </div>

      </div>

        <div className="value-block"><p>Current index value</p><strong>{formatNumber(snapshot.index_value)}</strong><span>Latest update: {formatTimestamp(snapshot.timestamp)}</span>
        </div></article>
    <aside className="details-card">
      <div className="details-title"><p className="eyebrow">Daily market data</p><h2>Session overview</h2></div><dl>{[['Open', snapshot.open], ['Today close', snapshot.close], ['Previous close', snapshot.previous_close], ['Day high', snapshot.high], ['Day low', snapshot.low]].map(([label, value]) => <div key={label as string}><dt>{label}</dt><dd>{formatNumber(value as number | null | undefined)}</dd></div>)}</dl>
    </aside>

    <IndexHistory indexId={index.id} /> 

    {/* <article className="metadata-card"><p className="eyebrow">Index metadata</p><div><span>Code</span><strong>{index.code}</strong>
    </div>{index.base_date && <div><span>Base date</span><strong>{index.base_date}</strong></div>}{typeof index.base_value === 'number' && <div><span>Base value</span><strong>{formatNumber(index.base_value)}</strong></div>}
    </article> */}


  </section><Constituents indexId={index.id} />
  </>
}