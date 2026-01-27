import { useState, useEffect } from 'react'
import './Hero.css'

function Hero() {
  const [elapsedTime, setElapsedTime] = useState({ hours: 0, minutes: 0, seconds: 0, ms: 0 })

  const tokenAddress = import.meta.env.VITE_TOKEN_ADDRESS || 'TOKEN_ADDRESS'
  const rawTimestamp = import.meta.env.VITE_LAUNCH_TIMESTAMP
  const launchTimestamp = rawTimestamp ? parseInt(rawTimestamp) : null
  const isLaunched = launchTimestamp && launchTimestamp < Date.now()
  const jupiterUrl = `https://jup.ag/swap/SOL-${tokenAddress}`

  useEffect(() => {
    if (!isLaunched) return

    const updateTimer = () => {
      const now = Date.now()
      const elapsed = now - launchTimestamp

      const hours = Math.floor(elapsed / (1000 * 60 * 60))
      const minutes = Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((elapsed % (1000 * 60)) / 1000)
      const ms = Math.floor((elapsed % 1000) / 10)

      setElapsedTime({ hours, minutes, seconds, ms })
    }

    updateTimer()
    const interval = setInterval(updateTimer, 10)
    return () => clearInterval(interval)
  }, [launchTimestamp, isLaunched])

  const formatTime = (num, digits = 2) => String(num).padStart(digits, '0')

  return (
    <section className="hero">
      <div className="hero-content">
        <img src="/logo.jpeg" alt="$SPEED Logo" className="hero-logo" />

        <h1 className="hero-title">
          <span className="speed-text">$SPEED</span>
        </h1>

        <p className="hero-tagline">Speedrunning to 100M Market Cap</p>

        <div className="speedrun-timer">
          <div className="timer-label">RUN TIME</div>
          {isLaunched ? (
            <div className="timer-display">
              <span className="timer-segment">{formatTime(elapsedTime.hours)}</span>
              <span className="timer-separator">:</span>
              <span className="timer-segment">{formatTime(elapsedTime.minutes)}</span>
              <span className="timer-separator">:</span>
              <span className="timer-segment">{formatTime(elapsedTime.seconds)}</span>
              <span className="timer-separator">.</span>
              <span className="timer-segment timer-ms">{formatTime(elapsedTime.ms)}</span>
            </div>
          ) : (
            <div className="timer-display timer-waiting">
              <span className="waiting-text">AWAITING LAUNCH</span>
            </div>
          )}
        </div>

        <a href={jupiterUrl} target="_blank" rel="noopener noreferrer" className="buy-button neon-sweep">
          BUY $SPEED
        </a>
      </div>

      <div className="hero-bg-effect"></div>

      <div className="parallax-container">
        <div className="parallax-back"></div>
        <div className="parallax-mid"></div>
      </div>
    </section>
  )
}

export default Hero
