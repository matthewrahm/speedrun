import { useScrollAnimation } from '../hooks/useScrollAnimation'
import './Roadmap.css'

function Roadmap() {
  const { ref, isVisible } = useScrollAnimation()
  const phases = [
    {
      id: 1,
      name: 'LAUNCH',
      status: 'completed',
      items: [
        'Token launch on Solana',
        'Website goes live',
        'Community formation',
        'Initial liquidity',
      ],
    },
    {
      id: 2,
      name: 'MOMENTUM',
      status: 'current',
      items: [
        'CoinGecko listing',
        'CoinMarketCap listing',
        '10K holders milestone',
        'Viral meme campaigns',
      ],
    },
    {
      id: 3,
      name: 'WR PACE',
      status: 'upcoming',
      items: [
        'CEX listing',
        '$SPEEDRUN merch store',
        'Speedrunning events',
        'Major partnerships',
      ],
    },
    {
      id: 4,
      name: 'LEGEND',
      status: 'upcoming',
      items: [
        '100M market cap (World Record)',
        'DAO governance',
        'Community treasury',
        '???',
      ],
    },
  ]

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return <span className="phase-badge badge-gold">[GOLD]</span>
      case 'current':
        return <span className="phase-badge badge-current">[CURRENT]</span>
      default:
        return null
    }
  }

  return (
    <section className="roadmap-section section" ref={ref}>
      <h2 className={`section-title scroll-fade-in ${isVisible ? 'visible' : ''}`}>ROADMAP</h2>
      <p className={`roadmap-subtitle scroll-fade-in ${isVisible ? 'visible' : ''}`}>The speedrun route to 100M</p>

      <div className={`timeline stagger-children ${isVisible ? 'visible' : ''}`}>
        {phases.map((phase) => (
          <div key={phase.id} className={`timeline-item status-${phase.status}`}>
            <div className="timeline-marker">
              <div className="marker-dot"></div>
              <div className="marker-line"></div>
            </div>

            <div className="timeline-content">
              <div className="phase-header">
                <span className="phase-number">Phase {phase.id}</span>
                <span className="phase-name">{phase.name}</span>
                {getStatusBadge(phase.status)}
              </div>

              <ul className="phase-items">
                {phase.items.map((item, index) => (
                  <li key={index} className="phase-item">
                    <span className="item-marker">
                      {phase.status === 'completed' ? '✓' : '○'}
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Roadmap
