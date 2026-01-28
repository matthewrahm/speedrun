import { useDexScreener, formatMarketCap } from '../hooks/useDexScreener'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import './LiveMetrics.css'

function LiveMetrics() {
  const { ref, isVisible } = useScrollAnimation()
  const tokenAddress = import.meta.env.VITE_TOKEN_ADDRESS
  const { data, loading } = useDexScreener(tokenAddress)

  const marketCap = data?.marketCap || 0
  const volume24h = data?.volume24h || 0
  const priceChange24h = data?.priceChange24h || 0

  const getCurrentSplit = () => {
    if (!marketCap) return 'LOADING...'
    if (marketCap >= 100e6) return '$100M ✓'
    if (marketCap >= 50e6) return '$50M → $100M'
    if (marketCap >= 10e6) return '$10M → $50M'
    if (marketCap >= 1e6) return '$1M → $10M'
    return '$0 → $1M'
  }

  const changeClass = priceChange24h >= 0 ? 'positive' : 'negative'
  const changePrefix = priceChange24h >= 0 ? '+' : ''

  return (
    <section className="live-metrics" ref={ref}>
      <div className={`metrics-container stagger-children ${isVisible ? 'visible' : ''}`}>
        <div className="metric-item neon-trail">
          <div className="metric-label">MARKET CAP</div>
          <div className="metric-value">{loading ? 'LOADING...' : formatMarketCap(marketCap)}</div>
        </div>
        <div className="metric-item highlight neon-trail">
          <div className="metric-label">CURRENT SPLIT</div>
          <div className="metric-value status-pending">{getCurrentSplit()}</div>
        </div>
        <div className="metric-item neon-trail">
          <div className="metric-label">24H VOLUME</div>
          <div className="metric-value">{loading ? 'LOADING...' : formatMarketCap(volume24h)}</div>
        </div>
        <div className="metric-item neon-trail">
          <div className="metric-label">24H CHANGE</div>
          <div className={`metric-value ${changeClass}`}>{loading ? 'LOADING...' : `${changePrefix}${priceChange24h.toFixed(2)}%`}</div>
        </div>
      </div>
    </section>
  )
}

export default LiveMetrics
