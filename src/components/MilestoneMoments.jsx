import { useDexScreener, formatMarketCap } from '../hooks/useDexScreener'
import { useMilestones } from '../hooks/useMilestones'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import './MilestoneMoments.css'

function MilestoneMoments() {
  const { ref, isVisible } = useScrollAnimation()
  const tokenAddress = import.meta.env.VITE_TOKEN_ADDRESS
  const launchTimestamp = parseInt(import.meta.env.VITE_LAUNCH_TIMESTAMP) || null
  const { data } = useDexScreener(tokenAddress)
  const { milestones, loading } = useMilestones()

  const marketCap = data?.marketCap || 0

  const MILESTONE_TARGETS = [
    { key: '1M', name: '1M MARKET CAP', target: 1e6 },
    { key: '10M', name: '10M MARKET CAP', target: 10e6 },
    { key: '50M', name: '50M MARKET CAP', target: 50e6 },
    { key: '100M', name: '100M MARKET CAP', target: 100e6 },
  ]

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return null
    const date = new Date(timestamp)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const formatSplitTime = (elapsed) => {
    if (!elapsed) return null
    // elapsed is already formatted as HH:MM:SS from SpeedrunSplits
    // Convert to days:hours:minutes:seconds format
    const parts = elapsed.split(':')
    if (parts.length === 3) {
      const [hours, minutes, seconds] = parts.map(Number)
      const days = Math.floor(hours / 24)
      const remainingHours = hours % 24
      return `${String(days).padStart(2, '0')}:${String(remainingHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
    }
    return elapsed
  }

  const getDelta = (currentIndex) => {
    if (currentIndex === 0) return null
    const current = MILESTONE_TARGETS[currentIndex]
    const prev = MILESTONE_TARGETS[currentIndex - 1]
    const currentData = milestones[current.key]
    const prevData = milestones[prev.key]

    if (!currentData?.timestamp || !prevData?.timestamp) return null

    const delta = currentData.timestamp - prevData.timestamp
    const hours = Math.floor(delta / (1000 * 60 * 60))
    const minutes = Math.floor((delta % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((delta % (1000 * 60)) / 1000)
    const days = Math.floor(hours / 24)
    const remainingHours = hours % 24

    return `+${String(days).padStart(2, '0')}:${String(remainingHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  }

  const formatPrice = (price) => {
    if (!price) return null
    if (price < 0.000001) return `$${price.toExponential(2)}`
    if (price < 0.01) return `$${price.toFixed(6)}`
    return `$${price.toFixed(4)}`
  }

  const formatVolume = (volume) => {
    if (!volume) return null
    if (volume >= 1e6) return `$${(volume / 1e6).toFixed(2)}M`
    if (volume >= 1e3) return `$${(volume / 1e3).toFixed(2)}K`
    return `$${volume.toFixed(0)}`
  }

  if (loading) {
    return (
      <section className="milestone-section section" ref={ref}>
        <h2 className={`section-title scroll-fade-in ${isVisible ? 'visible' : ''}`}>MILESTONE MOMENTS</h2>
        <p className="milestone-subtitle">Loading milestones...</p>
      </section>
    )
  }

  return (
    <section className="milestone-section section" ref={ref}>
      <h2 className={`section-title scroll-fade-in ${isVisible ? 'visible' : ''}`}>MILESTONE MOMENTS</h2>
      <p className={`milestone-subtitle scroll-fade-in ${isVisible ? 'visible' : ''}`}>
        Every achievement captured on chain
      </p>

      <div className={`timeline-container scroll-fade-in ${isVisible ? 'visible' : ''}`}>
        <div className="timeline-line" />

        {MILESTONE_TARGETS.map((milestone, index) => {
          const data = milestones[milestone.key]
          const isAchieved = data?.achieved
          const isLeft = index % 2 === 0

          return (
            <div
              key={milestone.key}
              className={`timeline-item ${isLeft ? 'left' : 'right'} ${isAchieved ? 'achieved' : 'locked'}`}
            >
              <div className="timeline-connector">
                <div className={`timeline-dot ${isAchieved ? 'achieved' : ''}`}>
                  {isAchieved ? (
                    <span className="dot-icon">&#9733;</span>
                  ) : (
                    <span className="dot-icon">&#128274;</span>
                  )}
                </div>
              </div>

              <div className={`milestone-card ${isAchieved ? 'achieved' : 'locked'}`}>
                <div className="card-header">
                  <span className="milestone-icon">{isAchieved ? '\u2605' : '\uD83D\uDD12'}</span>
                  <span className="milestone-name">{milestone.name}</span>
                </div>

                <div className="card-divider" />

                {isAchieved ? (
                  <div className="card-content achieved">
                    <div className="stat-row">
                      <span className="stat-label">ACHIEVED:</span>
                      <span className="stat-value">{formatTimestamp(data.timestamp)}</span>
                    </div>
                    <div className="stat-row">
                      <span className="stat-label">SPLIT TIME:</span>
                      <span className="stat-value split-time">{formatSplitTime(data.elapsed)}</span>
                    </div>
                    {getDelta(index) && (
                      <div className="stat-row">
                        <span className="stat-label">DELTA:</span>
                        <span className="stat-value delta">{getDelta(index)}</span>
                      </div>
                    )}

                    {(data.price || data.volume || data.liquidity) && (
                      <>
                        <div className="card-divider" />
                        {data.price && (
                          <div className="stat-row">
                            <span className="stat-label">PRICE:</span>
                            <span className="stat-value">{formatPrice(data.price)}</span>
                          </div>
                        )}
                        {data.volume && (
                          <div className="stat-row">
                            <span className="stat-label">VOLUME:</span>
                            <span className="stat-value">{formatVolume(data.volume)}</span>
                          </div>
                        )}
                        {data.liquidity && (
                          <div className="stat-row">
                            <span className="stat-label">LIQUIDITY:</span>
                            <span className="stat-value">{formatVolume(data.liquidity)}</span>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ) : (
                  <div className="card-content locked">
                    <div className="stat-row">
                      <span className="stat-label">TARGET:</span>
                      <span className="stat-value">{formatMarketCap(milestone.target)}</span>
                    </div>
                    <div className="stat-row">
                      <span className="stat-label">STATUS:</span>
                      <span className="stat-value status">IN PROGRESS...</span>
                    </div>
                    <div className="stat-row">
                      <span className="stat-label">CURRENT:</span>
                      <span className="stat-value">
                        {formatMarketCap(marketCap)} ({((marketCap / milestone.target) * 100).toFixed(1)}%)
                      </span>
                    </div>
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{ width: `${Math.min((marketCap / milestone.target) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default MilestoneMoments
