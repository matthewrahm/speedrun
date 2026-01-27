import './Chart.css'

function Chart() {
  const tokenAddress = import.meta.env.VITE_TOKEN_ADDRESS || 'TOKEN_ADDRESS'
  const embedUrl = `https://dexscreener.com/solana/${tokenAddress}?embed=1&theme=dark&trades=0&info=0`

  return (
    <section className="chart-section section">
      <h2 className="section-title">LIVE CHART</h2>
      <div className="chart-container">
        <iframe
          src={embedUrl}
          title="DexScreener Chart"
          className="chart-iframe"
          frameBorder="0"
          allow="clipboard-write"
          allowFullScreen
        />
      </div>
      <a
        href={`https://dexscreener.com/solana/${tokenAddress}`}
        target="_blank"
        rel="noopener noreferrer"
        className="chart-link"
      >
        View on DexScreener
      </a>
    </section>
  )
}

export default Chart
