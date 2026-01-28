import './Footer.css'

function Footer() {
  const twitterUrl = import.meta.env.VITE_TWITTER_URL || 'https://x.com'
  const tokenAddress = import.meta.env.VITE_TOKEN_ADDRESS || 'TOKEN_ADDRESS'

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-logo">
          <span className="footer-speed">$SPEEDRUN</span>
          <span className="footer-tagline">Speedrunning to 100M</span>
        </div>

        <div className="footer-links">
          <a href={twitterUrl} target="_blank" rel="noopener noreferrer" className="footer-link">
            <svg viewBox="0 0 24 24" className="footer-icon" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
            Twitter
          </a>
          <a
            href={`https://dexscreener.com/solana/${tokenAddress}`}
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            DexScreener
          </a>
        </div>

        <div className="footer-contract">
          <span className="contract-label">CA:</span>
          <span className="contract-value">{tokenAddress}</span>
        </div>

        <div className="footer-disclaimer">
          <p>NFA / DYOR</p>
          <p>$SPEEDRUN is a memecoin with no intrinsic value or expectation of financial return.</p>
          <p>This is not financial advice. Trade at your own risk.</p>
        </div>

        <div className="footer-credits">
          <p>Speedrunning the blockchain since 2024</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
