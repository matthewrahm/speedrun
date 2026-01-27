import { useScrollAnimation } from '../hooks/useScrollAnimation'
import './Community.css'

function Community() {
  const { ref, isVisible } = useScrollAnimation()
  const twitterUrl = import.meta.env.VITE_TWITTER_URL || 'https://x.com'

  const socials = [
    {
      name: 'Twitter / X',
      description: 'Follow for updates',
      url: twitterUrl,
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      ),
    },
  ]

  return (
    <section className="community-section section" ref={ref}>
      <h2 className={`section-title scroll-fade-in ${isVisible ? 'visible' : ''}`}>JOIN THE COMMUNITY</h2>
      <p className={`community-subtitle scroll-fade-in ${isVisible ? 'visible' : ''}`}>Connect with fellow speedrunners</p>

      <div className={`social-grid stagger-children ${isVisible ? 'visible' : ''}`}>
        {socials.map((social) => (
          <a
            key={social.name}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className="social-card glow-border"
          >
            <div className="social-icon">{social.icon}</div>
            <div className="social-name">{social.name}</div>
            <div className="social-description">{social.description}</div>
          </a>
        ))}
      </div>
    </section>
  )
}

export default Community
