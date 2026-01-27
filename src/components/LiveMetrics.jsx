import { useScrollAnimation } from '../hooks/useScrollAnimation'
import './LiveMetrics.css'

function LiveMetrics() {
  const { ref, isVisible } = useScrollAnimation()

  return (
    <section className="live-metrics" ref={ref}>
      <div className={`metrics-container stagger-children ${isVisible ? 'visible' : ''}`}>
        <div className="metric-item neon-trail">
          <div className="metric-label">MARKET CAP</div>
          <div className="metric-value">$0</div>
        </div>
        <div className="metric-item highlight neon-trail">
          <div className="metric-label">CURRENT SPLIT</div>
          <div className="metric-value status-pending">LOADING...</div>
        </div>
        <div className="metric-item neon-trail">
          <div className="metric-label">24H VOLUME</div>
          <div className="metric-value">$0</div>
        </div>
        <div className="metric-item neon-trail">
          <div className="metric-label">24H CHANGE</div>
          <div className="metric-value positive">+0.00%</div>
        </div>
      </div>
    </section>
  )
}

export default LiveMetrics
