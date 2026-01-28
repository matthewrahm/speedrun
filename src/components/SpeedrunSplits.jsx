import { useEffect, useRef } from 'react'
import { useDexScreener } from '../hooks/useDexScreener'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import { useMilestones } from '../hooks/useMilestones'
import './SpeedrunSplits.css'

function SpeedrunSplits() {
  const { ref, isVisible } = useScrollAnimation()
  const tokenAddress = import.meta.env.VITE_TOKEN_ADDRESS
  const rawTimestamp = import.meta.env.VITE_LAUNCH_TIMESTAMP
  const launchTimestamp = rawTimestamp ? parseInt(rawTimestamp) : null
  const isLaunched = launchTimestamp && launchTimestamp < Date.now()
  const { data } = useDexScreener(tokenAddress)
  const { milestones, logMilestone } = useMilestones()
  const loggedRef = useRef({})

  const marketCap = data?.marketCap || 0
  const priceUsd = data?.priceUsd || 0
  const volume24h = data?.volume24h || 0
  const liquidity = data?.liquidity || 0

  const MILESTONE_KEYS = {
    1e6: '1M',
    10e6: '10M',
    50e6: '50M',
    100e6: '100M',
  }

  const splits = [
    { name: 'Launch', target: 0, time: '00:00:00', achieved: isLaunched, key: null },
    { name: '1M Market Cap', target: 1e6, time: null, achieved: marketCap >= 1e6, key: '1M' },
    { name: '10M Market Cap', target: 10e6, time: null, achieved: marketCap >= 10e6, key: '10M' },
    { name: '50M Market Cap', target: 50e6, time: null, achieved: marketCap >= 50e6, key: '50M' },
    { name: '100M Market Cap', target: 100e6, time: null, achieved: marketCap >= 100e6, key: '100M' },
  ]

  useEffect(() => {
    if (!isLaunched || !marketCap) return

    Object.entries(MILESTONE_KEYS).forEach(async ([target, key]) => {
      const numTarget = Number(target)
      if (marketCap >= numTarget && !milestones[key]?.achieved && !loggedRef.current[key]) {
        // Mark as pending to prevent duplicate attempts during this cycle
        loggedRef.current[key] = 'pending'
        const elapsed = formatElapsedTime()
        const snapshot = {
          price: priceUsd,
          volume: volume24h,
          liquidity: liquidity,
        }
        const success = await logMilestone(key, elapsed, snapshot)
        if (success) {
          loggedRef.current[key] = true
        } else {
          // Allow retry on next data update
          loggedRef.current[key] = false
        }
      }
    })
  }, [marketCap, priceUsd, volume24h, liquidity, milestones, isLaunched, logMilestone])

  const getStatus = (split, index) => {
    if (split.achieved) return { text: '[GOLD]', class: 'gold' }

    // Find current split (first unachieved)
    const currentSplitIndex = splits.findIndex(s => !s.achieved)
    if (index === currentSplitIndex) {
      if (marketCap > 0) {
        const progress = (marketCap / split.target) * 100
        if (progress >= 50) return { text: '[WR PACE]', class: 'wr-pace' }
        if (progress >= 25) return { text: '[AHEAD]', class: 'ahead' }
      }
      return { text: '[CURRENT]', class: 'current' }
    }

    return { text: '', class: '' }
  }

  const formatElapsedTime = () => {
    if (!isLaunched) return '--:--:--'
    const elapsed = Date.now() - launchTimestamp
    const hours = Math.floor(elapsed / (1000 * 60 * 60))
    const minutes = Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((elapsed % (1000 * 60)) / 1000)
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  }

  const getSplitTime = (split) => {
    if (split.target === 0) return split.time
    if (split.key && milestones[split.key]?.achieved) {
      return milestones[split.key].elapsed
    }
    if (split.achieved) return formatElapsedTime()
    return '--:--:--'
  }

  const getCurrentProgress = () => {
    if (!isLaunched) return 0
    const currentSplit = splits.find(s => !s.achieved)
    if (!currentSplit) return 100
    const currentIndex = splits.indexOf(currentSplit)
    const prevTarget = currentIndex > 0 ? splits[currentIndex - 1].target : 0
    const range = currentSplit.target - prevTarget
    if (range === 0) return 0
    const progress = ((marketCap - prevTarget) / range) * 100
    return Math.min(Math.max(progress, 0), 100)
  }

  const currentSplitIndex = splits.findIndex(s => !s.achieved)

  return (
    <section className="splits-section section" ref={ref}>
      <h2 className={`section-title scroll-fade-in ${isVisible ? 'visible' : ''}`}>SPEEDRUN SPLITS</h2>

      <div className={`splits-container scroll-fade-in ${isVisible ? 'visible' : ''}`}>
        <div className="splits-header">
          <span className="splits-game">$SPEEDRUN Any% Glitchless</span>
          <span className="splits-category">Current Attempt</span>
        </div>

        <div className="split-progress-container">
          <div className="split-progress-bar">
            <div
              className="split-progress-fill"
              style={{ width: `${getCurrentProgress()}%` }}
            />
            <div
              className="split-progress-glow"
              style={{ left: `${getCurrentProgress()}%` }}
            />
          </div>
          <div className="split-progress-label">
            {isLaunched ? `${getCurrentProgress().toFixed(1)}% to next split` : 'Pre-Run'}
          </div>
        </div>

        <div className="splits-table">
          <div className="splits-row header-row">
            <span className="split-name">Split Name</span>
            <span className="split-time">Time</span>
            <span className="split-delta">Status</span>
          </div>

          {splits.map((split, index) => {
            const status = isLaunched ? getStatus(split, index) : { text: '', class: '' }
            const isCurrent = isLaunched && index === currentSplitIndex
            return (
              <div key={split.name} className={`splits-row ${split.achieved ? 'achieved' : ''} ${isCurrent ? 'current-split' : ''}`}>
                <span className="split-name">{split.name}</span>
                <span className="split-time">
                  {getSplitTime(split)}
                </span>
                <span className={`split-delta ${status.class}`}>
                  {status.text}
                </span>
              </div>
            )
          })}
        </div>

        <div className="splits-footer">
          <div className="wr-comparison">
            <span className="wr-label">World Record:</span>
            <span className="wr-value">???</span>
          </div>
          <div className="pb-comparison">
            <span className="pb-label">Personal Best:</span>
            <span className="pb-value">First Attempt</span>
          </div>
        </div>
      </div>

      <div className="splits-meme">
        <p>"Any% to 100M - No major glitches (just gains)"</p>
        <p className="verified">Verified by Solana Blockchain</p>
      </div>
    </section>
  )
}

export default SpeedrunSplits
